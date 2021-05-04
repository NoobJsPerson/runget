const {Collection,MessageEmbed} = require ('discord.js');
const fs = require ('fs');
const fetch = require('node-fetch');
module.exports = {
  name:'ready',
  async run(client,prefix){
    console.log('bot ready')
    client.user.setActivity('SpeedrunsLive', { type: 'COMPETING' });
    let er = new Collection();
    
    
        
    
setInterval(async () => {
	const content = await fs.promises.readFile('./storage.json');
const storageObject = JSON.parse(content);



  
  
    const runs = await fetch('https://www.speedrun.com/api/v1/runs?status=verified&orderby=verify-date&direction=desc').catch();

    const runsjson = await runs.json();
    
    const runsdata = runsjson.data;
    //fetching newly verified runs
runsdata.forEach(run => client.runs.set(run.id,run))
   //adding runs to client.runs collection
 client.runs = client.runs.filter(x => runsdata.find(z => x.id == z.id));
// deleting old unnecessary runs from client.runs
   
   
  const newruns = client.runs.filter(x => !er.has(x.id));
 //filter the runs that existing runs collection doesn't have
  if(newruns.first()){
    newruns.forEach(async newrun =>{
    let level='', lvlid, top='N/A', game, cover, index, cache, guildid, user = '';
    
    const guildid = Object.keys(storageObject).find(x => storageObject[x].id == newrun.game);

    
const guildobj = storageObject[guildid];

if(guildid){ 
  index = guildobj.findIndex(x => x.id == newrun.game);
   if(index) cache = guildobj[index];
}
    if(cache){
game = cache.name;
cover = cache.url;
} else {
	const gameres = await fetch(`https://speedrun.com/api/v1/games/${newrun.game}`).catch();
   const gamejson = await gameres.json()
  game = gamejson.data.names.international
 //fetching game data
   cover = gamejson.data.assets['cover-large'].uri;
if(cache){
storageObject[guildid][index].url = cover
await fs.promises.writeFile('./storage.json', JSON.stringify(storageObject));
}

}
    for(let player of newrun.players){
   const userres = await fetch(`https://speedrun.com/api/v1/users/${player.id}`).catch();
   const userjson = await userres.json();
   const i = newrun.players.findIndex(x => x.id == player.id )
      user += (user?i==newruns.players.length-1?' and ':', ':'')+userjson.data.names.international

   }
     // fetching user data
   
   const categoryres = await fetch(`https://speedrun.com/api/v1/categories/${newrun.category}`).catch();
   const categoryjson = await categoryres.json();
   const category = categoryjson.data.name;
   // fetching category data
   const variablesres = await fetch(`https://speedrun.com/api/v1/categories/${newrun.category}/variables`).catch();
   const variablesjson = await variablesres.json();
   
   const runVariables = Object.entries(newrun.values);
		    let subcategoryName = '',subcategoryQuery = '';
		    runVariables.forEach(v => {
		    
			    const foundVariable = variablesjson.data.find(c => c.id === v[0]);
			    if (foundVariable['is-subcategory'] === true) {
				    subcategoryName += !subcategoryName ? foundVariable.values.values[v[1]].label : ', ' + foundVariable.values.values[v[1]].label;
				    subcategoryQuery += !subcategoryQuery? '?var-' + v[0] + '=' + v[1] : '&var-' + v[0] + '=' + v[1];
			    
		    }
		    });
// fetching subcategory data if found
   if(newrun.level){
        const lvlres = await fetch(`https://speedrun.com/api/v1/levels/${newrun.level}`);
        const lvljson = await lvlres.json();
        level = lvljson.data.name
        lvlid = lvljson.data.id
        //fetching level data if found
   }
     const leaderres = await fetch(`https://speedrun.com/api/v1/leaderboards/${newrun.game}/${level?`level/${lvlid}`:'category'}/${categoryjson.data.id}${subcategoryQuery}`);
     const leaderjson = await leaderres.json();
     const topobj = leaderjson.data.runs.find(rundata => rundata.run.id == newrun.id);
     if(topobj) top = topobj.place;
     // fetching place in leaderboards
     
   
    const embed = new MessageEmbed()
    .setTitle(`${game}:${level} ${category} ${subcategoryName}`)
    .setColor('RANDOM')
    .setDescription(`**${newrun.times.primary.replace('PT','').replace('H',' hours ').replace('M',' minutes ').replace('S',' seconds')} by ${user}**`)
    .setURL(newrun.weblink)
    .addField('Verified at:','`'+newrun.status['verify-date'].replace('T',' ').replace('Z','')+'`', true)
    .setThumbnail(cover)
    .addField('Place in leaderboards',top,true);
 // constructing the run embed
    client.guilds.cache.forEach(g => {
      const channel = g.channels.cache.find(c => c.name =='new-runs')

      
      const dbgame = storageObject[g.id]
      
      if(channel){
        if(!dbgame ||!dbgame.length){

          channel.send(embed)
        } else {
                
          if(dbgame.find(x => x.id == newrun.game)){

            channel.send(embed)
          
          }
        }
        // sending the embed
      }
    });
      
    })
  }
   client.runs.forEach(run=> er.set(run.id,run));
   //setting new runs to existing to not get detected as new next time

	er = er.filter(x => client.runs.has(x.id));
// deleting unnecessary old runs
},60000);
// using setInterval to repeat the process every minute

  }
}
