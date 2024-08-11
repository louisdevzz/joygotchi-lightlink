'use client'
import { useEffect, useState } from "react"
import Link from "next/link";
import { Near } from "@/utils/near";
import axios from "axios";
import { useActiveAccount } from "thirdweb/react";

const Settings = () =>{
    const account = useActiveAccount()
    const [isSound, setIsSound] = useState<boolean>(false);
    const [ethBalance, setEthBalance] = useState<string|null>(null)
    const [raiTokenBalance, setRaiTokenBalance] = useState<string|null>(null)

    useEffect(()=>{
        if(account){
            fetchEthBalance()
            fetchRaiToken()
        }
    },[account])

    const copyAddress = () => {
        if(account){
            navigator.clipboard.writeText(account?.address as string)
            alert("Copied")
        }
    }

    const fetchEthBalance = async() =>{
        const response = await axios.get(`https://pegasus.lightlink.io/api/v2/addresses/${account?.address}`,{
            headers:{
                "Content-Type": "application/json"
            }
        })
        const data = response.data;
        if(data){
            const balance = data.coin_balance
            setEthBalance((Number(balance)*Math.pow(10,-18)).toFixed(8))
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

    return(
        <div className="h-full w-full flex flex-col">
            <div className="mt-3 border-2 border-[#304053] h-12 w-full flex flex-row justify-between items-center p-2 rounded-lg">
                <span className="text-black">Wallet address</span>
                <div className="flex cursor-pointer flex-row gap-1" onClick={copyAddress}>
                    <span className="text-black">{account?truncateString(account?.address):"-"}</span>
                    <img width={15} src="/assets/icon/copy.svg" alt="copy" />
                </div>
            </div>
            <div className="mt-3 flex flex-col justify-between items-center gap-3">
                <div className="flex flex-row justify-between items-center gap-3 border-2 text-center border-[#304053] rounded-lg w-full p-2 text-black">
                    <span>Invite code</span>
                    <span>Coming soon</span>
                </div>
                <div className="flex flex-row justify-between items-center gap-3 border-2 text-center border-[#304053] rounded-lg  w-full p-2 text-black">
                    <span>Referals</span>
                    <span>Coming soon</span>
                </div>
            </div>
            <div className="mt-5 flex flex-col border-2 border-[#304053] rounded-lg p-2 w-full text-black">
                <span>Balance</span>
                <div className="flex mt-3 flex-row justify-between items-center">
                    <div className="flex flex-row gap-1 items-center">
                        <img width={20} src="/assets/icon/eth.svg" alt="eth" />
                        <span className="text-lg">ETH</span>
                    </div>
                    <span>{ethBalance ? ethBalance : "-"}</span>
                </div>
                <div className="flex mt-1 flex-row justify-between items-center">
                    <div className="flex flex-row gap-1 items-center">
                        <img width={20} src="/assets/icon/coin.svg" alt="coin" />
                        <span className="text-lg">RGT</span>
                    </div>
                    <span>{raiTokenBalance ? parseDot(raiTokenBalance) : "-"}</span>
                </div>
            </div>
            <button className="w-full mt-4 bg-[#304053] hover:bg-opacity-85 rounded-lg h-14">
                <span className="text-xl">LOG OUT</span>
            </button>
            <div className="flex flex-col mt-5 gap-2">
                <div className="flex flex-row gap-1 cursor-pointer items-center text-black" onClick={()=>setIsSound((prv)=>!prv)}>
                    {
                        isSound?(
                            <img width={30} src="/assets/icon/sound.svg" alt="sound" />
                        ):(
                            <img width={30} src="/assets/icon/disable-sound.svg" alt="sound" />
                        )
                    }
                    <span className="text-lg ml-1 -mt-1">Sound</span>
                </div>
                <Link href={"#"} className="flex gap-1 flex-row cursor-pointer items-center text-black">
                    <img width={28} src="/assets/icon/telegram.svg" alt="telegram" />
                    <span className="text-lg ml-1 -mt-1">Telegram</span>
                </Link>
                <Link href={"#"} className="flex gap-1 flex-row cursor-pointer items-center text-black">
                    <img width={30} src="/assets/icon/feedback.svg" alt="feedback" />
                    <span className="text-lg ml-1 -mt-1">feedback</span>
                </Link>
                <Link href={"#"} className="flex gap-1 flex-row cursor-pointer items-center text-black">
                    <img width={26} src="/assets/icon/docs.svg" alt="docs" />
                    <span className="text-lg ml-2 -mt-1">docs</span>
                </Link>
            </div>
        </div>
    )
}

export default Settings;