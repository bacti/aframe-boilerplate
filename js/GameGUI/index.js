import React from 'react'
import { connect } from 'react-redux'

global.INTERSTITIAL_DEFAULT_WIDTH = 1334

import Preload from './Preload'
import Splash from './Splash'

class GameGUI extends React.Component
{
    constructor(props)
    {
        super(props)
        global.INTERSTITIAL_SCALE = window.innerWidth / INTERSTITIAL_DEFAULT_WIDTH
    }

	render()
	{
        let GUI = null
        switch (this.props.gameState)
        {
            case 'SPLASH':
            {
                GUI = <Splash store={this.props.store} />
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
