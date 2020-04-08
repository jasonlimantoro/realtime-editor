import socket from "socket.io";
import server from "@app/server";
import jwt from "jsonwebtoken";
import { Draft, User } from "@app/database/schema";

const io = socket(server);

const rooms: { [key: string]: any } = {};

io.on("connection", function (socket) {
  socket.on("LEAVE_ROOM", async (data) => {
    const decoded = jwt.decode(data.meta.token);
    const user = await User.findById(decoded!.sub);
    delete rooms[data.room][user!.username];
    socket.leave(data.room);
    socket.broadcast.to(data.room).emit("REMOVE_COLLABORATOR", {
      user: user!.username,
      clientId: socket.id,
    });
  });
  socket.on("CREATE_ROOM", async (data) => {
    const decoded = jwt.decode(data.meta.token);
    const user = await User.findById(decoded!.sub);
    socket.join(data.room);
    rooms[data.room] = rooms[data.room]
      ? {
          ...rooms[data.room],
          [user!.username]: socket.id,
        }
      : { [user!.username]: socket.id };
    io.to(data.room).emit("NEW_COLLABORATOR", {
      user: user!.username,
      clientId: socket.id,
      collaborators: rooms[data.room],
    });
  });
  socket.on("CHANGE_STATE", async (data) => {
    await Draft.findByIdAndUpdate(
      data.editorId,
      { value: data.value },
      { upsert: true, setDefaultsOnInsert: true }
    );
    socket.broadcast.to(data.editorId).emit("CHANGE_STATE_LISTENER", data);
  });

  socket.on("CHANGE_TITLE", async (data) => {
    await Draft.findByIdAndUpdate(
      data.editorId,
      { title: data.title },
      { upsert: true, setDefaultsOnInsert: true }
    );
    socket.broadcast.to(data.editorId).emit("CHANGE_TITLE_LISTENER", data);
  });
});
