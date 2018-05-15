import JSZip from 'jszip'
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
        resource.load_buffer(resource.get_embed_src('data/all1.zip'), response =>
        {
            let zip = new JSZip()
            zip.loadAsync(response).then(zip =>
            {
                for (let filename in zip.files)
                {
                    if (filename.includes('.sprite'))
                    {
                        zip.file(filename).async('string').then(data =>
                        {
                            let sprite = JSON.parse(data)
                            this.props.AuroraLoader(sprite)

                            let images = sprite.images
                            images.push(...
                            [
                                'image/crate.png',
                                'image/room.jpg',
                                'image/bg-interstitial.jpg',
                            ])
                            
                            let textureLoader = new THREE.TextureLoader()
                            let loader = images.map(imageUrl =>
                            {
                                return new Promise((resolve, reject) =>
                                {
                                    textureLoader.load(resource.get_embed_src(`data/${imageUrl}`),
                                            texture => resolve({ alias: imageUrl, data: texture }), undefined, reject)
                                })
                            })
                            Promise.all(loader).then(textures =>
                            {
                                resource.textures = {}
                                textures.map(texture => resource.textures[texture.alias] = texture.data)
                                this.props.SwitchState('SPLASH')
                            })
                        })
                    }
                }
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
