var Constant =
{
    OPACITY:        1 << 5,
    FREE_TRANSFORM: 1 << 6,
    BlendingMode: function(value)
    {
        return [
            BlendingMode.ADD,
            BlendingMode.COLOR,
            BlendingMode.COLOR_BURN,
            BlendingMode.COLOR_DODGE,
            BlendingMode.DARKEN,
            BlendingMode.DIFFERENCE,
            BlendingMode.EXCLUSION,
            BlendingMode.HARD_LIGHT,
            BlendingMode.HUE,
            BlendingMode.LIGHTEN,
            BlendingMode.LUMINOSITY,
            BlendingMode.MULTIPLY,
            BlendingMode.NORMAL,
            BlendingMode.OVERLAY,
            BlendingMode.SATURATION,
            BlendingMode.SCREEN,
            BlendingMode.SOFT_LIGHT
        ].indexOf(value)
    }
}

app.project.save()
app.activate()
var DebugLog = []

var IMAGES = {}
var MODULES = {}
var FRAMES = []
var ANIMATIONS = []
var nImage = 0
var nFrame = 0
var nAnimation = 0

var Utils =
{
    ToHEX: function(n)
    {
        var hex = n.toString(16)
        while (hex.length < 3) hex = '0' + hex
        return hex
    },

    Angle: function(x, y)
    {
        if (x == 0 && y == 0)
            return undefined;

        // computes the angle in radians with respect to the positive x-axis
        var angle = Math.atan2(y, x)
        if (angle < 0) angle += 2 * Math.PI
        return angle
    },
}

var Vector3 = function(n1, n2, n3)
{
    this.elements =
    [
        n1 || 0,
        n2 || 0,
        n3 || 0,
    ]
}

var Matrix3 = function(n11, n12, n13, n21, n22, n23, n31, n32, n33)
{
    this.elements =
    [
        n11 || 1, n12 || 0, n13 || 0,
        n21 || 0, n22 || 1, n23 || 0,
        n31 || 0, n32 || 0, n33 || 1,
    ]

    this.LeftMultiply = function(M)
    {
        return Matrix3.MultiplyMatrices(M, this);
    }
    this.RightMultiply = function(M)
    {
        return Matrix3.MultiplyMatrices(this, M);
    }

    this.MultiplyVector = function(V)
    {
        var VE = V.elements
        var V1 = VE[0], V2 = VE[1], V3 = VE[2];

        var LE = this.elements
        var L11 = LE[0], L12 = LE[1], L13 = LE[2];
        var L21 = LE[3], L22 = LE[4], L23 = LE[5];
        var L31 = LE[6], L32 = LE[7], L33 = LE[8];

        var result = new Vector3()
        result.elements[0] = L11 * V1 + L12 * V2 + L13 * V3;
        result.elements[1] = L21 * V1 + L22 * V2 + L23 * V3;
        result.elements[2] = L31 * V1 + L32 * V2 + L33 * V3;
        return result
    }
}

Matrix3.MultiplyMatrices = function MultiplyMatrices(L, R) {
    var RE = R.elements
    var R11 = RE[0], R12 = RE[1], R13 = RE[2];
    var R21 = RE[3], R22 = RE[4], R23 = RE[5];
    var R31 = RE[6], R32 = RE[7], R33 = RE[8];

    var LE = L.elements
    var L11 = LE[0], L12 = LE[1], L13 = LE[2];
    var L21 = LE[3], L22 = LE[4], L23 = LE[5];
    var L31 = LE[6], L32 = LE[7], L33 = LE[8];

    var result = new Matrix3()
    result.elements[0] = L11 * R11 + L12 * R21 + L13 * R31;
    result.elements[1] = L11 * R12 + L12 * R22 + L13 * R32;
    result.elements[2] = L11 * R13 + L12 * R23 + L13 * R33;

    result.elements[3] = L21 * R11 + L22 * R21 + L23 * R31;
    result.elements[4] = L21 * R12 + L22 * R22 + L23 * R32;
    result.elements[5] = L21 * R13 + L22 * R23 + L23 * R33;

    result.elements[6] = L31 * R11 + L32 * R21 + L33 * R31;
    result.elements[7] = L31 * R12 + L32 * R22 + L33 * R32;
    result.elements[8] = L31 * R13 + L32 * R23 + L33 * R33;
    return result
}

var Transformation = {
    Translate: function(matrix, tX, tY) {
        return matrix.LeftMultiply(new Matrix3(
            1, 0, tX,
            0, 1, tY,
            0, 0, 1));
    },
    
    Scale: function(matrix, sX, sY) {
        return matrix.LeftMultiply(new Matrix3(
            sX, 0, 0,
            0, sY, 0,
            0, 0, 1));
    },
    
    Rotate: function(matrix, r) {
        return matrix.LeftMultiply(new Matrix3(
            Math.cos(r), -Math.sin(r), 0,
            Math.sin(r), Math.cos(r), 0,
            0, 0, 1));
    },
    
    SkewY: function(matrix, angle) {
        return matrix.LeftMultiply(new Matrix3(
            1, 0, 0,
            Math.tan(angle), 1, 0,
            0, 0, 1));
    }
};

var LoadFrames = function(composition)
{
    var aid = Utils.ToHEX(nAnimation++);
    var AFrames = [];
    var theta = [];         // Rotation based on position path

    var EPSILON = 1e-3;     // Very small constant to get derivative of position

    for (var timeframe = composition.workAreaStart;
        timeframe <= composition.workAreaDuration + composition.workAreaStart;
        timeframe += composition.frameDuration)
    {
        var fid = Utils.ToHEX(nFrame++);        // Frame ID
        var FModules = [];

        // ============================== Transformation calculation ===============================
        for (var layerid = 1; layerid <= composition.numLayers; layerid++)
        {
            var layer = composition.layer(layerid);
            if (layer.source == null)    // skip non-FootageItem layers (camera center, etc.)
                continue;

            //  ------------------------------- Intrinsic attributes ----------------------------------
            var matrix = new Matrix3();
            var opacity = layer.activeAtTime(timeframe) ? 1 : NaN

            // First transformation is placed on the right-most (described first)
            // Use left-multiply to append new transformations

            // Anchor
            var anchor = layer.anchorPoint.valueAtTime(timeframe, false);
            matrix = Transformation.Translate(matrix, -anchor[0], -anchor[1]);

            // Scaling
            var scale = layer.scale.valueAtTime(timeframe, false);
            matrix = Transformation.Scale(matrix, scale[0] / 100, scale[1] / 100);

            // Rotation
            var rotation = layer.rotation.valueAtTime(timeframe, false) / 180 * Math.PI;
            matrix = Transformation.Rotate(matrix, rotation);

            // Auto-orient mode
            var position = layer.position.valueAtTime(timeframe, false);

            if (layer.autoOrient == AutoOrientType.ALONG_PATH) {
                // Rotation by path
                var lastPosition = layer.position.valueAtTime(timeframe - EPSILON, false);
                theta[layerid - 1] =
                    ((angle = Utils.Angle(position[0] - lastPosition[0], position[1] - lastPosition[1])) == undefined) ?
                    theta[layerid - 1] || 0 :       // Take the last angle if there's no movement
                    angle;                          // Take the derivative if there's movement

                matrix = Transformation.Rotate(matrix, theta[layerid - 1]);
            }
                                                       
            // Position
            matrix = Transformation.Translate(matrix, position[0], position[1]);

            // Opacity
            opacity *= layer.opacity.valueAtTime(timeframe, false) / 100;

            //  ------------------------------- Effect "Transform" attributes ----------------------------------
            var transform = layer.effect.property('Transform')
            if (transform != null)
            {
                var transformMatrix = new Matrix3();

                // Anchor
                var anchor = transform.anchorPoint.valueAtTime(timeframe, false);
                transformMatrix = Transformation.Translate(transformMatrix, -anchor[0], -anchor[1]);

                // Scaling
                var scaleX, scaleY;

                if (transform.scale != undefined)
                    scaleX = scaleY = transform.scale.valueAtTime(timeframe, false);
                else {
                    scaleX = transform.scaleWidth.valueAtTime(timeframe, false);
                    scaleY = transform.scaleHeight.valueAtTime(timeframe, false);
                }

                scaleX /= 100;
                scaleY /= 100;
                transformMatrix = Transformation.Scale(transformMatrix, scaleX, scaleY);

                // Rotation
                var rotation = transform.rotation.valueAtTime(timeframe, false) / 180 * Math.PI;
                transformMatrix = Transformation.Rotate(transformMatrix, rotation);

                // Skew Axis
                var skewAxis = transform.skewAxis.valueAtTime(timeframe, false) / 180 * Math.PI;
                var preSkew = Transformation.Rotate(new Matrix3(), skewAxis);
                var postSkew = Transformation.Rotate(new Matrix3(), -skewAxis);

                // Skewing
                var skew = transform.skew.valueAtTime(timeframe, false) / 180 * Math.PI;
                transformMatrix = transformMatrix.LeftMultiply(preSkew);
                transformMatrix = Transformation.SkewY(transformMatrix, skew);
                transformMatrix = transformMatrix.LeftMultiply(postSkew);
                                                        
                // Position
                var position = transform.position.valueAtTime(timeframe, false);
                transformMatrix = Transformation.Translate(transformMatrix, position[0], position[1]);

                // Opacity
                opacity *= transform.opacity.valueAtTime(timeframe, false) / 100;

                matrix = matrix.RightMultiply(transformMatrix);
            }

            var moduleId = IMAGES[layer.source.name]
            moduleId && (MODULES[moduleId].desc = layer.name)
            FModules[layerid] = {
                mid: moduleId,
                matrix: matrix,
                opacity: opacity,
                blendingMode: Constant.BlendingMode(layer.blendingMode),
                children: [],
            }
        }
        
        // ============================== Parent transformation ===============================
        // Find children
        topLevel = [];      // Top level layers (no parent)
        for (var layerid = 1; layerid <= composition.numLayers; layerid++)
        {
            var layer = composition.layer(layerid);
            var fmodule = FModules[layerid];
            if (!fmodule)    // Skip Null layers (camera center, etc.)
                continue;

            if (layer.parent) {
                var parentId = layer.parent.index;
                FModules[parentId] && FModules[parentId].children.push(fmodule);
            } else {
                topLevel.push(fmodule);

                // Transform to the middle of the screen
                fmodule.matrix = Transformation.Translate(fmodule.matrix,
                    - composition.width / 2,
                    - composition.height / 2);
            }
        }

        // Apply transformation (recursively)
        var propagate = function (fmodule) {
            for (var i = 0; i < fmodule.children.length; i++) {
                var childModule = fmodule.children[i];

                // Child transformation is local (applied first, on the right)
                // Parent transformation is global (on the left)
                childModule.matrix = Matrix3.MultiplyMatrices(fmodule.matrix, childModule.matrix);
                propagate(childModule);
            }
        };

        for (var i = 0; i < topLevel.length; i++)
            propagate(topLevel[i]);

        // ============================== Add frame ===============================
        FModules = FModules
            // .filter(function (x) { return x; })     // Filter out empty slots
            .reverse();                             // Reverse the order, so the top layer show last
        FRAMES.push({ id: 2 + fid, fmodules: FModules })
        AFrames.push(2 + fid)
    }
    ANIMATIONS.push({ id: 3 + aid, aframes: AFrames, start: composition.workAreaStart, duration: composition.workAreaDuration })
}

var LoadAEProject = function()
{
    for (var i = 1, length = app.project.items.length; i <= length; i++)
    {
        var item = app.project.items[i]
        switch (item.typeName)
        {
            case 'Footage':
            {
                if (!item.file || item.name.indexOf('.mov') > 0 || item.name.indexOf('.mp4') > 0) // no video
                    break;

                var mid = Utils.ToHEX(nImage)
                var module =
                {
                    id: 1 + mid,
                    imgid: nImage++,
                    width: item.width,
                    height: item.height
                }
                IMAGES[item.name] = module.id
                MODULES[module.id] = module
                break
            }
    
            case 'Composition':
            {
                if (!item.selected)
                    break;
                LoadFrames(item)
                break
            }
        }
    }
}

var Export = function()
{
    var projectPath=app.project.file.path.replace(/%20/g, ' ')
    var projectName=app.project.file.name.replace(/%20/g, ' ')
    var animFile = new File(projectPath + '/' + projectName.slice(0, -4) + '.jasmine')
    animFile.open('w')

    for (var image in IMAGES)
    {
        var imgfile = MODULES[IMAGES[image]].desc ? image : ''
        animFile.writeln('IMAGE\t-imgfile:' + '\"' + imgfile + '\"')
    }

    for (var index in MODULES)
    {
        MODULES[index].desc
            && animFile.writeln('MODULE\t-mid:' + MODULES[index].id + '\t-imgid:' + MODULES[index].imgid
                + '\t-x:0\t-y:0\t-w:' + MODULES[index].width + '\t-h:' + MODULES[index].height
                + '\t-desc:"' + MODULES[index].desc + '"')
    }

    for (var i = 0; i < nFrame; i++)
    {
        animFile.writeln('FRAME\t-fid:' + FRAMES[i].id + '\t-desc:""')
        var FModules = FRAMES[i].fmodules
        for (var j = 0, nFModule = FModules.length; j < nFModule; j++)
        {
            if (!FModules[j] || isNaN(FModules[j].opacity) || !FModules[j].mid)
                continue;

            var matrix = FModules[j].matrix
            var mode = FModules[j].blendingMode
            var token = '\tADD_FMODULE\t-mid:' + FModules[j].mid
            if (FModules[j].opacity < 1)
            {
                token += '\t-opacity:' + FModules[j].opacity
                mode |= Constant.OPACITY
            }
            if (true)
            {
                token += '\t-x:' + matrix.elements[2] + '\t-y:' + matrix.elements[5]
                token += '\t-m11:' + matrix.elements[0] + '\t-m12:' + matrix.elements[1] + '\t-m21:' + matrix.elements[3] + '\t-m22:' + matrix.elements[4]
                mode |= Constant.FREE_TRANSFORM
            }
            token += '\t-mode:' + mode
            animFile.writeln(token)
        }
    }

    for (var i = 0; i < nAnimation; i++)
    {
        animFile.writeln('ANIMATION\t-aid:' + ANIMATIONS[i].id + '\t-start:' + ANIMATIONS[i].start + '\t-duration:' + ANIMATIONS[i].duration + '\t-desc:""')
        var AFrames = ANIMATIONS[i].aframes
        for (var j = 0, nAFrame = AFrames.length; j < nAFrame; j++)
        {
            animFile.writeln('\tADD_AFRAME\t-fid:' + AFrames[j] + '\t-x:0\t-y:0\t-time:1')
        }
    }

    for (var i = 0, nDebugLog = DebugLog.length; i < nDebugLog; i++)
    {
        animFile.writeln(DebugLog[i])
    }

    animFile.close()
}

LoadAEProject()
Export()
