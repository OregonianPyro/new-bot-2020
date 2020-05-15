module.exports.run = async (client, message, args) => {
    const { MessageEmbed } = require('discord.js');
    const fs = require('fs');
    const admin = [];
    const adminConf = [];
    const games = [];
    const utility = [];
    const moderator = [];
    const modfun = [];
    for (let i in client.commands.array()) {
        const arrayed = client.commands.array();
        if (!arrayed[i].help.cat) continue;
        let cmd = arrayed[i].help;
        if (cmd.cat.toLowerCase() === 'administrator') admin.push(`$${cmd.name.toLowerCase()} - ${cmd.description}`);
        if (cmd.cat.toLowerCase() === 'admin-conf') adminConf.push(`$${cmd.name.toLowerCase()} - ${cmd.description}`);
        if (cmd.cat.toLowerCase() === 'games') games.push(`$${cmd.name.toLowerCase()} - ${cmd.description}`);
        if (cmd.cat.toLowerCase() === 'utility') utility.push(`$${cmd.name.toLowerCase()} - ${cmd.description}`);
        if (cmd.cat.toLowerCase() === 'moderator') moderator.push(`$${cmd.name.toLowerCase()} - ${cmd.description}`);
        if (cmd.cat.toLowerCase() === 'mod-fun') modfun.push(`$${cmd.name.toLowerCase()} - ${cmd.description}`);
    };
    if (args[0]) {
        let cmd = args[0].toLowerCase();
        if (!client.commands.has(cmd) && !client.aliases.has(cmd)) {
            message.delete();
            return message.channel.send('Invalid command.');
        };
        if (client.commands.has(cmd)) cmd = client.commands.get(cmd);
        if (client.aliases.has(cmd)) cmd = client.commands.get(client.aliases.get(cmd));
        const embed = new MessageEmbed()
            .setColor('BLUE')
            .setAuthor(`Command - $${cmd.help.name}`, client.user.avatarURL())
            .setDescription('`< >` denotes a __required__ parameter.\n`[ ]` denotes an optional parameter.')
            .addField('Description', cmd.help.description)
            .addField('Usage', cmd.help.usage)
            .addField('Alias(es)', cmd.help.aliases.length > 0 ? cmd.aliases.join(' ') : 'None')
            .addField('Parameters', cmd.help.parameters.length ? cmd.help.parameters : 'None')
        return message.channel.send(embed);
    };
    if (!message.member.permissions.has('KICK_MEMBERS')) {
        const embed = new MessageEmbed()
            .setColor('BLUE')
            .setAuthor('Utilidex Commands', client.user.avatarURL())
            .addField('Help / Utility', utility.join('\n'))
            .addField('Games', games.join('\n'))
        return message.channel.send(embed);
    };
    if (message.member.permissions.has('KICK_MEMBERS') && !message.member.permissions.has('ADMINISTRATOR')) {
        const embed = new MessageEmbed()
        .setColor('BLUE')
        .setAuthor('Utilidex Commands', client.user.avatarURL())
        .addField('Help / Utility', utility.join('\n'))
        .addField('Games', games.join('\n'))
        .addField('Moderator', moderator.join('\n'))
        .addField('Moderator-Fun', modfun.join('\n'))
    return message.channel.send(embed);
    };
    if (message.member.permissions.has('ADMINISTRATOR')) {
        const embed = new MessageEmbed()
        .setColor('BLUE')
        .setAuthor('Utilidex Commands', client.user.avatarURL())
        .addField('Help / Utility', utility.join('\n'))
        .addField('Games', games.join('\n'))
        .addField('Moderator', moderator.join('\n'))
        .addField('Moderator-Fun', modfun.join('\n'))
        .addField('Administrator', admin.join('\n'))
    return message.channel.send(embed);
    };
};

module.exports.conf = {
    enabled: true,
    reason: 'Command has some errors with it.',
    perms: {
        user: 'SEND_MESSAGES',
        bot: 'SEND_MESSAGES'
    }
};

module.exports.help = {
    name: 'Help',
    description: 'Displays a list of all commands or help for a specific command.',
    usage: '$help [commandName]',
    parameters: 'stringCommandName',
    aliases: [],
    cat: 'Utility'
};