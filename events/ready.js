module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
        console.log(`${client.user.tag} is ready!`);//console log ready
		const arrayOfStatus = [
			`apex legends`,
			`vocaloids alerts`,
		];//List of statuses to change to
		let index = 0
		setInterval(() => {//cycle through the statuses
			if(index === arrayOfStatus.length) index = 0;//if its at the end loop back
			const status = arrayOfStatus[index];//define the status from the list earlier
			client.user.setActivity(status);//set the status 
			index++;//add 1 to the index to switch to the next status
		}, 20000);
	},
};