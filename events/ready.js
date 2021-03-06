const {Collection,MessageEmbed} = require ('discord.js');
const db = require ('quick.db');
const fetch = require('node-fetch');
module.exports = {
  name:'ready',
  async run(client,prefix){
    console.log('bot ready')
    client.user.setActivity('SpeedrunsLive', { type: 'COMPETING' });
    const er = new Collection();
    
    

        
    
setInterval(async () => {
  
  
    const runs = await fetch('https://www.speedrun.com/api/v1/runs?status=verified&orderby=verify-date&direction=desc');

    const runsjson = await runs.json();
    
    const runsdata = runsjson.data;
    //fetching newly verified runs
runsdata.forEach(run => client.runs.set(run.id,run))
   //adding runs to client.runs collection
 client.runs.forEach(x => {
if(!runsdata.find(z => x.id == z.id)) client.runs.delete(x.id)
})
// deleting old unnecessary runs from client.runs
   
   
  const newruns = client.runs.filter(x => !er.has(x.id));
 //filter the runs that existing runs collection doesn't have
  if(newruns.first()){
    newruns.forEach(async newrun =>{
    let level='';
    let lvlid;
    let top;
   const userres = await fetch(`https://speedrun.com/api/v1/users/${newrun.players[0].id}`)
   const userjson = await userres.json()
   const user = await userjson.data.names.international
     // fetching user data
   const gameres = await fetch(`https://speedrun.com/api/v1/games/${newrun.game}`)
   const gamejson = await gameres.json()
   const game = gamejson.data.names.international
 //fetching game data
   const cover = gamejson.data.assets['cover-large'].uri
   const categoryres = await fetch(`https://speedrun.com/api/v1/categories/${newrun.category}`)
   const categoryjson = await categoryres.json()
   const category = categoryjson.data.name
   // fetching category data
   const variablesres = await fetch(`https://speedrun.com/api/v1/categories/${newrun.category}/variables`);
   const variablesjson = await variablesres.json();
   console.log(categoryjson)
   
   const runVariables = Object.entries(newrun.values);
		    let subcategoryName = '',subcategoryQuery = '';
		    runVariables.forEach(v => {
		    
			    const foundVariable = variablesjson.data.find(c => c.id === v[0]);
			    if (foundVariable['is-subcategory'] === true) {
				    subcategoryName += subcategoryName === '' ? foundVariable.values.values[v[1]].label : ', ' + foundVariable.values.values[v[1]].label;
				    subcategoryQuery += subcategoryQuery === '' ? '?var-' + v[0] + '=' + v[1] : '&var-' + v[0] + '=' + v[1];
			    
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
     const leaderres = await fetch(`https://speedrun.com/api/v1/leaderboards/${gamejson.data.id}/${level?`level/${lvlid}`:'category'}/${categoryjson.data.id}${subcategoryQuery}`);
     const leaderjson = await leaderres.json();
     const topobj = leaderjson.data.runs.find(rundata => rundata.run.id == newrun.id);
     if(topobj) top = topobj.place;
     // fetching place in leaderboards
     
   
    const embed = new MessageEmbed()
    .setTitle(`${game}:${level} ${category} ${subcategoryName}`)
    .setColor('RANDOM')
    .setDescription(`**${newrun.times.primary.replace('PT','').replace('H',' hours ').replace('M',' minutes ').replace('S',' seconds')} by ${user}**`)
    .setURL(newrun.weblink)
    .addField('Verified at:','`'+newrun.status['verify-date'].replace('T',' ').replace('Z','')+'`')
    .setThumbnail(cover);
    if(top) embed.addField('Place in leaderboards',top);
 // constructing the run embed
    client.guilds.cache.forEach(g => {
      const channel = g.channels.cache.find(c => c.name =='new-runs')
      
      const dbgame = db.get(`${g.id}.game`)
      
      if(channel){
        if(!dbgame ||!dbgame.length){

          channel.send(embed)
        } else {
                
          if(dbgame.includes(gamejson.data.id)){

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
   er.forEach(x => {
     if(!client.runs.has(x.id)) er.delete(x.id)
   })
// deleting unnecessary old runs
},60000);
// using setInterval to repeat the process every minute

  }
}
