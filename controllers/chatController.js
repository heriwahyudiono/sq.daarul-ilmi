const userModel = require("../models/userModel.js");
const chatModel = require("../models/chatModel.js");

const chatController = {
  getChatInbox: async function (req, res) {
    try {
      // Dapatkan daftar chat untuk pengguna saat ini
      const userId = req.session.userId;
      const chats = await chatModel.getChatsForUser(userId);

      res.render("chats", { chats });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },

  getChatRoom: async function (req, res) {
    try {
      const userId = req.session.userId;
      const receiverId = req.params.receiverId;
      const receiverName = await userModel.getUserNameById(receiverId);

      const chatHistory = await chatModel.getChatHistory(userId, receiverId);

      res.render("chat", { receiverName, messages: chatHistory });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },

  postSendMessage: async function (req, res) {
    try {
      const userId = req.session.userId;
      const receiverId = req.params.receiverId;
      const message = req.body.message;

      await chatModel.saveMessage(userId, receiverId, message);

      // Mengirim pesan melalui socket.io
      req.io.emit('receive-message', { sender_id: userId, text: message });

      res.redirect(`/chat/${receiverId}`);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },
};

module.exports = chatController;
