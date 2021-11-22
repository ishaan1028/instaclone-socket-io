const express = require('express');

const app = express().listen(8900 || process.env.PORT, () => {
    console.log("port 8900")
});

const io = require("socket.io")(app, {
    cors: {
        origin: "https://instaclone-react-by-ishaan.netlify.app"
    }
});

let users = [];

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {

    //when user connects
    console.log("a user connected");

    //take userId and socketId from user
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
    });

    //send and get message
    socket.on("sendMessage", ({ sender, receiverId, text }) => {
        const user = getUser(receiverId);
        io.to(user?.socketId).emit("getMessage", {
            sender,
            text,
        });
    });

    //when disconnect
    socket.on("disconnect", () => {
        console.log("a user disconnected!");
        removeUser(socket.id);
    });


});

