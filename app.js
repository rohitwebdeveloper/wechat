const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require('path');

//creating a server and intergrating it with socketio.
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);



// const filepath = path.join(__dirname, '../public/index.html');

// using middlewares 
const staticpath = path.join(__dirname, './public/')
app.use(express.static(staticpath));


//defining route for index file
app.get('/', (req, res) => {
  // res.sendFile(filepath);
  res.render('index')
})




const newio = io.of('/new-namespace');
const users = [];


// defining fuctions 
function userconnected(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

function displayusersinroom(room) {
  return users.filter(user => user.room === room);
}

function finduserindex(id) {
  return users.findIndex(user => user.id === id);
}

function finduserleft(id) {
  return users.filter(user => user.id === id);
}

function removeuser(index) {
  if (index === -1)
    return users;
  else {
    return users.splice(index, 1);
  }
}



// Establishing connection user connection to the server
newio.on("connection", (socket) => {
  console.log('User has been connected');
  let username;
  let roomname;

  // Receiving username and roomid form the client side.
  socket.on('user_room_join', (userdata) => {
    username = userdata.userval;
    roomname = userdata.roomcode;
    console.log(`${username} joined room: ${roomname}`);
    userconnected(socket.id, username, roomname);
    const getuser = displayusersinroom(roomname);

    // Joining a room with roomid.
    socket.join(roomname);

    newio.in(roomname).emit('user_joined_greeting', username);

    socket.on('client-message', (message) => {

      socket.in(roomname).emit('ser-message', message);
    })

    newio.in(roomname).emit('participant-name', getuser);
    newio.in(roomname).emit('room-name', roomname);

  })


  // Defining an event to be fired when the client is disconnected on he has left the chat 
  socket.on("disconnect", () => {
    console.log('User has been disconnected');
    let userid = socket.id;
    let userleft_greeting = finduserleft(userid);
    newio.in(roomname).emit('user_left_greeting', userleft_greeting);
    let userindex = finduserindex(userid);
    removeuser(userindex);
    console.log(`${username} left room: ${roomname}`);
    let userleave = displayusersinroom(roomname);
    newio.in(roomname).emit('participant-name', userleave);


  })

});




// Listing a server which we have created on the top.
httpServer.listen(3000, () => {
  console.log('The server is running on port 3000');
});