module.exports = async (client, message) => {
    if (message.channel.type !== 'text') return message.channel.send("Thanks for your message, but I am a bot. I am not programmed to read/reply to messages.");
    if (message.author.bot) return;
    const settings = client.settings.get(message.guild.id) || require('../default_settings.js');
    if (settings.ignored.users.includes(message.author.id)) return;
    if (settings.ignored.channels.includes(message.channel.id)) return;
    //await require('./functions/spamDetect.js')(client, message);
    ///if (message.member.roles.some(r => settings.ignored.roles.includes(r.id))) return;
    if (message.content === '<@484166057284861972> prefix') return message.reply(`the prefix is \`${settings.prefix}\``);
    if (message.content.indexOf(settings.prefix) !== 0) return;
    const args = message.content.split(' ').slice(1);
    let command = message.content.split(' ')[0];
    command = command.slice(settings.prefix.length).toLowerCase();
    /**
     * extremely shitty and dangerous command 'handler' right here. But it'll do for this.
     */
    const cmd = client.commands.get(command);
    if (!cmd) return;
    cmd.run(client, message, args);
};