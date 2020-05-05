/*
$settings edit <key> [path] <val>
-> 
$settings view <all|logging|muterole|greeting|leaving>
*/
module.exports.run = async (client, message, args) => {
    const { MessageEmbed } = require('discord.js');
    const settings = client.settings.get(message.guild.id);
    if (!settings) client.settings.set(message.guild.id, require('../../default_settings.js'));
    if (!message.member.permissions.has('ADMINISTRATOR')) {
        message.delete();
        return message.channel.send('**You must be an administrator to run this command.**');
    };
    if (!args[0] || args.length < 1) return client.execHelp(message, 'settings');
    const key = args[0];
    if (!['view', 'edit', 'reset'].includes(args[0].toLowerCase())) {
        message.delete();
        return message.channel.send(`**They key \`${args[0]}\` is invalid.**`);
    };
    if (key.toLowerCase() === 'view') {
        if (!args[1]) {
            message.delete();
            return message.channel.send('**No input provided. Please provide a valid value.**');
        };
        if (!['all', 'logging', 'muterole', 'greeting', 'leaving'].includes(args[1].toLowerCase())) {
            message.delete();
            return message.channel.send('**Invalid input provided.**');
        };
        const val = args[1].toLowerCase();
        if (val === 'all') {
            const setLog = settings.logging;
            const channelExist = (channel) => {
                if (!message.guild.channels.cache.get(channel)) return 'Invalid Channel.';
                return message.guild.channels.cache.get(channel).name;
            };
            const modlog = `**Moderation Logging**\nEnabled: ${setLog.modlog.enabled}\nChannel: ${channelExist(setLog.modlog.id)}`;
            const msglog = `**Message Logging**\nEnabled: ${setLog.msglog.enabled}\nChannel: ${channelExist(setLog.msglog.id)}`;
            const nicklog = `**Nickname Logging**\nEnabled: ${setLog.nicklog.enabled}\nChannel: ${channelExist(setLog.nicklog.id)}`;
            const imglog = `**Image Logging**\nEnabled: ${setLog.imglog.enabled}\nChannel: ${channelExist(setLog.imglog.id)}`;
            const memberlog = `**Member Logging**\nEnabled: ${setLog.memberlog.enabled}\nChannel: ${channelExist(setLog.memberlog.id)}`;
            const rolelog = `**Role Logging**\nEnabled: ${setLog.rolelog.enabled}\nChannel: ${channelExist(setLog.rolelog.id)}`;
            const logging = [modlog, msglog, nicklog, imglog, memberlog, rolelog].join('\n');
            let greeting;
            if (!settings.greeting.enabled) greeting = 'Greeting is not setup.';
            if (settings.greeting.enabled) {
                const enabled = settings.greeting.enabled;
                const channel = message.guild.channels.cache.get(settings.greeting.id) || 'Invalid Channel';
                const text = settings.greeting.text;
                const type = settings.greeting.type;
                greeting = [enabled, channel, text, type].join('\n');
            };
            let leaving;
            if (!settings.leaving.enabled) leaving = 'Leaving is not setup.';
            if (settings.leaving.enabled) {
                const enabled = settings.leaving.enabled;
                const channel = message.guild.channels.cache.get(settings.leaving.id) || 'Invalid Channel';
                const text = settings.leaving.text;
                const type = settings.leaving.type;
                leaving = [enabled, channel, text, type].join('\n');
            };
            const roleExist = (role) => {
                if (!message.guild.channels.cache.get(role)) return 'Invalid or no role set.';
                return message.guild.roles.cache.get(role).name;
            };
            const embed = new MessageEmbed()
                .setColor('BLUE')
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setDescription(`Here are the current settings for **${message.guild.name}**`)
                .addField('Logging', logging)
                .addField('Muted Role', roleExist(settings.muted_role))
                .addField('Greeting', greeting)
                .addField('Leaving', leaving)
            return message.delete(), message.channel.send(embed);
        } else if (val = 'logging') {

        } else if (val === 'muterole') {
             
        } else if (val === 'greeting') {
            
        } else if (val === 'leaving') {

        };
    } else if (key.toLowerCase() === 'edit') {

    } else if (key.toLowerCase() === 'reset') {

    };
};

module.exports.conf = {
    enabled: true,
    reason: null,
    perms: {
        user: 'ADMINISTRATOR',
        bot: 'SEND_MESSAGES'
    }
};

module.exports.help = {
    name: 'Settings',
    description: 'View, edit, or reset the bot\'s settings.',
    usage: '$settings <view|edit|reset> <key> <key2|val>',
    parameters: 'stringFlag, stringKey, stringKey2|stringVal',
    aliases: ['set', 'conf'],
    cat: 'Admin-Conf'
};