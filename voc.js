//variables
const fs = require('fs');
const Discord = require('discord.js');
require('dotenv').config();
const client = new Discord.Client();
client.commands = new Discord.Collection();
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
const commandFolders = fs.readdirSync('./commands');
const mongo = require('./mongo')
for (const file of eventFiles) {
	const event = require(`./events/${file}`);//find the events folder
	if (event.once) {client.once(event.name, (...args) => event.execute(...args, client));} else {client.on(event.name, (...args) => event.execute(...args, client));}}//Event listner
for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));//find command folder
	for (const file of commandFiles) {//find command files
		const command = require(`./commands/${folder}/${file}`);//define command
		client.commands.set(command.name, command);}}//command listener
const connectToMongoDB = async () => {await mongo().then(async (mongoose) => {try{console.log('DB - index: Connected')}finally{mongoose.connection.close}})}//Connect to the database
connectToMongoDB()
client.login(process.env.TOKEN);//Token login