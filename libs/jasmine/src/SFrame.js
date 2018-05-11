export default class SFrame extends PIXI.Container
{
    constructor(sLoader, frameIndex)
    {
        super();
        
        this.sLoader = sLoader;
        this.arrFModulesCache = {};

        if (frameIndex != undefined)
            this.SetFrame(frameIndex);

        
    }

    MakeFrame(frameIndex)
    {
        if (!this.arrFModulesCache[frameIndex]) 
        {
            let frame = this.sLoader.frames[frameIndex];
            let arrFModules = [];
            for (let i = 0; i < frame.fmCount; i++) {
                let fm = this.GetFModule(i + frame.fmstartIndex);
                arrFModules.push(fm);
            }
            this.arrFModulesCache[frameIndex] = {frame: frame,arrFModules: arrFModules};
        }
        return this.arrFModulesCache[frameIndex];
    }

    SetFrame(frameIndex)
    {
        if (frameIndex != this.frameIndex)
        {
            let frm = this.MakeFrame(frameIndex);
            this.removeChildren();
            this.frame = frm.frame;
            this.frameIndex = frameIndex;
            this.arrFModules = frm.arrFModules;
    
            for (let i = 0; i < this.arrFModules.length; i++) {
               this.addChild(this.arrFModules[i]);
            }
        }
    }

    GetImage(imgIndex) {
        return this.sLoader.textures[imgIndex].baseTexture;
    }
    GetModule(moduleIndex) {
        let md = this.sLoader.modules[moduleIndex];
        let rect = new PIXI.Rectangle(md.x, md.y, md.w, md.h);
        let texture = this.GetImage(md.imgIndex);
        return new PIXI.Sprite(new PIXI.Texture(texture, rect));
    }
    GetFModule(fmoduleIndex) {
        let fm = this.sLoader.fmodules[fmoduleIndex];
        let md = this.GetModule(fm.fmodulesID);
        // console.log(md);
        md.rotation = fm.fmodulesRotation / 180 * Math.PI;
        md.scale.set(fm.fmodulesScaleX, fm.fmodulesScaleY);
        md.position.set(fm.fmodulesOX, fm.fmodulesOY);
        return md;
    }
}