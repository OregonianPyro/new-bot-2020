module.exports.run = async (client, message, args) => {
    const notes = client.notes;
    const settings = client.settings.get(message.guild.id);
    const { MessageEmbed } = require('discord.js');
    const moment = require('moment');
    if (!message.member.permissions.has('KICK_MEMBERS')) {
        message.delete();
        return message.channel.send('**You must be a moderator to run this command.**');;
    };
    if (!args[0]) return client.execHelp(message, 'clearnotes');
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) {
        message.delete();
        return message.channel.send('**Error finding that user.**');
    };
    if (!notes.has(member.user.id)) {
        message.delete();
        return message.channel.send('That user has no moderation notes.');
    }; 
    let reason;
    !args[1] ? reason = 'N/A' : args.slice(1).join(' ');
    await message.delete();
    notes.delete(member.user.id);
    const embed = new MessageEmbed()
        .setAuthor(member.user.username, member.user.avatarURL())
        .setTitle('Moderation Notes Deleted')
        .setDescription(`${message.author.username} deleted all moderation notes for **${member.user.username}**`)
        .addField('Reason', reason)
        .setColor('BLUE')
    message.channel.send(embed);
    if (!settings.logging.modlog.enabled || !message.guild.channels.cache.get(settings.logging.modlog.id)) return;
    let channel = message.guild.channels.cache.get(settings.logging.modlog.id);  
    const logEmbed = new MessageEmbed()
        .setAuthor(`${member.user.tag} | Notes Deleted`, member.user.avatarURL())
        .setDescription(`${message.author.username} deleted all moderation notes for **${member.user.tag}** (\`${member.user.id}\`)`)
        .addField('Reason', reason)
        .setFooter( moment().format('MMMM Do YYYY, h:mm:ss a'))
        .setColor('BLUE')
    return channel.send(logEmbed);
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
    name: 'Clearnotes',
    description: 'Deletes all moderation notes for a user.',
    usage: '$clearnotes <@user|userID> [reason]',
    parameters: 'snowflakeGuildMember, optionalStringReason',
    aliases: "[]"
};