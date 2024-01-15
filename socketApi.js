const io = require('socket.io')();
const socketApi = {
  io: io,
};

// Add your socket.io logic here!
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});
// end of socket.io logic

module.exports = socketApi;

// socketApi.sendNotification = function () {
//   io.sockets.emit('hello', { msg: 'Hello World!' });
// };
