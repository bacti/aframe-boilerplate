import React from 'react'

window.hasNativeWebVRImplementation = !!window.navigator.getVRDisplays || !!window.navigator.getVRDevices
import WebVRPolyfill from 'webvr-polyfill'
window.webvrpolyfill = new WebVRPolyfill(
{
  	BUFFER_SCALE: 0.5,
  	CARDBOARD_UI_DISABLED: true,
  	ROTATE_INSTRUCTIONS_DISABLED: true,
})

export default class WebVR extends React.Component
{
    constructor(props)
    {
		super(props)
		
		if (navigator.getVRDisplays)
		{
			navigator.getVRDisplays().then(displays =>
			{
			  	this.vrDisplay = displays.length && displays[0]
				this.polyfilledVRDisplay = this.vrDisplay.displayName === 'Cardboard VRDisplay'
			})
		}

		this.EnterVR = _ =>
		{
			if (this.vrDisplay)
			{
				let vrManager = renderer.vr
				vrManager.setDevice(this.vrDisplay)
				vrManager.enabled = true
				this.vrDisplay.requestPresent([{ source: this.props.canvas }])
			}
		}
	}

	render()
    {
		return (
			<div onClick={this.EnterVR}
				style={{
					background: `url(${require('../data/vr-icon.png')}) 0% 0% / contain no-repeat`,
					position: 'absolute',
					zIndex: 12,
					width: '100px',
					height: '100px',
					right: 0,
					bottom: 0,
				}}
			>
			</div>
		)
	}
}
