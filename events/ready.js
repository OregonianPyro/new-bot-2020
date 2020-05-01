module.exports = async (client) => {
    let unmuteFunction = require('../functions/unmute.js');
    console.log(`Logged in as ${client.user.tag}.`);
    client.setInterval(() => {
        unmuteFunction(client);
    }, (60000));
};