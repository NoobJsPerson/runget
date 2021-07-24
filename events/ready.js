const { Collection, MessageEmbed } = require('discord.js');
const fs = require('fs');
const fetch = require('node-fetch');
module.exports = {
ㅤname: 'ready',
ㅤasync run(client, prefix) {
ㅤㅤconsole.log('bot ready')
ㅤㅤclient.user.setActivity('SpeedrunsLive', { type: 'COMPETING' });
ㅤㅤlet er = new Collection();
ㅤㅤsetInterval(async () => {
ㅤㅤㅤconst content = await fs.promises.readFile('./storage.json');
ㅤㅤㅤconst storageObject = JSON.parse(content);
ㅤㅤㅤconst runs = await fetch('https://www.speedrun.com/api/v1/runs?status=verified&orderby=verify-date&direction=desc').catch();
ㅤㅤㅤconst runsjson = await runs.json();
ㅤㅤㅤconst runsdata = runsjson.data;
ㅤㅤㅤ//fetching newly verified runs
ㅤㅤㅤrunsdata.forEach(run => client.runs.set(run.id, run))
ㅤㅤㅤ//adding runs to client.runs collection
ㅤㅤㅤclient.runs = client.runs.filter(x => runsdata.find(z => x.id == z.id));
ㅤㅤㅤ// deleting old unnecessary runs from client.runs
ㅤㅤㅤconst newruns = client.runs.filter(x => !er.has(x.id));
ㅤㅤㅤ//filter the runs that existing runs collection doesn't have
ㅤㅤㅤif (newruns.first()) {
ㅤㅤㅤㅤnewruns.forEach(async newrun => {
ㅤㅤㅤㅤㅤlet level = '',
ㅤㅤㅤㅤㅤㅤlvlid, top = 'N/A',
ㅤㅤㅤㅤㅤㅤgame, cover, index, cache, guildid, user = '';
ㅤㅤㅤㅤㅤconst guildarr = Object.entries(storageObject).find(x => x[1].find(y => y.id == newrun.game));
ㅤㅤㅤㅤㅤif (guildarr) {
ㅤㅤㅤㅤㅤㅤguildid = guildarr[0];
ㅤㅤㅤㅤㅤㅤindex = guildarr[1].findIndex(x => x.id == newrun.game);
ㅤㅤㅤㅤㅤㅤcache = guildarr[1][index];
ㅤㅤㅤㅤㅤㅤgame = cache.name;
ㅤㅤㅤㅤㅤㅤif (cache.url)
ㅤㅤㅤㅤㅤㅤㅤcover = cache.url;
ㅤㅤㅤㅤㅤㅤelse {
ㅤㅤㅤㅤㅤㅤㅤconst gameres = await fetch(`https://speedrun.com/api/v1/games/${newrun.game}`);
ㅤㅤㅤㅤㅤㅤㅤconst gamejson = await gameres.json();
ㅤㅤㅤㅤㅤㅤㅤ//fetching game data
ㅤㅤㅤㅤㅤㅤㅤcover = gamejson.data.assets['cover-large'].uri;
ㅤㅤㅤㅤㅤㅤㅤif (cache) {
ㅤㅤㅤㅤㅤㅤㅤㅤstorageObject[guildid][index].url = cover;
ㅤㅤㅤㅤㅤㅤㅤㅤawait fs.promises.writeFile('./storage.json', JSON.stringify(storageObject));
ㅤㅤㅤㅤㅤㅤㅤ}
ㅤㅤㅤㅤㅤㅤ}
ㅤㅤㅤㅤㅤ}
ㅤㅤㅤㅤㅤfor (let player of newrun.players) {
ㅤㅤㅤㅤㅤㅤconst userres = await fetch(`https://speedrun.com/api/v1/users/${player.id}`).catch();
ㅤㅤㅤㅤㅤㅤconst userjson = await userres.json();
ㅤㅤㅤㅤㅤㅤconst i = newrun.players.findIndex(x => x.id == player.id)
ㅤㅤㅤㅤㅤㅤuser += (user ? i == newruns.players.length - 1 ? ' and ' : ', ' : '') + userjson.data.names.international

ㅤㅤㅤㅤㅤ}
ㅤㅤㅤㅤㅤ// fetching user data

ㅤㅤㅤㅤㅤconst categoryres = await fetch(`https://speedrun.com/api/v1/categories/${newrun.category}`).catch();
ㅤㅤㅤㅤㅤconst categoryjson = await categoryres.json();
ㅤㅤㅤㅤㅤconst category = categoryjson.data.name;
ㅤㅤㅤㅤㅤ// fetching category data
ㅤㅤㅤㅤㅤconst variablesres = await fetch(`https://speedrun.com/api/v1/categories/${newrun.category}/variables`).catch();
ㅤㅤㅤㅤㅤconst variablesjson = await variablesres.json();

ㅤㅤㅤㅤㅤconst runVariables = Object.entries(newrun.values);
ㅤㅤㅤㅤㅤlet subcategoryName = '',
ㅤㅤㅤㅤㅤㅤsubcategoryQuery = '';
ㅤㅤㅤㅤㅤrunVariables.forEach(v => {
ㅤㅤㅤㅤㅤㅤconst foundVariable = variablesjson.data.find(c => c.id === v[0]);
ㅤㅤㅤㅤㅤㅤif (foundVariable['is-subcategory'] === true) {
ㅤㅤㅤㅤㅤㅤㅤsubcategoryName += !subcategoryName ? foundVariable.values.values[v[1]].label : ', ' + foundVariable.values.values[v[1]].label;
ㅤㅤㅤㅤㅤㅤㅤsubcategoryQuery += !subcategoryQuery ? '?var-' + v[0] + '=' + v[1] : '&var-' + v[0] + '=' + v[1];

ㅤㅤㅤㅤㅤㅤ}
ㅤㅤㅤㅤㅤ});
ㅤㅤㅤㅤㅤ// fetching subcategory data if found
ㅤㅤㅤㅤㅤif (newrun.level) {
ㅤㅤㅤㅤㅤㅤconst lvlres = await fetch(`https://speedrun.com/api/v1/levels/${newrun.level}`);
ㅤㅤㅤㅤㅤㅤconst lvljson = await lvlres.json();
ㅤㅤㅤㅤㅤㅤlevel = lvljson.data.name
ㅤㅤㅤㅤㅤㅤlvlid = lvljson.data.id
ㅤㅤㅤㅤㅤㅤ//fetching level data if found
ㅤㅤㅤㅤㅤ}
ㅤㅤㅤㅤㅤconst leaderres = await fetch(`https://speedrun.com/api/v1/leaderboards/${newrun.game}/${level?`level/${lvlid}`:'category'}/${categoryjson.data.id}${subcategoryQuery}`);
ㅤㅤㅤㅤㅤconst leaderjson = await leaderres.json();
ㅤㅤㅤㅤㅤconst topobj = leaderjson.data.runs.find(rundata => rundata.run.id == newrun.id);
ㅤㅤㅤㅤㅤif (topobj) top = topobj.place;
ㅤㅤㅤㅤㅤ// fetching place in leaderboards
ㅤㅤㅤㅤㅤconst embed = new MessageEmbed()
ㅤㅤㅤㅤㅤㅤ.setTitle(`${game}:${level} ${category} ${subcategoryName}`)
ㅤㅤㅤㅤㅤㅤ.setColor('RANDOM')
ㅤㅤㅤㅤㅤㅤ.setDescription(`**${newrun.times.primary.replace('PT','').replace('H',' hours ').replace('M',' minutes ').replace('S',' seconds')} by ${user}**`)
ㅤㅤㅤㅤㅤㅤ.setURL(newrun.weblink)
ㅤㅤㅤㅤㅤㅤ.addField('Verified at:', '`' + newrun.status['verify-date'].replace('T', ' ').replace('Z', '') + '`', true)
ㅤㅤㅤㅤㅤㅤ.setThumbnail(cover)
ㅤㅤㅤㅤㅤㅤ.addField('Place in leaderboards', top, true);
ㅤㅤㅤㅤㅤ// constructing the run embed
ㅤㅤㅤㅤㅤclient.guilds.cache.forEach(g => {
ㅤㅤㅤㅤㅤㅤconst dbgame = storageObject[g.id];
ㅤㅤㅤㅤㅤㅤif (dbgame && dbgame[0]) {
ㅤㅤㅤㅤㅤㅤㅤconst channel = g.channels.cache.find(c => dbgame[0].channel == c.id);
ㅤㅤㅤㅤㅤㅤㅤif (channel && dbgame.find(x => x.id == newrun.game)) channel.send(embed);
ㅤㅤㅤㅤㅤㅤㅤ// sending the embed
ㅤㅤㅤㅤㅤㅤ}
ㅤㅤㅤㅤㅤ});

ㅤㅤㅤㅤㅤclient.users.cache.forEach(u => {
ㅤㅤㅤㅤㅤㅤconst dbgame = storageObject[u.id];
ㅤㅤㅤㅤㅤㅤif (dbgame && dbgame[0] && dbgame.find(x => x.id == newrun.game)) u.send(embed);
ㅤㅤㅤㅤㅤㅤ// sending the embed
ㅤㅤㅤㅤㅤ});

ㅤㅤㅤㅤ})
ㅤㅤㅤ}
ㅤㅤㅤclient.runs.forEach(run => er.set(run.id, run));
ㅤㅤㅤ//setting new runs to existing to not get detected as new next time

ㅤㅤㅤer = er.filter(x => client.runs.has(x.id));
ㅤㅤㅤ// deleting unnecessary old runs
ㅤㅤ}, 60000);
ㅤㅤ// using setInterval to repeat the process every minute
ㅤ}
}