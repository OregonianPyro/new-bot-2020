module.exports.run = async (client, message, args) => {
    const { MessageEmbed } = require('discord.js');
    const moment = require('moment');
    if (!message.member.permissions.has('KICK_MEMBERS')) {
        message.delete();
        return message.channel.send('**You must be a moderator to run this command.**');
    };
    if (!args[0]) return client.execHelp(message, 'kick');
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return client.execHelp(message, 'kick');
    // if (member.roles.highest.rawPosition >= message.member.roles.highest.rawPosition) {
    //     message.delete();
    //     return message.channel.send('**You cannot moderate a user with an equal or higher role than you.**');
    // };
    if (member.user.id === message.author.id) {
        message.delete();
        return message.channel.send('**You cannot moderate yourself.**');
    };
    if (member.user.id === message.guild.owner.id) {
        message.delete();
        return message.channel.send('**You cannot moderate the server owner.**');
    };
    const reason = args.slice(1).join(' ');
    if (!reason || reason.length < 1) return client.execHelp(message, 'kick');
    await message.delete();
    const userDM = new MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setDescription(`You have been kicked from **${message.guild.name}** by ${message.author.tag}`)
        .addField('Reason', reason)
        .setColor('BLUE')
        .setFooter('[!] You can rejoin with a valid invite link.')
        .setThumbnail('https://goo.gl/HNsDw1')
    try {
        await member.send(userDM);
    } catch (e) {
        console.log(e);
    };
    const channelEmbed = new MessageEmbed()
        .setThumbnail('https://goo.gl/HNsDw1')
        .setAuthor(message.author.username, message.author.avatarURL())
        .setTitle('User Kicked')
        .setDescription(`**${member.user.username}** has been kicked by ${message.author.username}`)
        .addField('Reason', reason)
        .setColor('BLUE')
    try {
        await member.kick(`Kicked by ${message.author.tag} for ${reason}`);
    } catch (e) {
        return message.channel.send(`:no_entry: **Command failed: ${e.message}**`);
    };
    const time = moment().format('MMMM Do YYYY, h:mm:ss a');
    const current = client.modCases.get(message.guild.id);
    const caseNum = client.modCases.get(message.guild.id).length + 1;
    current.push({
        case: caseNum,
        user: member.user.tag,
        moderator: message.author.tag,
        type: "kick",
        time: time
    });
    if (!client.userModCases.has(member.user.id)) {
        await client.userModCases.set(member.user.id, []);
    };
    const userCases = client.userModCases.get(member.user.id);
    userCases.push({
        case: caseNum,
        user: member.user.tag,
        moderator: message.author.tag,
        type: "kick",
        time: time
    });
    client.userModCases.set(member.user.id, userCases);
    message.channel.send(member.user, channelEmbed);
    if (!client.settings.get(message.guild.id).logging.modlog.enabled || !message.guild.channels.cache.get(client.settings.get(message.guild.id).logging.modlog.id)) return;
    let channel = message.guild.channels.cache.get(client.settings.get(message.guild.id).logging.modlog.id);  
    const logEmbed = new MessageEmbed()
        .setAuthor(`${member.user.tag} | Kick`, member.user.avatarURL())
        .setDescription(`**${member.user.tag}** (\`${member.user.id}\`) was kicked by ${message.author.tag}`)
        .addField('Reason', reason)
        .setFooter(`Case #${caseNum} | ${time}`)
        .setColor('BLUE')
    return channel.send(logEmbed);
};

module.exports.conf = {
    enabled: true,
    reason: null,
    perms:{
        user:'KICK_MEMBERS',
        bot:'KICK_MEMBERS'
    }
};

module.exports.help = {
    name: 'Kick', 
    description: 'Kicks a member from the server.',
    usage: '$kick <@user|user ID> <reason>',
    aliases: '[]',
    parameters: 'snowflakeGuildMember, stringReason',
    category: 'Moderator'
};