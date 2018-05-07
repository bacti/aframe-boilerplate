import React from 'react'

export default class Sky extends React.Component
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
        this.vertices = [];

        for ( var i = 0; i < 100; i ++ ) {

            var x = Math.random() * 800 - 400;
            var y = Math.random() * 50 + 50;
            var z = Math.random() * 800 - 400;

            var size = Math.random() * 40 + 20;

            this.vertices.push( x - size, y, z - size );
            this.vertices.push( x + size, y, z - size );
            this.vertices.push( x - size, y, z + size );

            this.vertices.push( x + size, y, z - size );
            this.vertices.push( x + size, y, z + size );
            this.vertices.push( x - size, y, z + size );

        }
    }
}
