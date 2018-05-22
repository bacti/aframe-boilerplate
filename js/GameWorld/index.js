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

	render()
	{
        if (this.props.gameState != 'INGAME')
            return <object3D />
        return (
            <object3D>
                <Jasmine.ThreeMeshModule metadata={this.props.aurora} id={20} />
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
        gameState: state.currentState
    }
}
export default connect(mapStateToProps)(GameWorld)
