import React from 'react'
import { connect } from 'react-redux'

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
            return null
        return (
            <object3D>
                {/* <SkyBox size={400} /> */}
                <VideoBackground video={resource.video} />
            </object3D>
        )
	}
}

function mapStateToProps(state)
{
    return {
        gameState: state.currentState
    }
}
export default connect(mapStateToProps)(GameWorld)
