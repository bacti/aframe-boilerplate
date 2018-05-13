import React from 'react'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'

import ReactJasmine from './ReactJasmine'

export default class ReactJasmineWrapper extends React.Component
{
	render()
    {
        const history = createHistory()
        const store = createStore(routerReducer, applyMiddleware(routerMiddleware(history)))

		return (
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <ReactJasmine />
                </ConnectedRouter>
            </Provider>
        )
	}
}
