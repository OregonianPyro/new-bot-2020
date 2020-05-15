module.exports = async (client) => {
    const fs = require('fs');
    fs.readdir("../commands/Admin/", (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => {
          if (!file.endsWith(".js")) return;
          let props = require(`../commands/Admin/${file}`);
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
      fs.readdir("../commands/Admin-Conf/", (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => {
          if (!file.endsWith(".js")) return;
          let props = require(`../commands/Admin-Conf/${file}`);
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
      fs.readdir("../commands/Dev-Only/", (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => {
          if (!file.endsWith(".js")) return;
          let props = require(`../commands/Dev-Only/${file}`);
          let commandName = file.split(".")[0];
          console.log(`Attempting to load command ${commandName}`);
          client.commands.set(commandName, props);
          console.log('Attempting to load aliases');
          for (let  i in props.aliases) {
            client.aliases.set(props.aliases[i], commandName);
            console.log(`Aliase '${props.aliases[i]}' set.`);
          };
          console.log(`[ LOADED ] Loaded command ${props.help.name}`)
        });
      });
      fs.readdir("../commands/Games/", (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => {
          if (!file.endsWith(".js")) return;
          let props = require(`../commands/Games/${file}`);
          let commandName = file.split(".")[0];
          console.log(`Attempting to load command ${commandName}`);
          client.commands.set(commandName, props);
          console.log('Attempting to load aliases');
          for (let  i in props.aliases) {
            client.aliases.set(props.aliases[i], commandName);
            console.log(`Aliase '${props.aliases[i]}' set.`);
          };
          console.log(`[ LOADED ] Loaded command ${props.help.name}`)
        });
      });
      fs.readdir("../commands/Moderator/", (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => {
          if (!file.endsWith(".js")) return;
          let props = require(`../commands/Moderator/${file}`);
          let commandName = file.split(".")[0];
          console.log(`Attempting to load command ${commandName}`);
          client.commands.set(commandName, props);
          console.log('Attempting to load aliases');
          for (let  i in props.help.aliases) {
            client.aliases.set(props.help.aliases[i], props);
            console.log(`Aliase '${props.help.aliases[i]}' set.`);
          };
          console.log(`[ LOADED ] Loaded command ${props.help.name}`)
        });
      });
      fs.readdir("../commands/Moderator-Fun/", (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => {
          if (!file.endsWith(".js")) return;
          let props = require(`../commands/Moderator-Fun/${file}`);
          let commandName = file.split(".")[0];
          console.log(`Attempting to load command ${commandName}`);
          client.commands.set(commandName, props);
          console.log('Attempting to load aliases');
          for (let  i in props.help.aliases) {
            client.aliases.set(props.help.aliases[i], props);
            console.log(`Aliase '${props.help.aliases[i]}' set.`);
          };
          console.log(`[ LOADED ] Loaded command ${props.help.name}`)
        });
      });
      fs.readdir("../commands/Utility/", (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => {
          if (!file.endsWith(".js")) return;
          let props = require(`../commands/Utility/${file}`);
          let commandName = file.split(".")[0];
          console.log(`Attempting to load command ${commandName}`);
          client.commands.set(commandName, props);
          console.log('Attempting to load aliases');
          for (let  i in props.help.aliases) {
            client.aliases.set(props.help.aliases[i], props);
            console.log(`Aliase '${props.help.aliases[i]}' set.`);
          };
          console.log(`[ LOADED ] Loaded command ${props.help.name}`)
        });
      });
};