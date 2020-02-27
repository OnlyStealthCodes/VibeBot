const Discord = require("discord.js");

module.exports.run = async (client, msg, args) => {

// args is the data given after the space in the command.

let bUser = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[0]));
 if(!bUser) return msg.channel.send("This user does not exsist.");
 let bReason = args.join(" ").slice(22);
 if(bReason.length <= 0){
   bReason = "No Reason Was Given...";
 }
 if(bUser.hasPermission("MANAGE_MESSAGES")) return msg.reply("You have no power here..");
 if(!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.reply("You have no power here..");

 let banEmbed = new Discord.RichEmbed()

 .setDescription("~Ban~")
 .setColor("#d30606")
 .setImage(msg.author.avatarURL)
 .addField("Banned User", `${bUser} with ID ${bUser.id}`)
 .addField("Banned by: ", `${msg.author} with ID ${msg.author.id}`)
 .addField("Banned in: ", msg.channel)
 .addField("Banned at: ", msg.createdAt)
 .addField("Reason: ", bReason);

msg.guild.member(bUser).ban(bReason);
msg.channel.send(banEmbed);
}

module.exports.help = {

  name: "ban"

}
