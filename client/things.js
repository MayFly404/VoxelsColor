const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);

const canvas = document.getElementById('gc');
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setClearColor(0x3F5773);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const distance = 6;
camera.position.set(0, -7, 0);
camera.rotation.x = Math.PI / 2;

var light = new THREE.AmbientLight(0xefdfdf);
scene.add(light);
const shadowLight = new THREE.PointLight(0xffffff, 1, 0, 1);
shadowLight.position.set(175, 175, 87.5);
scene.add(shadowLight);
shadowLight.castShadow = true;
shadowLight.shadow.mapSize.width = 1024;
shadowLight.shadow.mapSize.height = 1024;

let randPlayer = Math.floor(Math.random() * 4) + 1;


class Player {
	constructor(x, y, z, color) {
     this.mesh = new THREE.Mesh(
			  new THREE.BoxGeometry(1,1,1),
			  new THREE.MeshLambertMaterial({ color: color })
		  );
		this.mesh.castShadow = true;
		this.mesh.position.set(x, y, z);
		scene.add(this.mesh);
    
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    this.texture = new THREE.Texture(canvas);
    this.healthbar = new THREE.Sprite(
      new THREE.SpriteMaterial({map: this.texture})
    );
    this.healthbar.position.set(x, y, z + 1.5);
    scene.add(this.healthbar);
    this.ctx = canvas.getContext('2d');
    this.ctx.textAlign = "center";
  }
  updateHealth(hp, bh, score, x, y, z) {
    this.healthbar.position.set(x, y, z + 1.5);
    this.texture.needsUpdate = true;
    this.ctx.clearRect(0, 0, 100, 100);
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 69, 100, 30);
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(0, 69, Math.floor(hp) / bh * 100, 30);
    this.ctx.fillStyle = "black";
    this.ctx.font = "20px Arial";
    this.ctx.fillText(Math.floor(hp) + " / " + bh, 50, 95);
    this.ctx.font = "69px Arial";
    this.ctx.fillText(score, 50, 50)
  }
}

class Floor {
	constructor(x, y, z, w, h, d, v, c, t) {
    var floorValue = v;
    /*
    Floor Value 1 = Grass   input color and top color
    Floor Value 2 = Normal  input color
    Floor Value 3 = Liquid  input color and xyz
     not made yet   Floor Value 4 = Sphere  input radius xyz and color
    */
    if(floorValue == 1){
      this.mesh = new THREE.Mesh(
			new THREE.BoxGeometry(w, h, d - 2),
			new THREE.MeshLambertMaterial({color: c})
		  );
		  this.mesh.castShadow = true;
		  this.mesh.receiveShadow = true;
		  this.mesh.position.set(x, y, z);
		  scene.add(this.mesh);
      this.top = new THREE.Mesh(
        new THREE.BoxGeometry(w, h),
        new THREE.MeshLambertMaterial({color: t})
      );
      this.top.castShadow = true;
      this.top.receiveShadow = true;
      this.top.position.set(x, y, z + d / 2 - 0.5)
      scene.add(this.top)
    }

    if(floorValue == 2){
  		this.mesh = new THREE.Mesh(
	  		new THREE.BoxGeometry(w, h, d),
		  	new THREE.MeshLambertMaterial({color: c})
		  );
  		this.mesh.castShadow = true;
	  	this.mesh.receiveShadow = true;
		  this.mesh.position.set(x, y, z);
		  scene.add(this.mesh);
    }

    if(floorValue === 3){
      this.liquid = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        new THREE.MeshLambertMaterial({
          color: c,
          opacity: t,
          transparent: true
        })
      );
      this.liquid.castShadow = false;
      this.liquid.receiveShadow = true;
      this.liquid.position.set(x, y, z);
      scene.add(this.liquid);
      var lavaHeight = z
      var lavaUp = setInterval(function(){
        lavaHeight++;
        this.liquid.position.set(x, y, z + lavaHeight);
      }, 100)
    }

	}
}



class Bullet {
  constructor(x, y, z) {
    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 20, 20),
      new THREE.MeshLambertMaterial({color: 0xffaaaa})
    );
		this.mesh.position.set(x, y, z);
		scene.add(this.mesh);
  }
}