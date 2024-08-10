'use client'
import { faucetAbi, petAddress, tokenAbi } from "@/utils/abi";
import axios from "axios";
import { useEffect, useState } from "react"

import { createThirdwebClient, prepareContractCall,getContract } from "thirdweb";
import { getOwnedNFTs } from "thirdweb/extensions/erc721";
import { useActiveAccount, useReadContract,useSendTransaction,useWalletBalance } from "thirdweb/react";

const client = createThirdwebClient({
    clientId: process.env.CLIENT_ID!
});

const Mint = () =>{
    const account = useActiveAccount();
    const [namePet, setNamePet] = useState<string|null>("GREEN DRAGON")
    const [ATK, setATK] = useState<string|null>("100")
    const [DEF, setDEF] = useState<string|null>("100")
    const [image, setImage] = useState<string|null>("/assets/animation/blackdragon/1.gif")
    const [status, setStatus] = useState<string|null>(null);
    const [isApprove, setIsApprove] = useState<boolean>(false);
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const { mutate: sendTx, data: transactionResult,isError,error,isSuccess } = useSendTransaction();
    const { mutate: sendTransaction, data: txResult,isError: isErrorTx,error: ErrorTx,isSuccess: isSuccessTx } = useSendTransaction();
    const contractAddress = "0x5D31C0fF4AAF1C906B86e65fDd3A17c7087ab1E3"
    const faucetAddress= "0x937529264EBF13a0203cfAf7bBf09a3822f6636a"
    const tokenAdrees = "0x774683C155327424f3d9b12a85D78f410F6E53A1"
    const MAX_ALLOWANCE = BigInt('20000000000000000000000')
    const chain = {
        id:1891,
        rpc:"https://1891.rpc.thirdweb.com/6f3aa29d720d4272cea48e0aaa54e79e"
    }


    
    
    const contractToken = getContract({
        client,
        address: tokenAdrees,
        chain,
        abi: tokenAbi
    });
    
    const { data: allowance, error: errorAllowance, isError: isErrorAllownce } = useReadContract({
        contract: contractToken,
        method: "allowance",
        params: [account?.address as string,contractAddress],
    });
    //console.log("allowance",allowance)

    if(isErrorAllownce){
        console.log("isErrorAllownce",errorAllowance)
    }

   
    //{ chain, address, client, tokenAddress }
    const { data: tokenBlanceData, isError: isTokenBlanceError,error:tokenBlanceError } = useWalletBalance({
        chain,
        address: account?.address,
        client,
        tokenAddress: tokenAdrees,
    });
    const { data: ethBlanceData, isError: isEthBlanceError,error: ethBlanceError } = useWalletBalance({
        chain,
        address: account?.address,
        client,
    });
    
    console.log("tokenBlanceData",tokenBlanceData)
    const onMintBlackDragon =() =>{
        setNamePet("BLACK DRAGON")
        setATK("100")
        setDEF("100")
        setImage("/assets/animation/blackdragon/1.gif")
        setCurrentIndex(0)
    }

    const onMintGreenDragon =() =>{
        setNamePet("GREEN DRAGON")
        setATK("100")
        setDEF("100")
        setImage("/assets/animation/greendragon/1.gif")
        setCurrentIndex(1)
    }
    
    const onMint = async() =>{
        const contract = getContract({
            client,
            address: contractAddress,
            chain: {
                id:1891,
                rpc:"https://1891.rpc.thirdweb.com/6f3aa29d720d4272cea48e0aaa54e79e"
            },
            abi: petAddress
        });
        if(allowance&&(Number(allowance.toString().replace("n","")) == 0)){
            const transactionAllowance = prepareContractCall({
                contract: contractToken,
                method: "approve",
                params: [contractAddress, MAX_ALLOWANCE]
            });
            sendTransaction(transactionAllowance as any)
            if(isSuccessTx){    
                const transaction = prepareContractCall({
                    contract,
                    method: "mint",
                    params: []
                });
                sendTx(transaction as any);  
            } 
        }else{
            const transaction = prepareContractCall({
                contract,
                method: "mint",
                params: []
            });
            sendTx(transaction as any);  
        }
        
        
    }
    console.log('allowance',allowance)
    if(ErrorTx){
        console.log("ErrorTx",ErrorTx)
    }

    if(isError){
        console.log("isError",error)
    }

    if(txResult){
        console.log("txResult",txResult)
    }

    if(transactionResult){
        console.log("transactionResult",transactionResult)
    }
    return(
        <>
            {status&&(
                <div className="fixed z-50 bg-[#97b5d5] w-60 h-10 top-5 left-[52%] rounded-lg border-2 border-[#e5f2f8] shadow-sm transform -translate-x-1/2 transition-all delay-75">
                    <div className="flex flex-row w-full px-3 items-center h-full gap-2">
                        <img width={22} src="/assets/icon/success.svg" alt="success" />
                        <small className="text-[#2d3c53] text-sm font-semibold">{status}</small>
                    </div>
                </div>
            )}

            <div className="border-2 border-[#304053] shadow-sm w-full h-44 rounded-lg">
                <div className="py-1 w-full rounded-t-md bg-[#304053] text-center">
                    <span className="text-xl">NFT PET</span>
                </div>
                <div className="px-3">
                    <div className="mt-5 flex flex-row gap-5 items-center justify-between">
                        <div className="p-3 rounded-md border-2 border-[#304053] items-center flex justify-center">
                            <img width={110} height={110} src={image as string} alt="pet" />
                        </div>
                        <div className="w-full text-black">
                            <div className="flex flex-col gap-2">
                                <div className="flex border-b-2 border-[#304053] flex-row justify-between items-center">
                                    <span className="text-[#00000075]">NAME</span>
                                    <span>{namePet}</span>
                                </div>
                                <div className="flex flex-row justify-between items-center">
                                    <span className="text-[#00000075]">ATK</span>
                                    <span>{ATK}</span>
                                </div>
                                <div className="flex flex-row justify-between items-center">
                                    <span className="text-[#00000075]">DEF</span>
                                    <span>{DEF}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
            <div className="flex flex-row justify-start gap-5 items-center mt-2">
                <div onClick={onMintBlackDragon} className={`h-28 cursor-pointer w-28 border-2 rounded-lg mt-2 border-[#304053] ${currentIndex==0?"border-opacity-100":"border-opacity-35"} relative`}>
                    <img width={24} className="h-20 w-20 ml-3 rounded-lg" src="/assets/animation/blackdragon/1.gif" alt="pet" />
                    <small className="text-black absolute ml-1 w-full bottom-1 text-[0.7rem]">
                        BLACK DRAGON
                    </small>
                </div>
                <div onClick={onMintGreenDragon} className={`h-28 cursor-pointer w-28 border-2 rounded-lg mt-2 border-[#304053] ${currentIndex==1?"border-opacity-100":"border-opacity-35"} relative`}>
                    <img width={24} className="h-20 w-20 ml-5 rounded-lg" src="/assets/animation/greendragon/1.gif" alt="pet" />
                    <small className="text-black absolute ml-1 w-full bottom-1 text-[0.7rem]">
                        GREEN DRAGON
                    </small>
                </div>
                {/* <div className="h-28 cursor-pointer w-28 border-2 rounded-lg mt-2 border-[#304053] relative">
                    <img width={24} className="h-20 w-20 ml-2 rounded-lg" src="/assets/animation/blackdragon/1.gif" alt="pet" />
                    <small className="text-black absolute ml-1 w-full bottom-1 text-[0.7rem]">
                        DRAGON BLACK
                    </small>
                </div> */}
            </div>
            <div className="mt-3 flex flex-col gap-2 justify-center items-center border-2 border-[#304053] h-32 w-full  rounded-lg">
                <div className="flex flex-col text-center -gap-2">
                    <span className="text-black">MINT 1 pet </span>
                    <span className="text-black">cost 2 token</span>
                </div>
                <button 
                        onClick={onMint}
                        className="w-44 h-12 px-3 py-2 bg-[#304053] rounded-lg"
                        >
                        <span className="font-semibold">MINT</span>
                    </button>
                
            </div>
        </>
    )
}

export default Mint;