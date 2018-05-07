import React from 'react'

export default class Landscape extends React.Component
{
    constructor(props)
    {
		super(props)
		this.InitGeometry()
    }

    render()
    {
		return (
            <mesh>
                <bufferGeometry
                    position={new THREE.BufferAttribute( new Float32Array( this.vertices ), 3 )}
                />
                <meshBasicMaterial color={0xffffff} />
            </mesh>
		)
    }
    
    InitGeometry()
    {
        this.vertices = []
    }
}
