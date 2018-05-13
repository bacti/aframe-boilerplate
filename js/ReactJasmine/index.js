import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import PreLoad from './PreLoad'

class Home extends React.Component
{
    componentDidMount()
    {
        console.log(this.props.history)
        this.props.history.push('/about')
    }

    render()
    {
        return (
            <div>
                <h2>Home</h2>
            </div>
        )
    }
}

const About = () => (
  <div>
    <h2>About</h2>
  </div>
)

class BasicExample extends React.Component
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
                    <Route exact path="/" component={PreLoad}/>
                    <Route path="/about" component={About}/>
                </div>
            </BrowserRouter>
        )
    }
}
export default BasicExample
