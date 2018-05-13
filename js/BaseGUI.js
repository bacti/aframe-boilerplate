import React from 'react'
import Jasmine from '../libs/jasmine/'
import ReactSpriteModule from './ReactSpriteModule'

export default class BaseGUI extends React.Component
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
        return <ReactSpriteModule></ReactSpriteModule>
	}
}
