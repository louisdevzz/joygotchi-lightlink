//const { attacker, winner, loser, scoresWon, prizeDebt } = decodedEvent;
interface HistoryAttack {
    attacker: string,
    winner: number,
    loser: number,
    scoresWon: number,
    prizeDebt: number
}

interface Background{
    backgroundPet?: any,
    data: string[]
}
