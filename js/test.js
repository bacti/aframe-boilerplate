var scene = new THREE.Scene(),
    light = new THREE.AmbientLight(0xffffff),
    renderer,
    // camera,
    renderer = new THREE.WebGLRenderer(),
    // box,
    ground,
    controls = null;

function initScene() {
    $('<div></div>').attr('id', 'sceneContainer').css({ width: '100%', height: '100%' }).appendTo(document.body)
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("sceneContainer").appendChild(renderer.domElement);

    scene.add(light);

    global.camera = new THREE.PerspectiveCamera(
        35,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );

    camera.position.set(0, 0, 100);

    scene.add(camera);

    global.box = new THREE.Mesh(
        new THREE.BoxGeometry(
            20,
            20,
            20),
        new THREE.MeshBasicMaterial({
            color: 0xFF0000
        }));

    scene.add(box);

    global.childBox = new THREE.Mesh(
        new THREE.PlaneGeometry(35, 35),
        new THREE.MeshBasicMaterial({
            color: 0x00FF00
        })
    );

    childBox.position.z = -130;



    camera.add(childBox);



    console.log(childBox.position)

    console.log(box.children);


    requestAnimationFrame(render);

};

var keep = true;

function movebox() {
    if (keep) {
        if (box.position.x > -55) {
            box.position.x -= .05;
            //console.log(box.position.x)
        } else {
            keep = false;

        }
    }
    // else
    // {
    //     if (box.position.x < 55) {
    //         box.position.x += .05;
    //     } else {
    //         keep = true;
    //     }
    // }

};


function render() {
    renderer.render(scene, camera);
    // box.rotation.x += .01;
    // box.rotation.y += .04;
    // movebox();
    requestAnimationFrame(render);
};

window.onload = initScene;