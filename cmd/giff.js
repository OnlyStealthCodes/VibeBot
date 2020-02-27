const Discord = require("discord.js");
const superagent = require('superagent');
const fs = require('fs');
const giphy = require('giphy-api')('Fh75OuPrRCMxc20791NZTWdVQ5PQ4XIB');

module.exports.run = async (client, msg, args, string) => {

try {
let find =  await giphy.search(string);

let data = find.data;

let giff = data[0].images.original.url;

msg.channel.send('Generating Giff...');

let giffEmbed = new Discord.RichEmbed()

.setDescription(msg.author)
.setImage(giff);

msg.channel.send(giffEmbed);

console.log(giff);
} catch(err){
msg.channel.send('We can\'t find the giff that you search for, sorry :(')
};
};

module.exports.help = {

  name: "giff"

}
