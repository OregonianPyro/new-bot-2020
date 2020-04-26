module.exports.run = async (client, message, args) => {
    const { MessageEmbed } = require('discord.js');
    const fs = require('fs');
    const ms = require('ms');
    const moment = require("moment");
    const momentDurationFormatSetup = require("moment-duration-format");
    momentDurationFormatSetup(moment);
    if (!message.member.permissions.has('KICK_MEMBERS')) {
        message.delete();
        return message.channel.send('**You must be a moderator to run this command.**');
    };
    if (!args[0]) return client.execHelp(message, 'mute');
    if (!client.settings.get(message.guild.id).muted_role) {
        message.delete();
        return message.channel.send('**This server has not set a muted role. Please set a muted role or run the `createmute` command.**');
    };
    const settings = client.settings.get(message.guild.id);
    if (!message.guild.roles.cache.get(settings.muted_role)) {
        message.delete();
        return message.channel.send(`**Unable to find the current muted role \`${settings.muted_role}\`**`);
    };
    const mutedRole = message.guild.roles.cache.get(settings.muted_role).id;
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return client.execHelp(message, 'mute');
    /*
    if (member.roles.highest.rawPosition >= message.member.roles.highest.rawPosition) {
        message.delete();
        return message.channel.send('**You cannot moderate a user with an equal or higher role than you.**');
    };
    if (member.user.id === message.author.id) {
        message.delete();
        return message.channel.send('**You cannot moderate yourself.**');
    };
    if (member.user.id === message.guild.owner.id) {
        message.delete();
        return message.channel.send('**You cannot moderate the server owner.**');
    };
    ^^ WORKS ^^
    */ 
    const time = args[1];
    if (!time || time.length < 1) return client.execHelp(message, 'mute');
    // if (ms(time) < 300000 || ms(time) > 604800000) {
    //     message.delete();
    //     return message.channel.send('**Mutes cannot be shorter than 5 minutes or longer than 7 days.');
    // }
    const reason = args.slice(2).join(' ');
    if (!reason || reason.length < 1) return client.execHelp(message, 'mute');
    await message.delete();
    if (client.activeMutes.has(member.user.id)) {
        message.delete();
        return message.channel.send('**That user is already muted.**');
    };
    let curMutes = client.activeMutes;
    if (!curMutes.has(member.user.id)) {
        await curMutes.set(member.user.id, {
            id: member.user.id,
            guild: message.guild.id,
            guild_muted_role: client.settings.get(message.guild.id).muted_role,
            time: time
        });
    };
    let timeInMins;
    if (time.includes("m")) timeInMins = time.replace("m", " minutes");
    if (time.includes("d")) timeInMins = time.replace("d", " days");
    if (time.includes("h")) timeInMins = time.replace("h", " hours");
    const userDM = new MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setDescription(`You have been muted in **${message.guild.name}** by ${message.author.tag} for \`${timeInMins}\``)
        .addField('Reason', reason)
        .setColor('BLUE')
        .setThumbnail('https://goo.gl/HNsDw1')
    try {
        await member.send(userDM);
    } catch (e) {
        console.log(e);
    };
    const channelEmbed = new MessageEmbed()
        .setThumbnail('https://goo.gl/HNsDw1')
        .setAuthor(message.author.username, message.author.avatarURL())
        .setTitle('User Muted')
        .setDescription(`**${member.user.username}** has been muted by ${message.author.username} for ${timeInMins}`)
        .addField('Reason', reason)
        .setColor('BLUE')
    try {
        await member.roles.add(message.guild.roles.cache.find(r => r.id === mutedRole));
    } catch (e) {
        return message.channel.send(`:no_entry: **Command failed: ${e.message}**`);
    };
    const logtime = moment().format('MMMM Do YYYY, h:mm:ss a');
    const current = client.modCases.get(message.guild.id);
    const caseNum = client.modCases.get(message.guild.id).length + 1;
    current.push({
        case: caseNum,
        user: member.user.tag,
        moderator: message.author.tag,
        type: "mute",
        length: timeInMins,
        time: time,
        reason: reason
    });
    if (!client.userModCases.has(member.user.id)) {
        await client.userModCases.set(member.user.id, []);
    };
    const userCases = client.userModCases.get(member.user.id);
    userCases.push({
        case: caseNum,
        user: member.user.tag,
        moderator: message.author.tag,
        type: "mute",
        length: timeInMins,
        time: time,
        reason: reason
    });
    client.userModCases.set(member.user.id, userCases);
    message.channel.send(member.user, channelEmbed);
    if (!client.settings.get(message.guild.id).logging.modlog.enabled || !message.guild.channels.cache.get(client.settings.get(message.guild.id).logging.modlog.id)) return;
    let channel = message.guild.channels.cache.get(client.settings.get(message.guild.id).logging.modlog.id);  
    const logEmbed = new MessageEmbed()
        .setAuthor(`${member.user.tag} | Mute`, member.user.avatarURL())
        .setDescription(`**${member.user.tag}** (\`${member.user.id}\`) was muted by ${message.author.tag} for **${timeInMins}**`)
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
    name: 'Mute', 
    description: 'Temporarily mutes a user.',
    usage: '$mute <@user|user ID> <time> <reason>',
    aliases: '[]',
    parameters: 'snowflakeGuildMember, integerTime, stringReason',
    remarks: 'Mute times cannot be less than 5 minutes, or more than 7 days. Muting an already muted user will override their current mute.',
    category: 'Moderator'
};