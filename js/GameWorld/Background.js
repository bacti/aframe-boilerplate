import React from 'react'

export default class Background extends React.Component
{
    componentDidMount()
    {
        this.refs.sphere.scale(-1, 1, 1)
    }

    render()
    {
        return (
            <mesh>
                <sphereGeometry ref='sphere' radius={500} widthSegments={60} heightSegments={40} />
                <meshBasicMaterial map={resource.textures['image/room.jpg']} />
            </mesh>
        )
    }
}
