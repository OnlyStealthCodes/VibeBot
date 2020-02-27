const Discord = require('discord.js');
const config = require('../config.json');

module.exports.run = async (client, msg, args, string) => {

let help = new Discord.RichEmbed()

.setAuthor('=== HELP ===')
.addField('1. Music', 'For any help with the music command **please select 1!**')
.addField('2. Commands', 'For any help with other commands **please select 2!**')
.addField('3. Channel', 'For any help with the kick command **please select 3!**')

msg.channel.send(help);
// Help selection time out
try{
  var response = await msg.channel.awaitMessages(msg2 => msg2.content < 5 && msg2.content > 0, {
    maxMatches: 1,
    time: 10000,
    errors: ['time']
});

if(response.first().content === '1'){
  let music = new Discord.RichEmbed()
    .setAuthor('=== MUSIC ===')
    .addField('!play', 'To play a song enter the command followed by the URL or search query.')
    .addField('!skip', 'To skip a song in the queue use the skip command')
    .addField('!stop', 'To stop all music from playing enter the stop command.')
    .addField('!resume', 'To resume the song that you paused enter the resume command.')
    .addField('!pause', 'To pause the current song playing use the pause command')
    .addField('!queue', 'To view the current queue of music please enter the queue command.')
    .addField('!volume', 'To change the vol of the music enter the volume command followed by the value of what you want the vol to be, **the maximum value is 10**')
    .addField('!np', 'To see the song currently playing enter the now playing command.');
    msg.channel.send(music);
  }
  else if(response.first().content === '2'){
    let cmd = new Discord.RichEmbed()
      .setAuthor('=== COMMANDS ===')
      .addField('!giff', 'To display a .gif enter the giff command followed by a search query.')
      .addField('!doggo', 'To display a random doggo enter the doggo command.')
      .addField('!f', 'To pay respects enter **f @user reason**');
      msg.channel.send(cmd);
  }
  else if(response.first().content === '3'){
    let chan = new Discord.RichEmbed()
      .setAuthor('=== COMMANDS ===')
      .addField('!kick', 'To kick a member from the server use the kick command followed by there userid')
      .addField('!ban', 'To ban a member from the server use the ban command followed by there userid')
      .addField('!clear', 'To clear messages from the channel use the clear command followed by the amount of messages you want to delete')
      .addField('!roles', 'To view the roles of a user, use the roles command followed by the userid');
      msg.channel.send(chan);
  }


} catch (err){
    console.error(err);
    return msg.channel.send('No or invalid value entered. Cancelling help selection!');
};

};
// -------------------------------------------------------------------------



module.exports.help = {

  name: 'help'

}
