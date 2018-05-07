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
			  	let vrDisplay = displays.length && displays[0]
				let polyfilledVRDisplay = vrDisplay.displayName === 'Cardboard VRDisplay'

				if (vrDisplay)
				{
					let vrManager = renderer.vr
					vrManager.setDevice(vrDisplay)
					vrManager.enabled = true
					vrDisplay.requestPresent([{ source: this.props.canvas }])

					let canvas = this.props.canvas
					let requestFullscreen = canvas.requestFullscreen
						|| canvas.webkitRequestFullscreen
						|| canvas.mozRequestFullScreen  // The capitalized `S` is not a typo.
						|| canvas.msRequestFullscreen
					requestFullscreen.apply(canvas)
				}
			})
		}
	}

	render()
    {
		return (
			<div style={{
				background: 'url(./data/vr-icon.png) 0% 0% / contain no-repeat',
				position: 'absolute',
				zIndex: 12,
				width: '100px',
				height: '100px',
				right: 0,
				bottom: 0,
			}}>
			</div>
		)
	}
}
