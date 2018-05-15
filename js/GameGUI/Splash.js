import React from 'react'

export default class Splash extends React.Component
{
    constructor(props)
    {
        super(props)
    }

	componentWillMount()
	{
        this.texCrate = resource.textures['image/crate.png']
    }

	render()
	{
        return (
            <sprite ref='sprite'
                scale={new THREE.Vector3(this.texCrate.image.width, this.texCrate.image.height, 1)}
                position={new THREE.Vector3(window.innerWidth / 2, window.innerHeight / 2, 0)}
            >
                <spriteMaterial map={resource.textures['image/crate.png']} />
            </sprite>
        )
	}
}
