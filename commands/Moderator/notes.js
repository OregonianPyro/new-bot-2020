module.exports.run = async (client, message, args) => {
    const notes = client.notes;
    const settings = client.settings.get(message.guild.id);
    const { MessageEmbed } = require('discord.js');
    const moment = require('moment');
    const wtf = '\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_';

    if (!message.member.permissions.has('KICK_MEMBERS')) {
        message.delete();
        return message.channel.send('**You must be a moderator to run this command.**');;
    };
    if (!args[0]) return client.execHelp(message, 'notes');
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) {
        message.delete();
        return message.channel.send('**Error finding that user.**');
    };
    if (!notes.has(member.user.id)) {
        message.delete();
        return message.channel.send('That user has no moderation notes.');
    }; 
    await message.delete();
    const userNotes = client.notes.get(member.user.id);
    const embed = new MessageEmbed()
        .setColor('BLUE')
        .setAuthor(member.user.username, member.user.avatarURL())
        .setTitle('Moderation Notes')
    for (let i in userNotes) {
        embed.addField(wtf, `Moderator: ${userNotes[i].moderator}\nTime: ${userNotes[i].time}\n**Note: ${userNotes[i].message}**`)
    };
    return message.channel.send(embed);
};

module.exports.config = {
    enabled: true,
    reason: null,
    perms: {
        user: 'KICK_MEMBERS',
        bot: 'SEND_MESSAGES'
    }
};

module.exports.help = {
    name: 'notes',
    description: 'Displays all moderation notes for a user.',
    usage: '$notes <@user|userID>',
    parameters: 'snowflakeGuildMember',
    aliases: [],
    cat: 'Moderator'
};