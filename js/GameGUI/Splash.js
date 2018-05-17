import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import DataHeader from '../DataHeader'
import Jasmine from '../../libs/jasmine/'
import { Update, SwitchState } from '../actions/'
import { TweenMgr } from '../../libs/tween/TweenMgr'

class Splash extends React.Component
{
    constructor(props)
    {
        super(props)
        this.myTween = new TweenMgr()
    }

	componentWillMount()
	{
        this.interstitial = resource.textures['bg-interstitial.jpg']
    }

    componentDidMount()
    {
        this.refs.begin.object.position.y -= 300
        this.myTween.Create(this.refs.begin.object, tweenDefine.LINEAR_EASE, {scale: 1}, {scale: 0.8}, 0.2, 1.5)
		this.myTween.Create(this.refs.begin.object, tweenDefine.ELASTIC_EASE_OUT, {scale: 0.8}, {scale: 1}, 0.5, 0)
		this.myTween.SetLoop(this.refs.begin.object, -1)
        this.myTween.PreInit()
        
        this.refs.bg.on('click', evt => this.props.SwitchState('INGAME'))
    }

    componentDidUpdate()
    {
        this.myTween.Update(this.props.deltaTime / 1000)
    }

	render()
	{
        return (
            <object3D>
                <Jasmine.ThreeSpriteFrame ref='begin' metadata={this.props.aurora} id={DataHeader.SPRITE_PRELOAD_FRAME_TAP_CONTINUE} />
                <Jasmine.ThreeSpriteFrame metadata={this.props.aurora} id={DataHeader.SPRITE_PRELOAD_FRAME_AIM} />
                <Jasmine.ThreeSpriteFrame metadata={this.props.aurora} id={DataHeader.SPRITE_PRELOAD_FRAME_GL_LOGO} />
                <Jasmine.ThreeSpriteFrame metadata={this.props.aurora} id={DataHeader.SPRITE_PRELOAD_FRAME_NEW_LOGO} />
                <Jasmine.ThreeSpriteFrame metadata={this.props.aurora} id={DataHeader.SPRITE_PRELOAD_FRAME_TXT_1} />
                <Jasmine.ThreeSpriteFrame metadata={this.props.aurora} id={DataHeader.SPRITE_PRELOAD_FRAME_TXT_2} />
                <Jasmine.ThreeSpriteFrame metadata={this.props.aurora} id={DataHeader.SPRITE_PRELOAD_FRAME_TXT_3} />
                <Jasmine.ThreeSpriteFrame metadata={this.props.aurora} id={DataHeader.SPRITE_PRELOAD_FRAME_ADS_TXT} />
                <Jasmine.ThreeSpriteFrame metadata={this.props.aurora} id={DataHeader.SPRITE_PRELOAD_FRAME_SLINGSHOT} />
                <sprite ref='bg'
                    scale={new THREE.Vector3(this.interstitial.image.width, this.interstitial.image.height, 1)}
                >
                    <spriteMaterial map={this.interstitial} />
                </sprite>
            </object3D>
        )
	}
}

let mapStateToProps = state =>
{
    return {
        aurora: state.aurora,
        deltaTime: state.deltaTime,
    }
}

let mapDispatchToProps = dispatch =>
{
    return bindActionCreators({ Update: Update, SwitchState: SwitchState }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Splash)
