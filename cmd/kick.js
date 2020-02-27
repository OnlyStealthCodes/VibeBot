const Discord = require("discord.js");

module.exports.run = async (client, msg, args, string) => {

  // args is the data given after the space in the command.

  let kUser = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(s));
  let kReason = string
  if(kReason.length <= 0){
    kReason = "No Reason Was Given...";
  }
  if(!kUser) return msg.channel.send("Can't find user!");
  if(!msg.member.hasPermission("MANAGE_MESSAGES")){

    let putonblast = new Discord.RichEmbed()

    .setDescription(`**${msg.author} has just attempted to kick an admin... Respect their authoritah!**`)
    .setImage('https://media1.giphy.com/media/7wNO1SZuasjD2/giphy.gif?cid=790b76115ca00c233963545667c9f425');

    msg.channel.send(putonblast);
    return
  };

  if(kUser.hasPermission("MANAGE_MESSAGES")){

    let putonblast = new Discord.RichEmbed()

    .setDescription(`**${msg.author} has just attempted to kick an admin... Respect their authoritah!**`)
    .setImage('https://media1.giphy.com/media/7wNO1SZuasjD2/giphy.gif?cid=790b76115ca00c233963545667c9f425');

    msg.channel.send(putonblast);
    return
  }

      let kickEmbed = new Discord.RichEmbed()

          .setDescription("~Kick~")
          .setColor("#e56b00")
          .setImage(msg.author.avatarURL)
          .addField("Kicked User", `${kUser} with ID ${kUser.id}`)
          .addField("Kicked By", `${msg.author}> with ID ${msg.author.id}`)
          .addField("Kicked In", msg.channel)
          .addField("Time", msg.createdAt)
          .addField("Reason", kReason);

      msg.guild.member(kUser).kick(kReason);
      msg.channel.send(kickEmbed);

  return;

}

module.exports.help = {

  name: "kick"

}
