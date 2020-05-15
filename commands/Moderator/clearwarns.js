module.exports.run = async (client, message, args) => {
    const warns = client.warns;
    const settings = client.settings.get(message.guild.id);
    const { MessageEmbed } = require('discord.js');
    const moment = require('moment');
    if (!message.member.permissions.has('KICK_MEMBERS')) {
        message.delete();
        return message.channel.send('**You must be a moderator to run this command.**');;
    };
    if (!args[0]) return client.execHelp(message, 'clearwarns');
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) {
        message.delete();
        return message.channel.send('**Error finding that user.**');
    };
    if (!warns.has(member.user.id)) {
        message.delete();
        return message.channel.send('That user has no active warnings.');
    }; 
    let reason;
    !args[1] ? reason = 'N/A' : args.slice(1).join(' ');
    await message.delete();
    warns.delete(member.user.id);
    const embed = new MessageEmbed()
        .setAuthor(member.user.username, member.user.displayAvatarURL())
        .setTitle('Warnings Cleared')
        .setDescription(`Current warnings for **${member.user.username}** have been cleared by ${message.author.username}`)
        .addField('Reason', reason)
        .setColor('BLUE')
    message.channel.send(member.user, embed);
    if (!settings.logging.modlog.enabled || !message.guild.channels.cache.get(settings.logging.modlog.id)) return;
    let channel = message.guild.channels.cache.get(settings.logging.modlog.id);  
    const logEmbed = new MessageEmbed()
        .setAuthor(`${member.user.tag} | Warnings Cleared`, member.user.displayAvatarURL())
        .setDescription(`${message.author.username} cleared all warnings for **${member.user.tag}** (\`${member.user.id}\`)`)
        .addField('Reason', reason)
        .setFooter( moment().format('MMMM Do YYYY, h:mm:ss a'))
        .setColor('BLUE')
    return channel.send(logEmbed);
};

module.exports.conf = {
    enabled: true,
    reason: null,
    perms: {
        user: 'KICK_MEMBERS',
        bot: 'SEND_MESSAGES'
    }
};

module.exports.help = {
    name: 'Clearwarns',
    description: 'Clears all warnings for a user.',
    usage: '$clearwarns <@user|userID> [reason]',
    parameters: 'snowflakeGuildMember, optionalStringReason',
    aliases: ['cw', 'deletewarns', 'clearwarnings'],
    cat: 'Moderator'
};