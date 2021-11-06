
async function pr(){

  setTimeout(function(){
    console.log('hello 1');
  },100);

  await new Promise((resolve, reject)=>{
    console.log('hello 2');
    for(let i=0;i<1000000000;i++){}
    // setTimeout(()=>resolve(1), 1);
    new Promise(()=>{
        setTimeout(()=>{resolve('123')},2000);
    })
  }).then(()=>{
    console.log('hello 3');
  })

  setTimeout(function(){
    console.log('hello 4');
  },0);
}

pr()
