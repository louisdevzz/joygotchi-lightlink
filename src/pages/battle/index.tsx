'use client'
import BattleLayout from "@/components/BattleLayout";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { eth_getTransactionReceipt, getContract, getRpcClient, prepareContractCall } from "thirdweb";
import { useActiveAccount, useReadContract, useSendTransaction } from "thirdweb/react";
import { client } from "@/utils/utils";
import { attackAbi, petAddress } from "@/utils/abi";
import { decodeLog } from "web3-eth-abi";
import CountDownTimer from "@/components/CountDownTimer";

const Battle = () =>{
    const account = useActiveAccount()
    const { mutate: sendTx, data: transactionResult,isSuccess,isError: isErrorSendTx,isPending,error: ErrorTx } = useSendTransaction();
    const [status, setStaus] = useState<string|null>(null)
    const [error, setError] = useState<string|null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [allListPet, setAllListPet] = useState<any>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [currentIndexPet, setCurrentIndexPet] = useState<number>(0);
    const [isShow, setIsShow] = useState<boolean>(false);
    const [isAttack, setIsAttack] = useState<boolean>(false)
    const [namePet, setNamePet] = useState<string|null>(null)
    const [isAttackf15m, setIsAttackf15m] = useState<boolean>(false)
    const [isAttacked,setIsAttacked] = useState<boolean>(false);
    const [seconds,setSeconds] = useState<number>(0)

    const contractAddress = "0x5D31C0fF4AAF1C906B86e65fDd3A17c7087ab1E3"
    const attackAddress = "0x828D456D397B08a19ca87Ad2Cf97598a07bf0D0E"
    
    useEffect(()=>{
        if(account){
            loadOpponent()
        }
    },[account])

    useEffect(()=>{
        if(localStorage.getItem("isAttackf15m")){
            setIsAttackf15m(true)
        }
        const oldSeconds = Number(localStorage.getItem("timeAttack"))||0;
        setSeconds(Math.abs(Math.floor((Date.now()-oldSeconds)/1000) - 900))
        if(Math.floor((Date.now()-oldSeconds)/1000)>900){
            setIsAttackf15m(false)
            localStorage.removeItem("isAttackf15m")
        }
    },[])

    const chain = {
        id:1891,
        rpc:"https://1891.rpc.thirdweb.com/6f3aa29d720d4272cea48e0aaa54e79e"
    }

    const contractPet = getContract({
        client,
        address: contractAddress,
        chain: {
            id:1891,
            rpc:"https://1891.rpc.thirdweb.com/6f3aa29d720d4272cea48e0aaa54e79e"
        },
        abi: petAddress
    });

    const attackContract = getContract({
        client,
        address: attackAddress,
        chain: {
            id:1891,
            rpc:"https://1891.rpc.thirdweb.com/6f3aa29d720d4272cea48e0aaa54e79e"
        },
        abi: attackAbi
    });



    const parseLogs = useCallback(async() =>{
        if(isAttacked&&isSuccess&&transactionResult.transactionHash){
            const rpcRequest = getRpcClient({ client, chain });
            const receipt = await eth_getTransactionReceipt(rpcRequest,{
                hash: transactionResult.transactionHash
            })
            const attackEvent = receipt.logs.find(log => log.address.toLowerCase() === attackAddress.toLocaleLowerCase())
            console.log("attackEvent",attackEvent)
            const decodedEvent = decodeLog(
                [
                    { type: 'uint256', name: 'attacker' },
                    { type: 'uint256', name: 'winner' },
                    { type: 'uint256', name: 'loser' },
                    { type: 'uint256', name: 'scoresWon' },
                    { type: 'uint256', name: 'prizeDebt' }
                ],
                attackEvent?.data.toString() as string,
                attackEvent?.topics as string[]
            );
            const { attacker, winner, loser, scoresWon, prizeDebt } = decodedEvent;
            console.log(`Winner: ${winner}, Loser: ${loser}, Scores Won: ${scoresWon}, Prize Debt: ${prizeDebt}`);
        }
        if(isSuccess&&transactionResult.transactionHash){
            setLoading(true)
        }
    },[transactionResult,isSuccess])
    
    useEffect(()=>{
        parseLogs()
    },[parseLogs])

    const checkStatus = useCallback(()=>{
        if(isErrorSendTx){
            console.log("ErrorTx",ErrorTx)
            setLoading(false)
            setError("You have one attack every 15 mins!")
            setTimeout(() => {
                setError(null)
            }, 1500);
        }
        if(isPending){
            setLoading(true)
        }
        if(isSuccess&&transactionResult.transactionHash){
            localStorage.setItem("timeAttack",Date.now().toString())
            setIsAttackf15m(true)
            localStorage.setItem("isAttackf15m","true")
            setLoading(false)
            setSeconds(900)
            setStaus("Attack Success!")
            setTimeout(() => {
                setStaus(null)
            }, 1500);
        }
    },[transactionResult,isErrorSendTx,isSuccess,isPending])

    useEffect(()=>{
        checkStatus()
    },[checkStatus])


    const loadOpponent = async() =>{
        const response = await axios.get(`https://pegasus.lightlink.io/api/v2/tokens/0x5D31C0fF4AAF1C906B86e65fDd3A17c7087ab1E3/instances`,{
            headers:{
                "Content-Type": "application/json"
            }
        })
        const data = response.data.items;
        // const dataFilter = data.filter((opponent:any)=> opponent.owner.hash !== account?.address)
        // console.log("dataFilter",dataFilter)
        setAllListPet(data)
    }

    const [pets, oponents] = useMemo(() => {
        const pets   = allListPet.filter((opponent:any)=> opponent.owner.hash === account?.address )
        const oponents = allListPet.filter((opponent:any)=> opponent.owner.hash !== account?.address )
        return [pets, oponents];
    }, [allListPet,account]);
    //console.log(oponents)
    const { data: dataPet, isError,refetch } = useReadContract({
        contract: contractPet,
        method: "getPetInfo",
        params: [pets[currentIndexPet]?.id],
    });
    
    if(isError){
        console.log('You have not pet')
    }

    useEffect(()=>{
        if(dataPet){
            if(pets.length > 0&&dataPet[0] == ""){
                setNamePet(pets[currentIndex].metadata.name)
            }else{
                setNamePet(dataPet[0])
            }
        }
    },[pets,dataPet])


    const onAttack = () =>{
        console.log("attack")
        const transaction = prepareContractCall({
            contract: attackContract,
            method: "attack", // <- this gets inferred from the contract
            params: [pets[currentIndexPet]?.id,oponents[currentIndex]?.id],
        });
        sendTx(transaction as any); 
        setIsAttack(true)
        setTimeout(() => {
            setIsAttack(false)
        }, 120);
        setTimeout(() => {
            setIsAttacked(true)
        }, 3000);
    }

    const handlSelectPet = (idx: number) => {
        setCurrentIndexPet(idx);
        setIsShow(false);
    }

    const nFormatter = (num:number, digits:number) => {
        const lookup = [
            { value: 1, symbol: "" },
            { value: 1e3, symbol: "k" },
            { value: 1e6, symbol: "M" },
            { value: 1e9, symbol: "G" },
            { value: 1e12, symbol: "T" },
            { value: 1e15, symbol: "P" },
            { value: 1e18, symbol: "E" }
        ];
        const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
        const item = lookup.findLast(item => num >= item.value);
        return item ? (num / item.value).toFixed(digits).replace(regexp, "").concat(item.symbol) : "0";
    }

    //console.log(isShow)

    return(
        <div className="h-screen w-full flex flex-row justify-center items-center">
            <div className="h-full md:max-h-[700px] w-full md:max-w-[400px] rounded-lg shadow-lg relative">
                <div className="bg-[#e5f2f8] flex flex-col h-full w-full relative">
                    {status&&(
                        <div className="fixed md:absolute z-50 bg-[#d4edda] w-80 h-10 top-5 left-[52%] rounded-lg border-2 border-[#c3e6cb] shadow-sm transform -translate-x-1/2 transition-all delay-75">
                            <div className="flex flex-row w-full px-3 items-center h-full gap-2 text-center">
                                <img width={22} src="/assets/icon/success.svg" alt="success" />
                                <small className="text-[#155724] text-[0.84rem] font-semibold">{status}</small>
                            </div>
                        </div>
                    )}
                    {loading&&(
                        <div className="fixed md:absolute z-50 bg-[#fef3c7] w-80 h-10 top-5 left-[52%] rounded-lg border-2 border-[#fabe25] shadow-sm transform -translate-x-1/2 transition-all delay-75">
                            <div className="flex flex-row w-full px-3 items-center h-full gap-2">
                                <img width={22} src="/assets/icon/reload.svg" alt="reload" />
                                <small className="text-[#f49d0c] text-[0.84rem] font-semibold">Loading....</small>
                            </div>
                        </div>
                    )}
                    {error&&(
                        <div className="fixed md:absolute z-50 bg-[#f8d7da] w-80 h-10 top-5 left-[52%] rounded-lg border-2 border-[#FF0000] shadow-sm transform -translate-x-1/2 transition-all delay-75">
                            <div className="flex flex-row w-full px-3 items-center h-full gap-2 text-center">
                                <img width={22} src="/assets/icon/error.svg" alt="error" />
                                <small className="text-[#FF0000] text-[0.84rem] font-semibold">{error}</small>
                            </div>
                        </div>
                    )}
                    <Header/>
                    <div className="h-full overflow-y-auto w-full scrollbar">
                        <div className="h-full flex flex-col relative w-full">
                            {
                                isAttackf15m&&(
                                    <div className="mt-2 text-center flex justify-center flex-row px-2">
                                        <p className="text-black px-2 py-1 bg-slate-300 w-full rounded-lg">Next Attack: <CountDownTimer seconds={seconds}/></p>
                                    </div>
                                )
                            }
                            <div className="mt-2 relative px-2">
                                <div className="w-full responsive rounded-md flex justify-center flex-row relative">
                                    {
                                        pets.length > 0 &&(
                                            <div className="absolute top-[65%] left-[52%] text-black">
                                                <small>{namePet}</small>
                                            </div>
                                        )
                                    }
                                    <img width={60} className="w-full h-full rounded-md" src="/assets/background/battle.png" alt="screen" />
                                    {pets.length > 0 && pets[currentIndexPet] &&(
                                        <img className="absolute mg" src={pets[currentIndexPet].metadata.image} alt="pet" />
                                    )}
                                    <div className="flex flex-row justify-between">
                                        <div className="absolute position">
                                            <BattleLayout petList={oponents} setIndex={setCurrentIndex}/>
                                        </div>
                                    </div>
                                </div>
                                {
                                pets.length > 0 &&(
                                    <div onClick={()=>setIsShow((prv)=>!prv)} className="mt-2 bg-[#a9c6e4] p-3 relative rounded-lg flex flex-row justify-between items-center text-black">
                                        <div className="flex flex-row items-center gap-2">
                                            {pets.length > 0 &&(
                                                <img className="-mt-2" width={62} src={pets[currentIndexPet].metadata.image} alt="pet" />
                                            )}
                                            <div className="flex flex-col">
                                                <p className="text-sm">{namePet}</p>
                                                <div className="flex flex-row gap-3">
                                                    <div className="flex flex-col">
                                                        <small>ATK: 100</small>
                                                        <small>DEF: 100</small>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <small>Status: {dataPet ? dataPet[1].toString():"-"}</small>
                                                        <small>Score: {dataPet ? nFormatter(Number(dataPet[2].toString()),1):"-"}</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button>
                                            <img width={20} className="rotate-90" src="/assets/icon/arrow_right.png" alt="arrow" />
                                        </button>
                                    </div>
                                )
                                }
                                <div className="mt-2 border-2 border-gray-300 flex flex-row justify-center gap-5 w-full px-2 py-3 rounded-lg text-black">
                                    <button onClick={onAttack}>
                                        {
                                            isAttack?(
                                                <img width={260} src="/assets/button/button-attack-enter.png" alt="btn" />
                                            ):(
                                                <img width={260} src="/assets/button/button-attack.png" alt="btn" />
                                            )
                                        }
                                    </button>
                                </div>
                            </div>
                            
                            
                        </div>
                        
                    </div>
                    <Footer/>
                    
                </div>
            </div>
        </div>
    )
}

export default Battle;