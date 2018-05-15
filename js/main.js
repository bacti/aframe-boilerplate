require('./zepto')
global.resource = global.resource || require('./debug')

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
	}

    render()
    {
        let store = applyMiddleware()(createStore)(reducers)
        return (
            <Provider store={store}>
                <MyAd store={store} />
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
