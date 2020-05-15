module.exports.run = async (client, message, args) => {
    const notes = client.warns;
    const settings = client.settings.get(message.guild.id);
    const { MessageEmbed } = require('discord.js');
    const moment = require('moment');
    const wtf = '\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_';

    if (!message.member.permissions.has('KICK_MEMBERS')) {
        message.delete();
        return message.channel.send('**You must be a moderator to run this command.**');;
    };
    if (!args[0]) return client.execHelp(message, 'warns');
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) {
        message.delete();
        return message.channel.send('**Error finding that user.**');
    };
    if (!notes.has(member.user.id)) {
        message.delete();
        return message.channel.send('That user has no active warnings.');
    }; 
    await message.delete();
    const userWarns = client.warns.get(member.user.id);
    const embed = new MessageEmbed()
        .setColor('BLUE')
        .setAuthor(member.user.username, member.user.displayAvatarURL())
        .setTitle('Warning History')
        .setDescription(`Found a total of **${userWarns.length}** warnings for ${member.user.username}`)
    for (let i in userWarns) {
        let tc = userWarns[i];
        embed.addField(wtf, `Case #${tc.caseNum}\nModerator: ${tc.moderator}\nReason: ${tc.reason}\nDate: ${tc.date.split(',')[0]}`)
    };
    return message.channel.send(embed);
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
    name: 'Warns',
    description: 'Displays all active warnings for a user.',
    usage: '$warns <@user|userID>',
    parameters: 'snowflakeGuildMember',
    aliases: ['warnings', 'showwarnings', 'userwarns'],
    cat: 'Moderator'
};