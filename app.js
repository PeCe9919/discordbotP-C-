//====================CODING THE PACKAGE====================
var Discord = require('discord.js');
var bot = new Discord.Client();
var fs = require('fs'); //first we need to require fs, it is packaged with node.js so no need to download anything extra





//// TENTATIVE DISCORD BOT
////npm i ytdl-core; npm i request; npm i fs; npm i get-youtube-id; npm i youtube-info
//const ytdl = require('ytdl-core');
//const request = require('request');
//const getYoutubeID = require('get-youtube-id');
//const fetchVideoInfo = require('youtube-info');
//var config = JSON.parse(fs.readFileSync('./settings.json', 'utf-8'));
//const yt_api_key = config.yt_api_key;
//const bot_controller = config.bot_controller;
//const prefix = config.prefix;



//====================MUSIC BOT COMMANDS====================
//npm i node-opus ytdl-core
//npm i ffmpeg-binaries
const { TOKEN, PREFIX } = require('./config');
const ytdl = require('ytdl-core');
const queue = new Map();

bot.on('warn', console.warn);
bot.on('error', console.error);


bot.on('message', async msg => {
    if (msg.author.bot) return undefined;
    if (!msg.content.startsWith(PREFIX)) return undefined;
    const args = msg.content.split(' ');
    const serverQueue = queue.get(msg.guild.id);
    
    if (msg.content.startsWith(`${PREFIX}play`)) {
        const voiceChannel = msg.member.voiceChannel;
        if (!voiceChannel) return msg.channel.send('Vous devez être connecté(e) à un channel vocal pour écouter de la musique.');
        const permissions = voiceChannel.permissionsFor(msg.client.user);
        if (!permissions.has('CONNECT')) {
            return msg.channel.send('Je ne peux pas me connecter à ce channel, assurez vous que j\'en possède les droits.');
        }
        if (!permissions.has('SPEAK')) {
            return msg.channel.send('Je ne peux pas parler dans ce channel, assurez vous que j\'en possède les droits.');
        }

        const songInfo = await ytdl.getInfo(args[1]);
        const song = {
            title: songInfo.title,
            url: songInfo.video_url
        };
        if (!serverQueue) {
            const queueConstruct = {
                textChannel: msg.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true
            };
            queue.set(msg.guild.id, queueConstruct);

            queueConstruct.songs.push(song);

            try {
                var connection = await voiceChannel.join();
                queueConstruct.connection = connection;
                play(msg.guild, queueConstruct.songs[0]);
            }   catch (error) {
                console.log(`Je ne peux pas rejoindre le channel vocal: ${error}`);
                queue.delete(msg.guild.id);
                return msg.channel.send(`Je ne peux pas rejoindre le channel vocal: ${error}`);
            }
        } else {
            serverQueue.songs.push(song);
            return msg.channel.send(`**${song.title}** a été ajoutée à la Queue !`);
        }

        return undefined;
    } else if (msg.content.startsWith(`${PREFIX}stop`)) {
        if (!msg.member.voiceChannel) return msg.channel.send('Vous n\'êtes pas dans un channel vocal.');
        msg.member.voiceChannel.leave();
        return undefined;
    }
});

function play(guild, song) {
    const serverQueue = queue.get(guild.id);

    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return; 
    }

    const dispatcher = connection.playStream(ytdl(song.url))
        .on('end', () => {
           console.log('song ended');
           serverQueue.songs.shift();
           play(guild, serverQueue.songs[0]);
        })
        .on('error', error => console.error(error));
    dispatcher.setVolumeLogarithmic(2 / 2);
}



//npm i quick.hook

//second lets call the file we just made using fs
var userData = JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));
var commandsList = fs.readFileSync('Storage/commands.txt', 'utf8');

//====================FUNCTION====================






//====================MESSAGE COMMANDS====================
//listener event: message recieved (this will run every time a message is receved)
bot.on('message', message => {

    //variables
    var sender = message.author; //the person who send message
    var msg = message.content.toUpperCase(); //takes the message and makes it all uppercase
    var prefix = '§'

    //first, we need to make sure that isn't reading a message that the bot is sending
    if(sender.id === '438480476286484482') { //check if the ID of the sender is the same ID as the bot
        return; //cancels the rest of the listener event
    }


    
    //====================HELP COMMAND====================
    if (msg === prefix + 'help' || msg === prefix + 'cmd') {
        message.channel.send("test")
    }









    //====================PING PONG COMMANDS====================
    if (msg === 'EMMA') {
        message.channel.send('CARENA')
    }
    if (msg === 'QUOI') {
        message.channel.send('FEUR')
    }
    if (msg === 'QUOI ?') {
        message.channel.send('FEUR')
    }
    if (msg === 'QUOI?') {
        message.channel.send('FEUR')
    }
    if (msg === 'quoi') {
        message.channel.send('FEUR')
    }
    if (msg === 'quoi?') {
        message.channel.send('FEUR')
    }
    if (msg === 'quoi ?') {
        message.channel.send('FEUR')
    }



    //====================BAD WORDS====================
    if (msg.includes('EVA')) {
        message.delete();
        message.author.send('Le mot *EVA* est banni, ne l\'utilisez pas !');
    }



//================================================================
//    if (msg.startsWith(prefix + 'USERINFO')) {
//        //we should assume that if they're not adding a name to the end of the commande they want info of themself
//        if (msg === prefix + 'USERINFO') {
//            message.channel.send(); //this will return the message about info on themselfs //we should make a function so we don't have to write it multitimes
//        }
//    }
//================================================================

    if (msg === prefix + 'HELP') {
        message.channel.send('**Ceci est un test**')
    }

    //now calling it is pretty easy
    if (msg === prefix + 'USERSTATS') {
        message.channel.send('Vous avez envoyé(e) **' + userData[sender.id].messagesSent + '** messages !')
    }


    //now lets make sur their username is tere before writting to the file
    if (!userData[sender.id]) userData[sender.id] = {
        messagesSent: 0
    }

    //now lets increase messages and write to the final file
    userData[sender.id].messagesSent++; //this adds one to 'messageSent', under the user

    //to save the file we have to write this
    fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
        if (err) console.error(err);
    });


    
});


//====================SETGAME ACTIVITY====================
bot.on('ready', () => {
    console.log('Bot launched...');
    bot.user.setGame('M.M', 'https://www.twitch.tv/pecetueur')
})





//listener event: bot launched
bot.login('Ready', () => {
    console.log('Bot launched...');


    //status
    bot.user.setStatus('idle') //Onlie, idle, dnd, invisible

    //game & streaming
    bot.user.setPresence({ game: { name: 'test', type: 0 } });
    //to set a stream, add another option like this
    bot.user.setGame('En Live', 'https://www.twitch.tv/pecetueur');
});



//listener event: user joining the discord server
bot.on('guildMemberAdd', member => {
    console.log('L\'ami(e) ' + member.user.username + ' nous a rejoins, bienvenu(e) à toi !')
    console.log(member)

    //now let's add a role when they join. first we need to get the role we want
    var role = member.guild.roles.find('name', 'Joueur'); //this looks for the role in the server(guild), it searches by name, meaning you can change 'JOUEUR' to the sole you want

    //secondly we will add the role
    member.addRole(role)

    //sending a message to a channel when a user joins discord
    member.guild.channels.get('406127456626540544').send('L\'ami(e) **' + member.user.username + '** nous a rejoint, bienvenu(e) à toi !');
});

//Now lets make it so that when someone leaves, code runs
//listener event: user leaving the discord server
bot.on('guildMemberRemove', member => {

    //sending a message to a channel when a user left discord
    member.guild.channels.get('406127456626540544').send('L\'ami(e) **' + member.user.username + '** nous a quitté(e) !');

});





//====================LOGIN====================
bot.login('NDM4ODM3Nzc0Mjg4NjgzMDEw.DcKbCg.3dq25LrW3modQIlnaR4a9i1GzX0')