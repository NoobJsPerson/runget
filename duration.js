module.exports = (time,time2) =>{
  if(!time || !time2) return;
  const duration = time - time2;
       let hours = Math.floor(duration/360000);
 
    let minutes = Math.floor((duration % 360000)/60000);
    let seconds = ((duration % 60000)/1000).toFixed(2);
    minutes = minutes ? minutes + ' minutes and ' : ''; 
    hours = hours ? hours + ' hours, ' : '';

  return hours+minutes+seconds+' seconds';
  
};