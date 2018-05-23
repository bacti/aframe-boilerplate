import React from 'react'
import { connect } from 'react-redux'

import DataHeader from '../DataHeader'
import Jasmine from '../../libs/jasmine/'
import Background from './Background'
import VideoBackground from './VideoBackground'
import SkyBox from './SkyBox'

class GameWorld extends React.Component
{
    constructor(props)
    {
        super(props)
    }

    componentDidUpdate()
    {
        if (this.props.gameState != 'INGAME')
            return
        this.refs.aim.object.rotation.set(this.props.camera.rotation.x, this.props.camera.rotation.y - Math.PI, -this.props.camera.rotation.z)
    }

	render()
	{
        if (this.props.gameState != 'INGAME')
            return <object3D />
        return (
            <object3D>
                <Jasmine.ThreeMeshModule ref='aim' metadata={this.props.aurora} id={20} />
                <SkyBox size={400} />
                {/* <VideoBackground video={resource.video} /> */}
            </object3D>
        )
	}
}

function mapStateToProps(state)
{
    return {
        aurora: state.aurora,
        camera: state.camera,
        deltaTime: state.deltaTime,
        gameState: state.currentState,
    }
}
export default connect(mapStateToProps)(GameWorld)
