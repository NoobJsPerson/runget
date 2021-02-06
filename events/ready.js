const {Collection,MessageEmbed} = require ('discord.js');
const db = require ('quick.db');
const fetch = require('node-fetch');
const {promisify} = require ('util');
module.exports = {
  name:'ready',
  async run(client,prefix){
    client.user.setActivity('SpeedrunsLive', { type: 'COMPETING' });
    const wait = promisify(setTimeout);
    const er = new Collection();
       

        
    
setInterval(async () => {
  
  
    const runs = await fetch('https://www.speedrun.com/api/v1/runs?status=verified&orderby=verify-date&direction=desc');
    const runsjson = await runs.json();
    const runsdata = runsjson.data;
   runsdata.forEach(run => client.runs.set(run.id,run))
   
  const newruns = client.runs.difference(er)
console.log(runsdata[0])
  if(newruns.first()){
    newruns.forEach(async newrun =>{
    let level='';
    let lvlid;
    let top;
   const userres = await fetch(`https://speedrun.com/api/v1/users/${newrun.players[0].id}`)
   const userjson = await userres.json()
   const user = await userjson.data.names.international
     
   const gameres = await fetch(`https://speedrun.com/api/v1/games/${newrun.game}`)
   const gamejson = await gameres.json()
   const game = gamejson.data.names.international
   if(game == 'Apple Kight') console.log(game)
   const cover = gamejson.data.assets['cover-large'].uri
   const categoryres = await fetch(`https://speedrun.com/api/v1/categories/${newrun.category}`)
   const categoryjson = await categoryres.json()
   const category = categoryjson.data.name
   if(newrun.level){
        const lvlres = await fetch(`https://speedrun.com/api/v1/levels/${newrun.level}`);
        const lvljson = await lvlres.json();
        level = lvljson.data.name
        lvlid = lvljson.data.id
   }
     const leaderres = await fetch(`https://speedrun.com/api/v1/leaderboards/${gamejson.data.id}/${level?`level/${lvlid}`:'category'}/${categoryjson.data.id}`);
     const leaderjson = await leaderres.json();
     const topobj = leaderjson.data.runs.find(rundata => rundata.run.id == newrun.id);
     if(topobj) top = topobj.place;
     
   
    const embed = new MessageEmbed()
    .setTitle(`${game}:${level} ${category}`)
    .setColor('RANDOM')
    .setDescription(`**${newrun.times.primary.replace('PT','').replace('H',' hours ').replace('M',' minutes ').replace('S',' seconds')} by ${user}**`)
    .setURL(newrun.weblink)
    .addField('Verified at:','`'+newrun.status['verify-date'].replace('T',' ').replace('Z','')+'`')
    .setThumbnail(cover);
    if(top) embed.addField('Place in leaderboards',top);

    client.guilds.cache.forEach(g => {
      const channel = g.channels.cache.find(c => c.name =='new-runs')
      
      const dbgame = db.get(`${g.id}.game`)
      
      if(channel){
        if(!dbgame ||!dbgame.length){

          channel.send(embed)
        } else {
                
          if(dbgame.includes(gamejson.data.id)){

            channel.send(embed)
          console.log('ye boi')
          }
        }
      }
    });
      
    })
  }
   client.runs.forEach(run=> er.set(run.id,run));

},60000);

  }
}
