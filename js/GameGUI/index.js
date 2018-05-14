import React from 'react'
import { connect } from 'react-redux'

import Preload from './Preload'
import Splash from './Splash'

class GameGUI extends React.Component
{
    constructor(props)
    {
        super(props)
    }

	render()
	{
        let GUI = null
        switch (this.props.gameState)
        {
            case 'SPLASH':
            {
                GUI = <Splash />
                break
            }
            default:
            {
                GUI = <Preload store={this.props.store} />
            }
        }
        return <object3D>{GUI}</object3D>
	}
}

function mapStateToProps(state)
{
    return {
        gameState: state.currentState
    }
}
export default connect(mapStateToProps)(GameGUI)
