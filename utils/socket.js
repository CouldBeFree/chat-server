const Message = require('../models/Message');
const chalk = require('chalk');

module.exports = function (io) {
  const sessionsMap = [];

  io.on("connection", async function (socket) {
    console.log(chalk.green(`socket connected ${socket.id}`))

    socket.on('user', async (user) => {
      io.emit('userOnline', user)
      const isUserExists = sessionsMap.filter(item => item.name === user.name).length
      if (user && !isUserExists) {
        sessionsMap.push({
          socketId: socket.id,
          name: user.name,
          userId: user._id
        })
        io.emit('onlineUsers', sessionsMap)
        sessionsMap.forEach(el => {
          console.log(chalk.green(`name ${el.name} id ${el.socketId}`))
        })
        console.log(chalk.green(`length ${sessionsMap.length}`))
      }
    })

    socket.on('message', msg => {
      const targetSocket = sessionsMap.find(socket => socket.name === msg.to)
      const fromSocket = sessionsMap.find(ses => ses.socketId === socket.id)
      if (targetSocket && targetSocket.socketId && fromSocket) {
        io.to(targetSocket.socketId).emit('messageResponse', {
          message: msg.message,
          from: fromSocket.name,
          to: msg.to,
          time: msg.time
        });
      }
      if (fromSocket) {
        Message.create({
          message: msg.message,
          from: fromSocket.name,
          to: msg.to,
          time: msg.time
        })
          .then(() => console.log(chalk.green(`Message from ${fromSocket.name} to ${msg.to} was successfully saved`)))
          .catch(e => console.log(chalk.red(e.message)))
      } else {
        console.log(chalk.red('Socket not found'))
      }
    })

    socket.on('typing', async(id) => {
      socket.broadcast.emit('userTyping', id)
    })

    socket.on('disconnect',  async () => {
      const index = sessionsMap.findIndex(el => el.socketId === socket.id)
      if (sessionsMap[index]) {
        console.log(chalk.red(`user ${sessionsMap[index].name} left the chat`))
        sessionsMap.splice(index, 1)
        console.log(chalk.green(`length ${sessionsMap.length}`))
        io.emit('onlineUsers', sessionsMap)
      }
    })
  });
}
