function TreesGeometry( landscape ) {

	THREE.BufferGeometry.call( this );

	var vertices = [];
	var colors = [];

	var raycaster = new THREE.Raycaster();
	raycaster.ray.direction.set( 0, -1, 0 );

	for ( var i = 0; i < 2000; i ++ ) {

		var x = Math.random() * 500 - 250;
		var z = Math.random() * 500 - 250;

		raycaster.ray.origin.set( x, 50, z );

		var intersections = raycaster.intersectObject( landscape );

		if ( intersections.length === 0 ) continue;

		var y = intersections[ 0 ].point.y;

		var height = Math.random() * 5 + 0.5;

		var angle = Math.random() * Math.PI * 2;

		vertices.push( x + Math.sin( angle ), y, z + Math.cos( angle ) );
		vertices.push( x, y + height, z );
		vertices.push( x + Math.sin( angle + Math.PI ), y, z + Math.cos( angle + Math.PI ) );

		angle += Math.PI / 2;

		vertices.push( x + Math.sin( angle ), y, z + Math.cos( angle ) );
		vertices.push( x, y + height, z );
		vertices.push( x + Math.sin( angle + Math.PI ), y, z + Math.cos( angle + Math.PI ) );

		var random = Math.random() * 0.1;

		for ( var j = 0; j < 6; j ++ ) {

			colors.push( 0.2 + random, 0.4 + random, 0 );

		}

	}

	this.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( vertices ), 3 ) );
	this.addAttribute( 'color', new THREE.BufferAttribute( new Float32Array( colors ), 3 ) );

};