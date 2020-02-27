

const Discord = require('discord.js');
const client = new Discord.Client({
  disableEveryone: true
});

const YouTube = require('simple-youtube-api');
const config = require("./config.json");
const fs = require('fs');
const ytdl = require('ytdl-core');
const youtube = new YouTube(config.g_api);
const http = require('http');

const queue = new Map();

client.commands = new Discord.Collection();

songQueue = [];
linkQueue = [];

fs.readdir("./cmd/", (err, files) => {
  if (err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js")
  if (jsfile.length <= 0) {
    console.log("Couldn't find commands.");
    return;
  }

  jsfile.forEach((f, i) => {
    let props = require(`./cmd/${f}`);
    console.log(`${f} loaded!`);
    client.commands.set(props.help.name, props);
  });
});

// Event = ready, when bot is ready do arguments.

// message = message, when message is sent do arguments.
client.on('message', async msg => {
  // arguments for messages
  if (msg.author.bot) return;
  if (msg.content.indexOf(config.prefix) !== 0) return;
  if (msg.channel.type === "dm") return;

  let args = msg.content.split(' ');
  let string = args.slice(1).join(' ');
  const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
  const serverQueue = queue.get(msg.guild.id);

  let command = msg.content.toLowerCase().split(' ')[0];
  command = command.slice(config.prefix.length)

  let cmdd = client.commands.get(command);
  if(cmdd) cmdd.run(client, msg, args, string);
try{
  if(command === 'play'){
    const voiceChannel = msg.member.voiceChannel;
    if(!voiceChannel) return msg.channel.send('You must be in a voice channel in order for me to join!');
    const permissions = voiceChannel.permissionsFor(msg.client.user);
    if(!permissions.has('CONNECT')){
      return msg.channel.send('For some reason I cannot join your voice channel! Make sure that I have the right permissions to join!');
    }
    if(!permissions.has('SPEAK')){
      return msg.channel.send('For some reason this channel wont allow me to play my music! Make sure that I have the right permissions to join');
    }
    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
      const playlist = await youtube.getPlaylist(url);
      const videos = await playlist.getVideos();
      for(const video of Object.values(videos)) {
        const video2 = await youtube.getVideoByID(video.id);
        await handleVideo(video2, msg, voiceChannel, true);
      }
      return msg.channel.send(`Playlist: **${playlist.title}** has been added to the queue!`);
} else {
    try {
          var videos = await youtube.searchVideos(string, 5);
          let index = 0;
          msg.channel.send(`
__**Song selection:**__
${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
Please provide a value to select one of the search results ranging from 1-5.
					`);

    try{
      var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 6, {
        maxMatches: 1,
        time: 10000,
        errors: ['time']
    });
} catch (err){
    console.error(err);
    return msg.channel.send('No or invalid value entered, cancelling video selection!');
}
  const videoIndex = parseInt(response.first().content);
  var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
} catch (err){
  console.error(err);
  return msg.channel.send('I could not find anything that you searched for :(');
}

  return handleVideo(video, msg, voiceChannel);
}

} else if (command === 'skip'){
  if(!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
  if(!serverQueue) return msg.channel.send('There is currently nothing in the queue. use **!play** to add a song to the queue!');
  msg.channel.send(`**${serverQueue.songs[0].title}** has been skipped...`)
  serverQueue.connection.dispatcher.end('The skip command has been used...');
} else if (command === 'stop'){
  if(!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
  if(!serverQueue) return msg.channel.send('Nothing is currently playing...');
  msg.channel.send(`**${serverQueue.songs[0].title}** has stopped playing...`)
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end('The stop command has been used!');
} else if (command === 'volume'){
  if(!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
  if(!serverQueue) return msg.channel.send('Nothing is currently playing...');
  if(!args[1]) return msg.channel.send(`The current volume is : **${serverQueue.volume}**`);
  serverQueue.volume = args[1];
  if(args[1] >= 11) return msg.channel.send('Volume is limited to a value of **10**');
  serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
  return msg.channel.send(`Volume: **${args[1]}**`);
} else if (command === 'np'){
  if(!serverQueue) return msg.channel.send('Nothing is currently playing!');
  return msg.channel.send(`**${serverQueue.songs[0].title}** is currently playing!`);
} else if (command === 'queue'){
  if(!serverQueue) return msg.channel.send('There is currently nothing playing!');
  return msg.channel.send(`__**Song queue:**__
${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}

**Now playing:** ${serverQueue.songs[0].title}
		`);
} else if (command === 'pause'){
  if(serverQueue && serverQueue.playing) {
    serverQueue.playing = false;
    serverQueue.connection.dispatcher.pause();
    return msg.channel.send(`**${serverQueue.songs[0].title}** has been paused!, to resume use command **!resume**`);
  }
  return msg.channel.send('There is nothing currently playing');
} else if (command === 'resume'){
  if(serverQueue) {
    serverQueue.playing = true;
    serverQueue.connection.dispatcher.resume();
    return msg.channel.send(`**${serverQueue.songs[0].title}** has been resumed!, to pause use command **!pause**`);
  }
  return msg.channel.send('There is nothing currently playing');
}

async function handleVideo(video, msg, voiceChannel, playlist = false){
  const serverQueue = queue.get(msg.guild.id);
  console.log(video);
  const song = {
    id: video.id,
    title: video.title,
    url: `https://www.youtube.com/watch?v=${video.id}`
  };
  if(!serverQueue) {
    const queueConstruct = {
      textChannel : msg.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 2,
      playing: true
    };
    queue.set(msg.guild.id, queueConstruct);

    queueConstruct.songs.push(song);

    try{
      var connection = await voiceChannel.join();
      queueConstruct.connection = connection;
      play(msg.guild, queueConstruct.songs[0]);
    } catch (error){
      console.error(`I could not join the voice channel: ${error}`);
      queue.delete(msg.guild.id);
      return msg.channel.send(`I could not join the voice channel: ${error}`);
    }

  } else {
    serverQueue.songs.push(song);
    console.log(serverQueue.songs);
    if(playlist) return undefined;
    else return msg.channel.send(`**${song.title}** has been added to the queue!`);
  }

}

  function play(guild, song){
    const serverQueue = queue.get(guild.id);

    if(!song){
      serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
    console.log(serverQueue.songs);

    const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
    .on('end', reason => {
      if(serverQueue.length <= 0) return msg.channel.send('All songs in queue have finished playing...');
      if(reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
      else console.log(reason);
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on('error', error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

    serverQueue.textChannel.send(`Now playing **${song.title}**`);
  }
}catch(err){
  console.log(err);
};
});
  client.on('ready', () => {
    console.log(client.commands);
    console.log(`Logged in as ${client.user.tag}!`)
    console.log(`We have ${client.guilds.size} servers conencted.`)
    client.user.setActivity(`currently undergoing maintenance...`);
    // only enable on hot fix! create boolean maybe?
     client.guilds.forEach((guild) => {
       let defaultChannel = "";
       guild.channels.forEach((channel) => {
         if(channel.type == "text" && defaultChannel == ""){
           if(channel.permissionsFor(guild.me).has("SEND_MESSAGES")){
           defaultChannel = channel;
           defaultChannel.send("Vibe has now been fully deployed across all servers with 24/7 server support :')");
         }
          }
       })
     })
    });

client.on(`guildCreate`, guild => {
  console.log(`New guild joined: ${guild.name} (${guild.id}). This guild has ${guild.memberCount} Members!`)
  client.user.setActivity(`We have ${client.guilds.size} servers using me!`)
});

client.on(`guildDelete`, guild => {
  console.log(`I have been removed from: ${guild.name} (${guild.id})`);
  client.user.setActivity(`We have ${client.guilds.size} servers using me!`);
});

client.on('error', err => {
  console.log(err);
});


client.login(config.token);
