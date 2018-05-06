import React from 'react'
import React3 from '../libs/react-three-renderer/src' 
import WebVR from './WebVR'
import { curve } from './Curve'
import RollerCoasterGeometry from './RollerCoasterGeometry'
import RollerCoasterLiftersGeometry from './RollerCoasterLiftersGeometry'

export default class RollerCoaster extends React.Component
{
    constructor(props, context)
    {
        super(props, context)

        this.cameraPosition = new THREE.Vector3(0, 0, 5)
        this.state =
        {
            cubeRotation: new THREE.Euler(),
        }

        this.curve = (function()
        {
            let vector = new THREE.Vector3()
            let vector2 = new THREE.Vector3()
            return {
                getPointAt: t =>
                {
                    t = t * PI2
                    var x = Math.sin(t * 3) * Math.cos(t * 4) * 50
                    var y = Math.sin(t * 10) * 2 + Math.cos(t * 17) * 2 + 5
                    var z = Math.sin(t) * Math.sin(t * 4) * 50
                    return vector.set(x, y, z).multiplyScalar(2)
                },
                getTangentAt: t =>
                {
                    var delta = 0.0001
                    var t1 = Math.max(0, t - delta)
                    var t2 = Math.min(1, t + delta)
                    return vector2.copy(this.getPointAt(t2)).sub(this.getPointAt(t1)).normalize()
                }
            }
        })()

        let position = new THREE.Vector3()
        let tangent = new THREE.Vector3()
        let lookAt = new THREE.Vector3()
        let velocity = 0
        let progress = 0
        let prevTime = performance.now()

        this.OnAnimate = _ =>
        {
            // this.setState(
            // {
            //     cubeRotation: new THREE.Euler(this.state.cubeRotation.x + 0.1, this.state.cubeRotation.y + 0.1, 0),
            // })
            let time = performance.now();
            let delta = time - prevTime;
        
            // for ( var i = 0; i < funfairs.length; i ++ ) {
        
            // 	funfairs[ i ].rotation.y = time * 0.0004;
        
            // }
        
            //
        
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
        }
    }
  
    render()
    {
        let width = window.innerWidth
        let height = window.innerHeight
        return (
            <div>
                <WebVR canvas={this.props.canvas} />
                <React3 mainCamera='perspective' width={width} height={height}
                    canvas={this.props.canvas}
                    onAnimate={this.OnAnimate}
                >
                    <scene background={0xf0f0ff}>
                        <hemisphereLight skyColor={0xfff0f0} groundColor={0x606066} position={new THREE.Vector3(1, 1, 1)} />
                        <object3D ref="train">
                            <perspectiveCamera name='perspective'
                                fov={40} aspect={width/height} near={0.1} far={500}
                            />
                        </object3D>
                        <mesh rotation={this.state.cubeRotation}>
                            <RollerCoasterGeometry curve={curve} divisions={1500} />
                            <meshPhongMaterial vertexColors={THREE.VertexColors} />
                        </mesh>
                        <mesh rotation={this.state.cubeRotation}>
                            <RollerCoasterLiftersGeometry curve={curve} divisions={100} />
                            <meshPhongMaterial />
                        </mesh>
                    </scene>
                </React3>
            </div>
        )
    }
}
