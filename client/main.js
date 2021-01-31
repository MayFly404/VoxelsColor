const socket = io();

let id;
socket.on('id', i => (id = i));

let color1 = Math.floor(Math.random() * 16777216) + 1
let colorMain = "0x" + color1

setInterval(function() {
    var element = document.getElementById("box");
    //generate random red, green and blue intensity
    var r = getRandomInt(0, 255);
    var g = getRandomInt(0, 255);
    var b = getRandomInt(0, 255);
    
    element.style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";
    document.getElementById("colorvalue").innerHTML = r + " " + g + " " + b;
}, 1500);

let Element1 = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6)

let [x, y, z] = [0, 0, 0];
const me = new Player(0, 0, 0, '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6));

let oof = new Audio("oof.mp3");

const players = {};
const bullets = {};

const floors = [];

socket.on('floors', data => {
	for (const f of data) {
		floors.push(new Floor(f.x, f.y, f.z, f.w, f.h, f.d, f.v, f.c, f.t));
	}
});


socket.on('players', data => {
	let notUpdated = [];
	for (let i in players) notUpdated.push(i);

	let notUpdatedBullets = [];
	for (let i in bullets) notUpdatedBullets.push(i);

	for (const p of data) {
		if (p.id == id) {
			({ x, y, z } = p);
			camera.position.set(
				x - Math.sin(angle.z) * Math.sin(angle.x) * distance,
				y - Math.cos(angle.z) * Math.sin(angle.x) * distance,
				z + Math.cos(angle.x) * distance
			);
			me.mesh.position.set(x, y, z);
			me.updateHealth(p.hp, p.bh, p.score, x, y, z);
		} else if (!players[p.id]) {
			players[p.id] = new Player(p.x, p.y, p.z, Element1);
			players[p.id].mesh.rotation.z = -p.angle;
			players[p.id].updateHealth(p.hp, p.bh, p.score, p.x, p.y, p.z);
		} else {
			players[p.id].mesh.position.set(p.x, p.y, p.z);
			players[p.id].mesh.rotation.z = -p.angle;
			notUpdated.splice(notUpdated.indexOf(p.id), 1);
			players[p.id].updateHealth(p.hp, p.bh, p.score, p.x, p.y, p.z);
		}

		for (const b of p.bullets) {
			if (!bullets[b.id]) {
				bullets[b.id] = new Bullet(b.x, b.y, b.z);
			} else {
				bullets[b.id].mesh.position.set(b.x, b.y, b.z);
				notUpdatedBullets.splice(notUpdatedBullets.indexOf(b.id), 1);
			}
		}
	}

	for (const i of notUpdatedBullets) {
		bullets[i].mesh.name = 'tmp';
		scene.remove(scene.getObjectByName('tmp'));
		delete bullets[i];
	}

	for (const i of notUpdated) {
		players[i].mesh.name = 'tmp';
		scene.remove(scene.getObjectByName('tmp'));
		players[i].healthbar.name = 'tmp';
		scene.remove(scene.getObjectByName('tmp'));
		delete players[i];
	}
});

function animate() {
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}
animate();