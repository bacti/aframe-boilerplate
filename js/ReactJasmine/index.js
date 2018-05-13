// import React from 'react'
// import { Provider } from 'react-redux'
// import { applyMiddleware, createStore } from 'redux'
// import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux'
// import createHistory from 'history/createBrowserHistory'

// import ReactJasmine from './ReactJasmine'

// export default class ReactJasmineWrapper extends React.Component
// {
// 	render()
//     {
//         const history = createHistory()
//         const store = createStore(routerReducer, applyMiddleware(routerMiddleware(history)))

// 		return (
//             <Provider store={store}>
//                 <ConnectedRouter history={history}>
//                     <ReactJasmine />
//                 </ConnectedRouter>
//             </Provider>
//         )
// 	}
// }

import React from 'react'
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom'

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
                {/* <Redirect to="/about" push /> */}
            </div>
        )
    }
}

const About = () => (
  <div>
    <h2>About</h2>
  </div>
)

const Topic = ({ match }) => (
  <div>
    <h3>{match.params.topicId}</h3>
  </div>
)

const Topics = ({ match }) => (
  <div>
    <h2>Topics</h2>
    <ul>
      <li>
        <Link to={`${match.url}/rendering`}>
          Rendering with React
        </Link>
      </li>
      <li>
        <Link to={`${match.url}/components`}>
          Components
        </Link>
      </li>
      <li>
        <Link to={`${match.url}/props-v-state`}>
          Props v. State
        </Link>
      </li>
    </ul>

    <Route path={`${match.path}/:topicId`} component={Topic}/>
    <Route exact path={match.path} render={() => (
      <h3>Please select a topic.</h3>
    )}/>
  </div>
)

class BasicExample extends React.Component
{
    constructor(props)
    {
        super(props)
        global.abc = props
    }

    componentDidMount()
    {
        // console.log(this.context)
    }

    render()
    {
        return (
            <Router>
                <div>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/topics">Topics</Link></li>
                </ul>

                <hr/>

                <Route exact path="/" component={Home}/>
                <Route path="/about" component={About}/>
                <Route path="/topics" component={Topics}/>
                </div>
            </Router>
        )
    }
}
export default BasicExample
