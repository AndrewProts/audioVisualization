$('.menu .song').click(function () {
	$('.song').removeClass('active');
	$(this).addClass('active');
	audioSRC = $(this).attr('data-src');
	play();
});
setTimeout(function () {
	$('.help').addClass('hide');
},10000);
window.onload = function () {
	play()
}
var play = true;
var audioSRC = './songs/audio.mp3';
var play = function() {
audio.src = audioSRC;
audio.load();
audio.play();
var context = new AudioContext();
var src = context.createMediaElementSource(audio);
var analyser = context.createAnalyser();

var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");

src.connect(analyser);
analyser.connect(context.destination);

analyser.fftSize = 1024;

var bufferLength = analyser.frequencyBinCount;

var dataArray = new Uint8Array(bufferLength);

var WIDTH = canvas.width;
var HEIGHT = canvas.height;

var barWidth = (WIDTH / bufferLength) * 2.5;
var barHeight;
var bitCircles = [];
var x = 0;
var particles = [];

function renderFrame() {
  requestAnimationFrame(renderFrame);
	ctx.clearRect(0,0,WIDTH,HEIGHT);
  x = 0;
	var angle = 0;

  analyser.getByteFrequencyData(dataArray);
  ctx.fillStyle = "#2B2D42";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
	ctx.fillStyle = 'rgba(239,35,60,0.2';
	ctx.shadowColor = '#70C1B3';
	ctx.shadowBlur = 10;
	ctx.fillStyle = "#247BA0";
	ctx.strokeStyle = "#247BA0";
	ctx.shadowColor = '#247BA0';
	ctx.lineWidth = 10;
	ctx.lineCap="round";
	ctx.beginPath();
	ctx.moveTo(WIDTH/2,(HEIGHT/2-90-dataArray[10]/2));
  for (var i = 10; i < 100; i++) {
		var cor = findDot(WIDTH/2,HEIGHT/2,WIDTH/2,(HEIGHT/2-90-dataArray[i]/2),angle);
		ctx.lineTo(cor.x,cor.y);
		angle+=4;
  }
  ctx.shadowBlur = 0;
  for(var i in particles){
  	ctx.fillStyle = 'rgba(36,123,160,'+particles[i].o+')';
  	ctx.fillRect(particles[i].x,particles[i].y,10,10);
  	particles[i].x+=particles[i].vx;
  	particles[i].y+=particles[i].vy;
  	particles[i].vx*=1.1;
  	particles[i].o-=0.08;
  	if(particles[i].x>WIDTH||particles[i].x<0||particles[i].y>HEIGHT||particles[i].y<0||particles[i].o<0){
  		particles.splice(i,1)
  	}
  }
  ctx.fillStyle = "#247BA0";
  ctx.shadowBlur = 10;
  ctx.lineTo(WIDTH/2,(HEIGHT/2-90-dataArray[10]/2));
  ctx.stroke();
  ctx.moveTo(WIDTH/2,(HEIGHT/2-100-dataArray[10]/2));
  for (var i = 10; i < 100; i++) {
		var cor = findDot(WIDTH/2,HEIGHT/2,WIDTH/2,(HEIGHT/2-100-dataArray[i]/2),angle);
		ctx.lineTo(cor.x,cor.y);
		angle+=4;
		if(dataArray[i]>160){
			particles.push({
				x:cor.x,
				y:cor.y,
				vx:(cor.x-WIDTH/2)*(dataArray[i]/1500),
				vy:(cor.y-HEIGHT/2)*(dataArray[i]/1500),
				o:1
			});
		}
  }
  ctx.lineTo(WIDTH/2,(HEIGHT/2-100-dataArray[10]/2));
  ctx.stroke();
}
audio.play();
renderFrame();
};
function findDot(x1,y1,x2,y2,f){
	f = f * (Math.PI/180);
	var xn = x1+(x2-x1)*Math.cos(f)-(y2-y1)*Math.sin(f)
	var yn = y1+(x2-x1)*Math.sin(f)+(y2-y1)*Math.cos(f)
	return {x:xn,y:yn}
}
