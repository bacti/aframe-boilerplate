import React from 'react'
import { connect } from 'react-redux'
import DataHeader from '../DataHeader'
import Jasmine from '../../libs/jasmine/'

class Splash extends React.Component
{
    constructor(props)
    {
        super(props)
    }

	componentWillMount()
	{
        this.interstitial = resource.textures['image/bg-interstitial.jpg'].image
    }

	render()
	{
        return (
            <object3D>
                <Jasmine.ThreeSpriteFrame metadata={this.props.aurora} id={DataHeader.SPRITE_ALL1_FRAME_TAP_CONTINUE} />
                <Jasmine.ThreeSpriteFrame metadata={this.props.aurora} id={DataHeader.SPRITE_ALL1_FRAME_AIM} />
                <Jasmine.ThreeSpriteFrame metadata={this.props.aurora} id={DataHeader.SPRITE_ALL1_FRAME_GL_LOGO} />
                <Jasmine.ThreeSpriteFrame metadata={this.props.aurora} id={DataHeader.SPRITE_ALL1_FRAME_NEW_LOGO} />
                <Jasmine.ThreeSpriteFrame metadata={this.props.aurora} id={DataHeader.SPRITE_ALL1_FRAME_TXT_1} />
                <Jasmine.ThreeSpriteFrame metadata={this.props.aurora} id={DataHeader.SPRITE_ALL1_FRAME_TXT_2} />
                <Jasmine.ThreeSpriteFrame metadata={this.props.aurora} id={DataHeader.SPRITE_ALL1_FRAME_TXT_3} />
                <Jasmine.ThreeSpriteFrame metadata={this.props.aurora} id={DataHeader.SPRITE_ALL1_FRAME_ADS_TXT} />
                <Jasmine.ThreeSpriteFrame metadata={this.props.aurora} id={DataHeader.SPRITE_ALL1_FRAME_SLINGSHOT} />
                <sprite ref='sprite'
                    scale={new THREE.Vector3(this.interstitial.width, this.interstitial.height, 1)}
                >
                    <spriteMaterial map={resource.textures['image/bg-interstitial.jpg']} />
                </sprite>
            </object3D>
        )
	}
}

let mapStateToProps = state =>
{
    return {
        aurora: state.aurora
    }
}

export default connect(mapStateToProps)(Splash)
