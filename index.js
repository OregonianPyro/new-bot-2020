const { Client } = require('discord.js');
const Enmap = require('enmap');
const fs = require('fs');
const client = new Client();
client.login(require('./secrets/token.js'));
client.defaultSettings = require('./default_settings');
client.settings = new Enmap({ name: 'settings' });
client.modCases = new Enmap({ name: 'moderation-cases-guild' });
client.userModCases = new Enmap({ name: 'user-mod-cases' });
client.roleHierachy = require('./functions/roleHierarchy');
client.execHelp = require('./functions/execHelp.js');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}.`);
});

client.on('error', (error) => {
    console.log(error);
});

client.on('guildCreate', (guild) => {
    client.settings.set(guild.id, require('./default_settings.js'));
});

client.on('guildDelete', (guild) => {
    client.settings.delete(guild.id);
});

client.on('message', async (message) => {
    if (message.channel.type !== 'text') return;
    if (message.author.bot) return;
    const settings = client.settings.get(message.guild.id) || require('./default_settings.js');
    if (settings.ignored.users.includes(message.author.id)) return;
    if (settings.ignored.channels.includes(message.channel.id)) return;
    ///if (message.member.roles.some(r => settings.ignored.roles.includes(r.id))) return;
    if (message.content === '<@484166057284861972> prefix') return message.reply(`the prefix is \`${settings.prefix}\``);
    if (message.content.indexOf(settings.prefix) !== 0) return;
    const args = message.content.split(' ').slice(1);
    let command = message.content.split(' ')[0];
    command = command.slice(settings.prefix.length).toLowerCase();
    /**
     * extremely shitty and dangerous command 'handler' right here. But it'll do for this.
     */
    let cmdFile = require(`./commands/${command}.js`);
    if (!cmdFile) return;
    // if (!message.member.permissions.has(cmdFile.conf.perms.user)) {
    //     return message.channel.send(`:no_entry: **You require the permission \`${cmdFile.conf.perms.user}\` to run this command.**`);
    // };
    try {
        await cmdFile.run(client, message, args);
    } catch (e) {
        console.error(e.stack);
        return message.channel.send(`:no_entry: **ERROR** | \`${e.message}\``);
    };
});