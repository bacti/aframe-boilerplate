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
        this.interstitial.size =
        {
            width: window.innerWidth,
            height: this.interstitial.height * window.innerWidth / this.interstitial.width,
        }
    }

	render()
	{
        return (
            <object3D>
                <sprite ref='sprite'
                    scale={new THREE.Vector3(this.interstitial.size.width, this.interstitial.size.height, 1)}
                    position={new THREE.Vector3(window.innerWidth / 2, window.innerHeight / 2, 0)}
                >
                    <spriteMaterial map={resource.textures['image/bg-interstitial.jpg']} />
                </sprite>
                <Jasmine.ThreeSpriteModule info={this.props.aurora.modules[100]} />
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
