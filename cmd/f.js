const Discord = require("discord.js");
const ytdl = require('ytdl-core');

module.exports.run = async (client, msg, args, string) => {

  let respectU = msg.guild.member(msg.mentions.users.first());
  let respectR = string.slice(22);
  console.log(respectR);

  if(!respectR) respectR = "...";
  if(!respectU) return msg.channel.send("**Respects have not been paid...**");

  let respects = new Discord.RichEmbed()

  .setDescription(`${msg.author} has paid their respects to ${respectU} because **${respectR}**`)
  .setImage('https://steamuserimages-a.akamaihd.net/ugc/853851618303933643/A2357BFB52A4461D2D0904D85BA9656715895D3E/');

  msg.channel.send(respects);

}

module.exports.help = {

  name: "f"

}
