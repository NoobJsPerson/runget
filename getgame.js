module.exports = async (input, interaction) => {
    const errormsg = "please input a valid name, abbreviation or id";
    const res = await fetch(`https://www.speedrun.com/api/v1/games/${input}`);
    let json = await res.json().catch();
    if (json.data) return json;
    const ares = await fetch(`https://www.speedrun.com/api/v1/games?name=${input}`);
    let ajson = await ares.json().catch();
    if (!ajson.data) {
        interaction.reply(errormsg);
        return;
    }
    if (ajson.data[0]) {
        json.data = ajson.data.find(x => x.names.international == decodeURIComponent(input))
        if (json.data) return json;
        else {
            interaction.reply(errormsg);
            return;
        }
    } else {
        if (ajson.data.id) return ajson;
        else {
            interaction.reply(errormsg);
            return;
        }
    }
}