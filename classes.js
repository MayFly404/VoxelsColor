class Floor {
	constructor(x, y, z, w, h, d, v, c, t) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
		this.h = h;
		this.d = d;
    this.v = v;
    this.c = c;
    this.t = t;
	}
	collide(player) {
    if(this.v == 1 || this.v == 2){
      if (
        player.x + player.w / 2 > this.x - this.w / 2 &&
        player.x - player.w / 2 < this.x + this.w / 2
      ) {
        if (
          player.y + player.w / 2 > this.y - this.h / 2 &&
          player.y - player.w / 2 < this.y + this.h / 2
        ) {
          if (
            player.z + player.w / 2 >= this.z - this.d / 2 &&
            player.z - player.w / 2 <= this.z + this.d / 2
          ) {
            if (
              player.z > this.z - this.d &&
              player.z < this.z + this.d &&
              this.v != 3
            ) {
              player.z = this.z + this.d / 2 + 0.5;
              return true;
            }
          }
        }
      }
    }
    return false;
  }
}

class Player {
	constructor(x, y, z, w) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
    this.hp = 100;
    this.bh = 100;
		this.sx = 0;
		this.sy = 0;
		this.sz = 0;
		this.angle = 0;
		this.landed = true;
		this.bullets = [];
    this.ready = true;
    this.score = 0;
	}
	reSpawn() {
		[this.x, this.y, this.z] = [0, 0, 40];
		[this.sx, this.sy, this.sz] = [0, 0, 0];
    this.score --;
    this.hp = this.bh;
    if(this.score < 0){
      this.score ++;
    }
	}
}


class Bullet {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.sx = 0;
		this.sy = 0;
		this.sz = 0;
		this.id = Math.random();
	}
	collide(player) {
		if (player.x + player.w / 2 > this.x && player.x - player.w / 2 < this.x) {
			if (
				player.y + player.w / 2 > this.y &&
				player.y - player.w / 2 < this.y
			) {
				if (
					player.z + player.w / 2 >= this.z &&
					player.z - player.w / 2 <= this.z
				) {
					return true;
				}
			}
		}
		return false;
	}
}

exports.Floor = Floor;
exports.Player = Player;
exports.Bullet = Bullet;
