const FS = require('fs')
const PATH = require('path')
const JIMP = require('jimp')
const RectanglePacking = require('./RectanglePacking')
const SpriteObject = require('./SpriteObject')

class Image
{
    constructor()
    {
        this.name
    }
}

class Module
{
    constructor()
    {
        this.mid
        this.type
        this.x
        this.y
        this.w
        this.h
        this.color
        this.imgIndex = 0
    }
}

class FModule
{
    constructor()
    {
        this.fmodulesID
        this.fmodulesOX
        this.fmodulesOY
        this.fmodulesFlags
        this.fmodulesPal
        this.fmodulesRotation
        this.fmodulesScaleX
        this.fmodulesScaleY
        this.fmodulesBlendMode
        this.fmodulesBlendOpacity
    }
}

class Frame
{
    constructor()
    {
        this.fid
        this.fmCount
        this.fmstartIndex
        this.rect = []
    }
}

class AFrame
{
    constructor()
    {
        this.frameIndex
        this.time
        this.ox
        this.oy
        this.flags
        this.rotation = 0
        this.scaleX = 1
        this.scaleY = 1
    }
}

class Animation
{
    constructor()
    {
        this.aid
        this.aFramesCount
        this.aFramesStartIndex
    }
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// TOKEN-BASED PROCESSING
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const unsigned = /[0-9]+/
const signed = /-?[0-9]+/
const anything = /.*/
const float = /-?[0-9]+(\.[0-9]+)?/

const anyID = /0x[0-9A-Fa-f]{4}/

// const IID = /0x0[0-9A-Fa-f]{3}/
// const MID = /0x1[0-9A-Fa-f]{3}/
// const FID = /0x2[0-9A-Fa-f]{3}/
// const AID = /0x3[0-9A-Fa-f]{3}/

const IID = anyID
const MID = anyID
const FID = anyID
const AID = anyID

function ClearAllComments(data)
{
    const multiLineComments = /\/\*[\s\S]*?\*\//g
    const singleLineComments = /\/\/[\s\S]*?$/gm
    return data.replace(singleLineComments, '')
               .replace(multiLineComments, '')
}

function Tokenize(data)
{
    let regex = /"([^"\r\n]*?)"|(\S+)|\n/g
    let tokens = []
    let matches
    while (matches = regex.exec(data))
    {
        // If encounter a newline, skip if previous token is also a newline
        if (matches[0] === '\n' && (tokens.length === 0 || tokens[tokens.length - 1] === '\n'))
            continue
        tokens.push(matches[0])
    }
    return tokens
}

function ProcessBraces(tokens)
{
    let current = []
    let stack = []

    tokens.forEach(token =>
    {
        if (token == '{')
        {
            stack.push(current)
            current = []
        }
        else
        if (token == '}')
        {
            let parent = stack.pop()
            parent.push(current)
            current = parent
        }
        else
        {
            current.push(token)
        }
    })

    if (stack.length > 0)
        throw new Error(`Missing ${stack.length} closing brace(s)`)

    return current
}

function Extract(tokens, ...patterns)
{
    if (tokens.length < patterns.length)
        throw new Error('Token array is too short')

    let extract = tokens.splice(0, patterns.length)

    return patterns.map((pattern, index) =>
    {
        if (typeof pattern === 'string')
        {
            if (pattern !== extract[index])
                throw new Error('Unmatched pattern: ' + pattern)
        }
        else
        {
            let newRegex = new RegExp('^' + pattern.source + '$')
            if (!extract[index].match(newRegex))
                throw new Error('Unmatched pattern: ' + pattern)
        }
        return extract[index]
    })
}

function SkipNewLine(tokens)
{
    if (tokens[0] === '\n')
        return tokens.splice(0, 1)

    return []
}

function SkipToNextLine(tokens)
{
    let newline = tokens.indexOf('\n')
    if (newline < 0)
        return null
    else
        return tokens.splice(0, newline + 1)
}

function ProcessEntry(aurora, tokens)
{
    SkipNewLine(tokens)
    let [first] = Extract(tokens, anything)

    switch (first)
    {
        case 'IMAGE':
            return ProcessIMAGE(aurora, tokens)
        case 'MODULES':
            return ProcessMODULES(aurora, tokens)
        case 'FRAME':
            return ProcessFRAME(aurora, tokens)
        case 'ANIM':
            return ProcessANIM(aurora, tokens)
    }

    throw new Error('Invalid entry')
}

function ProcessIMAGE(aurora, tokens)
{
    let [imgIndex, file] = Extract(tokens, IID, anything)

    let image = new Image()
    image.name = file.replace(/^"|"$/g, '')

    while (tokens[0] !== undefined)
    {
        if (tokens[0] == 'ALPHA')
        {
            let [tmp, alpha] = Extract(tokens, 'ALPHA', anything)
        }
        else if (tokens[0] == 'TRANSP')
        {
            let [tmp, transp] = Extract(tokens, 'TRANSP', anything)
        }
        else
            break
    }

    SkipToNextLine(tokens)
    aurora.images.push(image)
    return image
}

function ProcessMODULES(aurora, tokens)
{
    SkipToNextLine(tokens)
    let [next] = tokens.splice(0, 1)

    let modules = next.slice() // Make a copy
    while (modules.length > 0)
    {
        ProcessMD(aurora, modules)
    }

    SkipToNextLine(tokens)
    return aurora.modules
}

function ProcessMD(aurora, tokens)
{
    let md = new Module()

    SkipNewLine(tokens)

    let [tmp, mid, type] = Extract(tokens, 'MD', MID, anything)
    md.mid = mid

    switch (type)
    {
        case 'MD_IMAGE':
            md.type = MD_IMAGE
            let [imgIndex, x, y, width, height] = Extract(tokens, unsigned, signed, signed, unsigned, unsigned)

            md.imgIndex = parseInt(imgIndex)
            md.x = parseInt(x)
            md.y = parseInt(y)
            md.w = parseInt(width)
            md.h = parseInt(height)

        default:
            break
    }

    // if (tokens[0] && tokens[0][0] != '\n') {
    //     let [ desc ]  = Extract(tokens, anything)
    // }
    aurora.modules.push(md)

    SkipToNextLine(tokens)

    return md
}

function ProcessFRAME(aurora, tokens)
{
    let desc = ''
    if (/\"\w+\"/.test(tokens[0]))
    {
        desc = tokens[0].replace(/\"/g, '')
    }
    SkipToNextLine(tokens)
    let [next] = tokens.splice(0, 1)

    let count = 0
    let start = aurora.fmodules.length

    SkipNewLine(next)
    let fid = next[0]
    let fmodules = next.slice(1) // Skip Frame ID
    SkipToNextLine(fmodules)
    while (fmodules.length > 0)
    {
        ProcessFM(aurora, fmodules)
        count++
    }

    let frame = new Frame()
    frame.fid = fid
    frame.fmCount = count
    frame.fmstartIndex = start
    frame.desc = desc

    SkipToNextLine(tokens)
    aurora.frames.push(frame)

    return frame
}

function ProcessFM(aurora, tokens)
{
    let fm = new FModule()

    SkipNewLine(tokens)

    if (tokens[0] == 'RC')
    {
        SkipToNextLine(tokens)
        return
    }

    let [tmp, mid, x, y] = Extract(tokens, 'FM', MID, signed, signed)
    fm.fmodulesID = aurora.modules.findIndex(md => md.mid == mid)
    fm.fmodulesOX = parseInt(x)
    fm.fmodulesOY = parseInt(y)

    while (true)
    {
        if (tokens[0] == 'FREE_ROTATE')
        {
            let [tmp, rotate] = Extract(tokens, 'FREE_ROTATE', signed)
            fm.fmodulesRotation = parseInt(rotate)
        }
        else if (tokens[0] == 'FREE_SCALE_XY')
        {
            let [tmp, scaleX, scaleY] = Extract(tokens, 'FREE_SCALE_XY', signed, signed)
            fm.fmodulesScaleX = parseInt(scaleX)
            fm.fmodulesScaleY = parseInt(scaleY)
        }
        else
            break
    }

    // let [ pivotX, pivotY ]  = Extract(tokens, float, float)
    aurora.fmodules.push(fm)

    SkipToNextLine(tokens)

    return fm
}

function ProcessANIM(aurora, tokens)
{
    let desc = ''
    if (/\"\w+\"/.test(tokens[0]))
    {
        desc = tokens[0].replace(/\"/g, '')
    }
    SkipToNextLine(tokens)
    let [next] = tokens.splice(0, 1)

    let count = 0
    let start = aurora.aframes.length

    SkipNewLine(next)
    let aid = next[0]
    let aframes = next.slice(1) // Skip Anim ID
    SkipToNextLine(aframes)
    while (aframes.length > 0)
    {
        ProcessAF(aurora, aframes)
        count++
    }

    let anim = new Animation()
    anim.aid = aid
    anim.aFramesCount = count
    anim.aFramesStartIndex = start
    anim.desc = desc

    aurora.anims.push(anim)

    SkipToNextLine(tokens)
    return anim
}

function ProcessAF(aurora, tokens)
{
    let af = new AFrame()

    SkipNewLine(tokens)

    let [tmp, fid, time, x, y] = Extract(tokens, 'AF', FID, unsigned, signed, signed)
    af.frameIndex = aurora.frames.findIndex(fr => fr.fid == fid)
    af.time = parseInt(time)
    af.ox = parseInt(x)
    af.oy = parseInt(y)

    while (true)
    {
        if (tokens[0] == 'FREE_ROTATE')
        {
            let [tmp, rotate] = Extract(tokens, 'FREE_ROTATE', signed)
            af.rotation = parseInt(rotate)
        }
        else if (tokens[0] == 'FREE_SCALE_XY')
        {
            let [tmp, scaleX, scaleY] = Extract(tokens, 'FREE_SCALE_XY', signed, signed)
            af.scaleX = parseInt(scaleX)
            af.scaleY = parseInt(scaleY)
        }
        else
            break
    }

    // let [ pivotX, pivotY ]  = Extract(tokens, float, float)
    aurora.aframes.push(af)

    SkipToNextLine(tokens)

    return af
}

function CombineImage(sprites, srcPath, destPath, alias)
{
    return new Promise((resolve, reject) =>
    {
        let images = {}
        let loadImages = []
        let moduleRects = []
        sprites.forEach((sprite, spriteId) =>
        {
            images[spriteId] = {}
            sprite.images.forEach((image, imageId) =>
            {
                loadImages.push(new Promise((resolve, reject) =>
                {
                    JIMP.read(PATH.join(srcPath, image.name)).then(data =>
                    {
                        images[spriteId][imageId] = data
                        resolve()
                    })
                }))
            })
            sprite.modules.forEach(module =>
            {
                module.spriteId = spriteId
                moduleRects.push(
                {
                    w: module.w,
                    h: module.h,
                    index:
                    {
                        imageId: module.imgIndex,
                        spriteId: spriteId,
                        module: module,
                    }
                })
            })
        })
        Promise.all(loadImages).then( _ =>
        {
            let result = []
            let packing = new RectanglePacking(moduleRects)
            packing.Proceed()
            packing.groups.map((group, groupIndex) =>
            {
                let imageNew = new JIMP(group.solution[1], group.solution[2], 0x00000000)
                group.solution.slice(3).map(rect =>
                {
                    imageNew.blit(images[rect.index.spriteId][rect.index.imageId], rect.x, rect.y,
                        rect.index.module.x, rect.index.module.y, rect.index.module.w, rect.index.module.h)
                    rect.index.module.imgIndex = groupIndex
                    rect.index.module.x = rect.x
                    rect.index.module.y = rect.y
                })
                imageNew.write(PATH.join(destPath, `${alias}_${groupIndex}.png`))
                result.push({ name: `${alias}_${groupIndex}.png` })
            })
            resolve(result)
        })
    })
}

function CombineSpriteObjects(objects, srcPath, destPath, alias)
{
    return new Promise((resolve, reject) =>
    {
        CombineImage(objects, srcPath, destPath, alias).then(images =>
        {
            let newObj = new SpriteObject()
            newObj.images = images

            objects.forEach((object, index) =>
            {
                object.modules.forEach(module =>
                {
                    newObj.modules.push(module)
                })
            })

            let moduleIndexOffset = 0
            objects.forEach((object, index) =>
            {
                object.fmodules.forEach(fmodule =>
                {
                    fmodule.fmodulesID += moduleIndexOffset
                    newObj.fmodules.push(fmodule)
                })
                moduleIndexOffset += object.modules.length
            })

            let fmoduleIndexOffset = 0
            objects.forEach((object, index) =>
            {
                object.frames.forEach(frame =>
                {
                    frame.fmstartIndex += fmoduleIndexOffset
                    newObj.frames.push(frame)
                })
                fmoduleIndexOffset += object.fmodules.length
            })

            let frameIndexOffset = 0
            objects.forEach((object, index) =>
            {
                object.aframes.forEach(aframe =>
                {
                    aframe.frameIndex += frameIndexOffset
                    newObj.aframes.push(aframe)
                })
                frameIndexOffset += object.frames.length
            })

            let aframeIndexOffset = 0
            objects.forEach((object, index) =>
            {
                object.anims.forEach(anim =>
                {
                    anim.aFramesStartIndex += aframeIndexOffset
                    newObj.anims.push(anim)
                })
                aframeIndexOffset += object.aframes.length
            })

            newObj.SaveAsync(PATH.join(destPath, alias + '.bsprite'))
            resolve(newObj.GetDefineHeader(alias))
        })
    })
}

module.exports =
{
    LoadAsync(filename)
    {
        return new Promise((resolve, reject) =>
        {
            FS.readFile(filename, 'utf8', (err, data) =>
            {
                err && reject(err)

                let object = new SpriteObject()
                let tokens = ProcessBraces(Tokenize(ClearAllComments(data)))[0]
                tokens = tokens.slice(3, -2) // skip header & footer

                // process each entry
                while (tokens.length > 0)
                {
                    ProcessEntry(object, tokens)
                }

                resolve(object)
            })
        })
    },

    CombineSpriteObjects: CombineSpriteObjects,
}
