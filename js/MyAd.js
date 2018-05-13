import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import Preload from './screens/Preload'

export default class MyAd extends React.Component
{
    constructor(props)
    {
        super(props)
    }

	render()
	{
        return (
            <BrowserRouter>
                <div>
                    <Route exact path='/' component={Preload}/>
                </div>
            </BrowserRouter>
        )
	}
}
