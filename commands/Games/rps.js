module.exports.run = async (client, message, args) => {
    const { MessageEmbed } = require('discord.js');
    if (!args[0]) return client.execHelp(message, 'rps');
    const choice = args[0].toLowerCase();
    if (!['rock', 'paper', 'scissors'].includes(args[0])) {
        message.delete();
        return message.reply(`, **${args[0]}** is not a valid choice.`);
    };
    const botChoices = ['rock', 'paper', 'scissors'];
    const botChoice = botChoices[Math.floor(Math.random() * botChoices.length)];;
    const sendMsg = (color, msg) => {
        const embed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.avatarURL())
            .setColor(color)
            .setDescription(msg)
        return message.channel.send(embed);
    };
    switch (choice) {
        case 'rock':{
            switch (botChoice) {
                case 'rock':{
                    return sendMsg('GOLD', 'Rock, tie!');
                };
                case 'paper':{
                    return sendMsg('RED', 'Paper, I win!');
                };
                case 'scissors':{
                    return sendMsg('GREEN', 'Scissors, you win!');
                };
            };
        };
        case 'paper':{
            switch (botChoice) {
                case 'rock':{
                    return sendMsg('GREEN', 'Rock, you win!');
                };
                case 'paper':{
                    return sendMsg('GOLD', 'Paper, tie!');
                };
                case 'scissors':{
                    return sendMsg('RED', 'Scissors, I win!');
                };
            };
        };
        case 'scissors':{
            switch (botChoice) {
                case 'rock':{
                    return sendMsg('RED', 'Rock, I win!');
                };
                case 'paper':{
                    return sendMsg('GREEN', 'Paper, you win!');
                };
                case 'scissors':{
                    return sendMsg('GOLD', 'Scissors, tie!');
                };
            };
        };
    };
};

module.exports.config = {
    enabled: true,
    reason: null,
    perms: {
        user: 'SEND_MESSAGES',
        bot: 'SEND_MESSAGES'
    }
};

module.exports.help = {
    name: 'Rps',
    description: 'Play a game of rock, paper, scissors with the bot!',
    usage: '$rps <rock|paper|scissors>',
    parameters: 'stringChoice',
    aliases: ['rockpaper', 'rockpaperscissors'],
    cat: 'Games'
};