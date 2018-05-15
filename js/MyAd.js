import React from 'react'
import React3 from '../libs/react-three-renderer/src' 
import { Interaction } from 'three.interaction'
require('./DeviceOrientationControls')

import { connect, Provider } from 'react-redux'
import { bindActionCreators } from 'redux'
import { applyMiddleware, createStore } from 'redux'

import GameWorld from './GameWorld/'
import GameGUI from './GameGUI/'
import Actions from './actions/'

class MyAd extends React.Component
{
    constructor(props)
    {
        super(props)

        let prevTime = performance.now()
        this.OnAnimate = _ =>
        {
            let time = performance.now()
            let deltaTime = time - prevTime
            this.props.Update(deltaTime)
            this.controls.update()
            prevTime = time
        }

        this.OnWindowResize = _ =>
        {
            this.refs.camera.aspect = window.innerWidth / window.innerHeight
            this.refs.camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
        }
    }

	componentDidMount()
	{
        const interaction = new Interaction(renderer, this.refs.orthoscene, this.refs.orthocamera)
        this.controls = new THREE.DeviceOrientationControls(this.refs.camera)
        window.addEventListener('resize', this.OnWindowResize, false)
    }

	render()
	{
        let width = window.innerWidth
        let height = window.innerHeight
        return (
            <React3 mainCamera='camera' orthoCamera='orthocamera' width={width} height={height} antialias={true}
                canvas={document.getElementById('mainCanvas')}
                onAnimate={this.OnAnimate}
            >
                <scene background={0xf0f0ff} ref='scene'>
                    <perspectiveCamera name='camera' ref='camera'
                        fov={40} aspect={width/height} near={0.1} far={500}
                    />
                    <GameWorld store={this.props.store} />
                </scene>
                <orthoscene ref='orthoscene'>
                    <orthographicCamera name='orthocamera' ref='orthocamera'
                        position={new THREE.Vector3(0, 0, 1)}
                        left={0} right={width}
                        top={height} bottom={0}
                        near={1} far={100}
                    />
                    <GameGUI store={this.props.store} />
                </orthoscene>
            </React3>
        )
	}
}

let mapStateToProps = state =>
{
    return {}
}

let mapDispatchToProps = dispatch =>
{
    return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAd)
