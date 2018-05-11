const FS = require('fs')
const PATH = require('path')
const JIMP = require('jimp')
const RectanglePacking = require('./RectanglePacking')
const BWriter = require('./BWriter')
const Constant = require('../src/Constant')
const Sprite = require('./Sprite')
const JASMINE_DATA = PATH.join(process.env.MASTER_DATA, 'jasmine')
const SPRITE_DATA = PATH.join(process.env.MASTER_DATA, 'sprite')

let GetFiles = (dir, extname) =>
{
    let paths = FS.readdirSync(PATH.normalize(dir))
    let result = paths.filter(element =>
    {
        let path = PATH.join(dir, element)
        return FS.statSync(path).isFile() && PATH.extname(path).toLowerCase() == extname
    })
    return result
}
let GetKeyValuePair = data =>
{
    let pattern = /\s-(\w+):(?:(?:\"([^"]+)\")|([+-\w\.]+))/gm
    let match, result = {}
    while ((match = pattern.exec(data)))
    {
        result[match[1]] = (match[2] != undefined) ? match[2] : match[3]
    }
    return result
}

let padding = 1
let dataheader = {}
let promises = []

false && GetFiles(JASMINE_DATA, '.jasmine').forEach(anim =>
{
    promises.push(new Promise((resolve, reject) =>
    {
        FS.readFile(PATH.join(JASMINE_DATA, anim), 'utf8', (err, str) =>
        {
            let basename = PATH.basename(anim).slice(0, -8)
            let banim = PATH.join(process.env.RELEASE_DATA, basename + '.bjasmine')
            let writer = new BWriter(banim)

            writer.WriteByte(Constant.EXPORT_QUALITY_TRUE_COLOR)
            writer.WriteByte(Constant.EXPORT_TYPE_SINGLE_IMAGE)
            writer.WriteByte(Constant.EXPORT_PIXEL_32BITS)

            let promises = []
            let textureTokens = str.split(/\bIMAGE/gm).slice(1)
            textureTokens.forEach((token, index) =>
            {
                let info = GetKeyValuePair(token.replace(/\bMODULE([\w|\W]+)/gm, ''))
                promises.push(new Promise((resolve, reject) =>
                {
                    if (info.imgfile == undefined)
                    {
                        resolve({ index: index })
                    }
                    else
                    {
                        JIMP.read(PATH.join(JASMINE_DATA, info.imgfile)).then(data =>
                        {
                            // data.autocrop() => make wrong position
                            resolve(
                            {
                                w: data.bitmap.width,
                                h: data.bitmap.height,
                                data: data,
                                index: index,
                            })
                        })
                    }
                }))
            })

        Promise.all(promises).then(images =>
        {
            let packingImages = []
            let packing = new RectanglePacking(images.filter(image => image.data))
            packing.Proceed()
            packing.groups.map((group, groupIndex) =>
            {
                let imageNew = new JIMP(group.solution[1], group.solution[2], 0x00000000)
                group.solution.slice(3).map(rect =>
                {
                    imageNew.blit(images[rect.index].data, rect.x, rect.y)
                    images[rect.index].newIndex = groupIndex
                    images[rect.index].x = rect.x
                    images[rect.index].y = rect.y
                })
                imageNew.write(PATH.join(process.env.RELEASE_DATA, `${basename}_${groupIndex}.png`))
                packingImages.push({ name: `${basename}_${groupIndex}.png` })
            })

            writer.WriteByte(packingImages.length)
            packingImages.map(image => writer.WriteString(image.name))

            let moduleIndexes = {}
                let moduleTokens = str
                    .replace(/\bFRAME([\w|\W]+)/gm, '')     // Remove all parts starting from FRAME
                    .split(/\bMODULE/gm)                    // Split into modules (except item 0: IMAGE)
                    .slice(1)                               // Remove item 0 (IMAGE)
                writer.WriteShort(moduleTokens.length)      // Number of modules
                moduleTokens.forEach((token, index) =>
                {
                    let info = GetKeyValuePair(token)
                    let image = images[info.imgid]
                    moduleIndexes[info.mid] = index
                    writer.WriteUShort(image.x)
                    writer.WriteUShort(image.y)
                    writer.WriteUShort(image.w)
                    writer.WriteUShort(image.h)
                    writer.WriteUByte(image.newIndex)
                    dataheader[`JASMINE_${basename}_MODULE_${info.desc}`.trim().replace(/\r|\t|\"|-|.png| /g, '').toLocaleUpperCase()] = index
                })

                let frameModules = []
                let frameIndexes = {}
                let frameTokens = str.replace(/\bANIMATION([\w|\W]+)/gm, '').split(/\bFRAME/gm).slice(1)
                writer.WriteShort(frameTokens.length)
                frameTokens.forEach((token, index) =>
                {
                    let frame = token.split(/\bADD_FMODULE/gm)
                    frameIndexes[GetKeyValuePair(frame[0]).fid] = index
                    let fmodules = frame.slice(1)
                    writer.WriteUShort(fmodules.length)
                    fmodules.forEach(fmodule =>
                    {
                        let info = GetKeyValuePair(fmodule)
                        frameModules.push(info)
                    })
                })
                frameModules.forEach(info =>
                {
                    writer.WriteShort(moduleIndexes[info.mid])
                    writer.WriteUByte(info.mode)
                    if (info.mode & Constant.FREE_TRANSFORM)
                    {
                        writer.WriteFloat32(parseFloat(info.x))
                        writer.WriteFloat32(parseFloat(info.y))
                        writer.WriteFloat32(parseFloat(info.m11))
                        writer.WriteFloat32(parseFloat(info.m12))
                        writer.WriteFloat32(parseFloat(info.m21))
                        writer.WriteFloat32(parseFloat(info.m22))
                    }
                    if (info.mode & Constant.OPACITY)
                    {
                        writer.WriteFloat32(parseFloat(info.opacity))
                    }
                })

                let animFrames = []
                let animationTokens = str.split(/\bANIMATION/gm).slice(1)
                writer.WriteShort(animationTokens.length)
                animationTokens.forEach((token, index) =>
                {
                    let aframeTokens = token.split(/\bADD_AFRAME/gm)
                    let animInfo = GetKeyValuePair(aframeTokens[0])
                    writer.WriteFloat32(parseFloat(animInfo.start))
                    writer.WriteFloat32(parseFloat(animInfo.duration))
                    dataheader[`JASMINE_${basename}_ANIM_${animInfo.desc}`.trim().replace(/\r|\t|\"|-| /g, '').toLocaleUpperCase()] = index

                    let aframes = aframeTokens.slice(1)
                    writer.WriteShort(aframes.length)
                    aframes.forEach(aframe =>
                    {
                        let info = GetKeyValuePair(aframe)
                        animFrames.push(info)
                    })
                })
                animFrames.forEach(info =>
                {
                    writer.WriteUShort(frameIndexes[info.fid])
                    writer.WriteShort(info.x)
                    writer.WriteShort(info.y)
                    writer.WriteUByte(info.time)
                })

                writer.Close()
                resolve && resolve()
            })
        })
    }))
})

promises.push(new Promise((resolve, reject) =>
{
    let sprites = GetFiles(SPRITE_DATA, '.sprite')
    let loadSprites = sprites.map(sprite => Sprite.LoadAsync(PATH.join(SPRITE_DATA, sprite)))
    Promise.all(loadSprites).then(spriteObjects =>
    {
        Sprite.CombineSpriteObjects(spriteObjects, SPRITE_DATA, process.env.RELEASE_DATA, 'all1').then(spriteheader =>
        {
            spriteheader.map(header =>
            {
                dataheader[header.key] = header.value
            })
            resolve()
        })
    })
    .catch(e => console.log(e))
}))

Promise.all(promises).then(evt =>
{
    FS.writeFileSync('js/DataHeader.js', 'module.exports = ' + JSON.stringify(dataheader, null, '\t'))
})
