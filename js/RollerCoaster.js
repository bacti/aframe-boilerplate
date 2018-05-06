import React from 'react'
import React3 from '../libs/react-three-renderer/src' 
import WebVR from './WebVR'

const PI2 = Math.PI * 2

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

        this.OnAnimate = _ =>
        {
            this.setState(
            {
                cubeRotation: new THREE.Euler(this.state.cubeRotation.x + 0.1, this.state.cubeRotation.y + 0.1, 0),
            })
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
                    <scene>
                        <perspectiveCamera name='perspective'
                            fov={75} aspect={width/height} near={0.1} far={1000}
                            position={this.cameraPosition}
                        />
                        <hemisphereLight skyColor={0xfff0f0} groundColor={0x606066} position={new THREE.Vector3(1, 1, 1)} />
                        <mesh rotation={this.state.cubeRotation}>
                            <boxGeometry width={1} height={1} depth={1} />
                            <meshBasicMaterial color={0x00ff00} />
                        </mesh>
                    </scene>
                </React3>
            </div>
        )
    }
}
