let light;
let box;

function setup() {
	createCanvas(400, 400);
	light = new Light(width/2, 40, 240, PI/4);
	box = new Box(width/2, height/2, 64, 64);
}

function draw() {
	background(64);
	light.draw();
	box.draw();
}

class Light {

	constructor(x, y, r, a){
		this.pos = createVector(x, y);
		this.r = r;
		this.a = a;
	}

	draw(){

		let angles = [];

		let start =  PI/2 - this.a;
		let end = PI/2 + this.a;

		angles.push(start);
		angles.push(end);

		let n = 128;
		let d = 2*this.a/n;
		for(let i = 1; i < n; i++){
			let angle = PI/2-this.a + i * d;
			angles.push(angle);
		}

		let corners = box.corners;

		for(let i = 0; i < corners.length; i++){
			let corner = corners[i];
			let a = atan2(corner.y-this.pos.y, corner.x-this.pos.x);
			if(start < a && a < end){
				angles.push(a)
			}
		}

		angles.sort();
		
		noStroke();
		fill(255, 255, 153);
		beginShape();
		vertex(this.pos.x, this.pos.y);
		for(let i = 0; i < angles.length; i++){
			let angle = angles[i];
			let p = createVector(this.pos.x+this.r*cos(angle), this.pos.y+this.r*sin(angle))
			let intersect = box.intersect(this.pos, p);
			if(intersect){
				p = intersect
			}
			vertex(p.x, p.y);
		}
		endShape(CLOSE);

	}

}

class Box{
	constructor(x, y , w, h){
		this.pos = createVector(x, y)
		this.w = w;
		this.h = h;

		this.update();
	}

	draw(){
		this.pos.x = mouseX;
		this.pos.y = mouseY;
		this.update();
		fill(100);
		rectMode(CENTER);
		rect(this.pos.x, this.pos.y, this.w, this.h);
	}

	update() {
		this.corners = [
			createVector(this.pos.x-this.w/2, this.pos.y-this.h/2), // top left
			createVector(this.pos.x+this.w/2, this.pos.y-this.h/2), // top right
			createVector(this.pos.x+this.w/2, this.pos.y+this.h/2), // bottom right
			createVector(this.pos.x-this.w/2, this.pos.y+this.h/2) // bottom left
		];

		let l = this.corners.length;
		this. segments = [];
		for(let i = 0; i < l-1; i++){
			this.segments.push([this.corners[i], this.corners[i+1]]);
		}
		this.segments.push([this.corners[l-1], this.corners[0]]);
	}

	intersect(a, b) {

		let closest = null;
		let p = null;

		for(let i = 0; i < this.segments.length; i++){
			let c = this.segments[i][0];
			let d = this.segments[i][1];

			let abx = b.x - a.x;
			let aby = b.y - a.y;
			let cdx = d.x - c.x;
			let cdy = d.y - c.y;

			let acx = c.x - a.x;
			let acy = c.y - a.y;

			let e = abx * cdy - aby * cdx;

			if(e == 0.0) {
				continue;
			}

			let f = (cdy*acx - cdx*acy)/e;
			let g = (aby*acx - abx*acy)/e;

			if(f<0 || 1<f || g<-0.00001 || 1.00001<g){
				continue;
			}

			if(closest == null || f < closest){
				closest = f;
				let x = a.x+f*abx;
				let y = a.y+f*aby;
				p = createVector(x, y)
			}

		}

		return p;
	}
}