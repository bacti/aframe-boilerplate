import JSZip from 'jszip'
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Loader from 'resource-loader'
import Jasmine from '../../libs/jasmine/'
import { AuroraLoader, SwitchState } from '../actions/'

class Preload extends React.Component
{
    constructor(props)
    {
        super(props)
        resource.load_buffer(resource.get_embed_src('data/all1.bin'), response =>
        {
            let zip = new JSZip()
            zip.loadAsync(response).then(zip =>
            {
                let textureLoader = new THREE.TextureLoader()
                let loader = []
                for (let filename in zip.files)
                {
                    if (filename.includes('.sprite'))
                    {
                        zip.file(filename).async('string').then(data =>
                        {
                            let sprite = JSON.parse(data)
                            this.props.AuroraLoader(sprite)
                        })
                    }
                    else
                    if (filename.slice(-4).includes('.png') || filename.slice(-4).includes('.jpg'))
                    {
                        loader.push(new Promise((resolve, reject) =>
                        {
                            zip.file(filename).async('arraybuffer').then(data =>
                            {
                                textureLoader.load((window.URL ? URL : webkitURL).createObjectURL(new Blob([data], {type: 'image/' + filename.slice(-3)})),
                                    texture => resolve({ alias: filename, data: texture }), undefined, reject)
                            })
                        }))
                    }
                    else
                    if (filename.slice(-4).includes('.mp4'))
                    {
                        zip.file(filename).async('arraybuffer').then(data =>
                        {
                            resource.video = document.createElement('video')
                            $(resource.video).attr(
                            {
                                preload: 'auto',
                                src: (window.URL ? URL : webkitURL).createObjectURL(new Blob([data], {type: 'video/mp4'})),
                                'playsinline': '',
                                'webkit-playsinline': '',
                                'loop': true,
                            })
                        })
                    }
                }
                Promise.all(loader).then(textures =>
                {
                    resource.textures = {}
                    textures.map(texture => resource.textures[texture.alias] = texture.data)
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
            <sprite ref='sprite' scale={new THREE.Vector3(64, 64, 1)}>
                <spriteMaterial>
                    <texture url={resource.get_embed_src('data/loading_wheel.png')} />
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

const mapDispatchToProps = dispatch =>
{
    return bindActionCreators({ AuroraLoader: AuroraLoader, SwitchState: SwitchState }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Preload)
