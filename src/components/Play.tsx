"use client"
import Footer from './Footer';
import { useEffect, useState } from 'react';
import CountDownTimer from './CountDownTimer';
import BuyItem from './BuyItem';
import ScreenPet from './ScreenPet';
import { useRouter } from 'next/router';
import { ConnectButton, lightTheme, useActiveAccount, useReadContract, useSendTransaction } from 'thirdweb/react';

const client = createThirdwebClient({
    clientId: process.env.CLIENT_ID!
});
import { inAppWallet } from "thirdweb/wallets";
import { createThirdwebClient, getContract, prepareContractCall } from 'thirdweb';
import axios from 'axios';
import { petAddress } from '@/utils/abi';


const Play = () => {
    const wallets = [inAppWallet()]
    const account = useActiveAccount();
    const { mutate: sendTransaction, data: txResult,isSuccess: isSuccessTx,isPending: isPendingTx } = useSendTransaction();
    const { mutate: sendTx, data: txNamePet,isSuccess: isSuccessNamePet, isPending: isPendingNamePet,isError: isErrorNamePet } = useSendTransaction();
    const [isShow, setIsShow] = useState<boolean>(false)
    const [ethBalance, setEthBalance] = useState<string|null>(null)
    const [raiTokenBalance, setRaiTokenBalance] = useState<string|null>(null)
    const [loading, setLoading] = useState<boolean>(false);
    const [namePet,setNamePet] = useState<string|null>(null);
    const [petLists, setPetLists] = useState<any|null>([]);
    const [petList, setPetList] = useState<any|null>([]);
    const [index, setIndex] = useState<number>(0);
    const [status, setStatus] = useState<string|null>(null);
    const seconds = 0;
    const [error, setError] = useState<string|null>(null)
    const router = useRouter();
    const contractAddress = "0x5D31C0fF4AAF1C906B86e65fDd3A17c7087ab1E3"

    const contractPet = getContract({
        client,
        address: contractAddress,
        chain: {
            id:1891,
            rpc:"https://1891.rpc.thirdweb.com/6f3aa29d720d4272cea48e0aaa54e79e"
        },
        abi: petAddress
    });

    const { data: dataPet, isError } = useReadContract({
        contract: contractPet,
        method: "getPetInfo",
        params: [petList[index]?.id],
    });
    
    if(isError){
        console.log('You have not pet')
    }

    useEffect(()=>{
        if(isSuccessNamePet){
            setLoading(false)
            setStatus("Change pet name successful")
            setIsShow(false)
            setTimeout(() => {
                setStatus(null)
            }, 1200); 
        }
        if(isError){
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
        const response = await axios.get(`https://pegasus.lightlink.io/api/v2/addresses/${account?.address}`,{
            headers:{
                "Content-Type": "application/json"
            }
        })
        const data = response.data;
        if(data){
            const balance = data.coin_balance
            setEthBalance((Number(balance)*Math.pow(10,-18)).toFixed(6))
        }
    }

    const fetchRaiToken = async() =>{
        const response = await axios.get(`https://pegasus.lightlink.io/api/v2/addresses/${account?.address}/tokens?type=ERC-20`,{
            headers:{
                "Content-Type": "application/json"
            }
        })
        const data = response.data;
        if(data){
            const balance = data.items[0].value
            setRaiTokenBalance((Number(balance)*Math.pow(10,-18)).toString())
        }
    }

    const loadNFT = async() =>{
        const response = await axios.get(`https://pegasus.lightlink.io/api/v2/addresses/${account?.address}/nft?type=ERC-721`,{
            headers:{
                "Content-Type":"application/json"
            }
        })
        const data = response.data;
        if(data){
            setPetList(data.items)
        }
    }


    

    const onChangeName = async() =>{
        const contract = getContract({
            client,
            address: contractAddress,
            chain: {
                id:1891,
                rpc:"https://1891.rpc.thirdweb.com/6f3aa29d720d4272cea48e0aaa54e79e"
            },
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

    //console.log("petlist",dataPet)
    //console.log("eth",ethBalance)
    //console.log("raitoken",raiTokenBalance)
    //console.log("namepet",namePet)
    return(
        <div className="h-full md:max-h-[700px] w-full md:max-w-[400px] rounded-lg shadow-lg relative overflow-hidden">
            <div className="bg-[#e5f2f8] flex flex-col h-full w-full overflow-hidden">
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
                <div className="w-full sticky top-0 z-20">
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
                        <div className="border-b border-gray-300 h-20 w-full bg-[#2d3c53] relative">
                            <div className="flex flex-row justify-between px-2 py-2">
                                <div className="flex flex-col gap-1">
                                    <div className="flex flex-row gap-1">
                                        <img width={25} src="/assets/icon/eth_light.svg" alt="coin" />
                                        <p className="text-[#fff]">{ethBalance ? ethBalance : "-"}</p>
                                    </div>
                                    <div className="flex flex-row gap-1">
                                        <img width={25} src="/assets/icon/coin_light.svg" alt="coin" />
                                        <p className="text-[#fff]">{raiTokenBalance ? parseDot(raiTokenBalance) :"-"}</p>
                                    </div>
                                </div>
                                <div onClick={()=>setIsShow(true)} className="flex flex-row gap-1 items-center -mt-1 ml-2">
                                    <p className="text-[#fff]">{truncateNamePet(namePet as string)}</p>
                                    <img width={14} src="/assets/icon/pen.svg" alt="pen" />
                                </div>
                                <div className="flex flex-row  mt-1 items-center">
                                    <ConnectButton connectModal={{ size: "wide" }} detailsButton={{
                                        render:()=>{
                                            return(
                                                <div className="px-2 cursor-pointer py-0.5 h-8 rounded-full bg-[#a9c6e4]">
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
                                <CountDownTimer seconds={seconds}/>
                            </div>
                        </div>
                </div>
                <div className="h-full overflow-y-auto w-full scrollbar">
                    <div className="p-3 h-full flex flex-col relative w-full">
                        <div className="flex flex-col">
                            <div className="mt-2 h-full">
                                <div className="w-full h-[250px] rounded-md flex justify-center flex-row relative">
                                    <img width={60} className="w-full h-full rounded-md" src="/assets/background/screen_pet.png" alt="screen" />
                                    <div className="flex flex-row justify-between">
                                        {/* <img width={10} height={10} className="w-6 h-6 absolute top-1/2 left-[70px] " src="/assets/icon/arrow_left.png" alt="arrow" /> */}
                                        {/* <img width={150} className="absolute top-1/2 left-[53%] transform -translate-x-1/2 -translate-y-1/2" src="/assets/pet/pet.png" alt="pet" /> */}
                                        <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2">
                                            <ScreenPet dataPet={dataPet} petList={petList} changeName={setNamePet} setIndex={setIndex}/>
                                        </div>
                                        {/* <img width={10} height={10} className="w-6 h-6 absolute top-1/2 right-[60px] " src="/assets/icon/arrow_right.png" alt="arrow" /> */}
                                    </div>
                                    {/* <p className="text-[#fff] font-semibold absolute top-3/4 mt-3 left-1/2 transform -translate-x-1/2 ">Pet Name</p> */}
                                </div>
                            </div>
                            <div className="mt-2 bg-[#a9c6e4] w-full flex-row flex justify-between rounded-lg px-3 py-4">
                                <div className="flex flex-col text-center">
                                    <p className="text-xl">{dataPet ? dataPet[6].toString():"-"} NEAR</p>
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
                                    <p className="text-xl">{dataPet ? dataPet[2].toString():"-"}</p>
                                    <span className="text-[#00000088]">SCORE</span>
                                </div>
                            </div>
                            <BuyItem petLists={petLists} index={index} status={setStatus} error={setError}/>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
            
        </div>
    )
}

export default Play;