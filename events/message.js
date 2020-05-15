module.exports = async (client, message) => {
    const { MessageEmbed } = require('discord.js');
    //if (message.channel.type !== 'text') return message.channel.send("Thanks for your message, but I am a bot. I am not programmed to read/reply to messages.");
    if (message.author.bot) return;
    const settings = client.settings.get(message.guild.id) || require('../default_settings.js');
    //if (settings.ignored.users.includes(message.author.id)) return;
    //if (settings.ignored.channels.includes(message.channel.id)) return;
    //await require('./functions/spamDetect.js')(client, message);
    ///if (message.member.roles.some(r => settings.ignored.roles.includes(r.id))) return;
    if (message.content.toLowerCase() === `<@!397946421812396033> fuck you`) return require('../functions/fakeKick.js')(message);
    if (message.content === '<@484166057284861972> prefix') return message.reply(`the prefix is \`${settings.prefix}\``);
    if (message.content.indexOf(settings.prefix) !== 0) return;
    const args = message.content.split(' ').slice(1);
    let command = message.content.split(' ')[0];
    command = command.slice(settings.prefix.length).toLowerCase();
    /**
     * extremely shitty and dangerous command 'handler' right here. But it'll do for this.
     */
    if (client.commands.has(command)) {
        const cmd = client.commands.get(command);
        if (!cmd.conf.enabled) {
            message.delete();
            const embed = new MessageEmbed()
                .setColor('RED')
                .setAuthor(client.user.username, client.user.avatarURL())
                .setTitle('Command Disabled')
                .setDescription(`The command '**${cmd.help.name.toLowerCase()}**' has been disabled by the bot developer.`)
                .addField('Reason', cmd.conf.reason)
            return message.channel.send(embed);
        }
        cmd.run(client, message, args);
    } else if (client.aliases.has(command)) {
        const cmd = client.aliases.get(command);
        if (!cmd.conf.enabled) {
            message.delete();
            const embed = new MessageEmbed()
                .setColor('RED')
                .setAuthor(client.user.username, client.user.avatarURL())
                .setTitle('Command Disabled')
                .setDescription(`The command '**${cmd.help.name.toLowerCase()}**' has been disabled by the bot developer.`)
                .addField('Reason', cmd.conf.reason)
            return message.channel.send(embed);
        }
        cmd.run(client, message, args);
    };
};