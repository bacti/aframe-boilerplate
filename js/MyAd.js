import React from 'react'
import React3 from '../libs/react-three-renderer/src' 
import ReactSpriteModule from './ReactSpriteModule'

import { connect, Provider } from 'react-redux'
import { bindActionCreators } from 'redux'
import { applyMiddleware, createStore } from 'redux'

class MyAd extends React.Component
{
    constructor(props)
    {
        super(props)
        this.OnAnimate = _ =>
        {
        }
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
                </scene>
                <orthoscene ref='orthoscene'>
                    <orthographicCamera name='orthocamera' ref='orthocamera'
                        position={new THREE.Vector3(0, 0, 1)}
                        left={width / - 2} right={width / 2}
                        top={height / 2} bottom={height / - 2}
                        near={1} far={100}
                    />
                    <ReactSpriteModule />
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
    return bindActionCreators(
    {
        mainScene: scene =>
        {
            return {
                type: 'MAIN_SCENE',
                payload: scene,
            }
        },
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAd)
