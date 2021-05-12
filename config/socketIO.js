const io = require("socket.io")()
const socketIO = {
    io: io
}

io.on('connection', socket => {

    socket.on("typing", (data) => {
        socket.broadcast.emit("typing", data)
    })

    socket.on("typing-done", (data) => {
        socket.broadcast.emit("typing-done", data)
    })
})


module.exports = socketIO