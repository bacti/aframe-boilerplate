require('./zepto')
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'

import RollerCoaster from './RollerCoaster'
import reducers from './reducers'

class App extends React.Component
{
    constructor(props)
    {
        super(props)
    }

    render()
    {
        return (
            <Provider store={applyMiddleware()(createStore)(reducers)}>
                <RollerCoaster canvas={document.getElementById('mainCanvas')} />
            </Provider>
        )
    }
}

window.onload = function()
{
    $('<div></div>').attr('id', 'sceneContainer').css({ width: '100%', height: '100%' }).appendTo(document.body)
    $('<canvas></canvas>').attr({ id: 'mainCanvas' }).appendTo(document.body)

    ReactDOM.render(<App />, document.getElementById('sceneContainer'))
    // require('./webvr_rollercoaster.js')
}
