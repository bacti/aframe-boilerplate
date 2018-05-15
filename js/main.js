require('./zepto')
global.resource = global.resource || require('./debug')

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
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import reducers from './reducers/'

// import WebVR from './WebVR'
import MyAd from './MyAd'

class App extends React.Component
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

		this.ToggleVR = _ =>
		{
			if (!this.vrDisplay || !global.renderer)
                return
            ;!renderer.vr.getDevice() && renderer.vr.setDevice(this.vrDisplay)
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
	}

    render()
    {
        let canvas = document.getElementById('mainCanvas')
        let store = applyMiddleware()(createStore)(reducers)
        return (
            <Provider store={store}>
                <div>
                    <div onClick={this.ToggleVR}
                        style={{
                            background: `url(${resource.get_embed_src('data/image/vr-icon.png')}) 0% 0% / contain no-repeat`,
                            position: 'absolute',
                            zIndex: 1,
                            width: '7vw',
                            height: '4.2vw',
                            right: '1vw',
                            bottom: '1vw',
                        }}
                    >
                    </div>
                    <MyAd store={store} />
                </div>
            </Provider>
        )
    }
}

window.onload = function()
{
    $('<div></div>').attr('id', 'sceneContainer').css({ width: '100%', height: '100%' }).appendTo(document.body)
    $('<canvas></canvas>').attr({ id: 'mainCanvas' }).appendTo(document.body)

    ReactDOM.render(<App />, document.getElementById('sceneContainer'))
}
