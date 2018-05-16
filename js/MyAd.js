window.hasNativeWebVRImplementation = !!window.navigator.getVRDisplays || !!window.navigator.getVRDevices
import WebVRPolyfill from 'webvr-polyfill'
window.webvrpolyfill = new WebVRPolyfill(
{
	MOBILE_WAKE_LOCK: false,
  	BUFFER_SCALE: 1,
  	CARDBOARD_UI_DISABLED: true,
  	ROTATE_INSTRUCTIONS_DISABLED: true,
})

import React from 'react'
import React3 from '../libs/react-three-renderer/src' 
import { Interaction } from 'three.interaction'
require('./DeviceOrientationControls')

import { connect, Provider } from 'react-redux'
import { bindActionCreators } from 'redux'
import { applyMiddleware, createStore } from 'redux'

import GameWorld from './GameWorld/'
import GameGUI from './GameGUI/'
import { Update } from './actions/'

class MyAd extends React.Component
{
    constructor(props)
    {
        super(props)

		this.ToggleVR = _ =>
		{
			if (renderer.vr.enabled)
			{
				renderer.vr.enabled = false
                this.refs.orthoscene.visible = true
				this.vrDisplay.exitPresent()
			}
			else
			{
				renderer.vr.enabled = true
                this.refs.orthoscene.visible = false
				this.vrDisplay.requestPresent([{ source: document.getElementById('mainCanvas') }])
			}
		}

        let prevTime = performance.now()
        this.OnAnimate = _ =>
        {
            let time = performance.now()
            let deltaTime = time - prevTime
            this.props.Update(deltaTime)
            this.controls.update()
            prevTime = time
        }

        this.OnWindowResize = _ =>
        {
            this.refs.camera.aspect = window.innerWidth / window.innerHeight
            this.refs.camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
        }
    }

	componentDidMount()
	{
        const interaction = new Interaction(renderer, this.refs.orthoscene, this.refs.orthocamera)
        this.controls = new THREE.DeviceOrientationControls(this.refs.camera)
        window.addEventListener('resize', this.OnWindowResize, false)

		if (navigator.getVRDisplays)
		{
			navigator.getVRDisplays().then(displays =>
			{
			  	this.vrDisplay = displays.length && displays[0]
                this.polyfilledVRDisplay = this.vrDisplay.displayName === 'Cardboard VRDisplay'
                renderer.vr.setDevice(this.vrDisplay)
                document.getElementById('vr-icon').addEventListener('click', this.ToggleVR, false)
			})
		}
    }

	render()
	{
        let width = window.innerWidth
        let height = window.innerHeight
        return (
            <div>
                <React3 mainCamera='camera' orthoCamera='orthocamera' width={width} height={height} antialias={true}
                    canvas={document.getElementById('mainCanvas')}
                    onAnimate={this.OnAnimate}
                >
                    <scene background={0xf0f0ff} ref='scene'>
                        <perspectiveCamera name='camera' ref='camera'
                            fov={40} aspect={width/height} near={0.1} far={500}
                        />
                        <GameWorld store={this.props.store} />
                    </scene>
                    <orthoscene ref='orthoscene'>
                        <orthographicCamera name='orthocamera' ref='orthocamera'
                            position={new THREE.Vector3(0, 0, 1)}
                            left={0} right={width}
                            top={height} bottom={0}
                            near={1} far={100}
                        />
                        <GameGUI store={this.props.store} />
                    </orthoscene>
                </React3>
                <div id='vr-icon'
                    style={{
                        background: `url(${resource.get_embed_src('data/image/vr-icon.png')}) 0% 0% / contain no-repeat`,
                        position: 'absolute',
                        zIndex: 1,
                        width: '7vw',
                        height: '4.2vw',
                        right: '1vw',
                        bottom: '1vw',
                    }}
                />
            </div>
        )
	}
}

let mapDispatchToProps = dispatch =>
{
    return bindActionCreators({ Update: Update }, dispatch)
}

export default connect(_, mapDispatchToProps)(MyAd)
