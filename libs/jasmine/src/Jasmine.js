import Constant from './Constant'
import BReader from './BReader'
export default class Jasmine
{
    constructor(bufferReader, callback)
    {
        this.callback = callback
        this.LoadAsync(new BReader(bufferReader))
    }

    LoadAsync(bufferReader)
    {
        let m_exportQuality = bufferReader.ReadByte()
        let m_exportImageType = bufferReader.ReadByte()
        let m_exportPixelType = bufferReader.ReadByte()
    
        this.m_dataTextures = new PIXI.loaders.Loader()
        this.m_dataTextures.on('complete', this.callback)
        let m_numTexture = bufferReader.ReadByte()
        this.m_arrTextures = [...Array(m_numTexture)].map((_, i) =>
        {
            if (m_exportImageType == Constant.EXPORT_TYPE_SINGLE_IMAGE)
            {
                let texture = { alias: bufferReader.ReadString() }
                this.m_dataTextures.add(texture.alias, resource.get_embed_src(`data/${texture.alias}`), { loadType: PIXI.loaders.Resource.LOAD_TYPE.XHR })
                return texture
            }
        })
        this.m_dataTextures.load()

        this.m_numModule = bufferReader.ReadShort()
        this.m_arrModules = [...Array(this.m_numModule)].map((_, i) =>
        {
            return {
                x: bufferReader.ReadUShort(),
                y: bufferReader.ReadUShort(),
                w: bufferReader.ReadUShort(),
                h: bufferReader.ReadUShort(),
                textureId: bufferReader.ReadUByte(),
            }
        })

        let m_numFrameModule = 0
        this.m_numFrame = bufferReader.ReadShort()
        this.m_arrFrames = [...Array(this.m_numFrame)].map((_, i) =>
        {
            let frameInfo =
            {
                offset: m_numFrameModule,
                numFModules: bufferReader.ReadUShort(),
            }
            m_numFrameModule += frameInfo.numFModules
            return frameInfo
        })
        this.m_arrFrameModules = [...Array(m_numFrameModule)].map((_, i) =>
        {
            let frameModuleInfo =
            {
                moduleId: bufferReader.ReadShort(),
                mode: bufferReader.ReadUByte(),
            }

            if (frameModuleInfo.mode & Constant.FREE_TRANSFORM)
            {
                frameModuleInfo.x = bufferReader.ReadFloat32()
                frameModuleInfo.y = bufferReader.ReadFloat32()
                frameModuleInfo.M11 = bufferReader.ReadFloat32()
                frameModuleInfo.M12 = bufferReader.ReadFloat32()
                frameModuleInfo.M21 = bufferReader.ReadFloat32()
                frameModuleInfo.M22 = bufferReader.ReadFloat32()
            }
            if (frameModuleInfo.mode & Constant.OPACITY)
            {
                frameModuleInfo.opacity = bufferReader.ReadFloat32()
            }

            return frameModuleInfo
        })

        let m_numAnimFrame = 0
        let m_numAnim = bufferReader.ReadShort()
        this.m_arrAnims = [...Array(m_numAnim)].map((_, i) =>
        {
            let animInfo =
            {
                start: bufferReader.ReadFloat32(),
                duration: bufferReader.ReadFloat32(),
                numAFrames: bufferReader.ReadShort(),
                offset: m_numAnimFrame,
            }
            m_numAnimFrame += animInfo.numAFrames
            return animInfo
        })
        this.m_arrAnimFrames = [...Array(m_numAnimFrame)].map((_, i) =>
        {
            return {
                frameId: bufferReader.ReadUShort(),
                ox: bufferReader.ReadShort(),
                oy: bufferReader.ReadShort(),
                time: bufferReader.ReadUByte(),
            }
        })
    }

    GetArrayAFrame(animIndex)
    {
        let length = this.m_arrAnims[animIndex].numAFrames
        if (length > 0)
        {
            let offset = this.m_arrAnims[animIndex].offset
            return this.m_arrAnimFrames.slice(offset, offset + length)
        }
        return null
    }

    GetArrayFModule(frameIndex)
    {
        let length = this.m_arrFrames[frameIndex].numFModules
        if (length > 0)
        {
            let offset = this.m_arrFrames[frameIndex].offset
            return this.m_arrFrameModules.slice(offset, offset + length)
        }
        return null
    }

    GetModuleRect(moduleIndex)
    {
        if (moduleIndex >= 0 && moduleIndex < this.m_numModule)
        {
            let moduleInfo = this.m_arrModules[moduleIndex]
            return { width: moduleInfo.w, height: moduleInfo.h }
        }
        return {}
    }
}
