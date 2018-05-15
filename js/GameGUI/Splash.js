import React from 'react'

export default class Splash extends React.Component
{
    constructor(props)
    {
        super(props)
    }

	componentDidMount()
	{
    }

	render()
	{
        return (
            <sprite ref='sprite'
                scale={new THREE.Vector3(256, 256, 1)}
                position={new THREE.Vector3(window.innerWidth / 2, window.innerHeight / 2, 0)}
            >
                <spriteMaterial>
                    <texture url={(window.URL ? URL : webkitURL).createObjectURL(resource.data['image/crate.png'].data)} />
                </spriteMaterial>
            </sprite>
        )
	}
}
