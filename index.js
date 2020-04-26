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
client.commands = new Enmap();
client.aliases = new Enmap();
client.activeMutes = new Enmap({ name: 'active-mutes' });
//
//
fs.readdir("./commands/Admin/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      if (!file.endsWith(".js")) return;
      let props = require(`./commands/Admin/${file}`);
      let commandName = file.split(".")[0];
      console.log(`Attempting to load command ${commandName}`);
      client.commands.set(commandName, props);
      console.log(`[ LOADED ] Loaded command ${props.help.name}`);
    });
  });
  fs.readdir("./commands/Admin-Conf/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      if (!file.endsWith(".js")) return;
      let props = require(`./commands/Admin-Conf/${file}`);
      let commandName = file.split(".")[0];
      console.log(`Attempting to load command ${commandName}`);
      client.commands.set(commandName, props);
      console.log(`[ LOADED ] Loaded command ${props.help.name}`)
    });
  });
  fs.readdir("./commands/Dev-Only/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      if (!file.endsWith(".js")) return;
      let props = require(`./commands/Dev-Only/${file}`);
      let commandName = file.split(".")[0];
      console.log(`Attempting to load command ${commandName}`);
      client.commands.set(commandName, props);
      console.log(`[ LOADED ] Loaded command ${props.help.name}`)
    });
  });
  fs.readdir("./commands/Games/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      if (!file.endsWith(".js")) return;
      let props = require(`./commands/Games/${file}`);
      let commandName = file.split(".")[0];
      console.log(`Attempting to load command ${commandName}`);
      client.commands.set(commandName, props);
      console.log(`[ LOADED ] Loaded command ${props.help.name}`)
    });
  });
  fs.readdir("./commands/Moderator/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      if (!file.endsWith(".js")) return;
      let props = require(`./commands/Moderator/${file}`);
      let commandName = file.split(".")[0];
      console.log(`Attempting to load command ${commandName}`);
      client.commands.set(commandName, props);
      console.log(`[ LOADED ] Loaded command ${props.help.name}`)
    });
  });
  fs.readdir("./commands/Moderator-Fun/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      if (!file.endsWith(".js")) return;
      let props = require(`./commands/Moderator-Fun/${file}`);
      let commandName = file.split(".")[0];
      console.log(`Attempting to load command ${commandName}`);
      client.commands.set(commandName, props);
      console.log(`[ LOADED ] Loaded command ${props.help.name}`)
    });
  });
  fs.readdir("./commands/Utility/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      if (!file.endsWith(".js")) return;
      let props = require(`./commands/Utility/${file}`);
      let commandName = file.split(".")[0];
      console.log(`Attempting to load command ${commandName}`);
      client.commands.set(commandName, props);
      });
  });
//
//
client.on('ready', () => {
  let unmuteFunction = require('./functions/unmute.js');
    console.log(`Logged in as ${client.user.tag}.`);
    //
    client.setInterval(() => {
      unmuteFunction(client);
    }, (60000));
    //
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
    console.log(client.commands);
    const cmd = client.commands.get(command);
    console.log(!cmd)
    if (!cmd) return;
    cmd.run(client, message, args);
});

process.on('unhandledRejection', e => console.log(e));