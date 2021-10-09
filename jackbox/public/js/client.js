var socket = io();
var roundNum = 0;
var load = document.getElementById('load');
var input = document.getElementById('input');

$(load).click(function(data) {
  socket.emit('load data', input.value);
  });

load.addEventListener('submit', function(e) {
  e.preventDefault();
  console.log(input.value);
  if (input.value) {

    input.value = '';
  }
});

document.addEventListener("keypress", function(event) {
    event.preventDefault();
    if (event.keyCode == 65) {
      console.log("Toggling Admin Controls...");
      $("#wrapper").toggleClass("hidden");
    }
});

document.addEventListener("keypress", function(event) {
    event.preventDefault();
    if (event.keyCode == 66) {
      console.log("BORAT TIME");
      socket.emit('borat time');
      console.log('sent');
      }
});

document.addEventListener("keypress", function(event) {
    event.preventDefault();
    if (event.keyCode == 67) {
      console.log("game start");
      socket.emit('game start');
      }
});

var redColumn = $(".column.red"),
    greenColumn = $(".column.green");
    total = $(".total span");
    round = $(".round span");
    seed = $(".seed span");
//feb22 round span

var recursiveCheck = function(voteColor) {
    setTimeout(function() {
        if(animationTime[voteColor] <= 0) $reference[voteColor].removeClass("active");
        else recursiveCheck(voteColor);
    }, 500);
}

var recalculateWidth = function() {
    $(".column").each(function() {
        var columnEl = $(this).find("i");
        columnEl.css("width", "auto");

//feb28 vvvv this might be useful for img replace vvvv
        if($(this).width() < columnEl.width() + 20) $(this).find("a").addClass("no-space");
        else $(this).find("a").removeClass("no-space");

        columnEl.css("width","100%");
    });
}

var newVote = function(data) {
    redColumn.css("width", data.red.percentage + "%");
    redColumn.find("span").text(Math.round(data.red.percentage) + "%");

    greenColumn.css("width", data.green.percentage + "%");
    greenColumn.find("span").text(Math.round(data.green.percentage) + "%");

    total.text(data.red.votes + data.green.votes);

    recalculateWidth();
}

//mar18 why the fuck was this so easy

function changeImageL(imgName) {
  image = document.getElementById('imgDispL');
  image.src = imgName;
}

function changeImageR(imgName) {
  image = document.getElementById('imgDispR');
  image.src = imgName;
}

window.addEventListener('load', function() {
    new FastClick(document.body);
}, false);

$("#admin .graph").click(function(e) {
    e.preventDefault();

    $("#wrapper").toggleClass("hidden");
});

$("#admin .reset").click(function(e) {
    e.preventDefault();

    socket.emit("reset votes", true);
});

// feb28
// pretty sure (data) is not needed in this function, not sending any params

$("#admin .next").click(function(data) {
  socket.emit('next round');
  socket.emit('next vote');
  $("#wrapper").toggleClass("hidden");
  });

// mar6
$("#admin .back").click(function(data) {
  socket.emit('prev round');
  $("#wrapper").toggleClass("hidden");
  });


//mar13 what the fuck is this for??? probably nothing
$("#admin .next").click(function(e) {
    e.preventDefault();

});


var animationTime = {
    "red" : 0,
    "green" : 0,
};

var $reference = {};
$(".column a").click(function(e) {
    e.preventDefault();

    var voteColor = $(this).parent().attr("data-color");
    animationTime[voteColor] += 500;
    $reference[voteColor] = $(this);

    setTimeout(function(){
        animationTime[voteColor] -= 500;
    }, 500);

    if(!$reference[voteColor].hasClass("active")) {
        $reference[voteColor].addClass("active");
        recursiveCheck(voteColor);
    }
    socket.emit("new vote", voteColor);
    console.log(voteColor);
});

//mar6 we fuckin did it
//mar18 no we fuckin didn't lol (50000ms load time with all 510 images)
//mar18 sike i fixed it fuck you big chungus

socket.on('current round', function(value)
{
  roundNum = (value);
  round.text(roundNum);

  if (roundNum > 0 && roundNum < 129) {
    seed.text('round one');
    $(".seed").css('color',"#FFFFFF");
  }
  if (roundNum > 129 && roundNum < 192) {
    seed.text('round two');
    $(".seed").css('color',"lightblue");
  }
  if (roundNum > 192 && roundNum < 224) {
    seed.text('round three');
    $(".seed").css('color',"lightgreen");
  }
  if (roundNum > 224 && roundNum < 240) {
    seed.text('round four');
    $(".seed").css('color',"yellow");
  }
  if (roundNum > 240 && roundNum < 248) {
    seed.text('eighth finals');
    $(".seed").css('color',"orange");
  }
  if (roundNum > 248 && roundNum < 252) {
    seed.text('quarter finals');
    $(".seed").css('color',"#FFA500");
  }
  if (roundNum > 252 && roundNum < 254) {
    seed.text('semi finals');
    $(".seed").css('color',"#E0F4C0");
  }
  if (roundNum == 255) {
    seed.text('finals');
    $(".seed").css('color',"black");
  }
  if (roundNum == 256) {
    seed.text('winner JACKBOX 1 YEAR');
    $(".seed").css('color',"white");
  }

  console.log('Current Round ' + roundNum);

  //show lightbox at roundNum == 1?
});

socket.on('left fighter', function(value) {
  left = (value);
  var imgName = "images/img (" + left + ").png";
  changeImageL(imgName);

  //needed?
  socket.emit('current left', left);

});


socket.on('right fighter', function(value) {
  right = (value);
  var imgName = "images/img (" + right + ").png";
  changeImageR(imgName);

  //needed?
  socket.emit('current right', right);

});

socket.on('borat time', function() {
  console.log('recieved');
  if (document.getElementById('lightbox').style.display == 'block'){
    document.getElementById('lightbox').style.display = 'none';
  } else {
    document.getElementById('lightbox').style.display = 'block';
  }
});

socket.on('game start', function() {
  console.log('game start');
  if (document.getElementById('lightbox2').style.display == 'block'){
    document.getElementById('lightbox2').style.display = 'none';
  } else {
    document.getElementById('lightbox2').style.display = 'block';
  }
});

socket.on('save data', function(value) {
  console.log(value);
})

socket.on('vote results', function(data) {
      newVote(data);

});
