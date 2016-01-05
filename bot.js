var PARTICLE_TOKEN = '7ae40abd0f7c272888ca95b6740667febd1a29c8';
// var PARTICLE_DEVICE_ID = 'jester_boomer';
var PARTICLE_DEVICE_ID = 'dog_biker';
var MAX_SPEED = 255;

var five = require("johnny-five");
var Particle = require("particle-io");
var koa = require('koa');

var app = koa();

var board = new five.Board({
  io: new Particle({
    token: PARTICLE_TOKEN,
    deviceName: PARTICLE_DEVICE_ID
  })
});

board.on("ready", function() {
  console.log('ready');

  var servo = new five.Servo({
    pin: "D2",
    startAt: 90
  });

  var rightWheel = new five.Motor({
    //pins: { pwm: "D1", dir: "D4" },
    pins: { pwm: "D0", dir: "D4" },
    invertPWM: true
  });

  var leftWheel = new five.Motor({
    //pins: { pwm: "D2", dir: "D5" },
    pins: { pwm: "D1", dir: "D5" },
    invertPWM: true
  });

  function reverse() {
    leftWheel.rev(MAX_SPEED);
    rightWheel.rev(MAX_SPEED);
  }

  function forward() {
    leftWheel.fwd(MAX_SPEED);
    rightWheel.fwd(MAX_SPEED);
  }

  function stop() {
    leftWheel.stop();
    rightWheel.stop();
    servo.stop();
  }

  function left() {
    leftWheel.rev(MAX_SPEED);
    rightWheel.fwd(MAX_SPEED);
  }

  function right() {
    leftWheel.fwd(MAX_SPEED);
    rightWheel.rev(MAX_SPEED);
  }

  function reverse_slow() {
    leftWheel.rev(MAX_SPEED / 2);
    rightWheel.rev(MAX_SPEED / 2);
  }

  function forward_slow() {
    leftWheel.fwd(MAX_SPEED / 2);
    rightWheel.fwd(MAX_SPEED / 2);
  }

  function left_slow() {
    leftWheel.rev(MAX_SPEED / 2);
    rightWheel.fwd(MAX_SPEED / 2);
  }

  function right_slow() {
    leftWheel.fwd(MAX_SPEED / 2);
    rightWheel.rev(MAX_SPEED / 2);
  }

  function exit() {
    leftWheel.rev(0);
    rightWheel.rev(0);
    setTimeout(process.exit, 1000);
  }

  function armUp() {
    servo.to(180, 1000);
  }

  function armDown() {
    servo.home();
  }

  var keyMap = {
    'up': forward,
    'down': reverse,
    'left': left,
    'right': right,
    'space': stop,
    'u' : armUp,
    'd' : armDown,
    'q': exit,

    'w': forward_slow,
    's': reverse_slow,
    'a': left_slow,
    'd': right_slow
  };

  app.use(require('koa-static')('static', { defer: true }));

  app.use(function *(next){
    direction = this.request.query;
    if(this.request.path === '/x' && direction && direction.u) {
      var l = parseInt(direction.u);
      var r = parseInt(direction.u);
      l -= parseInt(direction.l);
      r -= parseInt(direction.r);

      if(l > 0) {
        leftWheel.fwd(l);
      } else {
        leftWheel.rev(Math.abs(l));
      }

      if(r > 0) {
        rightWheel.fwd(r);
      } else {
        rightWheel.rev(Math.abs(r));
      }

      console.log(l, r);
    }

    yield next;
  });

  app.use(function *(next){
    if(this.request.path === '/arm') {
      var dir = this.request.query.dir;
      console.log('arm ' + dir);

      if(dir === 'u') {
        armUp();
      } else {
        armDown();
      }
    }
    yield next;
  });


  app.listen(3000);


  var stdin = process.stdin;
  stdin.setRawMode(true);
  stdin.resume();

  stdin.on("keypress", function(chunk, key) {
    console.log('key: ' + key.name);
      if (!key || !keyMap[key.name]) return;      

      keyMap[key.name]();
  });
});