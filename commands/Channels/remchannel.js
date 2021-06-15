const Discord = require('discord.js')
const setupSchema = require('../../models/setupSchema')
module.exports = {
	name: 'remchannel',
	description: 'Remove channel',
	async execute(message){
        const result = await setupSchema.findOne({userID: message.author.id})
        if(result.channel.includes(message.channel.id)){
            const i = result.channel.indexOf(message.channel.id)
            await setupSchema.updateOne({
                userID: message.author.id,
            }, {
                $pull: {
                    channel: message.channel.id,
                    role: result.role[i],
                }
            })
        }else return message.channel.send("This channel is not set");
        const setChannelEmbed = new Discord.MessageEmbed()
            .setColor('ff63dd')
            .setTitle('Alert settings removed for ' + message.channel.guild.name)
            .setDescription('**Channel:** <#'+message.channel.id+'>\n**Role:**' + result.role[0])
        message.channel.send(setChannelEmbed)
    },
};