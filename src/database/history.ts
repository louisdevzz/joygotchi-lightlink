import clientPromise from "./db"


let client:any;
let dbs:any;
let history:any;


async function init(){
    if(dbs) return;
    try{
        client = await clientPromise;
        dbs = client.db("joygotchi");
        history = dbs.collection('history')
    }catch(error){
        //"Failed to stablish connection to database"
        throw new Error(error as string)
    }
}

(async()=>{
    await init()
})()

async function createHistory({
    attacker,
    winner, 
    loser, 
    scoresWon, 
    prizeDebt
}:HistoryAttack){
    try{
        if(!history) await init();
        const rs = await history.insertOne({
            attacker: attacker,
            winner: winner, 
            loser: loser, 
            scoresWon: scoresWon, 
            prizeDebt: prizeDebt,
            timeAttack: Math.floor(Date.now() / 1000)
        })
        return rs;
    }catch(error){
        return {error:"Failed to create user"}
    }
}

export {
    createHistory
}