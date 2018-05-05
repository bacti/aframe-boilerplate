import React from 'react'
import React3 from '../libs/react-three-renderer/src'
import WebVR from './WebVR'

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
