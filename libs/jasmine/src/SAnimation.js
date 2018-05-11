import SFrame from './SFrame'

const FPS = 60;

export default class SAnimation extends PIXI.Container
{
    constructor(sLoader)
    {
        super();

        this.sLoader = sLoader;
        this.ended = true;
    }

    SetAnim(animIndex, loop = false, playOnCreate = true) {
        this.removeChildren();
        
        let anim = this.sLoader.anims[animIndex];
        this.arrAFrames = [];

        for (let i = 0; i < anim.aFramesCount; i++) {
            let af = this.GetAFrame(i + anim.aFramesStartIndex);
            af.visible = false;
            this.addChild(af);
            this.arrAFrames.push(af);
        }

        this.anim = anim;
        this.loop = loop;

        if (playOnCreate)
            this.Play();
        else
            this.ended = true;
    }

    Play() {
        if (this.currentAFrame !== undefined && this.arrAFrames[this.currentAFrame] !== undefined)
            this.arrAFrames[this.currentAFrame].visible = false
        
        this.currentAFrame = 0
        this.currentTime = 0
        this.ended = false

		this.arrAFrames[this.currentAFrame].visible = true
    }

    GetAFrame(aframeIndex) {
        let af = this.sLoader.aframes[aframeIndex];
        let frame = new SFrame(this.sLoader, af.frameIndex);
        frame.rotation = af.rotation / 180 * Math.PI;
        frame.scale.set(af.scaleX * 100, af.scaleY * 100);
        frame.position.set(af.ox, af.oy);
        frame.time = af.time;
        return frame;
    }

	SetCurrentAFrame(currentAFrame, lastAFrame)
	{
		this.arrAFrames[lastAFrame].visible = false
		this.arrAFrames[currentAFrame].visible = true
    }

    Update(deltaTime)
    {
        if (this.ended)
            return

        this.currentTime += deltaTime;

        const aframe = this.arrAFrames[this.currentAFrame]
        const duration = aframe.time / FPS
        if (this.currentTime >= duration)
        {
            let lastAFrame = this.currentAFrame
            this.currentTime -= duration
            if (this.currentAFrame < this.arrAFrames.length - 1)
            {
                this.currentAFrame++
            }
            else
            if (this.loop)
            {
                this.currentAFrame = 0
            }
            else
            {
                this.ended = true
            }
            this.SetCurrentAFrame(this.currentAFrame, lastAFrame)
        }
    }
}
