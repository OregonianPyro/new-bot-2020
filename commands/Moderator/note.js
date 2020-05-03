module.exports.run = async (client, message, args) => {
    const notes = client.notes;
    const settings = client.settings.get(message.guild.id);
    const { MessageEmbed } = require('discord.js');
    const moment = require('moment');
    if (!message.member.permissions.has('KICK_MEMBERS')) {
        message.delete();
        return message.channel.send('**You must be a moderator to run this command.**');;
    };
    if (!args[0]) return client.execHelp(message, 'note');
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) {
        message.delete();
        return message.channel.send('**Error finding that user.**');
    };
    if (!args[1]) return client.execHelp(message, 'note');
    const msg = args.splice(1).join(' ');
    await message.delete();
    if (!client.notes.has(member.user.id)) client.notes.set(member.user.id, []);
    const obj = {
        moderator: message.author.tag,
        message: msg,
        time: moment().format('MMMM Do YYYY, h:mm:ss a')
    };
    const currentUserNotes = client.notes.get(member.user.id);
    await currentUserNotes.push(obj);
    client.notes.set(member.user.id, currentUserNotes);
    const embed = new MessageEmbed()
        .setAuthor(member.user.username, member.user.avatarURL())
        .setTitle('Moderation Note Added')
        .setDescription(`${message.author.username} added a moderation note to **${member.user.username}**`)
        .addField('Note', msg)
        .setColor('BLUE')
    message.channel.send(embed);
    if (!settings.logging.modlog.enabled || !message.guild.channels.cache.get(settings.logging.modlog.id)) return;
    let channel = message.guild.channels.cache.get(settings.logging.modlog.id);  
    const logEmbed = new MessageEmbed()
        .setAuthor(`${member.user.tag} | Note Added`, member.user.avatarURL())
        .setDescription(`${message.author.username} added a moderation note for **${member.user.tag}** (\`${member.user.id}\`)`)
        .addField('Note', msg)
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
    name: 'Note',
    description: 'Adds a private note for a user. This note can only be seen by staff members and can be used as a way to share information.',
    usage: '$note <@user|userID> <message>',
    parameters: 'snowflakeGuildMember, stringMessage',
    aliases: "[]"
};