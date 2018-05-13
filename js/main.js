require('./zepto')
global.resource = global.resource || require('./debug')

import React from 'react'
import ReactDOM from 'react-dom'
import WebVR from './WebVR'
import MyAd from './MyAd'

class App extends React.Component
{
    render()
    {
        let canvas = document.getElementById('mainCanvas')
        return (
            <div>
                <WebVR canvas={canvas} />
                <MyAd />
            </div>
        )
    }
}

window.onload = function()
{
    $('<div></div>').attr('id', 'sceneContainer').css({ width: '100%', height: '100%' }).appendTo(document.body)
    $('<canvas></canvas>').attr({ id: 'mainCanvas' }).appendTo(document.body)

    ReactDOM.render(<App />, document.getElementById('sceneContainer'))
}
