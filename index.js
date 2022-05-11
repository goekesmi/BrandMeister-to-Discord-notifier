const MINIMUM_REQUIRED_TRANSMIT_TIME_SECONDS = 2;
const ONLY_NOTIFY_IF_NO_TRANSMISSIONS_FOR_SECONDS = 900;  // 0 = don't use this feature



//Do not display messages older than CACHE_SECONDS ago and do not display messages with a duplicate SessionID within CACHE_SECONDS. The default value is typically fine here.
const CACHE_SECONDS = 60;
const io = require('socket.io-client');
const moment = require('moment');
const NodeCache = require('node-cache');
const sessionIdCache = new NodeCache({ stdTTL: CACHE_SECONDS });
const lastHeardCache = new NodeCache();
const BM_DEFAULT_URL = 'https://api.brandmeister.network';
const BM_DEFAULT_OPTS = {
    path: '/lh',
    reconnection: true
};

require('dotenv').config(); //initialize dotenv
const Discord = require('discord.js'); //import discord.js

const client = new Discord.Client({ intents: 3072}); //create new client

channels = [];
channel_list = process.env.CHANNELS.split(' ');
const TALK_GROUPS_TO_MONITOR = process.env.TALKGROUPS.split(' ');

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	channel_list.forEach( channel_num => {
			client.channels.fetch(channel_num).then( (gotchannel) => channels.push(gotchannel)) ;
			console.log(channel_num)
		});

});


//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); //login bot using token
		
const socket = io(BM_DEFAULT_URL, BM_DEFAULT_OPTS);

socket.open();

socket.on('connect', () => {
    console.log('Connected to BM API');
});


socket.on('mqtt', (msg) => {
    const lhMsg = JSON.parse(msg.payload);
    if (TALK_GROUPS_TO_MONITOR.indexOf(lhMsg.DestinationID) > -1 && lhMsg.Stop !== 0 && (lhMsg.Stop - lhMsg.Start) >= MINIMUM_REQUIRED_TRANSMIT_TIME_SECONDS && !sessionIdCache.get(lhMsg.SessionID)) {
        sessionIdCache.set(lhMsg.SessionID, true);
        if ((Math.round(new Date().getTime() / 1000) - lhMsg.Stop) <= CACHE_SECONDS) {
            const lastHeard = lastHeardCache.get(lhMsg.DestinationID);
            lastHeardCache.set(lhMsg.DestinationID, new Date().getTime());
            let talkerAlias = '';
            if (lhMsg.TalkerAlias) {
                talkerAlias = `(${lhMsg.TalkerAlias.replace(lhMsg.SourceCall, '').trim()}) `;
            }
            const duration = moment.duration(0 - (new Date().getTime() - lastHeard)).humanize();
            const msg = `Talkgroup ${lhMsg.DestinationID} - Transmission from ${lhMsg.SourceCall} ${talkerAlias}lasted ${lhMsg.Stop - lhMsg.Start} seconds. The previous transmission was ${duration} ago.`;
            console.log(msg);
            if (!ONLY_NOTIFY_IF_NO_TRANSMISSIONS_FOR_SECONDS || (ONLY_NOTIFY_IF_NO_TRANSMISSIONS_FOR_SECONDS && (!lastHeard || new Date().getTime() - lastHeard > ONLY_NOTIFY_IF_NO_TRANSMISSIONS_FOR_SECONDS * 1000))) {
                console.log('Notify');
		channels.forEach( channel => {
			console.log(channel)
			channel.send(msg)
			//client.channels.fetch("971516057804218478").then( (channel) => channel.send(msg))
		});
	
		
            } else {
                console.log('Not notifying, last activity was too soon.');
            }
        }
    }
});





