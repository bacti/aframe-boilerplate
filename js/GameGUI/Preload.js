import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Jasmine from '../../libs/jasmine/'
import Actions from '../actions/'

class Preload extends React.Component
{
    constructor(props)
    {
        super(props)

        resource.load_buffer(resource.get_embed_src('data/all1.bsprite'), response =>
        {
            new Jasmine.Loader(response, pixma =>
            {
                console.log(pixma)
            })
        })
    }

	render()
	{
        console.log('Preload')
        return null
	}
}

let mapStateToProps = state =>
{
    return {}
}

let mapDispatchToProps = dispatch =>
{
    return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Preload)
