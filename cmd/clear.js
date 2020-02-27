const Discord = require("discord.js");

module.exports.run = async (client, msg, args, string) => {

// args is the data given after the space in the command.

let arg = string.split(' ');

if(!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.reply("No can do boss..");
if(!arg[0]) return msg.channel.send("oof");
msg.channel.bulkDelete(arg[0]).then(() => {
  msg.channel.send(`Cleared ${arg[0]} messages.`).then(msg => msg.delete(5000));
})
}

module.exports.help = {

  name: "clear"

}
