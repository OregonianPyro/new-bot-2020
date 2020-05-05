module.exports = async (client, message) => {
    if (message.guild.id === "312344792300519425") return;
    setInterval(() => {
        if (!client.spam.has(message.author.id)) client.spam.set(message.author.id, [])
        const userSpam = client.spam.get(message.author.id);
        userSpam.push("a");
        client.spam.set(message.author.id, userSpam);
        if (client.spam.get(message.author.id).length < 8) return client.spam.set(message.author.id, []);
        if (client.spam.get(message.author.id).length > 7) return message.channel.send("SPAM"), client.spam.set(message.author.id, []);
    }, (5000));
};


/*
if (message.guild.id === "312344792300519425") return;
    if (!client.spam.has(message.author.id)) client.spam.set(message.author.id, []);
    //console.log(client.spam)
    const userSpam = client.spam.get(message.author.id);
    userSpam.push("a");
    client.spam.set(message.author.id, userSpam);
    console.log(client.spam.get(message.author.id).length);
*/