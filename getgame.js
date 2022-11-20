module.exports = async (input, interaction) => {
    const errormsg = `please input a valid name (case sensitive), abbreviation or id \ninput given: \`${decodeURIComponent(input)}\``;
    const res = await fetch(`https://www.speedrun.com/api/v1/games/${input}`);
    let json = await res.json().catch();
    if (json.data) return json;
    const ares = await fetch(`https://www.speedrun.com/api/v1/games?name=${input}`);
    let ajson = await ares.json().catch();
	const channel = interaction.channel || interaction.user;
    if (!ajson.data) {
        channel.reply(errormsg);
        return;
    }
    if (ajson.data[0]) {
        json.data = ajson.data.find(x => x.names.international == decodeURIComponent(input))
        if (json.data) return json;
        else {
            channel.send(errormsg);
            return;
        }
    } else {
        if (ajson.data.id) return ajson;
        else {
            channel.send(errormsg);
            return;
        }
    }
}