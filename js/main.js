require('./zepto')
/// #if DEBUG
global.resource = require('./debug')
/// #endif

import React from 'react'
import ReactDOM from 'react-dom'
import WebVR from './WebVR'
import RollerCoaster from './RollerCoaster/'

import ZipLoader from './ZipLoader'

class App extends React.Component
{
    constructor(props)
    {
        super(props)
    }

    render()
    {
        let canvas = document.getElementById('mainCanvas')
        return (
            <div>
                <WebVR canvas={canvas} />
                <RollerCoaster canvas={canvas} />
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
