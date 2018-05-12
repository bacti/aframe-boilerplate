import React from 'react'
import { connect, Provider } from 'react-redux'
import { bindActionCreators } from 'redux'
import { applyMiddleware, createStore } from 'redux'
import reducers from './reducers'

import React3 from '../../libs/react-three-renderer/src' 
import { curve } from './Curve'
import Landscape from './Landscape'
import Trees from './Trees'
import Sky from './Sky'
import RollerCoasterGeometry from './RollerCoasterGeometry'
import RollerCoasterLifters from './RollerCoasterLifters'
import RollerCoasterShadow from './RollerCoasterShadow'
require('./DeviceOrientationControls')

import BaseGUI from '../BaseGUI'

class RollerCoaster extends React.Component
{
    constructor(props, context)
    {
        super(props, context)

        let position = new THREE.Vector3()
        let tangent = new THREE.Vector3()
        let lookAt = new THREE.Vector3()
        let velocity = 0
        let progress = 0
        let prevTime = performance.now()

        this.OnAnimate = _ =>
        {
            let time = performance.now();
            let delta = time - prevTime;
        
            progress += velocity
            progress = progress % 1
        
            position.copy( curve.getPointAt( progress ) )
            position.y += 0.3
        
            this.refs.train.position.copy( position )
        
            tangent.copy( curve.getTangentAt( progress ) )
        
            velocity -= tangent.y * 0.0000001 * delta
            velocity = Math.max( 0.00004, Math.min( 0.0002, velocity ) )
        
            this.refs.train.lookAt( lookAt.copy( position ).sub( tangent ) )
        
            prevTime = time
            // this.controls.update()
        }
    }

    componentDidMount()
    {
        this.props.mainScene(this.refs.scene)
        this.controls = new THREE.DeviceOrientationControls(this.refs.camera)
        this.refs.directionalLight.position.set(1, 1, 1).normalize()
    }

    render()
    {
        let width = window.innerWidth
        let height = window.innerHeight
        let frustumSize = 1000
        let aspect = width / height

        return (
            <React3 mainCamera='perspective' orthoCamera='ortho' width={width} height={height} antialias={true}
                canvas={this.props.canvas}
                onAnimate={this.OnAnimate}
            >
                <scene background={0xf0f0ff} ref='scene'>
                    <hemisphereLight skyColor={0xfff0f0} groundColor={0x606066} position={new THREE.Vector3(1, 1, 1)} />
                    <object3D ref="train">
                        <perspectiveCamera name='perspective' ref='camera'
                            fov={40} aspect={width/height} near={0.1} far={500}
                        />
                    </object3D>
                    <Landscape store={this.props.store} />
                    <Trees store={this.props.store} />
                    <Sky />
                    <mesh>
                        <RollerCoasterGeometry curve={curve} divisions={1500} />
                        <meshPhongMaterial vertexColors={THREE.VertexColors} />
                    </mesh>
                    <RollerCoasterLifters curve={curve} />
                    <RollerCoasterShadow curve={curve} />
                </scene>
                <orthoscene>
                    <orthographicCamera name='ortho'
                        left={frustumSize * aspect / - 2} right={frustumSize * aspect / 2}
                        top={frustumSize / 2} bottom={frustumSize / - 2}
                        near={1} far={1000}
                    />
                    <directionalLight color={0xffffff} intensity={1} ref='directionalLight' />
                    <BaseGUI />
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

export default connect(mapStateToProps, mapDispatchToProps)(RollerCoaster)
