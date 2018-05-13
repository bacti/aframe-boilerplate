import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

class Home extends React.Component
{
    constructor(props)
    {
        super(props)
        // console.log(this.props)
    }

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
                    <Route exact path="/" component={Home}/>
                    <Route path="/about" component={About}/>
                </div>
            </BrowserRouter>
        )
    }
}
export default BasicExample
