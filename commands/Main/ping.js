const Discord = require('discord.js');
const client = new Discord.Client();
module.exports = {
	name: 'ping',
	description: 'See latency',
	execute(message){    
        message.channel.send('Pinging...').then(sent => {
            sent.edit(`Roundtrip latency: ${sent.createdTimestamp - message.createdTimestamp}ms`);
        });
    },
};