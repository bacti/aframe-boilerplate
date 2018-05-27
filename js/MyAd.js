window.hasNativeWebVRImplementation = !!window.navigator.getVRDisplays || !!window.navigator.getVRDevices
import WebVRPolyfill from '../libs/webvr-polyfill'
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
import DeviceControl from './controls/'

import { connect, Provider } from 'react-redux'
import { bindActionCreators } from 'redux'
import { applyMiddleware, createStore } from 'redux'

import GameWorld from './GameWorld/'
import GameGUI from './GameGUI/'
import { Update, CameraLoader } from './actions/'

class MyAd extends React.Component
{
    constructor(props)
    {
        super(props)

		this.ToggleVR = _ =>
		{
            if (!this.vrDisplay)
                return
			if (renderer.vr.enabled)
			{
				renderer.vr.enabled = false
				this.vrDisplay.exitPresent()
			}
			else
			{
				renderer.vr.enabled = true
				this.vrDisplay.requestPresent([{ source: this.props.canvas }])
			}
		}

        let prevTime = performance.now()
        this.OnAnimate = _ =>
        {
            let time = performance.now()
            let deltaTime = time - prevTime
            this.props.Update(deltaTime)
            this.deviceControl.Update()
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
        this.props.CameraLoader(this.refs.camera)
        this.deviceControl = new DeviceControl(this.refs.camera)
        const interaction = new Interaction(renderer, this.refs.scene, this.refs.camera)
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
        return (
            <div>
                <React3 mainCamera='camera'
                    width={this.props.size.INTERSTITIAL_WIDTH} height={this.props.size.INTERSTITIAL_HEIGHT}
                    antialias={true}
                    canvas={this.props.canvas}
                    onAnimate={this.OnAnimate}
                >
                    <scene background={0xf0f0ff} ref='scene'>
                        <perspectiveCamera name='camera' ref='camera'
                            fov={50} aspect={this.props.size.INTERSTITIAL_WIDTH/this.props.size.INTERSTITIAL_HEIGHT} near={100} far={1000}
                        >
                            <GameGUI store={this.props.store} />
                        </perspectiveCamera>
                        <GameWorld store={this.props.store} />
                    </scene>
                </React3>
                <div id='vr-icon'
                    style={{
                        background: `url(${resource.get_embed_src('data/vr-icon.png')}) 0% 0% / contain no-repeat`,
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

let mapStateToProps = state =>
{
    return {
        size: state.size
    }
}

let mapDispatchToProps = dispatch =>
{
    return bindActionCreators({ Update: Update, CameraLoader: CameraLoader }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAd)
