const { Client } = require('discord.js');
const Enmap = require('enmap');
const fs = require('fs');
const client = new Client();
client.login(require('./secrets/token.js'));
client.defaultSettings = require('./default_settings');
client.settings = new Enmap({ name: 'settings' });
client.modCases = new Enmap({ name: 'moderation-cases-guild' });
client.userModCases = new Enmap({ name: 'user-mod-cases' });
client.stars = new Enmap({ name: 'stars' });
client.roleHierachy = require('./functions/roleHierarchy');
client.execHelp = require('./functions/execHelp.js');
client.commands = new Enmap();
client.aliases = new Enmap();
client.aliases = new Enmap();
client.activeMutes = new Enmap({ name: 'active-mutes' });
client.spam = new Enmap({ name: "spam" });
client.notes = new Enmap({ name: "notes" });
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
      console.log('Attempting to load aliases');
      if (!typeof(props.aliases) !== 'array') return console.log("No aliases to set.")
      for (let  i in props.aliases) {
        client.aliases.set(props.aliases[i], commandName);
        console.log(`Aliase '${props.aliases[i]}' set.`);
      };
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
      console.log('Attempting to load aliases');
      if (!typeof(props.aliases) !== 'array') return console.log("No aliases to set.")
      for (let  i in props.aliases) {
        client.aliases.set(props.aliases[i], commandName);
        console.log(`Aliase '${props.aliases[i]}' set.`);
      };
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
      console.log('Attempting to load aliases');
      if (!typeof(props.aliases) !== 'array') return console.log("No aliases to set.")
      for (let  i in props.aliases) {
        client.aliases.set(props.aliases[i], commandName);
        console.log(`Aliase '${props.aliases[i]}' set.`);
      };
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
      console.log('Attempting to load aliases');
      if (!typeof(props.aliases) !== 'array') return console.log("No aliases to set.")
      for (let  i in props.aliases) {
        client.aliases.set(props.aliases[i], commandName);
        console.log(`Aliase '${props.aliases[i]}' set.`);
      };
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
      console.log('Attempting to load aliases');
      if (!typeof(props.aliases) !== 'array') return console.log("No aliases to set.")
      for (let  i in props.aliases) {
        console.log(props.aliases[i]);
        client.aliases.set(props.aliases[i], commandName);
        console.log(`Aliase '${props.aliases[i]}' set.`);
      };
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
      console.log('Attempting to load aliases');
      if (!typeof(props.aliases) !== 'array') return console.log("No aliases to set.")
      for (let  i in props.aliases) {
        client.aliases.set(props.aliases[i], commandName);
        console.log(`Aliase '${props.aliases[i]}' set.`);
      };
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
      console.log('Attempting to load aliases');
      if (!typeof(props.aliases) !== 'array') return console.log("No aliases to set.")
      for (let  i in props.aliases) {
        client.aliases.set(props.aliases[i], commandName);
        console.log(`Aliase '${props.aliases[i]}' set.`);
      };
      });
  });
//
//
fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

client.commands.forEach(c => {
  for (let i in c.aliases) {
    client.aliases.set(c.aliases[i], c.help.name.toLowerCase());
  };
});

process.on('unhandledRejection', e => console.log(e));