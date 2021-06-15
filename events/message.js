//Variables
const { prefix } = require('../config.json');
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');//some stuff for mention prefix
const setupSchema = require('../models/setupSchema')
module.exports = {
	name: 'message',
	async execute(message, client) {
        if(!message.content.startsWith(prefix))return;//If it doesnt start with the prefix then ignore
        if (message.author.bot) return;//If a bot sent it ignore
        const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);//Some mention prefix stuff
        if (!prefixRegex.test(message.content)) return;//^^
        const [, matchedPrefix] = message.content.match(prefixRegex);//^^
        const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);//Set arguments
        const commandName = args.shift().toLowerCase();//Check what command it is
        const command = client.commands.get(commandName)|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));//Find it in the commands folder

        //Normally this would be in seperate files in the commands folder but the ay i do it means it has to be in an event
        if(commandName === 'c'){
            const result = await setupSchema.findOne({userID: message.author.id})//Search for it in the database
            if(result.userID !== message.author.id)return message.channel.send('No perms')
            const channelArray = result.channel//Define the array of channels
            const comment = args.splice(0).join(" ")//Get all words and join them
            for (i = 0; i < channelArray.length; i++){//For each channel that exists in the array it will send the thing with the tag
                if(!comment){return message.channel.send('You did not provide a comment')}//If you dont put a comment it will throw an error
                const cEmbed = new Discord.MessageEmbed()//Define the embed
                    .setColor('DC143C')
                    .setDescription(comment)
                    .setTimestamp()
                client.channels.cache.get(result.channel[i]).send(cEmbed)//Send to the channel in the array which was set earlier
                //client.channels.cache.get(result.channel[i]).send('Comment without image sent by vocaloid')//Send the role
            }
        }
        if(commandName === 'ni'){
            //This and 'n'/'ci' are the same almost
            const result = await setupSchema.findOne({userID: message.author.id})
            if(result.userID !== message.author.id)return message.channel.send('No perms')
            const channelArray = result.channel
            const roleArray = result.role//Define the role array
            const comment = args.splice(1).join(" ")//Get all the words after the image link and join them
            const image = args[0]//Set the image in the embed
            for (i = 0; i < channelArray.length; i++){
                if(!comment){return message.channel.send('You did not provide a comment')}
                const cEmbed = new Discord.MessageEmbed()
                    .setColor('DC143C')
                    .setDescription(comment)
                    .setImage(image)
                    .setTimestamp()
                client.channels.cache.get(result.channel[i]).send(cEmbed)//Send the embed
                client.channels.cache.get(result.channel[i]).send(roleArray[i])//Send the role
                //client.channels.cache.get(result.channel[i]).send('Note with image sent by vocaloid')//Send the role
                
            }
        }
        if(commandName === 'ci'){
            const result = await setupSchema.findOne({userID: message.author.id})
            if(result.userID !== message.author.id)return message.channel.send('No perms')
            const channelArray = result.channel
            const comment = args.splice(1).join(" ")
            const image = args[0]
            for (i = 0; i < channelArray.length; i++){
                if(!comment){return message.channel.send('You did not provide a comment')}
                const cEmbed = new Discord.MessageEmbed()
                    .setColor('DC143C')
                    .setDescription(comment)
                    .setTimestamp()
                    .setImage(image)
                client.channels.cache.get(result.channel[i]).send(cEmbed)
                //client.channels.cache.get(result.channel[i]).send('Comment with image sent by vocaloid')//Send the role
            }
        }
        if(commandName === 'n'){
            const result = await setupSchema.findOne({userID: message.author.id})
            if(result.userID !== message.author.id)return message.channel.send('No perms')
            const channelArray = result.channel
            const roleArray = result.role
            const comment = args.splice(0).join(" ")
            for (i = 0; i < channelArray.length; i++){
                if(!comment){return message.channel.send('You did not provide a comment')}
                const cEmbed = new Discord.MessageEmbed()
                    .setColor('DC143C')
                    .setDescription(comment)
                    .setTimestamp()
                client.channels.cache.get(result.channel[i]).send(cEmbed)
                client.channels.cache.get(result.channel[i]).send(roleArray[i])
                //client.channels.cache.get(result.channel[i]).send('Note without image sent by vocaloid')//Send the role
            }
        }
        if (!command) return;//If the command doest exist ignore
        try {
            command.execute(message, args);//Try to do the command
        } catch (error) {
            console.error(error);//Throw an error if it cant execute the command
            message.reply('There was an error.');
        }
        
        
	},
};