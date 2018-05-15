import React from 'react'
// require('../DeviceOrientationControls')

export default class Background extends React.Component
{
    constructor(props, context)
    {
        super(props, context)

    }

    componentDidMount()
    {
        this.refs.sphere.scale(-1, 1, 1)
        // this.controls = new THREE.DeviceOrientationControls(this.refs.camera)
    }

    render()
    {
        return (
            <mesh>
                <sphereGeometry ref='sphere' radius={500} widthSegments={60} heightSegments={40} />
                <meshBasicMaterial map={new THREE.TextureLoader().load((window.URL ? URL : webkitURL).createObjectURL(resource.data['image/room.jpg'].data))} />
            </mesh>
        )
    }
}
