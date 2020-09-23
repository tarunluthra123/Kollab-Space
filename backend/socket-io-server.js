const jwt = require("jsonwebtoken");
const TOKEN_SECRET = process.env.TOKEN_SECRET || "secret123";

const verifyUserWithToken = async (token, name) => {
  const decoded = await jwt.verify(token, TOKEN_SECRET);
  return decoded.name === name;
};

const randomStringGenerator = (length = 5) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const chatRooms = new Map();

const generateNewRoom = () => {
  let roomName = randomStringGenerator();
  while (chatRooms.has(roomName)) {
    roomName = randomStringGenerator();
  }
  let roomPassword = randomStringGenerator();
  chatRooms.set(roomName, roomPassword);
  return { roomName, roomPassword };
};

exports = module.exports = function (server) {
  const io = require("socket.io")(server);

  io.on("connection", (socket) => {
    // console.log("connected ", socket.id);
    socket.on("msg_send", (data) => {
      console.log(data);

      socket.emit("hello there", {
        msg: "hola",
      });
    });

    socket.on("createNewRoom", async (data) => {
      const user = data.user;
      const verified = await verifyUserWithToken(user.token, user.name);
      if (verified) {
        const newRoom = generateNewRoom();
        socket.join(newRoom.roomName);
        io.to(newRoom.roomName).emit("New room", newRoom);
      } else {
        socket.emit("Invalid user");
      }
    });

    socket.on("joinChatRoom", async (data) => {
      const user = data.user;
      const verified = await verifyUserWithToken(user.token, user.name);
      if (verified) {
        const roomName = data.room.roomName;
        const roomPassword = data.room.roomPassword;
        if (chatRooms.has(roomName)) {
          const correctPassword = chatRooms.get(roomName);
          if (correctPassword === roomPassword) {
            socket.join(roomName);
            io.to(roomName).emit(user.name + " has joined the room.");
          } else {
            socket.emit("Incorrect room password");
          }
        } else {
          socket.emit("Room does not exist");
        }
      } else {
        socket.emit("Invalid user");
      }
    });
  });
};
