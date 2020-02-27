const Discord = require("discord.js");
const ytdl = require('ytdl-core');
const config = require('../config.json');

module.exports.run = async (client, msg, args, songQueue, song) => {

  if(songQueue.length <= 1) return msg.channel.send("There are currently no songs in the queue! To queue a song please use the **!play** command along with a YouTube URL!");

  function idx(i, f){
    if(f === 0) return;
    msg.channel.send(f+'.'+ ' ' + '**' + i + '**');
    if(!f) msg.channel.send(queueEmbed);
  }
  let queueEmbed = new Discord.RichEmbed()
  .setColor("#e56b00")
  .setAuthor("**Song Queue**")
  .setDescription(`**Queue requested by: ${msg.author}**`);
  await msg.channel.send(queueEmbed);
  songQueue.forEach(idx);

  console.log(songQueue);
}

module.exports.help = {
  name: "queue"
}
