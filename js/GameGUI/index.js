import React from 'react'
import {connect} from 'react-redux'

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
        return (
            <object3D>
                <Preload />
            </object3D>
        )
	}
}

function mapStateToProps(state)
{
    return {
        state: state.currentState
    }
}
export default connect(mapStateToProps)(GameGUI)
