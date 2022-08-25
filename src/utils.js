export function onMouseMove(e, mouse) {
  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components
  if (e.touches) {
    var clientX = e.touches[0].clientX;
    var clientY = e.touches[0].clientY;
  } else {
    var clientX = event.clientX;
    var clientY = event.clientY;
  }

  mouse.x = (clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(clientY / window.innerHeight) * 2 + 1;
  return mouse;
}

export async function loadSVG(scene) {
  var loader = new THREE.SVGLoader();
  var material_name;

  const a =
    "https://cdn.glitch.com/af370b6d-3f32-47c5-aa5d-adafb6a739ab%2Farielklevecz4.svg?v=1574731449642";
  // load a SVG resource
  await loader.load(
    // resource URL
    a,
    // called when the resource is loaded
    function(data) {
      var paths = data.paths;
      var group = new THREE.Group();
      group.scale.multiplyScalar(0.1);
      group.position.x = -20;
      group.position.y = 7;
      group.position.z = -10;
      group.scale.y *= -1;
      group.name = "ariel";

      material_name = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      for (var i = 0; i < paths.length; i++) {
        var path = paths[i];

        var shapes = path.toShapes(true);

        for (var j = 0; j < shapes.length; j++) {
          var shape = shapes[j];
          var geometry = new THREE.ShapeBufferGeometry(shape);

          var mesh = new THREE.Mesh(geometry, material_name);
          // mesh.rotation.x = Math.PI / 2;
          group.add(mesh);
        }
      }
      // var pgeo = new THREE.PlaneBufferGeometry(1, 1, 1);
      // var material = new THREE.MeshPhongMaterial({
      //   color: 0xffffff,
      //   shininess: 0,
      //   specular: 0x222222
      // });
      // var mesh = new THREE.Mesh(pgeo, material);
      // mesh.name = "ariel_plate";
      scene.add(group);
      // scene.add(mesh);
    },
    // called when loading is in progresses
    function(xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    // called when loading has errors
    function(error) {
      console.log("An error happeneda");
    }
  );

  return material_name;
}
