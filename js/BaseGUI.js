var radius = 500, theta = 0;
var frustumSize = 1000;

export default class BaseGUI
{
	constructor()
	{
		var aspect = window.innerWidth / window.innerHeight;
		global.orthocamera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000 );

		global.orthoscene = new THREE.Scene();
		// orthoscene.background = new THREE.Color( 0xf0f0f0 );

		var light = new THREE.DirectionalLight( 0xffffff, 1 );
		light.position.set( 1, 1, 1 ).normalize();
		orthoscene.add( light );

		var geometry = new THREE.BoxBufferGeometry( 20, 20, 20 );

		for (var i = 0; i < 2000; i ++)
		{
			var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

			object.position.x = Math.random() * 800 - 400;
			object.position.y = Math.random() * 800 - 400;
			object.position.z = Math.random() * 800 - 400;

			object.rotation.x = Math.random() * 2 * Math.PI;
			object.rotation.y = Math.random() * 2 * Math.PI;
			object.rotation.z = Math.random() * 2 * Math.PI;

			object.scale.x = Math.random() + 0.5;
			object.scale.y = Math.random() + 0.5;
			object.scale.z = Math.random() + 0.5;

			orthoscene.add( object );
		}

		// renderer = new THREE.WebGLRenderer();
		// renderer.setPixelRatio( window.devicePixelRatio );
		// renderer.setSize( window.innerWidth, window.innerHeight );
	}

	render()
	{
		theta += 0.1;

		orthocamera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
		orthocamera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
		orthocamera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
		orthocamera.lookAt( orthoscene.position );
		orthocamera.updateMatrixWorld();

		// renderer.render( orthoscene, orthocamera );
	}
}
