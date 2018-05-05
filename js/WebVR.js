import React from 'react'

window.hasNativeWebVRImplementation = !!window.navigator.getVRDisplays || !!window.navigator.getVRDevices
import WebVRPolyfill from 'webvr-polyfill'
window.webvrpolyfill = new WebVRPolyfill(
{
  	BUFFER_SCALE: 1,
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
				}
			})
		}
	}

	render()
    {
		return null
	}
}
