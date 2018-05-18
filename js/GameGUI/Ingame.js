import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import DataHeader from '../DataHeader'
import Jasmine from '../../libs/jasmine/'
import { Update, SwitchState } from '../actions/'

class Ingame extends React.Component
{
    constructor(props)
    {
        super(props)
}

	componentWillMount()
	{
    }

    componentDidMount()
    {
    }

    componentDidUpdate()
    {
    }

	render()
	{
        return (
            <object3D>
                <Jasmine.ThreeSpriteFrame metadata={this.props.aurora} id={DataHeader.SPRITE_GAME_FRAME_AIM} />
                <Jasmine.ThreeSpriteFrame metadata={this.props.aurora} id={DataHeader.SPRITE_GAME_FRAME_LOGO} />
                <Jasmine.ThreeSpriteFrame metadata={this.props.aurora} id={DataHeader.SPRITE_PRELOAD_FRAME_TUTORIAL_1} />
            </object3D>
        )
	}
}

let mapStateToProps = state =>
{
    return {
        aurora: state.aurora,
    }
}

let mapDispatchToProps = dispatch =>
{
    return bindActionCreators({ Update: Update, SwitchState: SwitchState }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Ingame)
