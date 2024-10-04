'use client'
import BattleLayout from "@/components/BattleLayout";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { eth_getTransactionReceipt, getContract, getGasPrice, getRpcClient, prepareContractCall } from "thirdweb";
import { useActiveAccount, useReadContract, useSendTransaction } from "thirdweb/react";
import { client } from "@/utils/utils";
import { attackAbi, petAddress } from "@/utils/abi";
import { decodeLog } from "web3-eth-abi";
import CountDownTimer from "@/components/CountDownTimer";
import { Web3 } from 'web3';

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
    const [petInfolist, setPetInfoList] = useState<any>([]);
    const [gas, setGas] = useState<bigint|null>(null)
    const [isPendingAttack,setIsPendingAttack] = useState<boolean>(false)
    const [attackSuccess, setAttackSuccess] = useState<boolean>(false)
    const [showLog, setShowLog] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [logAttack, setLogAttack] = useState<string[]>([])

    const contractAddress = "0x5D31C0fF4AAF1C906B86e65fDd3A17c7087ab1E3"
    const attackAddress = "0x828D456D397B08a19ca87Ad2Cf97598a07bf0D0E"
    const web3 = new Web3('https://replicator-01.pegasus.lightlink.io/rpc/v1'); 
    const raiGotchiContract = new web3.eth.Contract(petAddress, contractAddress);
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
        rpc:"https://endpoints.omniatech.io/v1/lightlink/pegasus/public"
    }


    useEffect(()=>{
        const loadGasPrice = async()=>{
            const gasPrice = await getGasPrice({
                client,
                chain
            })
            setGas(gasPrice)
        }
        loadGasPrice()
    },[gas])

    const contractPet = getContract({
        client,
        address: contractAddress,
        chain,
        abi: petAddress
    });

    const attackContract = getContract({
        client,
        address: attackAddress,
        chain,
        abi: attackAbi
    });



    const parseLogs = useCallback(async() =>{
        if(transactionResult?.transactionHash){
            setTimeout(() => {
                setIsAttacked(true)
                console.log("attacked")
            }, 3000);
        }
        if(isAttacked&&transactionResult){
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
            const res = await axios.post("/api/attack/history",{
                attacker: account?.address,
                winner: Number(winner),
                loser: Number(loser),
                scoresWon: Number(scoresWon),
                prizeDebt: Number(prizeDebt)
            },{
                headers:{
                    "Content-Type": "application/json"
                }
            });
            console.log("post history", res.data.acknowledged)
            console.log(`Winner: ${winner}, Loser: ${loser}, Scores Won: ${scoresWon}, Prize Debt: ${prizeDebt}`);
        }
    },[transactionResult,isAttacked])
    
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
        if(isAttacked&&transactionResult){
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
    },[transactionResult,isErrorSendTx,isSuccess,isPending,isAttacked])

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
        gas: gas as bigint
    });
    
    if(isError){
        console.log('You have not pet')
    }

    useEffect(()=>{
        if(dataPet){
            if(pets.length > 0&&dataPet[0] == ""){
                setNamePet(pets[currentIndexPet].metadata.name)
            }else{
                setNamePet(dataPet[0])
            }
        }
        loadPetInfo()
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

    const truncateNamePet = (str: string)=>{
        if(str&&str.length > 10){
            return str.slice(0,10)+"..."
        }
        return str
    }

    const loadPetInfo = async() =>{
        if(pets.length > 0){
            const petInfomation:any = []
            for(let i = 0; i < pets.length; i++){
                const petInfo = await raiGotchiContract.methods.getPetInfo(pets[i].id).call();
                const cleanPetInfo = {
                    _id:pets[i].id,
                    _name: petInfo._name,
                    _status: petInfo._status,
                    _score: petInfo._score,
                    _level: petInfo._level,
                    _timeUntilStarving: petInfo._timeUntilStarving,
                    _owner: petInfo._owner,
                    _rewards: petInfo._rewards,
                    _genes: petInfo._genes
                };
                petInfomation.push(cleanPetInfo)
                //console.log(`[INFO] Pet ${pets[i].id} Info:`, cleanPetInfo);
            }
            setPetInfoList(petInfomation)
            //console.log("petinfo",petInfomation)
        }
    }

    const Attack = () =>{
        setIsPendingAttack(true)
        setTimeout(() => {
            setAttackSuccess(true)
        }, 5000);
    }

    const onReturn = () =>{
        setIsPendingAttack(false)
        setAttackSuccess(false)
    }

    //console.log(pets)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 5000); // 15 seconds

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="h-screen w-full flex flex-row justify-center items-center">
                <div className="h-full md:max-h-[700px] w-full md:max-w-[400px] rounded-lg shadow-lg relative">
                    <div className="background flex flex-col h-full w-full relative">
                        <Header/>
                        <div className="h-full overflow-y-auto w-full scrollbar overflow-x-hidden">
                            <div className="h-full flex flex-col relative w-full text-center justify-center items-center">
                                <img width={200} src="/assets/asset/battle_pvp_searching .gif" alt="battle" />
                            </div>
                        </div>
                        <Footer/>
                    </div>
                </div>
            </div>
        );
    }

    //console.log(petInfolist)
    //console.log(pets)

    return(
        <div className="h-screen w-full flex flex-row justify-center items-center">
            <div className="h-full md:max-h-[700px] w-full md:max-w-[400px] rounded-lg shadow-lg relative">
                <div className="background flex flex-col h-full w-full relative">
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
                    <div className="h-full overflow-y-auto w-full scrollbar overflow-x-hidden">
                        <div className="h-full flex flex-col relative w-full text-center">
                            <img width={200} className="w-full" src="/assets/background/battle_banner.gif" alt="battle" />
                            <div className="relative px-2">
                                {
                                    !isPendingAttack&&(
                                        <div className="w-full responsive rounded-md flex justify-center flex-row relative">
                                            <div className="flex flex-col">
                                                <img width={60} className="w-full h-full rounded-md" src="/assets/background/battle_bg.png" alt="screen" />
                                                {
                                                    pets.length > 0 &&(
                                                        <div className="absolute top-[16%] w-full left-[19%] transform  translate-y-1/2">
                                                            <img width={80} src={pets[0].metadata.image} alt={pets[0].metadata.name} />
                                                        </div>
                                                    )
                                                }
                                                {
                                                    pets.length > 0 &&(
                                                        <div className="absolute top-[32%] w-full -left-[20%] oponent">
                                                            <img width={80} src={pets[1].metadata.image} alt={pets[1].metadata.name} />
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    )
                                }
                                {
                                    isPendingAttack&&(
                                        <div className="w-full responsive rounded-md flex justify-center flex-row relative">
                                            <div className="flex flex-col">
                                                <img width={60} className="w-full h-full rounded-md" src="/assets/background/battle.png" alt="screen" />
                                                {
                                                    pets.length > 0 &&(
                                                        <div className="absolute top-[30%] left-0">
                                                            <img className="-mt-10 w-32 h-32" src={pets[currentIndexPet].metadata.image} alt={pets[currentIndexPet].metadata.name} />
                                                        </div>
                                                    )
                                                }
                                                {
                                                    oponents.length > 0 &&(
                                                        <div className="absolute top-[30%] right-0">
                                                            <img className="-mt-10 w-32 h-32 oponent" src={oponents[currentIndex].metadata.image} alt={oponents[currentIndex].metadata.name} />
                                                        </div>
                                                    )
                                                }
                                                {
                                                    attackSuccess&&(
                                                        <div className="absolute flex justify-center items-center w-full z-20 h-full bg-black bg-opacity-45 rounded-lg">
                                                            <span className="font-semibold text-2xl">You Win</span>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    )
                                }
                                
                                <div className="relative mt-3 w-full">
                                    <img width={20} className="w-full" src="/assets/asset/battle_pet_info.png" alt="battle" />
                                    <div className="absolute bottom-6 left-4 w-full flex flex-row gap-4 items-center">
                                        {
                                            pets.length > 0 &&(
                                                <div className="flex flex-col">
                                                    <img width={80} src={pets[0].metadata.image} alt={pets[0].metadata.name} />
                                                </div>
                                            )
                                        }
                                        <div className="flex flex-col items-start mt-4 font-outline">
                                            <span className='text-lg'>RAI</span>
                                            <div className='flex flex-row gap-10 text-sm'>
                                                <div className='flex flex-col'>
                                                    <span>ATK: 100</span>
                                                    <span>DEF: 100</span>
                                                </div>
                                                <div className='flex flex-col items-start'>
                                                    <span>STAUS: HAPPY</span>
                                                    <span>SCORE: 0</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute top-1 right-4 w-auto flex flex-row-reverse gap-4 items-center">
                                        {
                                            pets.length > 1 &&(
                                                <div className="flex flex-col oponent">
                                                    <img width={80} src={pets[1].metadata.image} alt={pets[1].metadata.name} />
                                                </div>
                                            )
                                        }
                                        <div className="flex flex-col items-start mt-4 font-outline">
                                            <span className='text-lg'>RAI</span>
                                            <div className='flex flex-row gap-10 text-sm'>
                                                <div className='flex flex-col'>
                                                    <span>ATK: 100</span>
                                                    <span>DEF: 100</span>
                                                </div>
                                                <div className='flex flex-col items-start'>
                                                    <span>STAUS: HAPPY</span>
                                                    <span>SCORE: 0</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-2 relative">
                                    <img src="/assets/asset/battle_log.png" alt="Battle Log" className="w-full h-full" />
                                    <div className="absolute top-4 left-6 flex text-start w-full h-full text-sm font-outline flex-col gap-2">
                                        <span className="text-sm">Log Information</span>
                                        <span>Rai attacked, dealt 35 dmg</span>
                                    </div>
                                    <div className="absolute right-4 bottom-0 transform -translate-y-1/2">
                                        <img 
                                            src="/assets/asset/battle_arrow_down.png" 
                                            alt="Toggle Log" 
                                            className={`w-7 h-6 transition-transform duration-300 ${showLog ? 'rotate-180' : ''}`}
                                        />
                                    </div>
                                </div>

                                {/* <div className="mt-2 border-2 border-gray-300 flex flex-row justify-center gap-5 w-full px-2 py-3 rounded-lg text-black">
                                    {
                                        attackSuccess?(
                                            <button onClick={onReturn} className="bg-orange-500 hover:bg-opacity-70 w-full px-2 py-3 rounded-lg">
                                                <span className="font-semibold text-xl text-white">Return battle</span>
                                            </button>
                                        ):(
                                            <button onClick={Attack} disabled={isPendingAttack} className="bg-orange-500 hover:bg-opacity-70 w-full px-2 py-3 rounded-lg">
                                                <span className="font-semibold text-xl text-white">{isPendingAttack ? "Attacking..." : "Battle"}</span>
                                            </button>
                                        )
                                    }
                                </div> */}
                            </div>
                            
                        </div>
                        {
                            logAttack.length > 0 && logAttack.includes("You Lost")&&(
                                <div className="fixed top-0 left-0 z-50 h-screen w-full flex flex-row justify-center items-center ">
                                    <div className="h-full md:max-h-[700px] p-2 w-full md:max-w-[400px] rounded-lg shadow-lg relative bg-black bg-opacity-40 flex flex-col gap-5 items-center">
                                        <img width={200} height={100} className="max-h-[300px] w-full mt-10" src="/assets/asset/battle_lost.png" alt="battle" />
                                        <button>
                                            <img width={130} src="/assets/asset/button_ok.png" alt="icon" />
                                        </button>
                                    </div>
                                </div>
                            )
                        }
                        {
                            logAttack.length > 0 && logAttack.includes("You Win")&&(
                                <div className="fixed top-0 left-0 z-50 h-screen w-full flex flex-row justify-center items-center ">
                                    <div className="h-full md:max-h-[700px] p-2 w-full md:max-w-[400px] rounded-lg shadow-lg relative bg-black bg-opacity-40 flex flex-col gap-5 items-center">
                                        <img width={200} height={100} className="max-h-[300px] w-full mt-10" src="/assets/asset/battle_win.png" alt="battle" />
                                        <button>
                                            <img width={130} src="/assets/asset/button_ok.png" alt="icon" />
                                        </button>
                                    </div>
                                </div>
                            )
                        }
                        {
                            logAttack.length > 0 && logAttack.includes("You and Opponent are both dead")&&(
                                <div className="fixed top-0 left-0 z-50 h-screen w-full flex flex-row justify-center items-center ">
                                    <div className="h-full md:max-h-[700px] p-2 w-full md:max-w-[400px] rounded-lg shadow-lg relative bg-black bg-opacity-40 flex flex-col gap-5 items-center">
                                        <img width={200} height={100} className="max-h-[300px] w-full mt-10" src="/assets/asset/battle_draw.png" alt="battle" />
                                        <button>
                                            <img width={130} src="/assets/asset/button_ok.png" alt="icon" />
                                        </button>
                                    </div>
                                </div>
                            )
                        }
                        {
                            isShow&&(
                                <div className="fixed top-0 left-0 z-20 h-screen w-full flex flex-row justify-center items-center">
                                    <div className="h-full md:max-h-[700px] w-full md:max-w-[400px] rounded-lg shadow-lg relative background overflow-y-auto scrollbar overflow-x-hidden">
                                        <div className="h-screen w-full rounded-lg p-3 font-outline pb-10 mt-16"> {/* Added pb-20 for bottom padding */}
                                            <img width={200} className="w-full" src="/assets/asset/battle_pvp_list_header.png" alt="battle" />
                                            <div className="flex flex-col gap-2 mt-5">
                                                {
                                                    pets.length > 0 && (
                                                        pets.map((pet: any, idx: number) => (
                                                            <div key={idx} className="flex flex-col gap-2 relative">
                                                                <img width={200} className="w-full" src="/assets/asset/battle_pvp_list_tab.png" alt="battle" />
                                                                <img width={80} className="absolute bottom-6 left-4" src={pet.metadata.image} alt="pet" />
                                                                <span className="absolute top-5 left-[27%] text-sm">
                                                                    {petInfolist[idx]._name!='' ? truncateNamePet(petInfolist[idx]._name) : truncateNamePet(pet.metadata.name)}
                                                                </span>
                                                                <span className="absolute top-5 right-[24%] text-sm">ID: {pet.id}</span>
                                                                <div className="flex flex-col absolute bottom-5 left-[27%] text-[13px]">
                                                                    <span>x{petInfolist[idx] ? nFormatter(Number(petInfolist[idx]._score), 2) : '0000000'}</span>
                                                                    <div className="flex flex-row gap-2">
                                                                        <span>ATK: {petInfolist[idx] ? petInfolist[idx]._genes[0] : '100'}</span>
                                                                        <span>DEF: {petInfolist[idx] ? petInfolist[idx]._genes[1] : '100'}</span>
                                                                    </div>
                                                                </div>
                                                                <button className="absolute bottom-5 right-4" onClick={() => handlSelectPet(idx)}>
                                                                    <img width={20} className="w-24" src="/assets/asset/battle_pvp_fight_button.png" alt="battle" />
                                                                </button>   
                                                            </div>
                                                        ))
                                                    )
                                                }
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    <Footer/>
                    
                </div>
            </div>
        </div>
    )
}

export default Battle;