import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import PreLoad from './screens/PreLoad'

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
                    <Route exact path='/' component={PreLoad}/>
                </div>
            </BrowserRouter>
        )
	}
}
