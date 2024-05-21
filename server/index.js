const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
import { TikTokConnectionWrapper, getGlobalConnectionCount } from './connectionWrapper.js';


app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  let tiktokConnectionWrapper;

  console.info('New connection from origin', socket.handshake.headers['origin'] || socket.handshake.headers['referer']);

  socket.on('setUniqueId', (uniqueId, options) => {

      // Prohibit the client from specifying these options (for security reasons)
      if (typeof options === 'object' && options) {
          delete options.requestOptions;
          delete options.websocketOptions;
      } else {
          options = {};
      }

      // Session ID in .env file is optional
      if (process.env.SESSIONID) {
          options.sessionId = process.env.SESSIONID;
          console.info('Using SessionId');
      }


      // Connect to the given username (uniqueId)
      try {
          tiktokConnectionWrapper = new TikTokConnectionWrapper(uniqueId, options, true);
          tiktokConnectionWrapper.connect();
      } catch (err) {
          socket.emit('tiktokDisconnected', err.toString());
          return;
      }

      // Redirect wrapper control events once
      tiktokConnectionWrapper.once('connected', state => socket.emit('tiktokConnected', state));
      tiktokConnectionWrapper.once('disconnected', reason => socket.emit('tiktokDisconnected', reason));

      // Notify client when stream ends
      tiktokConnectionWrapper.connection.on('streamEnd', () => socket.emit('streamEnd'));

      // Redirect message events
      tiktokConnectionWrapper.connection.on('roomUser', msg => socket.emit('roomUser', msg));
      tiktokConnectionWrapper.connection.on('member', msg => socket.emit('member', msg));
      tiktokConnectionWrapper.connection.on('chat', msg => socket.emit('chat', msg));
      tiktokConnectionWrapper.connection.on('gift', msg => socket.emit('gift', msg));
      tiktokConnectionWrapper.connection.on('social', msg => socket.emit('social', msg));
      tiktokConnectionWrapper.connection.on('like', msg => socket.emit('like', msg));
      tiktokConnectionWrapper.connection.on('questionNew', msg => socket.emit('questionNew', msg));
      tiktokConnectionWrapper.connection.on('linkMicBattle', msg => socket.emit('linkMicBattle', msg));
      tiktokConnectionWrapper.connection.on('linkMicArmies', msg => socket.emit('linkMicArmies', msg));
      tiktokConnectionWrapper.connection.on('liveIntro', msg => socket.emit('liveIntro', msg));
      tiktokConnectionWrapper.connection.on('emote', msg => socket.emit('emote', msg));
      tiktokConnectionWrapper.connection.on('envelope', msg => socket.emit('envelope', msg));
      tiktokConnectionWrapper.connection.on('subscribe', msg => socket.emit('subscribe', msg));
  });

  socket.on('disconnect', () => {
      if (tiktokConnectionWrapper) {
          tiktokConnectionWrapper.disconnect();
      }
  });
});



server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});
