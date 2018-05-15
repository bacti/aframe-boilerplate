import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Loader from 'resource-loader'
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
                let images = pixma.images
                images.push(...
                [
                    'image/crate.png',
                    'image/room.jpg',
                ])
                
                let textureLoader = new Loader()
                images.forEach(imageUrl => {
                    textureLoader.add(imageUrl, resource.get_embed_src(`data/${imageUrl}`), { loadType: Loader.Resource.LOAD_TYPE.XHR });
                })
                textureLoader.load((loader, resources) =>
                {
                    resource.data = textureLoader.resources
                    this.props.SwitchState('SPLASH')
                })
            })
        })
    }

    componentDidUpdate()
    {
        this.refs.sprite.material.rotation -= this.props.deltaTime / 80
    }

	render()
	{
		return (
            <sprite ref='sprite'
                scale={new THREE.Vector3(32, 32, 1)}
                position={new THREE.Vector3(window.innerWidth / 2, window.innerHeight / 2, 0)}
            >
                <spriteMaterial>
                    <texture url={resource.get_embed_src('data/image/loading_wheel.png')} />
                </spriteMaterial>
            </sprite>
        )
	}
}

let mapStateToProps = state =>
{
    return {
        deltaTime: state.deltaTime
    }
}

let mapDispatchToProps = dispatch =>
{
    return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Preload)
