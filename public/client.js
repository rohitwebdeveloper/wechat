

const socket = io('/new-namespace');

let audio = new Audio('1111.mp3');
let time = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
setInterval(() => {
    time= new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
}, 1000);


const user = document.querySelector('.username');
user.addEventListener('change', (event) => {
    event.target.value;
})


const userinfo = document.querySelector('.userinfo_container');
const createbtn = document.querySelector('.create-btn');
const joinbtn = document.querySelector('.join-btn');

// Making a user join or create a room by getting his name and roomid and sending it to the server.
joinbtn.addEventListener('click', () => {

    let userval = user.value
    let roomcode = document.querySelector('.roomname').value;
    let logineduser = document.querySelector('.logined_user');
    if (userval == "") {
        userinfo.style.visibility = 'visible';
        alert('Please Enter Username');
    } else {
        userinfo.style.visibility = 'hidden';
        logineduser.innerHTML = userval;
    }
    socket.emit('user_room_join', { userval, roomcode });
})


createbtn.addEventListener('click', () => {

    let userval = user.value
    let roomcode = document.querySelector('.roomname').value;
    let logineduser = document.querySelector('.logined_user');
    if ((userval == "") || (roomcode == "")) {
        userinfo.style.visibility = 'visible';
        alert('Please Enter Username And RoomId');
    } else {
        userinfo.style.visibility = 'hidden';
        logineduser.innerHTML = userval;
    }
    socket.emit('user_room_join', { userval, roomcode });
})

const exitbutton = document.querySelector('.exit-btn');
exitbutton.addEventListener('click', () => {
    location.reload();
})



socket.on('user_joined_greeting', (joinedgreeting) => {
    let joining_leaving_message = document.querySelector('.joining_leaving_message');
    joining_leaving_message.innerHTML = "";
    joining_leaving_message.innerHTML = `${joinedgreeting} has joined !`;

    setTimeout(() => {
        let joining_leaving_message = document.querySelector('.joining_leaving_message');
        joining_leaving_message.innerHTML = "";
    }, 5000);
})

socket.on('user_left_greeting', (leftgreeting) => {
    let joining_leaving_message = document.querySelector('.joining_leaving_message');
    joining_leaving_message.innerHTML = "";
    leftgreeting.forEach((user)=>{
        joining_leaving_message.innerHTML = `${user.username} has left !`;
    })

    setTimeout(() => {
        let joining_leaving_message = document.querySelector('.joining_leaving_message');
        joining_leaving_message.innerHTML = "";
    }, 5000);

})






// Showing the all participants connected in a specific room  to the user in which he is present.
socket.on('participant-name', (connectedparticipant) => {
    let ollist = document.createElement("ol");
    ollist.classList.add("ollist");
    connectedparticipant.forEach((user, index) => {
        let li = document.createElement("li");
        li.innerHTML = user.username;
        ollist.appendChild(li);
    });

    let connectedbox = document.querySelector('.connected_people');
    connectedbox.innerHTML = "";
    connectedbox.appendChild(ollist);
})

// socket.on('noofusers', (noofusers)=>{
//     let h3 = document.querySelector('.h3');
//     h3.innerHTML = `People Connected(${noofusers})`;
// })

socket.on('room-name', (roomname) => {
    let roomid = document.querySelector('.roomid');
    roomid.innerHTML = `RoomId: ${roomname}`;
})



const input_message = document.querySelector('.input-message');
input_message.addEventListener('change', (event) => {
    event.target.value;
})



const form = document.getElementById("form");

// Preventing the reload of the page when the form is submitted.
form.addEventListener('submit', (event) => {
    event.preventDefault();

    let usernam = document.querySelector('.username').value;
    let input = document.querySelector('.input-message');
    let inputval = input.value;

    // Sending user message to the server
    socket.emit('client-message', `${usernam} : ${inputval}<br>
    <p> ${time}</p>`);

    //Displaying sender's message to him at his own side 
    let ul = document.querySelector(".message-box");
    let div = document.createElement("div");
    div.classList.add("right");
    div.innerHTML = `You: ${inputval}<br>
    <p> ${time}</p>`
    ul.appendChild(div);
    input.value = " ";
})

// Receiving message from the server sent by other users on the server and displaying it on the screen on his left side
socket.on('ser-message', (messagess) => {
    audio.play();
    let ul = document.querySelector(".message-box");
    let div = document.createElement("div");
    div.classList.add("left");
    div.innerHTML = messagess;
    ul.appendChild(div);
})

const hamlogo = document.querySelector('.ham_logo');
const connectedbox = document.querySelector('.connected-box');
hamlogo.addEventListener('click', () => {
    connectedbox.classList.toggle('active');
    hamlogo.classList.toggle('active');
})





