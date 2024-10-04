"use client"
import Footer from './Footer';
import { useEffect, useState } from 'react';
import CountDownTimer from './CountDownTimer';
import BuyItem from './BuyItem';
import ScreenPet from './ScreenPet';
import { useRouter } from 'next/router';
import { ConnectButton, useActiveAccount, useReadContract, useSendTransaction } from 'thirdweb/react';
import { inAppWallet } from "thirdweb/wallets";
import { createThirdwebClient, getContract, prepareContractCall } from 'thirdweb';
import axios from 'axios';
import { petAddress } from '@/utils/abi';
import Mint from './Mint';
import Header from './Header';
import Link from 'next/link';
import Web3 from 'web3';
const client = createThirdwebClient({
    clientId: process.env.CLIENT_ID!
});

const Play = () => {
    const wallets = [inAppWallet()]
    const account = useActiveAccount();
    const { mutate: sendTx, data: txNamePet,isSuccess: isSuccessNamePet, isPending: isPendingNamePet,isError: isErrorNamePet } = useSendTransaction();
    const [isShow, setIsShow] = useState<boolean>(false)
    const [ethBalance, setEthBalance] = useState<string|null>(null)
    const [raiTokenBalance, setRaiTokenBalance] = useState<string|null>(null)
    const [loading, setLoading] = useState<boolean>(false);
    const [namePet,setNamePet] = useState<string|null>(null);
    const [petList, setPetList] = useState<any|null>([]);
    const [loadingFetch, setLoadingFetch] = useState<boolean>(true)
    const [index, setIndex] = useState<number>(0);
    const [status, setStatus] = useState<string|null>(null);
    const [error, setError] = useState<string|null>(null)
    const [backgroundPet, setPackgroundPet] = useState<string|null>(null)
    const [isShowModal, setIsShowModal] = useState<boolean>(false)
    const [petInfoList, setPetInfoList] = useState<any>([])
    const router = useRouter();
    const contractAddress = "0x5D31C0fF4AAF1C906B86e65fDd3A17c7087ab1E3"
    

    const chain = {
        id:1891,
        rpc:"https://replicator.pegasus.lightlink.io/rpc/v1"
    }

    const attackAddress = "0x828D456D397B08a19ca87Ad2Cf97598a07bf0D0E"
    const web3 = new Web3('https://replicator-01.pegasus.lightlink.io/rpc/v1'); 
    const raiGotchiContract = new web3.eth.Contract(petAddress, contractAddress);

    const contractPet = getContract({
        client,
        address: contractAddress,
        chain,
        abi: petAddress
    });
    const { data: dataPet, isError,refetch,error:ErrorPet } = useReadContract({
        contract: contractPet,
        method: "getPetInfo",
        params: [petList[index]?.id],
    });
    //console.log("petList",account?.address)
    if(isError){
        console.log('You have not pet',ErrorPet)
    }

    useEffect(()=>{
        if(localStorage.getItem("backgroundPet")){
            setPackgroundPet(localStorage.getItem("backgroundPet"))
        }else{
            setPackgroundPet("screen_pet.png")
        }
    },[])

    useEffect(()=>{
        if(isSuccessNamePet){
            setLoading(false)
            setStatus("Change pet name successful")
            setIsShow(false)
            setTimeout(() => {
                setStatus(null)
            }, 1200); 
        }
        if(isErrorNamePet){
            setLoading(false)
            setError("Change pet name failed!")
            setTimeout(() => {
                setError(null)
            }, 1200); 
        }
        if(isPendingNamePet){
            setLoading(true)
        }
    },[isSuccessNamePet,isErrorNamePet,isPendingNamePet])

    useEffect(()=>{
        if(dataPet){
            setLoadingFetch(false)
            if(petList.length > 0&&dataPet[0] == ""){
                setNamePet(petList[index].metadata.name)
            }else{
                setNamePet(dataPet[0])
            }
        }
    },[petList,dataPet])

    useEffect(()=>{
        if(!account){
            router.push("/login")
        }
        if(account){
            loadNFT()
            fetchEthBalance()
            fetchRaiToken()
        }
    },[account])

    const fetchEthBalance = async() =>{
        try{
            const response = await axios.get(`https://pegasus.lightlink.io/api/v2/addresses/${account?.address}`,{
                headers:{
                    "Content-Type": "application/json"
                }
            })
            if(response.status == 404){
                return ;
            }
            const data = response.data;
            if(data){
                const balance = data.coin_balance
                setEthBalance((Number(balance)*Math.pow(10,-18)).toFixed(6))
            }
        }catch(error){
            setLoadingFetch(false)
            console.log("Not Eth Balance")
        }
    }

    const fetchRaiToken = async() =>{
        try{
            const response = await axios.get(`https://pegasus.lightlink.io/api/v2/addresses/${account?.address}/tokens?type=ERC-20`,{
                headers:{
                    "Content-Type": "application/json"
                }
            })
            if(response.status == 404){
                return ;
            }
            const data = response.data;
            if(data){
                const balance = data.items[0].value
                setRaiTokenBalance((Number(balance)*Math.pow(10,-18)).toFixed(0))
            }
        }catch(error){
            setLoadingFetch(false)
            console.log("Not rai token in balance")
        }
    }

    const loadNFT = async() =>{
        try{
            const response = await axios.get(`https://pegasus.lightlink.io/api/v2/addresses/${account?.address}/nft?type=ERC-721`,{
                headers:{
                    "Content-Type":"application/json"
                }
            })
            if(response.status == 404){
                return ;
            }
            const data = response.data;
            setPetList(data.items)
        }catch(error){
            setLoadingFetch(false)
            console.log("not pet in wallet")
        }
    }
    

    const onChangeName = async() =>{
        const contract = getContract({
            client,
            address: contractAddress,
            chain,
            abi: petAddress
        });
        const transaction = prepareContractCall({
            contract,
            method: "setPetName",
            params: [petList[index]?.id,namePet as string]
        });
        sendTx(transaction as any);  
    }

    const truncateNamePet = (str: string)=>{
        if(str&&str.length > 10){
            return str.slice(0,10)+"..."
        }
        return str
    }

    const truncateString = (str: string)=>{
        const format = str.replace("0x","");
        if(format.length > 6) return "0x"+format.slice(0,2)+'...'+format.slice(-2);
        return "0x"+format
    }

    const parseDot = (str: string) => {
        var value = str.split('.').join('');
    
        if (value.length > 3) {
            return  value.substring(0, value.length - 3) + '.' + value.substring(value.length - 3, value.length);
        }
    
        return value;
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

    const loadPetInfo = async() =>{
        if(petList.length > 0){
            const petInfomation:any = []
            for(let i = 0; i < petList.length; i++){
                const petInfo = await raiGotchiContract.methods.getPetInfo(petList[i].id).call();
                const cleanPetInfo = {
                    _id:petList[i].id,
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

    useEffect(()=>{
        loadPetInfo()
    },[petList])

    if(loadingFetch){
        return(
            <div className="h-full md:max-h-[700px] w-full md:max-w-[400px] rounded-lg shadow-lg relative">
                <div className="bg-[#5cd6fe] bg-opacity-20 flex flex-col h-full w-full relative">
                    <Header/>
                    <div className='h-screen'/>
                    <Footer/>
                </div>
            </div>
        )
    }

    return(
        <div className="h-full md:max-h-[700px] w-full md:max-w-[400px] rounded-lg shadow-lg relative">
            <div className="background bg-opacity-30 flex flex-col h-full w-full relative">
                {status&&(
                    <div className="fixed md:absolute z-50 bg-[#d4edda] w-80 h-10 top-5 left-[52%] rounded-lg border-2 border-[#c3e6cb] shadow-sm transform -translate-x-1/2 transition-all delay-75">
                        <div className="flex flex-row w-full px-3 items-center h-full gap-2">
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
                        <div className="flex flex-row w-full px-3 items-center h-full gap-2">
                            <img width={22} src="/assets/icon/error.svg" alt="error" />
                            <small className="text-[#FF0000] text-[0.84rem] font-semibold">{error}</small>
                        </div>
                    </div>
                )}
                {
                    !loadingFetch&&petList.length == 0&&(
                        <Header/>
                    )
                }
                {
                    !loadingFetch&&petList.length > 0 &&(
                        <div className="w-full sticky top-0 z-20 rounded-t-lg">
                                {
                                    isShow&&(
                                        <div className="fixed h-screen w-full md:max-h-[700px] md:max-w-[400px] bg-black bg-opacity-45 z-40 overflow-hidden overscroll-none">
                                            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#e5f2f8] pb-5 w-[375px] rounded-lg">
                                                <div className="flex flex-row justify-between items-center w-full bg-[#2d3c53] h-12 rounded-t-lg px-3">
                                                    <span className='text-white'>Change Name Pet</span>
                                                    <button onClick={()=>setIsShow(false)}>
                                                        <img width={35} src="/assets/icon/close.svg" alt="close" />
                                                    </button>
                                                </div>
                                                <div className="px-3 mt-5 flex flex-col gap-1 text-black">
                                                    <label htmlFor="name">Name Pet</label>
                                                    <input onChange={(e)=>setNamePet(e.target.value)} type="text" placeholder="Enter new name" className="px-3 py-2 border-2 outline-none rounded-lg border-gray-300 focus:border-[#2d3c53] hover:border-[#2d3c53]" />
                                                </div>
                                                <div className="flex justify-end px-3 mt-7">
                                                    <button onClick={onChangeName} className="px3 py-2 w-32 rounded-lg h-12 bg-[#2d3c53] hover:bg-opacity-90">
                                                        <span className='text-white'>Change</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                <div className="border-b border-gray-300 h-20 w-full relative background-top">
                                    <div className="flex flex-row justify-between px-2 py-2">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex flex-row gap-1">
                                                <img width={25} src="/assets/icon/eth_light.svg" alt="coin" />
                                                <p className="font-outline text-[#fff]">{ethBalance ? ethBalance : "0"}</p>
                                            </div>
                                            <div className="flex flex-row gap-1">
                                                <img width={25} src="/assets/icon/coin.svg" alt="coin" />
                                                <p className="font-outline text-[#fff]">{raiTokenBalance ? parseDot(raiTokenBalance) :"0"}</p>
                                            </div>
                                        </div>
                                        <div onClick={()=>setIsShow(true)} className="flex flex-row gap-1 items-center -mt-1 ml-2">
                                            <p className="font-outline text-[#fff]">{truncateNamePet(namePet as string)}</p>
                                            <img width={14} src="/assets/icon/pen.svg" alt="pen" />
                                        </div>
                                        <div className="flex flex-row  mt-1 items-center">
                                            <ConnectButton connectModal={{ size: "wide" }} detailsButton={{
                                                render:()=>{
                                                    return(
                                                        <div className="px-2 cursor-pointer py-0.5 h-8 rounded-full bg-[#9de6ac] font-outline">
                                                            {truncateString(account?.address as string)}
                                                        </div>
                                                    )
                                                }
                                            }} theme={"dark"} signInButton={{
                                                label: "Connect Wallet"
                                            }} autoConnect client={client} wallets={wallets} />
                                        </div>
                                    </div>
                                    <div className="px-3 py-2 w-[150px] rounded-full text-center absolute top-2/3 left-1/3  h-10 bg-[#f48f59]">
                                        {/* <span>0h:57m:35s</span> */}
                                        <CountDownTimer seconds={dataPet ? Number(dataPet[4]) : 0}/>
                                    </div>
                                </div>
                        </div>
                    )
                }
                <div className="h-full overflow-y-auto w-full scrollbar">
                    <div className="p-2 h-full flex flex-col relative w-full">
                        {
                            !loadingFetch&&petList.length > 0 &&(
                                <div className="flex flex-col">
                                    <div className="mt-2 h-full">
                                        <div className="w-full h-[250px] rounded-md flex justify-center flex-row relative">
                                            <img width={60} className="w-full h-full rounded-md" src={`/assets/background/pet_background.png`} alt="screen" />
                                            <div className="flex flex-row justify-between">
                                                <div className="absolute top-[40%] left-[48%] transform -translate-x-1/2 -translate-y-1/2">
                                                    <ScreenPet dataPet={dataPet} petList={petList} changeName={setNamePet} setIndex={setIndex}/>
                                                </div>
                                                <span className='absolute top-[80%] mt-4 w-[80%] text-center left-[50%] transform -translate-x-1/2 -translate-y-1/2 font-outline'>
                                                    {
                                                        dataPet&&(dataPet[0]==""?petList[index].metadata.name
                                                        :dataPet[0])
                                                        
                                                    }
                                                </span>
                                                {/* <div className='absolute top-3/4 mt-3 left-[56%]'>
                                                    <Link href={"/accessories"} className='px-2 py-1 rounded-lg bg-gradient-to-r from-indigo-600  to-purple-600  bg-no-repeat bg-bottom '>
                                                        <span>Accessories</span>
                                                    </Link>
                                                </div> */}
                                            </div>
                                            {/* <p className="text-[#fff] font-semibold absolute top-3/4 mt-3 left-1/2 transform -translate-x-1/2 ">Pet Name</p> */}
                                        </div>
                                    </div>
                                    <div className='mt-4 relative'>
                                        <img width={20} className='w-full h-full' src="/assets/asset/information_pet.png" alt="asset" />
                                        {
                                            petList&&(
                                                    <div className='absolute top-3 left-5'>
                                                        <img width={70} src={petList[index].image_url} alt="pet" />
                                                    </div>
                                                )
                                        }
                                        <div className='flex flex-col absolute top-6 left-[28%] text-white font-outline'>
                                            <span className='text-sm'>RAI</span>
                                            <div className='flex flex-row gap-5 text-sm'>
                                                <div className='flex flex-col'>
                                                    <span>ATK: 100</span>
                                                    <span>DEF: 100</span>
                                                </div>
                                                <div className='flex flex-col'>
                                                    <span>STAUS: HAPPY</span>
                                                    <span>SCORE: 0</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={()=>setIsShowModal(true)} className='absolute right-6 bottom-6'>
                                            <img width={35} src="/assets/asset/swap.png" alt="icon" />
                                        </button>
                                    </div>
                                    {/* <div className="mt-2 bg-[#a9c6e4] w-full flex-row flex justify-between rounded-lg px-3 py-4">
                                        <div className="flex flex-col text-center">
                                            <p className="text-xl">{dataPet ? dataPet[6].toString():"-"} ETH</p>
                                            <span className="text-[#00000088]">REWARDS</span>
                                        </div>
                                        <div className="flex flex-col text-center">
                                            <p className="text-xl">{dataPet ? dataPet[3].toString():"-"}</p>
                                            <span className="text-[#00000088]">LEVEL</span>
                                        </div>
                                        <div className="flex flex-col text-center">
                                            <p className="text-xl">{dataPet ? dataPet[1].toString():"-"}</p>
                                            <span className="text-[#00000088]">STATUS</span>
                                        </div>
                                        <div className="flex flex-col text-center">
                                            <p className="text-xl">{dataPet ? nFormatter(Number(dataPet[2].toString()),1):"-"}</p>
                                            <span className="text-[#00000088]">SCORE</span>
                                        </div>
                                    </div> */}
                                    <BuyItem petList={petList} index={index} loading={setLoading} status={setStatus} error={setError} refetch={refetch} optionFetchs={{
                                            fetchEthBalance,
                                            fetchRaiToken
                                        }}/>
                                    
                                </div>
                            )
                        }
                        {
                            isShowModal&&(
                                <div className="fixed top-0 left-0 z-10 h-screen w-full flex flex-row justify-center items-center rounded-lg">
                                    <div className="h-full md:max-h-[700px] w-full md:max-w-[400px] rounded-lg shadow-lg relative bg-black bg-opacity-40 overflow-y-auto scrollbar overflow-x-hidden">
                                        <div className='bg-[#fff] w-full h-screen mt-[5rem] p-2'>
                                            <img width={200} className="w-full" src="/assets/asset/pet_swap_header.png" alt="frame" />
                                            <div className='flex flex-col gap-2 mt-2'>
                                                {
                                                    petList&&(
                                                        petList.map((item:any,index:number)=>(
                                                            <div key={index} className='relative'>
                                                                <img width={20} className='w-full' src="/assets/asset/pet_information_swap.png" alt="coin" />
                                                                {
                                                                    petList&&(
                                                                        <div className='absolute top-2 left-3'>
                                                                            <img width={80} src={item.image_url} alt="pet" />
                                                                        </div>
                                                                    )
                                                                }
                                                                <span className='absolute text-xs top-4 mt-4 w-full text-center left-[40%] transform -translate-x-1/2 -translate-y-1/2 font-outline'>
                                                                    {petInfoList[index]._name!='' ? truncateNamePet(petInfoList[index]._name) : truncateNamePet(item.metadata.name)}
                                                                </span>
                                                                <span className='absolute text-xs top-4 mt-4 w-full text-center left-[77%] transform -translate-x-1/2 -translate-y-1/2 font-outline'>
                                                                    status:{" "}
                                                                    happy
                                                                </span>
                                                                <div className='absolute text-xs bottom-6 mt-4 w-full text-center left-[78%] transform -translate-x-1/2 -translate-y-1/2 font-outline flex flex-row gap-2'>
                                                                    <span className=''>
                                                                        ATK:{" "}
                                                                        100
                                                                    </span>
                                                                    <span className=''>
                                                                        DEF:{" "}
                                                                        100
                                                                    </span>
                                                                </div>
                                                                <button onClick={()=>setIsShowModal(false)} className='absolute text-xs bottom-1 mt-4 w-full text-center left-[71%] transform  -translate-y-1/2 font-outline'>
                                                                    <img width={100} src="/assets/asset/pet_swap_button.png" alt="button" />
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
                        {
                            !loadingFetch&&petList.length == 0&&(
                                <Mint/>
                            )
                        }
                    </div>
                </div>
                {
                    !loadingFetch&&(
                        <Footer/>
                    )
                }
                
            </div>
        </div>
    )
}

export default Play;