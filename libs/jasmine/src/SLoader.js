import BReader from './BReader';
import PATH from "path";

const BSPRITE_v005					= 0x05DF // supported version
const SUPPORTED_VERSION				= BSPRITE_v005
const BS_MODULES					= (1 << 0)
const BS_MODULES_XY					= (1 << 1)
const BS_MODULES_IMG				= (1 << 2)
const BS_MODULE_IMAGES_TC_BMP		= (1 << 3)
const BS_MODULES_WH_SHORT			= (1 << 4)     // export w, h for each module as short
const BS_MODULES_XY_SHORT 			= (1 << 5)     // export x, y for each module as short
const BS_MODULES_USAGE 				= (1 << 6)     // export for each module which transformations are used in the sprite
const BS_IMAGE_SIZE_INT 			= (1 << 7)     // module size will be stored on int, for larger module
const BS_FRAMES 					= (1 << 8)
const BS_FM_OFF_SHORT 				= (1 << 10)    // export fm offsets as shorts
const BS_NFM_SHORT 					= (1 << 11)    // export fmodule count per frame as short
const BS_SKIP_FRAME_RC 				= (1 << 12)    // do not export frame rect
const BS_FRAME_COLL_RC 				= (1 << 13)    // export collision rect
const BS_FM_PALETTE 				= (1 << 14)    // export palette used by the module
const BS_FRAME_RECTS 				= (1 << 15)    // export frame rects
const BS_ANIMS 						= (1 << 16)
const BS_NO_AF_START 				= (1 << 17)    // do not export start of AFrames
const BS_AF_OFF_SHORT 				= (1 << 18)    // export af offsets as shorts
const BS_NAF_SHORT 					= (1 << 19)    // export naf as short
const BS_FM_INDEX_SHORT 			= (1 << 20)    // export frame module ID's as shorts
const BS_AF_INDEX_SHORT 			= (1 << 21)    // export animation frame ID's as shorts
const BS_EXTRA_FLAGS 				= (1 << 22)	// if enabled means that there are extra flags exported.
const BS_MODULE_IMAGES_FX 			= (1 << 23)	// export encoded images for each module (flipped horizontally)
const BS_MODULE_IMAGES 				= (1 << 24)
const BS_PNG_CRC 					= (1 << 25)
const BS_KEEP_PAL 					= (1 << 26)
const BS_TRANSP_FIRST 				= (1 << 27)
const BS_TRANSP_LAST 				= (1 << 28)
const BS_SINGLE_IMAGE 				= (1 << 29)
const BS_MULTIPLE_IMAGES 			= (1 << 30)
const BS_GIF_HEADER 				= (1 << 31)	// export gif header instead of palet
const BS_DEFAULT_MIDP2 				= (BS_MODULES | BS_FRAMES | BS_ANIMS | BS_MODULE_IMAGES)
const BS_DEFAULT_NOKIA 				= (BS_DEFAULT_MIDP2)
const BS_DEFAULT_MIDP1 				= (BS_MODULES | BS_MODULES_XY | BS_FRAMES | BS_ANIMS)
const BS_DEFAULT_MIDP1b 			= (BS_MODULES | BS_FRAMES | BS_ANIMS | BS_MODULE_IMAGES | BS_PNG_CRC)
const BS_DEFAULT_MIDP1c 			= (BS_MODULES | BS_MODULES_XY | BS_FRAMES | BS_ANIMS | BS_SINGLE_IMAGE)


//BSprite extra flags0
const BS_EX0_FM_FREE_ROTATE_SCALE 	= (1 << 0)
const BS_EX0_AF_FREE_ROTATE_SCALE 	= (1 << 1)
const BS_EX0_MULTIPAL_IMAGE 		= (1 << 2)
const BS_EX0_MULTI_IMAGE 			= (1 << 3)
const BS_EX0_FM_BLEND_MODE 			= (1 << 4)		// export blend mode for each frame module. You need to enable GLLibConfig.sprite_useFMBlendMode
const BS_EX0_MODULE_IMAGES_USED 	= (1 << 5)

const BS_EX0_IMAGES_NAME         	= (1 << 10)

const BS_EX0_ANIMEX 				= (1 << 12)	// export tween
const BS_EX0_PIVOT_FRAME_ANIM 		= (1 << 13)
const BS_EX0_MMAPPINGS 				= (1 << 17)	// export module mappings to *.bsprite
const BS_EX0_MM_OFFSET 				= (1 << 18)	// export module offset for mapping
const BS_EX0_MM_OFFSET_SHORT 		= (1 << 19)	// export module offset as short
const BS_EX0_SINGLE_IMAGE_INDEX 	= (1 << 20)	// export image data contain alpha values and RGB palette indices

const BS_EX0_PRIMITIVES_PAL 		= (1 << 22)	// export color (from palette) & image index for primitive modules
const BS_EX0_MODULE_MERGED_ATLAS 	= (1 << 23) 	// export module merged atlas
const BS_PALETTE_TYPE 				= (1 << 24)		// export palette type to use blend palette or others in future
const BS_FRAME_POLYGONS 			= (1 << 26)		// export frame polygons collision

const MD_IMAGE 						= 0
const MD_RECT 						= 0xFF
const MD_FILL_RECT 					= 0xFE
const MD_MARKER 					= 0xFD
const MD_ARC 						= 0xFC
const MD_FILL_ARC 					= 0xFB
const MD_TRIANGLE 					= 0xFA
const MD_FILL_TRIANGLE 				= 0xF9
const MD_LINE 						= 0xF8
const MD_FILL_RECT_GRAD 			= 0xF7
const MD_MESH 						= 0xF4

// Frames/Anims flags...
const FLAG_FLIP_X 					= 0x01
const FLAG_FLIP_Y 					= 0x02
const FLAG_ROT_90 					= 0x04
const FLAG_HYPER_FM 				= 0x10 // Hyper FModule, used by FModules

export class Image
{
    constructor() {
        this.name
    }
}

export class Module
{
    constructor()
    {
        this.type
        this.imgIndex
        this.x
        this.y
        this.w
        this.h
        this.color
    }
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export class FModule
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

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export class Frame
{
    constructor()
    {
        this.fmCount
        this.fmstartIndex
        this.rect = []
    }
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export class AFrame
{
    constructor()
    {
        this.frameIndex
        this.time
        this.ox
        this.oy
        this.flags
        this.rotation = 0
        this.scaleX	= 1
        this.scaleY	= 1
    }
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export class Animation
{
    constructor()
    {
        this.aFramesCount
        this.aFramesStartIndex
    }
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export class Rect
{
    constructor()
    {
        this.x		= 0
        this.y		= 0
        this.width	= 0
        this.height	= 0
    }

    Set(rect)
    {
        this.x		= rect.x
        this.y		= rect.y
        this.width	= rect.width
        this.height	= rect.height
    }

    Scale(scalex, scaley)
    {
        this.x		*= scalex
        this.y		*= scaley
        this.width	*= scalex
        this.height	*= scaley

        return this
    }

    Translate(x, y)
    {
        this.x		+= x
        this.y		+= y

        return this
    }

    Clone()
    {
        let rect = new Rect()

        rect.x		= this.x
        rect.y		= this.y
        rect.width	= this.width
        rect.height	= this.height

        return rect
    }
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export default class SLoader
{
    constructor(buffer, callback)
    {
        this.bsFlags				= 0
        this.bsExtraFlags			= 0
        this.modules 				= []
        this.fmodules				= []
        this.frames					= []
        this.frameRect				= []
        this.framePolygon			= []
        this.framePolygonLength		= []
        this.aframes				= []
        this.anims					= []

        this.callback = callback
        this.textures = null
        this.bufferReader = new BReader(buffer)
        this.LoadAsync()
    }

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    CheckFlag(flag1, flag2)
    {
        return (flag1 & flag2) != 0
    }

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    CheckSpriteFlag(flag)
    {
        return (this.bsFlags & flag) != 0
    }

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    CheckSpriteExtraFlag(flag)
    {
        return (this.bsExtraFlags & flag) != 0
    }

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    ConvertFMFlagsToFreeRotateScale(fmodule)
    {
        let fm_flags	= fmodule.fmodulesFlags
        let ox 			= fmodule.fmodulesOX
        let oy			= fmodule.fmodulesOY
        let module		= this.modules[fmodule.fmodulesID]
        let w			= module.w
        let h			= module.h

        fmodule.fmodulesRotation	= 0
        fmodule.fmodulesScaleX	= 1
        fmodule.fmodulesScaleY	= 1

        if (this.CheckFlag(fm_flags, FLAG_ROT_90))
        {
            fmodule.fmodulesRotation = 90
            if (this.CheckFlag(fm_flags, FLAG_FLIP_X))
            {
                fmodule.fmodulesScaleX = -1
                if (this.CheckFlag(fm_flags, FLAG_FLIP_Y))
                {
                    fmodule.fmodulesScaleY = -1
                    oy += w
                }
                else
                {
                    oy += w
                    ox += h
                }
            }
            else if (this.CheckFlag(fm_flags, FLAG_FLIP_Y))
            {
                fmodule.fmodulesScaleY = -1
            }
            else
            {
                ox += h
            }
            fmodule.fmodulesOY = oy
            fmodule.fmodulesOX = ox
        }
        else
        {
            if (this.CheckFlag(fm_flags, FLAG_FLIP_X))
            {
                fmodule.fmodulesScaleX = -1
                ox += w
                fmodule.fmodulesOX = ox
            }

            if (this.CheckFlag(fm_flags, FLAG_FLIP_Y))
            {
                fmodule.fmodulesScaleY = -1
                oy += h
                fmodule.fmodulesOY = oy
            }
        }
    }

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    LoadImage() {
        if (this.CheckSpriteExtraFlag(BS_EX0_IMAGES_NAME)) {
            let nImages = this.bufferReader.ReadUShort();
            for (let i = 0; i < nImages; i++) {
                let image = new Image();

                let length = this.bufferReader.ReadUByte();
                image.name = this.bufferReader.ReadString();
                
                if (image.name.length != length - 1)
                    throw new Error("Wrong string length");

                image.name = PATH.normalize(image.name);

                this.images.push(image);
            }
        }
    }

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    LoadModule()
    {
        let nModules = this.bufferReader.ReadUShort()
        if (nModules > 0)
        {
            let module
            for (let i = 0; i < nModules; ++i)
            {
                let moduleType					= this.bufferReader.ReadUByte()
                let bLoadAModulePosition		= false
                let bLoadAModuleSize			= false
                let bLoadPrimitivePaletteIndex	= false
                let bLoadAModuleColor			= false

                module 		= new Module()
                module.type = moduleType

                if (moduleType == MD_IMAGE)
                {
                    bLoadAModulePosition = true
                    bLoadAModuleSize = true
                    if (this.CheckSpriteFlag(BS_MODULES_IMG))
                    {
                        module.imgIndex = this.bufferReader.ReadByte()
                    }
                }
                else if (moduleType == MD_MESH)
                {
                }
                else if (moduleType == MD_RECT)
                {
                }
                else if (moduleType == MD_FILL_RECT)
                {
                    bLoadPrimitivePaletteIndex = true
                    bLoadAModuleColor = true
                    bLoadAModuleSize = true
                }
                else if (moduleType == MD_MARKER)
                {
                }
                else if (moduleType == MD_ARC)
                {
                }
                else if (moduleType == MD_FILL_ARC)
                {
                }
                else if (moduleType == MD_TRIANGLE)
                {
                }
                else if (moduleType == MD_FILL_TRIANGLE)
                {
                }
                else if (moduleType == MD_LINE)
                {
                }
                else if (moduleType == MD_FILL_RECT_GRAD)
                {
                }
                else
                {
                    Utils.Log('Invalid module type : ' + moduleType + '	module #' + i)
                }

                if (bLoadPrimitivePaletteIndex)
                {
                    if (this.CheckSpriteExtraFlag(BS_EX0_PRIMITIVES_PAL))
                    {
                        //.........
                    }
                }

                if (bLoadAModuleColor)
                {
                    module.color = Graphic.ToColor(this.bufferReader.ReadInt32())
                }

                if (bLoadAModulePosition)
                {
                    if (this.CheckSpriteFlag(BS_MODULES_XY_SHORT))
                    {
                        module.x = this.bufferReader.ReadShort()
                        module.y = this.bufferReader.ReadShort()
                    }
                    else if (this.CheckSpriteFlag(BS_MODULES_XY))
                    {
                        module.x = this.bufferReader.ReadByte()
                        module.y = this.bufferReader.ReadByte()
                    }
                }

                if (bLoadAModuleSize)
                {
                    if (this.CheckSpriteFlag(BS_MODULES_WH_SHORT))
                    {
                        module.w = this.bufferReader.ReadShort()
                        module.h = this.bufferReader.ReadShort()
                    }
                    else
                    {
                        module.w = this.bufferReader.ReadByte()
                        module.h = this.bufferReader.ReadByte()
                    }
                }
                this.modules.push(module)
            }
        }
    }

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    LoadFModule()
    {
        let nFModules = this.bufferReader.ReadUShort()
        if (nFModules > 0)
        {
            for (let i = 0; i < nFModules; i++)
            {
                let fmodule = new FModule()
                if (this.CheckSpriteFlag(BS_FM_INDEX_SHORT))
                {
                    fmodule.fmodulesID = this.bufferReader.ReadShort()
                }
                else
                {
                    fmodule.fmodulesID = this.bufferReader.ReadByte()
                }

                if (this.CheckSpriteFlag(BS_FM_OFF_SHORT))
                {
                    fmodule.fmodulesOX = this.bufferReader.ReadShort()
                    fmodule.fmodulesOY = this.bufferReader.ReadShort()
                }
                else
                {
                    fmodule.fmodulesOX = this.bufferReader.ReadByte()
                    fmodule.fmodulesOY = this.bufferReader.ReadByte()
                }

                // Frame Module Palette (BYTE/0)
                if (this.CheckSpriteFlag(BS_FM_PALETTE))
                {
                    fmodule.fmodulesPal = this.bufferReader.ReadByte()
                }

                // Frame Module flags (BYTE)
                fmodule.fmodulesFlags = this.bufferReader.ReadByte()
                if (this.CheckSpriteExtraFlag(BS_EX0_FM_FREE_ROTATE_SCALE))
                {
                    fmodule.fmodulesRotation = this.bufferReader.ReadShort()
                    fmodule.fmodulesScaleX = this.bufferReader.ReadShort() / 100
                    fmodule.fmodulesScaleY = this.bufferReader.ReadShort() / 100
                }
                else
                {
                    this.ConvertFMFlagsToFreeRotateScale(fmodule)
                }

                // Frame Module Blend Mode (1 BYTE mode + 1 BYTE opacity)
                if (this.CheckSpriteExtraFlag(BS_EX0_FM_BLEND_MODE))
                {
                    fmodule.fmodulesBlendMode = this.bufferReader.ReadByte()
                    fmodule.fmodulesBlendOpacity = this.bufferReader.ReadByte()
                }

                this.fmodules.push(fmodule)
            }
        }
    }

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    LoadFrame()
    {
        if (this.CheckSpriteFlag(BS_FRAME_RECTS))
        {
            let nRects			= this.bufferReader.ReadUShort()
            let size 			= nRects << 2
            let frameRectIndex	= 0

            if (this.CheckSpriteFlag(BS_FM_OFF_SHORT))
            {
                BReader.ReadShortArray(this.frameRect, frameRectIndex, data, index, size)
                index += (size * 2)
                frameRectIndex += size
            }
            else
            {
                BReader.ArrayCopy(this.frameRect, frameRectIndex, data, index, size)
                index += size
                frameRectIndex += size
            }
        }

        if (this.CheckSpriteExtraFlag(BS_FRAME_POLYGONS))
        {
            let nConner = this.bufferReader.ReadUShort()
            let size 	= nConner << 1

            if (this.CheckSpriteFlag(BS_FM_OFF_SHORT))
            {
                BReader.ReadShortArray(this.framePolygon, 0, data, index, size)
                index += (size * 2)
            }
            else
            {
                BReader.ReadShortArray(this.framePolygon, 0, data, index, size)
                index += (size)
            }

            let nPolygon = this.bufferReader.ReadUShort()
            BReader.ReadShortArray(this.framePolygonLength, 0, data, index, nPolygon)
            index += (nPolygon * 2)
        }

        // Frames...
        let nFrames = this.bufferReader.ReadUShort()
        if (nFrames > 0)
        {
            let frameRectOffset		= 0
            let framePolygonOffset	= 0
            for (let i = 0; i < nFrames; i++)
            {
                let frame 				= new Frame()
                let frameRectCount		= 0
                let framePolygonCount	= 0
                if (this.CheckSpriteFlag(BS_NFM_SHORT))
                {
                    frame.fmCount = this.bufferReader.ReadShort()
                }
                else
                {
                    frame.fmCount = this.bufferReader.ReadByte()
                }

                frame.fmstartIndex = this.bufferReader.ReadShort()
                if (this.CheckSpriteFlag(BS_FRAME_RECTS))
                {
                    let frameRectStart = frameRectOffset
                    frameRectOffset	+= this.bufferReader.ReadByte()
                    frameRectCount	= frameRectOffset - frameRectStart

                    for (let j = 0; j < frameRectCount; j++)
                    {
                        let rect = new Rect()
                        let idx	 = (frameRectStart + j) * 4

                        rect.x		= this.frameRect[idx + 0]
                        rect.y		= this.frameRect[idx + 1]
                        rect.width	= this.frameRect[idx + 2]
                        rect.height	= this.frameRect[idx + 3]

                        frame.rect.push(rect)
                    }
                }

                if (this.CheckSpriteExtraFlag(BS_FRAME_POLYGONS))
                {
                    let framePolygonStart = framePolygonOffset
                    framePolygonOffset += this.bufferReader.ReadByte()
                    framePolygonCount = framePolygonOffset - framePolygonStart

                    let idx = 0
                    for (let j = 0; j < framePolygonCount; j++)
                    {
                        let polygon = []
                        let idx		= 0
                        for (var k = 0; k < framePolygonStart + j; k++)
                        {
                            idx += this.framePolygonLength[k]
                        }

                        for (var k = 0; k < this.framePolygonLength[framePolygonStart + j]; k++)
                        {
                            var offset = (idx + k) * 2
                            polygon.push(this.framePolygon[offset + 0])
                            polygon.push(this.framePolygon[offset + 1])
                        }
                        frame.rect.push(polygon)
                    }
                }

                if (frameRectCount <= 0 && framePolygonCount <=0)
                {
                    let rect		= new Rect()
                    let fm_start	= frame.fmstartIndex
                    let fm_end		= frame.fmstartIndex + frame.fmCount
                    let fm 			= this.fmodules[fm_start]
                    let right		= 0
                    let bottom		= 0

                    if (fm)
                    {
                        rect.x		= fm.fmodulesOX
                        rect.y		= fm.fmodulesOY
                        right		= fm.fmodulesOX + this.modules[fm.fmodulesID].w
                        bottom		= fm.fmodulesOY + this.modules[fm.fmodulesID].h
                    }

                    for (let j = fm_start; j < fm_end; j++)
                    {
                        let md 	= this.modules[this.fmodules[j].fmodulesID]
                        fm 		= this.fmodules[j]

                        if (rect.x > fm.fmodulesOX)
                        {
                            rect.x = fm.fmodulesOX
                        }
                        if (rect.y > fm.fmodulesOY)
                        {
                            rect.y = fm.fmodulesOY
                        }
                        if (right < fm.fmodulesOX + md.w)
                        {
                            right = fm.fmodulesOX + md.w
                        }
                        if (bottom < fm.fmodulesOY + md.h)
                        {
                            bottom = fm.fmodulesOY + md.h
                        }
                    }

                    rect.width	= right - rect.x
                    rect.height = bottom - rect.y

                    frame.rect.push(rect)
                }

                this.frames.push(frame)
            }

            if (!this.CheckSpriteFlag(BS_SKIP_FRAME_RC))
            {
                // Bound rect for each frame...
                let nFrames4 = nFrames << 2
                for (let i = 0; i < nFrames4; i++)
                {
                    let value
                    if (this.CheckSpriteFlag(BS_FM_OFF_SHORT))
                    {
                        value = this.bufferReader.ReadShort()
                    }
                    else
                    {
                        value = this.bufferReader.ReadByte()
                    }
                }
            }

            if (this.CheckSpriteFlag(BS_FRAME_COLL_RC))
            {
                if (this.CheckSpriteFlag(BS_FM_OFF_SHORT))
                {
                    index += (nFrames << 3)//skip
                }
                else
                {
                    index += (nFrames << 2)//skip
                }
            }
        }
    }

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    LoadAFrame()
    {
        // AFrames...
        let nAFrames = this.bufferReader.ReadUShort()
        if (nAFrames > 0)
        {
            for (let i = 0; i < nAFrames; i++)
            {
                let aframe = new AFrame()
                if (this.CheckSpriteFlag(BS_AF_INDEX_SHORT))
                {
                    aframe.frameIndex = this.bufferReader.ReadShort()
                }
                else
                {
                    aframe.frameIndex = this.bufferReader.ReadByte()
                }

                aframe.time = this.bufferReader.ReadUByte()
                if (this.CheckSpriteFlag(BS_AF_OFF_SHORT))
                {
                    aframe.ox = this.bufferReader.ReadShort()
                    aframe.oy = this.bufferReader.ReadShort()
                }
                else
                {
                    aframe.ox = this.bufferReader.ReadByte()
                    aframe.oy = this.bufferReader.ReadByte()
                }

                aframe.flags = this.bufferReader.ReadByte()
                if (this.CheckSpriteExtraFlag(BS_EX0_AF_FREE_ROTATE_SCALE))
                {
                    aframe.rotation = this.bufferReader.ReadShort()
                    aframe.scaleX = this.bufferReader.ReadShort() / 100
                    aframe.scaleY = this.bufferReader.ReadShort() / 100
                }

                this.aframes.push(aframe)
            }
        }
    }

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    LoadAnims()
    {
        // Anims...
        let nAnims = this.bufferReader.ReadUShort()
        if (nAnims > 0)
        {
            for (let i = 0; i < nAnims; i++)
            {
                let anim = new Animation()
                if (this.CheckSpriteFlag(BS_NAF_SHORT))
                {
                    anim.aFramesCount = this.bufferReader.ReadShort()
                }
                else
                {
                    anim.aFramesCount = this.bufferReader.ReadByte()
                }

                anim.aFramesStartIndex = this.bufferReader.ReadShort()
                this.anims.push(anim)
            }
        }
    }

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    LoadTween()
    {
        if (this.CheckSpriteExtraFlag(BS_EX0_ANIMEX))
        {
            try
            {
                let keyFramesAmount = this.bufferReader.ReadUShort()
                for (let i = 0; i < keyFramesAmount; i++)
                {
                    index += 2
                    index++
                    index += 2
                    index += 2
                    index += 2
                    index += 2
                    index += 2
                    index += 2
                    index++
                    index += 2
                    index += 2
                    index += 2
                    index += 2
                    index += 2
                    index++
                    index += 2

                }

                let interpolationSegmentsAmount = this.bufferReader.ReadUShort()
                for (let i = 0; i < interpolationSegmentsAmount; i++)
                {
                    index += 2
                    index += 2
                    index += 2
                }

                let layersAmount = this.bufferReader.ReadUShort()
                for (let i = 0; i < layersAmount; i++)
                {
                    index += 2
                    index += 2
                    index += 2
                    index += 2
                    index += 2
                }

                let animExAmount = this.bufferReader.ReadUShort()
                for (let i = 0; i < animExAmount; i++)
                {
                    //Read layers id animation consist of
                    index += 2
                    index += 2
                    index += 2
                }
            }
            catch (e)
            {
                Utils.Log('Guisprite: ' + e)
            }
        }
    }

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    LoadAsync()
    {
        this.bsFlags				= 0
        this.bsExtraFlags			= 0
        this.images                 = []
        this.modules 				= []
        this.fmodules				= []
        this.frames					= []
        this.frameRect				= []
        this.framePolygon			= []
        this.framePolygonLength		= []
        this.aframes				= []
        this.anims					= []

        let bs_version = this.bufferReader.ReadShort()

        if (bs_version != SUPPORTED_VERSION)
        {
            Utils.Log('ASprite.Load.Invalid BSprite version!')
            return
        }

        this.bsFlags = this.bufferReader.ReadInt32()
        if (this.CheckSpriteFlag(BS_EXTRA_FLAGS))
        {
            this.bsExtraFlags = this.bufferReader.ReadInt32()
        }

        this.LoadImage();
        this.LoadModule()
        this.LoadFModule()
        this.LoadFrame()
        this.LoadAFrame()
        this.LoadAnims()
        // this.LoadTween()

        if (this.modules.length <= 0)
        {
            Utils.Log('WARNING: sprite with num modules = ' + this.modules.length)
            return
        }
                
        this.data =
        {
            images: this.images,
            modules: this.modules,
            fmodules: this.fmodules,
            frames: this.frames,
            aframes: this.aframes,
            anims: this.anims,
        };

        this.m_loadTexture = new PIXI.loaders.Loader();

        this.images.forEach(img => {
            this.m_loadTexture.add(img.name, resource.get_embed_src(`data/${img.name}`), { loadType: PIXI.loaders.Resource.LOAD_TYPE.XHR });
        });

        this.m_loadTexture.on('complete', evt =>
        {
            this.textures = this.images.map(img => this.m_loadTexture.resources[img.name].texture);
            this.callback(this);
        });
        this.m_loadTexture.load();
    }
}
