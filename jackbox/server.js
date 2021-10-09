var express = require('express');
var app = express();
var	http = require('http').Server(app);
var	io = require('socket.io')(http);
var fs = require('fs');
var path = require('path');
var ids = [];
ids[0] = 'bababoey123';
var position = 0;
var futureImg = 255;
// need to change for max combatants
var currentRound = 1;
var fighters = [];
for (a = 0; a < 256; a++) {
	fighters.push(a);
};
// input max combatants
var evens = 0
var odds = 1
var left = fighters[evens];
var right = fighters[odds];
var voteTotal = 0;
var roundNum = 1;
var voteData = {
	red: {
		votes: 0,
		percentage: 0
	},
	green: {
		votes: 0,
		percentage: 0
	}
};
var gameState = 0;


// load page

app.use(express.static('public'));

app.get('/', function(req, res){
	res.sendfile('index.html');
});

io.on('connection', function(socket){
	var uid = socket.id;

	console.log('a user connected',uid);

	io.emit('vote results', voteData);

	//feb28 send current round
	io.emit('current round', roundNum);
	io.emit('left fighter', left);
	io.emit('right fighter', right);

	//mar13 fucks
	socket.on('current left', function(data) {
		left = data
	});

	socket.on('current right', function(data) {
		right = data
	});

	// new vote

	socket.on('new vote', function(data) {
			if (ids.includes(uid,0)){
				console.log('Multiple inputs detected by user', uid);
		} else {
				console.log('New vote logged by',uid);
					ids.push(uid);
					voteTotal++;
					voteData[data].votes++;
		}

		for(var key in voteData) {
			voteData[key].percentage = (voteData[key].votes / voteTotal) * 100;
		}

		io.emit('vote results', voteData);
	});

	// reset votes

	socket.on('reset votes', function(data) {
		voteTotal = 0;
		ids=['bababoey123']
		for (key in voteData) {
			for (detail in voteData[key]) {
				voteData[key][detail] = 0;
			}
		}

		io.emit('vote results', voteData);

			});


	//feb28 next round
	//should merge this socket.on call with next vote, they listen for the same thing
	//how this function works
	//listening for the string 'next round' from client.js
	//exectutes function
	//increases roundNum
	//io.emit sends string 'current round' with the updated roundNum

socket.on('borat time', function(){
	io.emit('borat time');
});

socket.on('game start', function(){
	io.emit('game start');
});

socket.on('next round', function(){
	console.log('Round ' + roundNum + ' complete. Starting Round ' + (roundNum + 1));
	futureImg++;

	if (voteData['red'].percentage > voteData['green'].percentage){
		fighters.push(left);
	  console.log(left + " should appear as fighter #" + futureImg);
	}
	else if (voteData['red'].percentage < voteData['green'].percentage) {
		fighters.push(right);
	  console.log(right + " should appear as fighter #" + futureImg);
	}
	else {
		console.log('There was a tie. Randomly assigning a winner');
		g = (Math.floor(Math.random() * 2) == 0);
		if(g){
			fighters.push(left);
		  console.log(left + " should appear as fighter #" + futureImg);
		} else {
			fighters.push(right);
		  console.log(right + " should appear as fighter #" + futureImg);
		}
	};

	voteTotal = 0;
	ids=['bababoey123']
	for (key in voteData) {
		for (detail in voteData[key]) {
			voteData[key][detail] = 0;
		}
	};

	var saveData = roundNum + "," + fighters.toString();

	roundNum++;
	left = fighters[evens];
	right = fighters[odds];
	evens = evens+2;
	odds = odds+2;
	left = fighters[evens];
	right = fighters[odds];
	io.emit('vote results', voteData);
	io.emit('current round', roundNum);
	io.emit('left fighter', left);
	io.emit('right fighter', right);
	io.emit('save data', saveData);
});

socket.on('load data', function(data) {

	var str = data;
	var str1 = str.split(",");
	roundNum = str1[0];

	evens = 2 * roundNum - 2;
	odds = 2 * roundNum - 1;
	left = fighters[evens];
	right = fighters[odds];

	str1.shift();
	fighters = str1;

	io.emit('vote results', voteData);
	io.emit('current round', roundNum);
	io.emit('left fighter', left);
	io.emit('right fighter', right);
})


socket.on('prev round', function(){
	console.log('Rolling back Round ' + roundNum + '. Starting Round ' + (roundNum - 1));
	roundNum--;
	left = fighters[evens];
	right = fighters[odds];
	evens = evens-2;
	odds = odds-2;
	left = fighters[evens];
	right = fighters[odds];
	io.emit('current round', roundNum);
	io.emit('left fighter', left);
	io.emit('right fighter', right);
	io.emit('current round', roundNum);
	console.log('.img(' + fighters[fighters.length-1] + ') will be removed from position #' + fighters.length)
	fighters.pop();
	futureImg--;
	voteTotal = 0;
	ids=['bababoey123']
	for (key in voteData) {
		for (detail in voteData[key]) {
			voteData[key][detail] = 0;
		}
	}

	io.emit('vote results', voteData);

});


	// next vote (CURRENTLY UNUTILIZED)

socket.on('next vote', function(data) {
	currentRound++;
// i is the number of fighters to change
		i = 1
		while (i < 2){
			i++;
			for (j in fighters){
				y = j % 2;
				if (y == 0){
					position++;
					continue;
				}
				if (y == 1){
					position++;
					break;
//					document.getElementById('img2').textContent = j;
				}
			}
		}

io.emit('next vote', voteData);


	});
			})


http.listen(4000, function(){
	console.log('listening on *:4000');
});
