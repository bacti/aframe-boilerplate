const BWriter = require('./BWriter')
const SpriteConstant =  require('../src/SpriteConstant')
const _ = require('lodash')
_.merge(global, SpriteConstant)

module.exports =
class SpriteObject
{
    constructor()
    {
        this.images = []
        this.modules = []
        this.fmodules = []
        this.frames = []
        this.aframes = []
        this.anims = []
    }

    BuildFlag()
    {
        let IsShort = x => x < -128 || x > 127
        this.bsFlags = 0
        this.bsExtraFlags = 0
        this.bsFlags |= BS_EXTRA_FLAGS | BS_SKIP_FRAME_RC
        this.bsFlags |= this.images.length > 0 ? BS_MODULES_IMG : 0 //zero
        this.bsExtraFlags |= this.images.length > 0 ? BS_EX0_IMAGES_NAME : 0
        if (this.modules.length > 0) this.bsFlags |= BS_MODULES

        //moules
        let bsMdXYSht = this.modules.reduce((ac, cr) => ac || IsShort(cr.x) || IsShort(cr.y), false)
        this.bsFlags |= bsMdXYSht ? BS_MODULES_XY_SHORT : BS_MODULES_XY

        let bsMdWhSht = this.modules.reduce((ac, cr) => ac || IsShort(cr.w) || IsShort(cr.h), false)
        this.bsFlags |= bsMdWhSht ? BS_MODULES_WH_SHORT : 0

        //fmodules
        let bsFmIdSht = this.fmodules.reduce((ac, cr) => ac || IsShort(cr.fmodulesID), false)
        this.bsFlags |= bsFmIdSht ? BS_FM_INDEX_SHORT : 0

        let bsFmOffSht = this.fmodules.reduce((ac, cr) => ac || IsShort(cr.fmodulesOX) || IsShort(cr.fmodulesOY), false)
        this.bsFlags |= bsFmOffSht ? BS_FM_OFF_SHORT : 0

        /*not supprot BS_FM_PALETTE yet*/
        let fmFrRtScl = this.fmodules.reduce((ac, cr) => ac || cr.fmodulesScaleX || cr.fmodulesRotation, undefined)
        this.bsExtraFlags |= fmFrRtScl ? BS_EX0_FM_FREE_ROTATE_SCALE : 0
        let fmBlndMd = this.fmodules.reduce((ac, cr) => ac || cr.fmodulesBlendMode || cr.fmodulesBlendOpacity, undefined)
        this.bsExtraFlags |= fmBlndMd ? BS_EX0_FM_BLEND_MODE : 0
        // console.log(fmBlendMode?true: false)
        //frames
        /*not support BS_FRAME_RECTS, BS_FRAME_POLYGONS, BS_FRAME_RECTS, 
            BS_FRAME_POLYGONS, BS_SKIP_FRAME_RC, BS_FRAME_COLL_RC,
             BS_FM_OFF_SHORT yet*/
        let bsBfmSht = this.frames.reduce((ac, cr) => ac || IsShort(cr.fmCount), false)
        this.bsFlags |= bsBfmSht ? BS_NFM_SHORT : 0

        //afame
        let bsAfIdSht = this.aframes.reduce((ac, cr) => ac || IsShort(cr.frameIndex), false)
        this.bsFlags |= bsAfIdSht ? BS_AF_INDEX_SHORT : 0

        let bsAfOffSht = this.aframes.reduce((ac, cr) => ac || IsShort(cr.ox) || IsShort(cr.oy), false)
        this.bsFlags |= bsAfOffSht ? BS_AF_OFF_SHORT : 0

        let afFrRtScl = this.aframes.reduce((ac, cr) => ac || cr.rotation || cr.scaleX, undefined)

        this.bsExtraFlags |= afFrRtScl ? BS_EX0_AF_FREE_ROTATE_SCALE : 0
        //anims
        let bsNfSht = this.anims.reduce((ac, cr) => ac || IsShort(cr.aFramesCount), false)
        this.bsFlags |= bsNfSht ? BS_NAF_SHORT : 0

        //some els
        // this.bsFlags = 0x01411531
        // this.bsExtraFlags = 0x00000001
    }

    GetDefineHeader(name)
    {
        if (!name) name = ''
        name = name.toUpperCase() + '_'
        let res = []
        this.frames.forEach((e, i) =>
        {
            if (e.desc && e.desc.length > 0)
            {
                let key = e.desc.trim().replace(/\s+/g, '_').toUpperCase()
                key = 'SPRITE_' + name + 'FRAME_' + key
                res.push({ key: key, value: i })
            }

        })
        this.anims.forEach((e, i) =>
        {
            if (e.desc && e.desc.length > 0)
            {
                let key = e.desc.trim().replace(/\s+/g, '_').toUpperCase()
                key = 'SPRITE_' + name + 'ANIM_' + key
                res.push({ key: key, value: i })
            }

        })
        return res
    }

    CheckSpriteFlag(flag)
    {
        return (this.bsFlags & flag) != 0
    }

    CheckSpriteExtraFlag(flag)
    {
        return (this.bsExtraFlags & flag) != 0
    }

    SaveAsync(fileOut)
    {
        let self = this
        this.BuildFlag()
        // console.log(this)

        return new Promise((resolve, reject) =>
        {
            let writer = new BWriter(fileOut)
            writer.WriteShort(SUPPORTED_VERSION)
            writer.WriteInit32(this.bsFlags)
            writer.WriteInit32(this.bsExtraFlags)

            //write moduleswrite
            //todo: write image
            self.WriteImages(writer, self.images)
            self.WriteModule(writer, self.modules)
            self.WriteFmodule(writer, self.fmodules)
            self.WriteFrame(writer, self.frames)
            self.WriteAFrame(writer, self.aframes)
            self.WriteAnims(writer, self.anims)
            writer.Close()

            resolve()
        })
    }

    WriteImages(writer, images)
    {
        if (this.CheckSpriteExtraFlag(BS_EX0_IMAGES_NAME))
        {
            writer.WriteUShort(images.length)
            for (let i = 0; i < images.length; ++i)
            {
                let image = images[i]
                writer.WriteUByte(image.name.length + 1)
                writer.WriteString(image.name)
            }
        }
    }

    WriteModule(writer, modules)
    {
        writer.WriteUShort(modules.length)
        for (let i = 0; i < modules.length; ++i)
        {
            let module = modules[i]
            writer.WriteUByte(module.type)

            let moduleType = module.type
            let bLoadAModulePosition = false
            let bLoadAModuleSize = false
            let bLoadPrimitivePaletteIndex = false
            let bLoadAModuleColor = false

            if (moduleType == MD_IMAGE)
            {
                bLoadAModulePosition = true
                bLoadAModuleSize = true

                if (this.CheckSpriteFlag(BS_MODULES_IMG))
                {

                    writer.WriteByte(module.imgIndex)
                }
            }
            else
            if (moduleType == MD_FILL_RECT)
            {
                bLoadPrimitivePaletteIndex = true
                bLoadAModuleColor = true
                bLoadAModuleSize = true
            }
            else
            {
                Utils.Log('Unsupported module type : ' + moduleType + '	module #' + i)
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
                writer.WriteInit32(module.color)
            }

            if (bLoadAModulePosition)
            {
                if (this.CheckSpriteFlag(BS_MODULES_XY_SHORT))
                {
                    writer.WriteShort(module.x)
                    writer.WriteShort(module.y)
                }
                else
                if (this.CheckSpriteFlag(BS_MODULES_XY))
                {
                    writer.WriteByte(module.x)
                    writer.WriteByte(module.y)
                }
            }

            if (bLoadAModuleSize)
            {
                if (this.CheckSpriteFlag(BS_MODULES_WH_SHORT))
                {
                    writer.WriteShort(module.w)
                    writer.WriteShort(module.h)
                }
                else
                {
                    writer.WriteByte(module.w)
                    writer.WriteByte(module.h)
                }
            }
        }
    }

    WriteFmodule(writer, fmodules)
    {
        writer.WriteUShort(fmodules.length)
        for (let i = 0; i < fmodules.length; ++i)
        {
            let fmodule = fmodules[i]
            // console.log(fmodule)
            if (this.CheckSpriteFlag(BS_FM_INDEX_SHORT))
            {
                writer.WriteShort(fmodule.fmodulesID)
            }
            else
            {
                writer.WriteByte(fmodule.fmodulesID)
            }

            if (this.CheckSpriteFlag(BS_FM_OFF_SHORT))
            {
                writer.WriteShort(fmodule.fmodulesOX)
                writer.WriteShort(fmodule.fmodulesOY)
            }
            else
            {
                writer.WriteByte(fmodule.fmodulesOX)
                writer.WriteByte(fmodule.fmodulesOY)
            }

            // Frame Module Palette (BYTE/0)
            if (this.CheckSpriteFlag(BS_FM_PALETTE))
            {
                writer.WriteByte(fmodule.fmodulesPal)
            }

            // Frame Module flags (BYTE)
            writer.WriteByte(0) //fmodule.fmodulesFlags
            if (this.CheckSpriteExtraFlag(BS_EX0_FM_FREE_ROTATE_SCALE))
            {
                writer.WriteShort(fmodule.fmodulesRotation)
                writer.WriteShort(fmodule.fmodulesScaleX)
                writer.WriteShort(fmodule.fmodulesScaleY)
            }

            // Frame Module Blend Mode (1 BYTE mode + 1 BYTE opacity)
            if (this.CheckSpriteExtraFlag(BS_EX0_FM_BLEND_MODE))
            {
                writer.WriteByte(fmodule.fmodulesBlendMode)
                writer.WriteByte(fmodule.fmodulesBlendOpacity)
            }
        }
    }

    WriteFrame(writer, frames)
    {
        /*not support frame rect, frame polygon, frame  coll  */

        writer.WriteUShort(frames.length)
        for (let i = 0; i < frames.length; ++i)
        {
            let frame = frames[i]
            if (this.CheckSpriteFlag(BS_NFM_SHORT))
            {
                writer.WriteShort(frame.fmCount)
            }
            else
            {
                writer.WriteByte(frame.fmCount)
            }
            writer.WriteShort(frame.fmstartIndex)
        }
        // console.log(this.CheckSpriteExtraFlag(BS_FRAME_POLYGONS))
    }

    WriteAFrame(writer, aframes)
    {
        // console.log(aframes.length)
        writer.WriteUShort(aframes.length)
        for (let i = 0; i < aframes.length; ++i)
        {
            let aframe = aframes[i]

            if (this.CheckSpriteFlag(BS_AF_INDEX_SHORT))
            {
                writer.WriteShort(aframe.frameIndex)
            }
            else
            {
                writer.WriteByte(aframe.frameIndex)
            }
            writer.WriteUByte(aframe.time)
            if (this.CheckSpriteFlag(BS_AF_OFF_SHORT))
            {
                writer.WriteShort(aframe.ox)
                writer.WriteShort(aframe.oy)
            }
            else
            {
                writer.WriteByte(aframe.ox)
                writer.WriteByte(aframe.oy)
            }
            writer.WriteByte(aframe.flags)
            if (this.CheckSpriteExtraFlag(BS_EX0_AF_FREE_ROTATE_SCALE))
            {
                writer.WriteShort(aframe.rotation)
                writer.WriteShort(aframe.scaleX)
                writer.WriteShort(aframe.scaleY)
            }
        }
    }

    WriteAnims(writer, anims)
    {
        writer.WriteUShort(anims.length)
        for (let i = 0; i < anims.length; ++i)
        {
            let anim = anims[i]
            if (this.CheckSpriteFlag(BS_NAF_SHORT))
            {
                writer.WriteShort(anim.aFramesCount)
            }
            else
            {
                writer.WriteByte(anim.aFramesCount)

            }
            writer.WriteShort(anim.aFramesStartIndex)
        }
    }
}
