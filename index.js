const express = require('express');
const app = express();
const serv = require('http').Server(app);

app.use('/', express.static(__dirname + '/client/'));

serv.listen(2000);
console.log('Server started.');

const io = require('socket.io')(serv);

const fs = require('fs');

const map = JSON.parse(fs.readFileSync("map2.json"));


const { Floor, Player, Bullet} = require('./classes.js');

const players = {};

const floors = [];


for (const f of map.data) floors.push(new Floor(f[0], f[1], f[2], f[3], f[4], f[5], f[6], f[7], f[8]))

var bulletTime = 200;
var bulletDamage = 20;
var upgrades = 0;


io.on('connection', socket => {
	const id = socket.id;
	players[id] = new Player(0, 0, 41, 1);
	const p = players[id];
	socket.emit('id', socket.id);
	socket.emit('floors', floors);
	socket.on('move', data => {
    var speed = data.speed;
    var upgrades = data.upgrade;

		const x = Math.sin(data.angle) * speed;
		const y = Math.cos(data.angle) * speed;
		if (p.landed && data.jump) {
			p.sz += 0.85;
			p.landed = false;
		}

		p.sx = x;
		p.sy = y;
	});

	socket.on('angle', a => {
		p.angle = a;
	});

	socket.on('shoot', a => {
    if (!p.ready) return;
		const b = new Bullet(p.x, p.y, p.z);
		p.bullets.push(b);

		b.sx = Math.sin(a) * 1;
		b.sy = Math.cos(a) * 1;
		b.sz = Math.sin(a) * 1;
    p.ready = false;
    
    setTimeout(() => p.ready = true, bulletTime);
 
	});

	socket.on('disconnect', () => {
		delete players[id];
	});
});


function update() {
	for (const i in players) {
		const p = players[i];

		p.x += p.sx;
		p.y += p.sy;
		p.z += p.sz;

    if(p.hp > p.bh){
      p.hp = p.bh;
    }
    if(p.hp < p.bh){
      p.hp += 0.05;
    }
    if (p.score >= 2){
      p.upgrades = 1;
    }
    if(this.upgrades == 1){
      bulletDamage == 40;
    }

		if (p.z < 0) {
		  p.reSpawn();
		}
		let landed = false;
		for (const f of floors) {
			if (f.collide(p)) {
				landed = true;
				break;
			}
		}
		p.landed = landed;
		if (!p.landed) p.sz -= 0.05;
		else p.sz = 0;

		for (const i in p.bullets) {
			const b = p.bullets[i];
			b.x += b.sx;
			b.y += b.sy;

			if (b.x < -1000 || b.x > 1000 || b.y < -1000 || b.y > 1000)
				p.bullets.splice(i, 1);
      
      for (const i in players) {
        const target = players[i];
        if(p != target && b.collide(target)) {
          target.hp -= bulletDamage;
          p.bullets.splice(p.bullets.indexOf(b), 1);
          
          if(target.hp <= 0) {
            target.reSpawn();
            p.score++;
            p.hp += 15;
          }
          break;
        }
      }
		}
	}
}


function send(){
  const pack = [];
	for (const i in players) {
		const p = players[i];
		const bullets = [];
		for (const b of p.bullets) bullets.push({ x: b.x, y: b.y, z: b.z, id: b.id });

		pack.push({
			x: p.x,
			y: p.y,
			z: p.z,
			id: i,
      hp: p.hp,
      bh: p.bh,
      up: p.up,
			angle: p.angle,
			bullets: bullets,
			score: p.score
		});
	}

	io.emit('players', pack);
}

setInterval(() => {
	update();
	send();
}, 1000 / 60); 