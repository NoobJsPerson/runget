module.exports = (time,time2) =>{
  if(!time || !time2) return;
  const duration = time - time2;
    let hours = Math.floor(duration/360000);
 
    let minutes = Math.floor((duration - hours*360000)/60000);
    let seconds = ((duration - minutes * 60000 - hours * 360000)/1000).toFixed(2);
    if(minutes){
      minutes+= ' minutes and ';
    } else {
      minutes='';
    }
      if(hours){
        hours+=' hours, ';
      } else {
        hours='';
      }

  return hours+minutes+seconds+' seconds';
  
};