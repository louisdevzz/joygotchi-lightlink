import { createHistory } from "@/database/history";
import type { NextApiRequest, NextApiResponse } from "next";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if(req.method == "POST"){
        try{
            const { attacker, winner, loser, scoresWon, prizeDebt } = req.body;
            const result = await createHistory({
                attacker,
                winner,
                loser,
                scoresWon,
                prizeDebt
            });
            res.status(200).json(result)
        }catch(err){
            res.status(500).json(err)
        }
    }
}
