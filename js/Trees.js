import React from 'react'

export default class Trees extends React.Component
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
                    color={new THREE.BufferAttribute( new Float32Array( this.colors ), 3 )}
                />
                <meshBasicMaterial color={0xffffff} />
            </mesh>
		)
	}
	
	InitGeometry(landscape)
	{
		this.vertices = [];
		this.colors = [];

		var raycaster = new THREE.Raycaster();
		raycaster.ray.direction.set( 0, -1, 0 );

		for ( var i = 0; i < 2000; i ++ )
		{
			var x = Math.random() * 500 - 250;
			var z = Math.random() * 500 - 250;

			raycaster.ray.origin.set( x, 50, z );

			var intersections = raycaster.intersectObject( landscape );

			if ( intersections.length === 0 ) continue;

			var y = intersections[ 0 ].point.y;

			var height = Math.random() * 5 + 0.5;

			var angle = Math.random() * Math.PI * 2;

			this.vertices.push( x + Math.sin( angle ), y, z + Math.cos( angle ) );
			this.vertices.push( x, y + height, z );
			this.vertices.push( x + Math.sin( angle + Math.PI ), y, z + Math.cos( angle + Math.PI ) );

			angle += Math.PI / 2;

			this.vertices.push( x + Math.sin( angle ), y, z + Math.cos( angle ) );
			this.vertices.push( x, y + height, z );
			this.vertices.push( x + Math.sin( angle + Math.PI ), y, z + Math.cos( angle + Math.PI ) );

			var random = Math.random() * 0.1;

			for ( var j = 0; j < 6; j ++ )
			{
				this.colors.push( 0.2 + random, 0.4 + random, 0 );
			}
		}
	}
}
