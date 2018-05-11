import Constant from './Constant'
import JSpriteFrame from './JSpriteFrame'
export default class JAnimation extends PIXI.Container
{
    constructor(jasmine, animIndex, loop = false, oncreate)
    {
        super()
        this.arrAFrame = jasmine.GetArrayAFrame(animIndex)
        this.arrSpriteFrame = this.arrAFrame.map((info, _) =>
        {
            let animFrame = new JSpriteFrame(jasmine, info.frameId, oncreate)
            animFrame.visible = false
            this.addChild(animFrame)
            return animFrame
        })
        this.startTime = jasmine.m_arrAnims[animIndex].start
        this.currentAFrame = 0
        this.loop = loop

        this.cummulativeTime = this.GetCummulativeTime();
        this.totalTime = this.cummulativeTime[this.cummulativeTime.length - 1];

        this.currentTime = 0

        this.ended = false
    }

    get currentTime() {
        return this._currentTime;
    }

    set currentTime(value) {
        this._currentTime = value;

        if (value < this.startTime)
            return;

        value -= this.startTime;
        if (this.loop)
            value %= this.totalTime;

        let newFrame = this.cummulativeTime.findIndex(t => value < t);
        if (newFrame < 0) {
            newFrame = this.cummulativeTime.length - 1;
            this.ended = true;
        }

        this.SetCurrentAFrame(newFrame, this.currentAFrame);

        this.currentAFrame = newFrame;
    }

    GetCummulativeTime() {
        let sum = 0;
        let cummulative = [];
        this.arrAFrame.forEach(af => {
            sum += af.time / 23.98;
            cummulative.push(sum);
        });
        return cummulative;
    }

    SetCurrentAFrame(currentAFrame, lastAFrame)
    {
        this.arrSpriteFrame[lastAFrame].visible = false
        this.arrSpriteFrame[currentAFrame].visible = true
    }

    GetCurrentAFrame()
    {
        let frame = {}
        this.arrSpriteFrame[this.currentAFrame].children.map((fmodule, _) =>
        {
            frame[fmodule.ref.moduleId] = fmodule.ref
        })
        return frame
    }

    GetCurrentSpriteFrame() {
        return this.arrSpriteFrame[this.currentAFrame];
    }

    Update(deltaTime)
    {
        if (this.ended)
            return

        this.currentTime += deltaTime
    }
}
