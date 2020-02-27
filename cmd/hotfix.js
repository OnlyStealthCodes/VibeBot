const Discord = require("discord.js");

module.exports.run = async (client, msg, args) => {

  let hot = new Discord.RichEmbed()

  .setAuthor('=== Hotfix ===')
  .addField('Music', 'The music functionality has been tweaked and is more efficient with all commands now fully working.')
  .addField('Help', 'The help command has now been fully implemented')
  .addField('Further Updates', 'Vibe will notify every single server of any more upcoming updates')

  msg.channel.send(hot);


}

module.exports.help = {

  name: "hotfix"

}
