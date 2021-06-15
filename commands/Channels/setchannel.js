const Discord = require('discord.js')
const setupSchema = require('../../models/setupSchema')
module.exports = {
	name: 'setchannel',
	description: 'Set channel',
	async execute(message, args){    
        if(!args[0]){
            return message.channel.send('No role was stated')
        }//If you don't provide a role it will throw an error
        const result = await setupSchema.findOne({userID: message.author.id})//Find the setup in the database
        if(args[0] === '@everyone'){
            var role = '@everyone'//Some stuff to make it work with @everyone
            var roleMention = '@everyone'//^^
        }else{
            role = message.mentions.roles.first();//See the first role which is mentioned
            roleMention = '<@&'+role.id+'>';
        }
        if(result){//If it exists it will update the array
            if('275043451211481090' !== message.author.id)return message.channel.send('No perms')
            if(result.channel.includes(message.channel.id)){
                const i = result.channel.indexOf(message.channel.id)
                await setupSchema.updateOne({
                    userID: message.author.id,
                }, {
                    $pull: {
                        channel: result.channel[i],
                        role: result.role[i],
                    }
                })
                await setupSchema.updateOne({
                    userID: message.author.id,
                }, {
                    $push: {
                        channel: message.channel.id,
                        role: roleMention,
                    }
                })
                const updateChannelEmbed = new Discord.MessageEmbed()//Define embed
                    .setColor('ff63dd')
                    .setTitle('Alert settings updated for ' + message.channel.guild.name)
                    .setDescription('**Channel:** <#'+message.channel.id+'>\n**Role: **'+roleMention)
                return message.channel.send(updateChannelEmbed)
            }else{
                await setupSchema.updateOne({
                    userID: message.author.id,//Find the document in the database
                }, {
                    $push: {
                        channel: message.channel.id,
                        role: roleMention,//Add the role and channel id to their respective databases
                    }
                })
            }
            //}
            
        }else if(!result) {//If not it will make one
            const setup = {
                userID: message.author.id,
                userName: message.author.tag,
                channel: message.channel.id,
                role: roleMention,
                
            }//Define what to be added to the database
            console.log('Setup logged to the database')
            await new setupSchema(setup).save()//Create it with what was defined above
        }
        
        const setChannelEmbed = new Discord.MessageEmbed()//Define embed
            .setColor('ff63dd')
            .setTitle('Alert settings for ' + message.channel.guild.name)
            .setDescription('**Channel:** <#'+message.channel.id+'>\n**Role: **'+roleMention)
        message.channel.send(setChannelEmbed)//Send embed
    },
};