const Discord = require("discord.js");
const ytdl = require('ytdl-core');

module.exports.run = async (client, msg, args) => {
msg.member.voiceChannel.leave();
}
module.exports.help = {
  name: "leave"
}
