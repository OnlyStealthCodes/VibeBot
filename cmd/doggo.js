const Discord = require("discord.js");
const superagent = require("superagent")

module.exports.run = async (client, msg, args) => {


  let wait = await msg.channel.send("Generating Doggo...")

  let {body} = await superagent
  .get(`https://dog.ceo/api/breeds/image/random`)
  console.log(body.message)
  console.log(body.status)

  if(!{body}) return msg.channel.send("Try again!")

      let doggo = new Discord.RichEmbed()
      .setColor("#998e60")
      .setAuthor('Doggos!', msg.guild.iconURL)
      .setImage(body.message)
      .addField("Requested by: ", msg.author);

    msg.channel.send(doggo)


}

module.exports.help = {

  name: "doggo"

}
