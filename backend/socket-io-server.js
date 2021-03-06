const jwt = require("jsonwebtoken");
const TOKEN_SECRET = process.env.TOKEN_SECRET || "secret123";

const verifyUserWithToken = async (token, name) => {
  const decoded = await jwt.verify(token, TOKEN_SECRET);
  return decoded.name === name;
};

const randomStringGenerator = (length = 4, useOnlyCapitals = true) => {
  let result = "";
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (!useOnlyCapitals) {
    characters += "abcdefghijklmnopqrstuvwxyz0123456789";
  }
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const chatRooms = new Map(); //{name:password}
const chatRoomsInviteCodes = new Map(); //{inviteCode : {name,password}}
const chatRoomsInviteSecrets = new Map(); // {{name,password} : inviteCode}

const generateNewRoom = () => {
  let roomName = randomStringGenerator();
  while (chatRooms.has(roomName)) {
    roomName = randomStringGenerator();
  }
  const roomPassword = randomStringGenerator();
  chatRooms.set(roomName, roomPassword);

  let roomInviteCode = randomStringGenerator(5, false);
  if (chatRoomsInviteCodes.has(roomInviteCode)) {
    roomInviteCode = randomStringGenerator(5, false);
  }
  chatRoomsInviteCodes.set(roomInviteCode, { roomName, roomPassword });
  chatRoomsInviteSecrets.set(
    JSON.stringify({ roomName, roomPassword }),
    roomInviteCode
  );
  return { roomName, roomPassword, roomInviteCode };
};

exports = module.exports = function (server) {
  const io = require("socket.io")(server);
  chatRooms.set("abc", "def"); //For testing purposes

  io.on("connection", (socket) => {
    socket.on("messageReceived", (data) => {
      io.to(data.room.name).emit("messageReceived", data);
    });

    socket.on("createNewRoom", async (data) => {
      const user = data.user;
      const verified = await verifyUserWithToken(user.token, user.name);
      if (verified) {
        const newRoom = generateNewRoom();
        socket.emit("createdNewRoom", newRoom);
      } else {
        socket.emit("Invalid user");
      }
    });

    socket.on("joinChatRoom", async (data) => {
      const user = data.user;
      const verified = await verifyUserWithToken(user.token, user.name);
      if (verified) {
        const { roomName, roomPassword } = data.room;
        if (chatRooms.has(roomName)) {
          const correctPassword = chatRooms.get(roomName);
          if (correctPassword === roomPassword) {
            socket.join(roomName);
            const { avatarInfo } = data;
            const inviteCode = chatRoomsInviteSecrets.get(
              JSON.stringify({
                roomName,
                roomPassword,
              })
            );

            io.to(roomName).emit("roomJoinNotification", {
              notification: "New Participant",
              room: { name: roomName, password: roomPassword, inviteCode },
              user,
              avatarInfo,
            });
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

    socket.on("joinRoomViaInviteCode", async (data) => {
      const { user, inviteCode, avatarInfo } = data;
      const verified = await verifyUserWithToken(user.token, user.name);
      if (verified) {
        if (chatRoomsInviteCodes.has(inviteCode)) {
          const { roomName, roomPassword } = chatRoomsInviteCodes.get(
            inviteCode
          );
          socket.join(roomName);
          io.to(roomName).emit("roomJoinNotification", {
            notification: "New Participant",
            room: { name: roomName, password: roomPassword, inviteCode },
            user,
            avatarInfo,
          });
        } else {
          socket.emit("Invalid room invite code");
        }
      } else {
        socket.emit("Invalid user");
      }
    });

    socket.on("leaveChatRoom", (data) => {
      const { user, room, avatarInfo } = data;
      io.to(room.name).emit("roomJoinNotification", {
        notification: "Participant Left",
        user,
        avatarInfo,
        room,
      });
    });

    socket.on("codeChange", (data) => {
      if (data.room && data.room.name) {
        socket.to(data.room.name).emit("codeUpdate", {
          code: data.code,
          cursorPosition: data.cursorPosition,
          user: data.user,
        });
      }
    });

    socket.on("cursorChange", (data) => {
      if (data.room && data.room.name)
        socket.to(data.room.name).emit("cursorPositionUpdate", {
          row: data.row,
          column: data.column,
        });
    });

    socket.on("languageChange", (data) => {
      if (data.room && data.room.name)
        io.to(data.room.name).emit("languageTagUpdate", {
          lang: data.lang,
        });
    });
  });
};
