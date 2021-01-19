const showUsers = (roomName, socket) => {
    // LIST ALL USERS
    socket.emit('ASK_USERS', {
        room: roomName
    })
}
export default showUsers;