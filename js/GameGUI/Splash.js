import React from 'react'

export default class Splash extends React.Component
{
    constructor(props)
    {
        super(props)
    }

	render()
	{
        return (
            <sprite ref='sprite' scale={new THREE.Vector3(256, 256, 1)}>
                <spriteMaterial>
                    <texture url={(window.URL ? URL : webkitURL).createObjectURL(resource.data['image/crate.png'].data)} />
                </spriteMaterial>
            </sprite>
        )
	}
}
