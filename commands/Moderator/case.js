module.exports.run = async (client, message, args) => {
    const { MessageEmbed } = require('discord.js');
    const modArray = client.modCases.get(message.guild.id);
    //check user's permissions
    if (!message.member.permissions.has('KICK_MEMBERS')) {
        message.delete();
        return message.channel.send('**You must be a moderator to run this command.**');
    };
    if (!args[0]) return client.execHelp(message, 'case');
    const providedNum = args[0];
    // if (!typeof(providedNum) != 'number') {
    //     message.delete();
    //     return message.channel.send('**Invalid case number provided.**');
    // };
    //check for case number
    const num = args[0];
    if (!modArray[num - 1]) {
        message.delete();
        return message.channel.send('**No moderation record exists with that case number.**');
    };
    const thisCase = modArray[num - 1];
    await message.delete();
    //let msg = message.channel.send('Fetching case details, please wait...');
    const embed = new MessageEmbed()
        .setColor(thisCase.type != 'ban' ? 'BLUE' : 'RED')
        .setAuthor(message.guild.name, message.guild.iconURL())
        .addField('Case #', thisCase.case, true)
        .addField('User', thisCase.user, true)
        .addField('Moderator', thisCase.moderator, true)
        .addField('Type', thisCase.type)
        .addField('Reason', `\`\`\`${thisCase.reason}\`\`\``)
        .addField('Occurred On', thisCase.time)
    return message.channel.send(embed);
};

module.exports.conf = {
    enabled: true,
    reason: null,
    perms: {
        user: 'KICK_MEMBERS',
        bot: 'EMBED_LINKS'
    }
};

module.exports.help = {
    name: 'Case',
    description: 'Displays details about a specific moderation case.',
    usage: '$case <number>',
    parameters: 'integerCaseNumber',
    aliases: [],
    cat: 'Moderator'
};