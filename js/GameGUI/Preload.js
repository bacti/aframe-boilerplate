import React from 'react'
import Jasmine from '../../libs/jasmine/'

export default class Preload extends React.Component
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
    return bindActionCreators(
    {
        changeState: state =>
        {
            return 'MAIN_SCENE',
                payload: scene,
            }
        },
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(RollerCoaster)
