/*
MIT License

Copyright (c) 2016 Vincent Bazia

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*Modified*

*/

class flappyBird{
	constructor(){
		this.sprites = {
			bird: document.getElementById("flapBird"),
			background: document.getElementById("flapBackground"),
			pipetop: document.getElementById("flapPipeTop"),
			pipebottom: document.getElementById("flapPipeBottom")
		}

		this.game;
		this.start();
	}

	start(){
		this.game = new Game();
		this.game.start();
		this.game.update();
		this.game.display();
	}
}

var game;
var FPS = 180;
var maxScore=0;

var images = {
	bird: document.getElementById("flapBird"),
	background: document.getElementById("flapBackground"),
	pipetop: document.getElementById("flapPipeTop"),
	pipebottom: document.getElementById("flapPipeBottom")
};

var speed = function(fps){
	FPS = parseInt(fps);
}

var Bird = function(json){
	this.x = 80;
	this.y = 250;
	this.width = 40;
	this.height = 30;

	this.alive = true;
	this.gravity = 0;
	this.velocity = 0.3;
	this.jump = -6;

	this.init(json);
}

Bird.prototype.init = function(json){
	for(var i in json){
		this[i] = json[i];
	}
}

Bird.prototype.flap = function(){
	this.gravity = this.jump;
}

Bird.prototype.update = function(){
	this.gravity += this.velocity;
	this.y += this.gravity;
}

Bird.prototype.isDead = function(height, pipes){
	if(this.y >= height || this.y + this.height <= 0){
		return true;
	}
	for(var i in pipes){
		if(!(
			this.x > pipes[i].x + pipes[i].width ||
			this.x + this.width < pipes[i].x || 
			this.y > pipes[i].y + pipes[i].height ||
			this.y + this.height < pipes[i].y
			)){
			return true;
		}
	}
}

var Pipe = function(json){
	this.x = 0;
	this.y = 0;
	this.width = 50;
	this.height = 40;
	this.speed = 3;

	this.init(json);
}

Pipe.prototype.init = function(json){
	for(var i in json){
		this[i] = json[i];
	}
}

Pipe.prototype.update = function(){
	this.x -= this.speed;
}

Pipe.prototype.isOut = function(){
	if(this.x + this.width < 0){
		return true;
	}
}

var Game = function(){
	this.pipes = [];
	this.birds = [];
	this.score = 0;
	this.container = $(".interstitial-wrapper");
	$(".interstitial-wrapper").html('<canvas id="myCanvas" width="600" height="500"></canvas>');
	this.canvas = document.getElementById("myCanvas");
	this.ctx = this.canvas.getContext("2d");
	this.width = this.canvas.width;
	this.height = this.canvas.height;
	this.spawnInterval = 90;
	this.interval = 0;
	this.gen = [];
	this.alives = 0;
	this.generation = 0;
	this.backgroundSpeed = 0.5;
	this.backgroundx = 0;
	this.maxScore = 0;
	this.run = false;
}

Game.prototype.start = function(){
	this.interval = 0;
	this.score = 0;
	this.pipes = [];
	this.birds = [];

	/*this.gen = Neuvol.nextGeneration();
	for(var i in this.gen){
		var b = new Bird();*/
		this.birds.push(new Bird())
	/*}
	this.generation++;*/
	this.alives = this.birds.length;
}

Game.prototype.update = function(){
	if (this.run == true) {
		this.backgroundx += this.backgroundSpeed;
		var nextHoll = 0;
		if(this.birds.length > 0){
			for(var i = 0; i < this.pipes.length; i+=2){
				if(this.pipes[i].x + this.pipes[i].width > this.birds[0].x){
					nextHoll = this.pipes[i].height/this.height;
					break;
				}
			}
		}


		for(var i in this.birds){
			if(this.birds[i].alive){

				var inputs = [
				this.birds[i].y / this.height,
				nextHoll
				];

				//var res = this.gen[i].compute(inputs);
				/*if(res > 0.5){
					this.birds[i].flap();
				}*/
				//this.birds[0].flap()

				this.birds[i].update();
				if(this.birds[i].isDead(this.height, this.pipes)){
					this.birds[i].alive = false;
					this.alives--;
					//console.log(this.alives);
					//Neuvol.networkScore(this.gen[i], this.score);
					if(this.isItEnd()){
						//this.start();
					}
				}
			}
		}

		for(var i = 0; i < this.pipes.length; i++){
			this.pipes[i].update();
			if(this.pipes[i].isOut()){
				this.pipes.splice(i, 1);
				i--;
			}
		}

		if(this.interval == 0){
			var deltaBord = 50;
			var pipeHoll = 120;
			var hollPosition = Math.round(Math.random() * (this.height - deltaBord * 2 - pipeHoll)) +  deltaBord;
			this.pipes.push(new Pipe({x:this.width, y:0, height:hollPosition}));
			this.pipes.push(new Pipe({x:this.width, y:hollPosition+pipeHoll, height:this.height}));
		}

		this.interval++;
		if(this.interval == this.spawnInterval){
			this.interval = 0;
		}

		this.score++;
		this.maxScore = (this.score > this.maxScore) ? this.score : this.maxScore;
		
	}

	var self = this;
	if(FPS == 0){
		setZeroTimeout(function(){
			self.update();
		});
	}else{
		setTimeout(function(){
			self.update();
		}, 1000/FPS);
	}
}


Game.prototype.isItEnd = function(){
	for(var i in this.birds){
		if(this.birds[i].alive){
			return false;
		}
	}
	return true;
}

Game.prototype.display = function(){
	this.ctx.clearRect(0, 0, this.width, this.height);
	for(var i = 0; i < Math.ceil(this.width / images.background.width) + 1; i++){
		this.ctx.drawImage(images.background, i * images.background.width - Math.floor(this.backgroundx%images.background.width), 0)
	}

	for(var i in this.pipes){
		if(i%2 == 0){
			this.ctx.drawImage(images.pipetop, this.pipes[i].x, this.pipes[i].y + this.pipes[i].height - images.pipetop.height, this.pipes[i].width, images.pipetop.height);
		}else{
			this.ctx.drawImage(images.pipebottom, this.pipes[i].x, this.pipes[i].y, this.pipes[i].width, images.pipetop.height);
		}
	}

	this.ctx.fillStyle = "#FFC600";
	this.ctx.strokeStyle = "#CE9E00";
	for(var i in this.birds){
		if(this.birds[i].alive){
			this.ctx.save(); 
			this.ctx.translate(this.birds[i].x + this.birds[i].width/2, this.birds[i].y + this.birds[i].height/2);
			this.ctx.rotate(Math.PI/2 * this.birds[i].gravity/20);
			this.ctx.drawImage(images.bird, -this.birds[i].width/2, -this.birds[i].height/2, this.birds[i].width, this.birds[i].height);
			this.ctx.restore();
		}
	}

	this.ctx.fillStyle = "white";
	this.ctx.font="20px Oswald, sans-serif";
	this.ctx.fillText("Score : "+ this.score, 10, 25);
	this.ctx.fillText("Max Score : "+this.maxScore, 10, 50);
	//this.ctx.fillText("Alive : "+this.alives+" / "+Neuvol.options.population, 10, 100);

	var self = this;
	requestAnimationFrame(function(){
		self.display();
	});
}