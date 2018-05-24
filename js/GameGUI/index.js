import React from 'react'
import { connect } from 'react-redux'

import Preload from './Preload'
import Splash from './Splash'
import Ingame from './Ingame'

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
            case 'SPLASH': GUI = Splash; break
            case 'INGAME': GUI = Ingame; break
            default: GUI = Preload
        }
        return (
            <object3D position={new THREE.Vector3(this.props.size.INTERSTITIAL_WIDTH / 2, this.props.size.INTERSTITIAL_HEIGHT / 2, 0)}>
                <GUI store={this.props.store} />
            </object3D>
        )
	}
}

function mapStateToProps(state)
{
    return {
        size: state.size,
        gameState: state.currentState
    }
}
export default connect(mapStateToProps)(GameGUI)
