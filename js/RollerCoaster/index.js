import React from 'react'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import reducers from './reducers'
import RollerCoaster from './RollerCoaster'

export default class RollerCoasterWrapper extends React.Component
{
	render()
    {
        let store = applyMiddleware()(createStore)(reducers)
		return (
            <Provider store={store}>
                <RollerCoaster store={store} canvas={document.getElementById('mainCanvas')} />
            </Provider>
        )
	}
}
