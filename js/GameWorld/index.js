import React from 'react'
import { connect } from 'react-redux'

import Background from './Background'
import SkyBox from './SkyBox'

class GameWorld extends React.Component
{
    constructor(props)
    {
        super(props)
    }

	render()
	{
        let object = null
        switch (this.props.gameState)
        {
            case 'INGAME':
            {
                object = <SkyBox size={400} />
                break
            }
        }
        return <object3D>{object}</object3D>
	}
}

function mapStateToProps(state)
{
    return {
        gameState: state.currentState
    }
}
export default connect(mapStateToProps)(GameWorld)
