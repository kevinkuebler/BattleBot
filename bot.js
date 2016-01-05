var five = require("johnny-five");
var Particle = require("particle-io");

var board = new five.Board({
  io: new Particle({
    token: '7ae40abd0f7c272888ca95b6740667febd1a29c8',
    deviceName: 'dog_biker'
  })
});

board.on("ready", function() {

  (new five.Led("D7")).strobe();

});