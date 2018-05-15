import React from 'react'

window.hasNativeWebVRImplementation = !!window.navigator.getVRDisplays || !!window.navigator.getVRDevices
import WebVRPolyfill from 'webvr-polyfill'
window.webvrpolyfill = new WebVRPolyfill(
{
	MOBILE_WAKE_LOCK: false,
  	BUFFER_SCALE: 1,
  	CARDBOARD_UI_DISABLED: true,
  	ROTATE_INSTRUCTIONS_DISABLED: true,
})

export default class WebVR extends React.Component
{
    constructor(props)
    {
        super(props)
    }

	componentDidMount()
	{
        // console.log(global.renderer)
        // const interaction = new Interaction(renderer, scene, camera);
        this.refs.sprite.on('click', function(ev)
        {
            console.log('bacti')
        });
    }

	render()
	{
        let width = window.innerWidth * 0.07
        let height = window.innerWidth * 0.042
        return (
            <sprite ref='sprite'
                scale={new THREE.Vector3(width, height, 1)}
                position={new THREE.Vector3(window.innerWidth * 0.99 - width / 2, window.innerWidth * 0.01 + height / 2, 0)}
            >
                <spriteMaterial>
                    <texture url={resource.get_embed_src('data/image/vr-icon.png')} />
                </spriteMaterial>
            </sprite>
        )
	}
}
