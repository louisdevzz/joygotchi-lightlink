'use client'
import { useState,useEffect, useMemo } from "react";
import Link from "next/link";

import { useRouter } from "next/router";
import { createThirdwebClient, defineChain, getContract } from "thirdweb";
import { ConnectButton, lightTheme, useActiveAccount, useIsAutoConnecting } from "thirdweb/react";
import axios from "axios";

const client = createThirdwebClient({
    clientId: process.env.CLIENT_ID!
});
import { inAppWallet } from "thirdweb/wallets";


const Header = () =>{
    const wallets = [inAppWallet()]
    const account = useActiveAccount();
    const [isShow, setIsShow] = useState<boolean>(false);
    const [status, setStatus] = useState<string|null>(null);
    const router = useRouter();
    const [ethBalance, setEthBalance] = useState<string|null>(null)
    const [raiTokenBalance, setRaiTokenBalance] = useState<string|null>(null)

    useEffect(()=>{
        if(account){
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
            console.log("Not rai token in balance")
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
        <div className="sticky w-full fix-header top-0 z-10 md:rounded-t-lg">
            {status&&(
                    <div className="fixed z-50 bg-[#97b5d5] w-60 h-10 top-5 left-[52%] rounded-lg border-2 border-[#e5f2f8] shadow-sm transform -translate-x-1/2 transition-all delay-75">
                        <div className="flex flex-row w-full px-3 items-center h-full gap-2">
                            <img width={22} src="/assets/icon/success.svg" alt="success" />
                            <small className="text-[#2d3c53] text-sm font-semibold">{status}</small>
                        </div>
                    </div>
                )}
            <div className="border-b border-gray-300 h-16 w-full bg-[#2d3c53] relative">
                <div className="flex flex-row justify-between items-center px-2 py-2 pt-3">
                    <div className="flex flex-row items-center gap-5">
                        <div className="flex flex-row gap-1">
                            <img width={25} height={25} src="/assets/icon/eth_light.svg" alt="coin" />
                            <p className="text-[#fff]">{ethBalance ? ethBalance : "0"}</p>
                        </div>
                        <div className="flex flex-row gap-1">
                            <img width={25} height={25} src="/assets/icon/coin_light.svg" alt="coin" />
                            <p className="text-[#fff]">{raiTokenBalance ?  parseDot(raiTokenBalance) : "0"}</p>
                        </div>
                    </div>
                    
                    <div className="flex flex-row gap-4 items-center">
                        <ConnectButton connectModal={{ size: "wide" }} detailsButton={{
                            style:{
                                background: "#fff",
                            },
                            render:()=>{
                                return(
                                    <div className="px-2 cursor-pointer py-0.5 h-8 rounded-full bg-[#a9c6e4]">
                                        {truncateString(account?.address as string)}
                                    </div>
                                )
                            }
                        }} theme={"dark"} signInButton={{
                            style:{
                                background: "#fff"
                            },
                            label: "Connect Wallet"
                        }} autoConnect client={client} wallets={wallets} />
                        {/* <ConnectButton client={client} chain={{
                            id:1891,
                            rpc:`https://1891.rpc.thirdweb.com/${process.env.CLIENT_ID!}`
                        }}
                        wallets={wallets}
                        /> */}
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default Header;