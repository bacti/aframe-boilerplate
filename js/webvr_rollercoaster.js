/**
 * @author mrdoob / http://mrdoob.com/
 */

function RollerCoasterGeometry( curve, divisions ) {

	THREE.BufferGeometry.call( this );

	var vertices = [];
	var normals = [];
	var colors = [];

	var color1 = [ 1, 1, 1 ];
	var color2 = [ 1, 1, 0 ];

	var up = new THREE.Vector3( 0, 1, 0 );
	var forward = new THREE.Vector3();
	var right = new THREE.Vector3();

	var quaternion = new THREE.Quaternion();
	var prevQuaternion = new THREE.Quaternion();
	prevQuaternion.setFromAxisAngle( up , Math.PI / 2 );

	var point = new THREE.Vector3();
	var prevPoint = new THREE.Vector3();
	prevPoint.copy( curve.getPointAt( 0 ) );

	// shapes

	var step = [
		new THREE.Vector3( -0.225,  0, 0 ),
		new THREE.Vector3(  0, -0.050, 0 ),
		new THREE.Vector3(  0, -0.175, 0 ),

		new THREE.Vector3(  0, -0.050, 0 ),
		new THREE.Vector3(  0.225,  0, 0 ),
		new THREE.Vector3(  0, -0.175, 0 )
	];

	var PI2 = Math.PI * 2;

	var sides = 5;
	var tube1 = [];

	for ( var i = 0; i < sides; i ++ ) {

		var angle = ( i / sides ) * PI2;
		tube1.push( new THREE.Vector3( Math.sin( angle ) * 0.06, Math.cos( angle ) * 0.06, 0 ) );

	}

	var sides = 6;
	var tube2 = [];

	for ( var i = 0; i < sides; i ++ ) {

		var angle = ( i / sides ) * PI2;
		tube2.push( new THREE.Vector3( Math.sin( angle ) * 0.025, Math.cos( angle ) * 0.025, 0 ) );

	}

	var vector = new THREE.Vector3();
	var normal = new THREE.Vector3();

	function drawShape( shape, color ) {

		normal.set( 0, 0, -1 ).applyQuaternion( quaternion );

		for ( var j = 0; j < shape.length; j ++ ) {

			vector.copy( shape[ j ] );
			vector.applyQuaternion( quaternion );
			vector.add( point );

			vertices.push( vector.x, vector.y, vector.z );
			normals.push( normal.x, normal.y, normal.z );
			colors.push( color[ 0 ], color[ 1 ], color[ 2 ] );

		}

		normal.set( 0, 0, 1 ).applyQuaternion( quaternion );

		for ( var j = shape.length - 1; j >= 0; j -- ) {

			vector.copy( shape[ j ] );
			vector.applyQuaternion( quaternion );
			vector.add( point );

			vertices.push( vector.x, vector.y, vector.z );
			normals.push( normal.x, normal.y, normal.z );
			colors.push( color[ 0 ], color[ 1 ], color[ 2 ] );

		}

	};

	var vector1 = new THREE.Vector3();
	var vector2 = new THREE.Vector3();
	var vector3 = new THREE.Vector3();
	var vector4 = new THREE.Vector3();

	var normal1 = new THREE.Vector3();
	var normal2 = new THREE.Vector3();
	var normal3 = new THREE.Vector3();
	var normal4 = new THREE.Vector3();

	function extrudeShape( shape, offset, color ) {

		for ( var j = 0, jl = shape.length; j < jl; j ++ ) {

			var point1 = shape[ j ];
			var point2 = shape[ ( j + 1 ) % jl ];

			vector1.copy( point1 ).add( offset );
			vector1.applyQuaternion( quaternion );
			vector1.add( point );

			vector2.copy( point2 ).add( offset );
			vector2.applyQuaternion( quaternion );
			vector2.add( point );

			vector3.copy( point2 ).add( offset );
			vector3.applyQuaternion( prevQuaternion );
			vector3.add( prevPoint );

			vector4.copy( point1 ).add( offset );
			vector4.applyQuaternion( prevQuaternion );
			vector4.add( prevPoint );

			vertices.push( vector1.x, vector1.y, vector1.z );
			vertices.push( vector2.x, vector2.y, vector2.z );
			vertices.push( vector4.x, vector4.y, vector4.z );

			vertices.push( vector2.x, vector2.y, vector2.z );
			vertices.push( vector3.x, vector3.y, vector3.z );
			vertices.push( vector4.x, vector4.y, vector4.z );

			//

			normal1.copy( point1 );
			normal1.applyQuaternion( quaternion );
			normal1.normalize();

			normal2.copy( point2 );
			normal2.applyQuaternion( quaternion );
			normal2.normalize();

			normal3.copy( point2 );
			normal3.applyQuaternion( prevQuaternion );
			normal3.normalize();

			normal4.copy( point1 );
			normal4.applyQuaternion( prevQuaternion );
			normal4.normalize();

			normals.push( normal1.x, normal1.y, normal1.z );
			normals.push( normal2.x, normal2.y, normal2.z );
			normals.push( normal4.x, normal4.y, normal4.z );

			normals.push( normal2.x, normal2.y, normal2.z );
			normals.push( normal3.x, normal3.y, normal3.z );
			normals.push( normal4.x, normal4.y, normal4.z );

			colors.push( color[ 0 ], color[ 1 ], color[ 2 ] );
			colors.push( color[ 0 ], color[ 1 ], color[ 2 ] );
			colors.push( color[ 0 ], color[ 1 ], color[ 2 ] );

			colors.push( color[ 0 ], color[ 1 ], color[ 2 ] );
			colors.push( color[ 0 ], color[ 1 ], color[ 2 ] );
			colors.push( color[ 0 ], color[ 1 ], color[ 2 ] );

		}

	};

	var offset = new THREE.Vector3();

	for ( var i = 1; i <= divisions; i ++ ) {

		point.copy( curve.getPointAt( i / divisions ) );

		up.set( 0, 1, 0 );

		forward.subVectors( point, prevPoint ).normalize();
		right.crossVectors( up, forward ).normalize();
		up.crossVectors( forward, right );

		var angle = Math.atan2( forward.x, forward.z );

		quaternion.setFromAxisAngle( up, angle );

		if ( i % 2 === 0 ) {

			drawShape( step, color2 );

		}

		extrudeShape( tube1, offset.set(  0,  -0.125, 0 ), color2 );
		extrudeShape( tube2, offset.set(  0.2, 0,     0 ), color1 );
		extrudeShape( tube2, offset.set( -0.2, 0,     0 ), color1 );

		prevPoint.copy( point );
		prevQuaternion.copy( quaternion );

	}

	// console.log( vertices.length );

	this.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( vertices ), 3 ) );
	this.addAttribute( 'normal', new THREE.BufferAttribute( new Float32Array( normals ), 3 ) );
	this.addAttribute( 'color', new THREE.BufferAttribute( new Float32Array( colors ), 3 ) );

};

RollerCoasterGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );

function RollerCoasterLiftersGeometry( curve, divisions ) {

	THREE.BufferGeometry.call( this );

	var vertices = [];
	var normals = [];

	var quaternion = new THREE.Quaternion();

	var up = new THREE.Vector3( 0, 1, 0 );

	var point = new THREE.Vector3();
	var tangent = new THREE.Vector3();

	// shapes

	var tube1 = [
		new THREE.Vector3(  0,  0.05, -0.05 ),
		new THREE.Vector3(  0,  0.05,  0.05 ),
		new THREE.Vector3(  0, -0.05,  0 )
	];

	var tube2 = [
		new THREE.Vector3( -0.05, 0,  0.05 ),
		new THREE.Vector3( -0.05, 0, -0.05 ),
		new THREE.Vector3(  0.05, 0,  0 )
	];

	var tube3 = [
		new THREE.Vector3(  0.05, 0, -0.05 ),
		new THREE.Vector3(  0.05, 0,  0.05 ),
		new THREE.Vector3( -0.05, 0,  0 )
	];

	var vector1 = new THREE.Vector3();
	var vector2 = new THREE.Vector3();
	var vector3 = new THREE.Vector3();
	var vector4 = new THREE.Vector3();

	var normal1 = new THREE.Vector3();
	var normal2 = new THREE.Vector3();
	var normal3 = new THREE.Vector3();
	var normal4 = new THREE.Vector3();

	function extrudeShape( shape, fromPoint, toPoint ) {

		for ( var j = 0, jl = shape.length; j < jl; j ++ ) {

			var point1 = shape[ j ];
			var point2 = shape[ ( j + 1 ) % jl ];

			vector1.copy( point1 );
			vector1.applyQuaternion( quaternion );
			vector1.add( fromPoint );

			vector2.copy( point2 );
			vector2.applyQuaternion( quaternion );
			vector2.add( fromPoint );

			vector3.copy( point2 );
			vector3.applyQuaternion( quaternion );
			vector3.add( toPoint );

			vector4.copy( point1 );
			vector4.applyQuaternion( quaternion );
			vector4.add( toPoint );

			vertices.push( vector1.x, vector1.y, vector1.z );
			vertices.push( vector2.x, vector2.y, vector2.z );
			vertices.push( vector4.x, vector4.y, vector4.z );

			vertices.push( vector2.x, vector2.y, vector2.z );
			vertices.push( vector3.x, vector3.y, vector3.z );
			vertices.push( vector4.x, vector4.y, vector4.z );

			//

			normal1.copy( point1 );
			normal1.applyQuaternion( quaternion );
			normal1.normalize();

			normal2.copy( point2 );
			normal2.applyQuaternion( quaternion );
			normal2.normalize();

			normal3.copy( point2 );
			normal3.applyQuaternion( quaternion );
			normal3.normalize();

			normal4.copy( point1 );
			normal4.applyQuaternion( quaternion );
			normal4.normalize();

			normals.push( normal1.x, normal1.y, normal1.z );
			normals.push( normal2.x, normal2.y, normal2.z );
			normals.push( normal4.x, normal4.y, normal4.z );

			normals.push( normal2.x, normal2.y, normal2.z );
			normals.push( normal3.x, normal3.y, normal3.z );
			normals.push( normal4.x, normal4.y, normal4.z );

		}

	};

	var fromPoint = new THREE.Vector3();
	var toPoint = new THREE.Vector3();

	for ( var i = 1; i <= divisions; i ++ ) {

		point.copy( curve.getPointAt( i / divisions ) );
		tangent.copy( curve.getTangentAt( i / divisions ) );

		var angle = Math.atan2( tangent.x, tangent.z );

		quaternion.setFromAxisAngle( up, angle );

		//

		if ( point.y > 10 ) {

			fromPoint.set( -0.75, -0.35, 0 );
			fromPoint.applyQuaternion( quaternion );
			fromPoint.add( point );

			toPoint.set( 0.75, -0.35, 0 );
			toPoint.applyQuaternion( quaternion );
			toPoint.add( point );

			extrudeShape( tube1, fromPoint, toPoint );

			fromPoint.set( -0.7, -0.3, 0 );
			fromPoint.applyQuaternion( quaternion );
			fromPoint.add( point );

			toPoint.set( -0.7, -point.y, 0 );
			toPoint.applyQuaternion( quaternion );
			toPoint.add( point );

			extrudeShape( tube2, fromPoint, toPoint );

			fromPoint.set( 0.7, -0.3, 0 );
			fromPoint.applyQuaternion( quaternion );
			fromPoint.add( point );

			toPoint.set( 0.7, -point.y, 0 );
			toPoint.applyQuaternion( quaternion );
			toPoint.add( point );

			extrudeShape( tube3, fromPoint, toPoint );

		} else {

			fromPoint.set( 0, -0.2, 0 );
			fromPoint.applyQuaternion( quaternion );
			fromPoint.add( point );

			toPoint.set( 0, -point.y, 0 );
			toPoint.applyQuaternion( quaternion );
			toPoint.add( point );

			extrudeShape( tube3, fromPoint, toPoint );

		}

	}

	this.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( vertices ), 3 ) );
	this.addAttribute( 'normal', new THREE.BufferAttribute( new Float32Array( normals ), 3 ) );

};

RollerCoasterLiftersGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );

function RollerCoasterShadowGeometry( curve, divisions ) {

	THREE.BufferGeometry.call( this );

	var vertices = [];

	var up = new THREE.Vector3( 0, 1, 0 );
	var forward = new THREE.Vector3();

	var quaternion = new THREE.Quaternion();
	var prevQuaternion = new THREE.Quaternion();
	prevQuaternion.setFromAxisAngle( up , Math.PI / 2 );

	var point = new THREE.Vector3();

	var prevPoint = new THREE.Vector3();
	prevPoint.copy( curve.getPointAt( 0 ) );
	prevPoint.y = 0;

	var vector1 = new THREE.Vector3();
	var vector2 = new THREE.Vector3();
	var vector3 = new THREE.Vector3();
	var vector4 = new THREE.Vector3();

	for ( var i = 1; i <= divisions; i ++ ) {

		point.copy( curve.getPointAt( i / divisions ) );
		point.y = 0;

		forward.subVectors( point, prevPoint );

		var angle = Math.atan2( forward.x, forward.z );

		quaternion.setFromAxisAngle( up, angle );

		vector1.set( -0.3, 0, 0 );
		vector1.applyQuaternion( quaternion );
		vector1.add( point );

		vector2.set(  0.3, 0, 0 );
		vector2.applyQuaternion( quaternion );
		vector2.add( point );

		vector3.set(  0.3, 0, 0 );
		vector3.applyQuaternion( prevQuaternion );
		vector3.add( prevPoint );

		vector4.set( -0.3, 0, 0 );
		vector4.applyQuaternion( prevQuaternion );
		vector4.add( prevPoint );

		vertices.push( vector1.x, vector1.y, vector1.z );
		vertices.push( vector2.x, vector2.y, vector2.z );
		vertices.push( vector4.x, vector4.y, vector4.z );

		vertices.push( vector2.x, vector2.y, vector2.z );
		vertices.push( vector3.x, vector3.y, vector3.z );
		vertices.push( vector4.x, vector4.y, vector4.z );

		prevPoint.copy( point );
		prevQuaternion.copy( quaternion );

	}

	this.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( vertices ), 3 ) );

};

RollerCoasterShadowGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );

function SkyGeometry() {

	THREE.BufferGeometry.call( this );

	var vertices = [];

	for ( var i = 0; i < 100; i ++ ) {

		var x = Math.random() * 800 - 400;
		var y = Math.random() * 50 + 50;
		var z = Math.random() * 800 - 400;

		var size = Math.random() * 40 + 20;

		vertices.push( x - size, y, z - size );
		vertices.push( x + size, y, z - size );
		vertices.push( x - size, y, z + size );

		vertices.push( x + size, y, z - size );
		vertices.push( x + size, y, z + size );
		vertices.push( x - size, y, z + size );

	}


	this.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( vertices ), 3 ) );

};

SkyGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );

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

TreesGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );

var renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.vr.enabled = true;
renderer.vr.userHeight = 0; // TOFIX
document.body.appendChild( renderer.domElement );

// document.body.appendChild( WEBVR.createButton( renderer ) );

//

var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xf0f0ff );

var light = new THREE.HemisphereLight( 0xfff0f0, 0x606066 );
light.position.set( 1, 1, 1 );
scene.add( light );

var train = new THREE.Object3D();
scene.add( train );

var camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.1, 500 );
train.add( camera );

// environment

var geometry = new THREE.PlaneBufferGeometry( 500, 500, 15, 15 );
geometry.rotateX( - Math.PI / 2 );

var positions = geometry.attributes.position.array;
var vertex = new THREE.Vector3();

for ( var i = 0; i < positions.length; i += 3 ) {

	vertex.fromArray( positions, i );

	vertex.x += Math.random() * 10 - 5;
	vertex.z += Math.random() * 10 - 5;

	var distance = ( vertex.distanceTo( scene.position ) / 5 ) - 25;
	vertex.y = Math.random() * Math.max( 0, distance );

	vertex.toArray( positions, i );

}

geometry.computeVertexNormals();

var material = new THREE.MeshLambertMaterial( {
	color: 0x407000
} );

var mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

var geometry = new TreesGeometry( mesh );
var material = new THREE.MeshBasicMaterial( {
	side: THREE.DoubleSide, vertexColors: THREE.VertexColors
} );
var mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

var geometry = new SkyGeometry();
var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
var mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

//

var PI2 = Math.PI * 2;

var curve = ( function () {

	var vector = new THREE.Vector3();
	var vector2 = new THREE.Vector3();

	return {

		getPointAt: function ( t ) {

			t = t * PI2;

			var x = Math.sin( t * 3 ) * Math.cos( t * 4 ) * 50;
			var y = Math.sin( t * 10 ) * 2 + Math.cos( t * 17 ) * 2 + 5;
			var z = Math.sin( t ) * Math.sin( t * 4 ) * 50;

			return vector.set( x, y, z ).multiplyScalar( 2 );

		},

		getTangentAt: function ( t ) {

			var delta = 0.0001;
			var t1 = Math.max( 0, t - delta );
			var t2 = Math.min( 1, t + delta );

			return vector2.copy( this.getPointAt ( t2 ) )
				.sub( this.getPointAt( t1 ) ).normalize();

		}

	};

} )();

var geometry = new RollerCoasterGeometry( curve, 1500 );
var material = new THREE.MeshPhongMaterial( {
	vertexColors: THREE.VertexColors
} );
var mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

var geometry = new RollerCoasterLiftersGeometry( curve, 100 );
var material = new THREE.MeshPhongMaterial();
var mesh = new THREE.Mesh( geometry, material );
mesh.position.y = 0.1;
scene.add( mesh );

var geometry = new RollerCoasterShadowGeometry( curve, 500 );
var material = new THREE.MeshBasicMaterial( {
	color: 0x305000, depthWrite: false, transparent: true
} );
var mesh = new THREE.Mesh( geometry, material );
mesh.position.y = 0.1;
scene.add( mesh );

var funfairs = [];

//

var geometry = new THREE.CylinderBufferGeometry( 10, 10, 5, 15 );
var material = new THREE.MeshLambertMaterial( {
	color: 0xff8080,
	//flatShading: true // Lambert does not support flat shading
} );
var mesh = new THREE.Mesh( geometry, material );
mesh.position.set( - 80, 10, - 70 );
mesh.rotation.x = Math.PI / 2;
scene.add( mesh );

funfairs.push( mesh );

var geometry = new THREE.CylinderBufferGeometry( 5, 6, 4, 10 );
var material = new THREE.MeshLambertMaterial( {
	color: 0x8080ff,
	//flatShading: true // Lambert does not support flat shading
} );
var mesh = new THREE.Mesh( geometry, material );
mesh.position.set( 50, 2, 30 );
scene.add( mesh );

funfairs.push( mesh );

//

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

//

var position = new THREE.Vector3();
var tangent = new THREE.Vector3();

var lookAt = new THREE.Vector3();

var velocity = 0;
var progress = 0;

var prevTime = performance.now();

function render() {

	var time = performance.now();
	var delta = time - prevTime;

	for ( var i = 0; i < funfairs.length; i ++ ) {

		funfairs[ i ].rotation.y = time * 0.0004;

	}

	//

	progress += velocity;
	progress = progress % 1;

	position.copy( curve.getPointAt( progress ) );
	position.y += 0.3;

	train.position.copy( position );

	tangent.copy( curve.getTangentAt( progress ) );

	velocity -= tangent.y * 0.0000001 * delta;
	velocity = Math.max( 0.00004, Math.min( 0.0002, velocity ) );

	train.lookAt( lookAt.copy( position ).sub( tangent ) );

	//

	renderer.render( scene, camera );

	prevTime = time;

}

renderer.animate( render );
