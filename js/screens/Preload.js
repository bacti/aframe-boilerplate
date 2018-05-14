import React from 'react'
import Jasmine from '../../libs/jasmine/'

export default class PreLoad extends React.Component
{
    constructor(props)
    {
        super(props)

        resource.load_buffer(resource.get_embed_src('data/all1.bsprite'), response =>
        {
            new Jasmine.Loader(response, pixma =>
            {
                console.log(pixma)
                setTimeout( _ => this.props.history.push('/roller-coaster'), 2000)
            })
        })
    }

	render()
	{
        return null
	}
}
