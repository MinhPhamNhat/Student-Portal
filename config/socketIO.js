const io = require("socket.io")()
const socketIO = {
    io: io
}

io.on('connection', socket => {

    console.log(socket.id + " Just join server")

    socket.on('disconnect', () => {
        console.log(socket.id + " Just disconnect from server")
    })

    socket.on("typing", (data) => {
        socket.broadcast.emit("typing", data)
    })

    socket.on("typing-done", (data) => {
        socket.broadcast.emit("typing-done", data)
    })
})


module.exports = socketIO