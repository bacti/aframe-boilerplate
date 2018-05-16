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
                <Jasmine.ThreeSpriteFrame metadata={this.props.aurora} id={DataHeader.SPRITE_ALL1_FRAME_LOADING} />
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
