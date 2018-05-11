import Constant from './Constant'
let BLEND_MODES =
[
    PIXI.BLEND_MODES.ADD,
    PIXI.BLEND_MODES.COLOR,
    PIXI.BLEND_MODES.COLOR_BURN,
    PIXI.BLEND_MODES.COLOR_DODGE,
    PIXI.BLEND_MODES.DARKEN,
    PIXI.BLEND_MODES.DIFFERENCE,
    PIXI.BLEND_MODES.EXCLUSION,
    PIXI.BLEND_MODES.HARD_LIGHT,
    PIXI.BLEND_MODES.HUE,
    PIXI.BLEND_MODES.LIGHTEN,
    PIXI.BLEND_MODES.LUMINOSITY,
    PIXI.BLEND_MODES.MULTIPLY,
    PIXI.BLEND_MODES.NORMAL,
    PIXI.BLEND_MODES.OVERLAY,
    PIXI.BLEND_MODES.SATURATION,
    PIXI.BLEND_MODES.SCREEN,
    PIXI.BLEND_MODES.SOFT_LIGHT,
]

export default class JSpriteFrame extends PIXI.Container
{
    constructor(jasmine, frameIndex, oncreate)
    {
        super()
        let arrFModule = jasmine.GetArrayFModule(frameIndex)
        if (arrFModule == null)
            return
        this.oncreate = oncreate
        arrFModule.map((info, _) =>
        {
            let size = jasmine.GetModuleRect(info.moduleId)
            let alias = jasmine.m_arrTextures[jasmine.m_arrModules[info.moduleId].textureId].alias
            let texture = jasmine.m_dataTextures.resources[alias].texture
            texture.info = jasmine.m_arrModules[info.moduleId]
            this.AttachFModule(info, texture, size)
        })
    }

    AttachFModule(info, texture, size)
    {
        let frame = new PIXI.Rectangle(texture.info.x, texture.info.y, texture.info.w, texture.info.h)
        let moduleTexture = new PIXI.Texture(texture.baseTexture, frame)
        let matrix = new PIXI.Matrix(info.M11, info.M21, info.M12, info.M22, info.x, info.y)

        let sprite = new PIXI.Sprite(moduleTexture)
        sprite.transform.setFromMatrix(matrix)
        sprite.alpha = info.opacity == undefined ? 1 : info.opacity
        // to fix on webgl
        // https://github.com/pixijs/pixi.js/issues/3824
        // https://github.com/pixijs/pixi.js/issues/2248
        sprite.blendMode = BLEND_MODES[info.mode & 0b11111]
        sprite.ref =
        {
            moduleId: info.moduleId,
            x: info.x,
            y: info.y,
            scale: info.M11,
            w: texture.info.w,
            h: texture.info.h
        }

        sprite.transform.updateLocalTransform();
        sprite.center = sprite.localTransform.apply(new PIXI.Point(sprite.ref.w / 2, sprite.ref.h / 2));
        sprite.ref.center = {
            x: sprite.center.x,
            y: sprite.center.y
        };

        this.addChild(sprite)
        this.oncreate && this.oncreate(sprite, info.moduleId)
    }
}