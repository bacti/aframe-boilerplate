import React from 'react'
import React3 from '../libs/react-three-renderer/src' 
require('./DeviceOrientationControls')

export default class Controls extends React.Component
{
    constructor(props, context)
    {
        super(props, context)

        this.OnAnimate = _ =>
        {
        }
    }

    componentDidMount()
    {
        this.refs.sphere.scale(1, 1, 1)
        this.controls = new THREE.DeviceOrientationControls(this.refs.camera)
    }

    render()
    {
        let width = window.innerWidth
        let height = window.innerHeight
        return (
            <React3 mainCamera='perspective' width={width} height={height} antialias={true}
                canvas={this.props.canvas}
                onAnimate={this.OnAnimate}
            >
                <scene>
                    <perspectiveCamera name='perspective' ref='camera'
                        fov={75} aspect={width/height} near={1} far={1000}
                    />
                    <mesh>
                        <sphereGeometry ref='sphere' radius={500} widthSegments={60} heightSegments={40} />
                        <meshBasicMaterial map={new THREE.TextureLoader().load('textures/2294472375_24a3b8ef46_o.jpg')} />
                    </mesh>
                </scene>
            </React3>
        )
    }
}
