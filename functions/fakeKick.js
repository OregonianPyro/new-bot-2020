module.exports = async (message) => {
    const client = message.client;
    const { MessageEmbed } = require('discord.js');
    const channelEmbed = new MessageEmbed()
        .setThumbnail('https://goo.gl/HNsDw1')
        .setAuthor(client.user.username, client.user.avatarURL())
        .setTitle('User Kicked')
        .setDescription(`**${message.author.username}** has been kicked by ${client.user.username}`)
        .addField('Reason', 'Hasta la vista, baby!')
        .setColor('BLUE')
    const userDM = new MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setDescription(`You have been kicked from **${message.guild.name}** by ${client.user.tag}`)
        .addField('Reason', 'Hasta la vista, baby!')
        .setColor('BLUE')
        .setFooter('[!] You can rejoin with a valid invite link.')
        .setThumbnail('https://goo.gl/HNsDw1')
    try {
        await message.author.send(userDM);
    } catch (e) {
        console.log(e);
    };
    await message.channel.send(message.member, channelEmbed);
    setTimeout(() => {
        message.channel.send('Psyche.')
        try {
            message.author.send('Psyche.');
        } catch (e) {
            console.log(e.message);
        };
    }, (5000));
};