var five = require("johnny-five");
var Particle = require("particle-io");

var board = new five.Board({
  io: new Particle({
    token: '7ae40abd0f7c272888ca95b6740667febd1a29c8',
    deviceName: 'dog_biker'
  })
});

board.on("ready", function() {

  console.log('ready');

  var servo1 = new five.Servo({
    pin: "D2",
	center: true,
	type: "continuous",
	debug: false
  });

  var servo2 = new five.Servo({
	pin: "D3",
	center: true,
	
	debug: false
  });

  var rightWheel = new five.Motor({
    pins: { pwm: "D0", dir: "D4" },
    invertPWM: true
  });

  var leftWheel = new five.Motor({
    pins: { pwm: "D1", dir: "D5" },
    invertPWM: true
  });

  var speed = 255;

  function reverse() {
    leftWheel.rev(speed);
    rightWheel.rev(speed);
  }

  function forward() {
    leftWheel.fwd(speed);
    rightWheel.fwd(speed);
  }

  function stop() {
    leftWheel.stop();
    rightWheel.stop();
  }

  function left() {
    leftWheel.rev(speed);
    rightWheel.fwd(speed);
  }

  function right() {
    leftWheel.fwd(speed);
    rightWheel.rev(speed);
  }

  function testServo() {
  	servo1.sweep({ range: [45,135], interval: 5000 });
  	servo2.sweep({ range: [45,135], interval: 5000 });
  }

  function exit() {
    leftWheel.rev(0);
    rightWheel.rev(0);
    servo1.stop();
    servo2.stop();
    setTimeout(process.exit, 1000);
  }

  var keyMap = {
    'up': forward,
    'down': reverse,
    'left': left,
    'right': right,
    'space': stop,
    'x' : testServo,
    'q': exit
  };

  var stdin = process.stdin;
  stdin.setRawMode(true);
  stdin.resume();

  stdin.on("keypress", function(chunk, key) {
      if (!key || !keyMap[key.name]) return;      
      console.log(key.name);
      keyMap[key.name]();
  });

});