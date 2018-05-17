import React from 'react'

export default class VideoBackground extends React.Component
{
    componentWillMount()
    {
        this.texture = new THREE.VideoTexture(resource.video)
        this.texture.format = THREE.RGBFormat
        this.texture.minFilter = THREE.LinearFilter
        this.texture.magFilter = THREE.LinearFilter
        //this.texture.mapping = THREE.SphericalReflectionMapping
        this.texture.mapping = THREE.UVMapping
        this.texture.image.width = resource.video.videoWidth
        this.texture.image.height = resource.video.videoHeight
        resource.video.play()
    }

    componentDidMount()
    {
        this.refs.sphere.scale(-1, 1, 1)
    }

    render()
    {
        return (
            <mesh>
                <sphereGeometry ref='sphere' radius={200} widthSegments={32} heightSegments={32} phiStart={Math.PI * 2} />
                <meshBasicMaterial map={this.texture} depthTest={false} depthWrite={false} />
            </mesh>
        )
    }
}
