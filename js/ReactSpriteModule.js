import React from 'react'

export default class ReactSpriteModule extends React.Component
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
            <sprite ref='sprite' scale={new THREE.Vector3(256, 256, 1)}>
                <spriteMaterial>
                    <texture url={resource.get_embed_src('data/image/crate.png')} />
                </spriteMaterial>
            </sprite>
        )
	}
}
