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
        return (
            <object3D scale={new THREE.Vector3(INTERSTITIAL_SCALE, INTERSTITIAL_SCALE, 1)}
                position={new THREE.Vector3(window.innerWidth * (1 - INTERSTITIAL_SCALE) / 2, window.innerHeight * (1 - INTERSTITIAL_SCALE) / 2, 0)}
            >
                {GUI}
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
export default connect(mapStateToProps)(GameGUI)
