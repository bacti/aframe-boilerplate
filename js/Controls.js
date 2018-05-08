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
            this.controls.update()
        }
    }

    componentDidMount()
    {
        this.refs.sphere.scale(-1, 1, 1)
        this.controls = new THREE.DeviceOrientationControls(this.refs.camera)
    }

    render()
    {
        let width = window.innerWidth
        let height = window.innerHeight
        return (
            <React3 mainCamera='perspective' width={width} height={height} antialias={true} pixelRatio={window.devicePixelRatio}
                canvas={this.props.canvas}
                onAnimate={this.OnAnimate}
            >
                <scene>
                    <perspectiveCamera name='perspective' ref='camera'
                        fov={75} aspect={width/height} near={1} far={1000}
                    />
                    <mesh>
                        <sphereGeometry ref='sphere' radius={500} widthSegments={60} heightSegments={40} />
                        <meshBasicMaterial map={new THREE.TextureLoader().load(require('../data/room.jpg'))} />
                    </mesh>
                    <mesh>
                        <boxGeometry width={100} height={100} depth={100} widthSegments={4} heightSegments={4} depthSegments={4} />
                        <meshBasicMaterial color={0xff00ff} wireframe={true} />
                    </mesh>
                </scene>
            </React3>
        )
    }
}
