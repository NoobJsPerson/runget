module.exports = (time,time2) =>{
  if(!time || !time2) return;

  let duration = time - time2,
    hours = Math.floor(duration/360000),
    minutes = Math.floor((duration % 360000)/60000),
    seconds = ((duration % 60000)/1000).toFixed(2);

    minutes = minutes ? minutes + ' minutes and ' : ''; 
    hours = hours ? hours + ' hours, ' : '';

  return hours+minutes+seconds+' seconds';
  
};