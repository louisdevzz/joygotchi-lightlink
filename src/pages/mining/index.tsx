'use client'
import CountDownTimer from "@/components/CountDownTimer";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { faucetAbi } from "@/utils/abi";
import { useEffect, useState } from "react";
import { createThirdwebClient, getContract, getGasPrice, prepareContractCall, prepareTransaction, sendAndConfirmTransaction, sendTransaction, simulateTransaction } from "thirdweb";
import { useActiveAccount, useSendTransaction,useWaitForReceipt } from "thirdweb/react";
const client = createThirdwebClient({
    clientId: process.env.CLIENT_ID!
});

const Mining = () =>{
    const [status, setStatus] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isDisable, setDisable] = useState<boolean>(false);
    const oldSeconds = 0
    const [seconds,setSeconds] = useState<number>(Math.abs(Math.floor((Date.now()-oldSeconds)/1000) - 60));
    const [error, setError] = useState<string|null>(null)
    const [isShowModal, setIsShowModal] = useState<boolean>(false);
    const [isClaim, setIsClaim] = useState<boolean>(false)
    const faucetAddress= "0x937529264EBF13a0203cfAf7bBf09a3822f6636a"
    const acccont = useActiveAccount();
    const { mutate: sendTx, data: transactionResult,isSuccess,isError,isPending } = useSendTransaction();
    const chain = {
        id:1891,
        rpc:"https://1891.rpc.thirdweb.com/6f3aa29d720d4272cea48e0aaa54e79e"
    }
	//console.log("address", acccont?.address);

    useEffect(()=>{
        if(isSuccess){
            setLoading(false)
            setStatus("Claim successfull")
            setTimeout(() => {
                setStatus(null)
            }, 1200); 
        }
        if(isError){
            setLoading(false)
            setError("Claim failed!")
            setTimeout(() => {
                setError(null)
            }, 1200); 
        }
        if(isPending){
            setLoading(true)
        }
    },[isSuccess,isError,isPending])

    const onFaucet = async() =>{
        const contract = getContract({
            client,
            address: faucetAddress,
            chain,
            abi: [
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_token",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "constructor"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_to",
                            "type": "address"
                        }
                    ],
                    "name": "getRaiToken",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "toggleActive",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "token",
                    "outputs": [
                        {
                            "internalType": "contract IERC20",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_to",
                            "type": "address"
                        }
                    ],
                    "name": "withdrawAll",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                }
            ]
        });
        const transaction = prepareContractCall({
            contract,
            method: "getRaiToken", // <- this gets inferred from the contract
            params: [
                "0xea72Cd032bD0f34B460e41A81e3a9731d1013030"
            ],
        });
        sendTx(transaction as any);   
        setIsClaim(true)
        setTimeout(() => {
            setIsClaim(false)
        }, 120);
    }
    
    
    return(
        <div className="flex flex-row justify-center items-center h-screen">
            <div className="h-full md:max-h-[700px] w-full md:max-w-[400px] rounded-lg shadow-lg relative">
                <div className="bg-[#e5f2f8] h-full w-full flex flex-col relative">
                    {status&&(
                        <div className="fixed md:absolute z-50 bg-[#d4edda] w-60 h-10 top-5 left-[52%] rounded-lg border-2 border-[#c3e6cb] shadow-sm transform -translate-x-1/2 transition-all delay-75">
                            <div className="flex flex-row w-full px-3 items-center h-full gap-2">
                                <img width={22} src="/assets/icon/success.svg" alt="success" />
                                <small className="text-[#155724] text-sm font-semibold">{status}</small>
                            </div>
                        </div>
                    )}
                    {loading&&(
                        <div className="fixed md:absolute z-50 bg-[#fef3c7] w-60 h-10 top-5 left-[52%] rounded-lg border-2 border-[#fabe25] shadow-sm transform -translate-x-1/2 transition-all delay-75">
                            <div className="flex flex-row w-full px-3 items-center h-full gap-2">
                                <img width={22} src="/assets/icon/reload.svg" alt="reload" />
                                <small className="text-[#f49d0c] text-sm font-semibold">Loading....</small>
                            </div>
                        </div>
                    )}
                    {error&&(
                        <div className="fixed md:absolute z-50 bg-[#f8d7da] w-60 h-10 top-5 left-[52%] rounded-lg border-2 border-[#FF0000] shadow-sm transform -translate-x-1/2 transition-all delay-75">
                            <div className="flex flex-row w-full px-3 items-center h-full gap-2">
                                <img width={22} src="/assets/icon/error.svg" alt="error" />
                                <small className="text-[#FF0000] text-sm font-semibold">{error}</small>
                            </div>
                        </div>
                    )}
                    <Header/>
                    <div className="overflow-y-auto w-full h-full">
                        <div className="mt-2 px-2">
                            <div className="border-2 border-[#304053] shadow-sm w-full h-60 rounded-lg relative">
                                <img width={70} className="w-full h-60 rounded-lg" src="/assets/background/mining-background.png" alt="gif" />
                                <img width={70} className="absolute top-[35%] left-[60%]" src="/assets/background/stone.png" alt="stone" />
                                <img width={150} className="absolute top-[25%] left-[35%]" src="/assets/pet/mining.gif" alt="mining" />
                                <button onClick={onFaucet} className="text-white flex justify-center items-center flex-row font-semibold absolute bottom-0 py-3 rounded-lg left-1/2 transform -translate-x-1/2">
                                {
                                    isClaim?
                                    (
                                        <img width={550} src="/assets/button/claim-button-pressed.png" alt="claim" />
                                    ):(
                                        <img width={550} src="/assets/button/claim-button.png" alt="claim" />
                                    )
                                }
                                </button>
                            </div>
                            <div className="mt-5 pb-10 flex flex-row justify-between gap-3">
                                <div onClick={()=>setIsShowModal(true)} className="h-44 w-36 shadow-lg ">
                                    <img width={100} className="w-full" src="/assets/tools/card-tool.png" alt="tool" />
                                </div>
                                <div onClick={()=>setIsShowModal(true)} className="h-44 w-36 shadow-lg ">
                                    <img width={100} className="w-full" src="/assets/tools/card-tool.png" alt="tool" />
                                </div>
                                <div onClick={()=>setIsShowModal(true)} className="h-44 w-36 shadow-lg ">
                                    <img width={100} className="w-full" src="/assets/tools/card-tool.png" alt="tool" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer/>
                </div>
                {
                    isShowModal&&(
                        <div className="fixed top-0 min-h-screen md:w-[400px] md:h-[700px] screen bg-black bg-opacity-60 z-50 flex justify-center items-center overflow-hidden">
                            <div className="bg-white h-[80vh] mt-5 w-[95%] rounded-lg flex flex-col p-2 pb-5">
                                <div className="flex flex-col overflow-y-auto">
                                <div className="flex justify-between flex-row">
                                    <span className="text-black text-2xl">Tool Slot</span>
                                    <button onClick={()=>setIsShowModal(false)}>
                                        <img width={35} src="/assets/icon/close.svg" alt="close" />
                                    </button>
                                </div>
                                <div className="flex flex-row justify-end items-center mt-1">
                                    <button className="text-white bg-red-500 px-2 py-1 rounded-lg flex flex-row gap-2 items-center">
                                        <img width={20} src="/assets/icon/close-btn.svg" alt="closeBtn" />
                                        <span className="">Remove tool</span>
                                    </button>
                                </div>
                                <div className="w-full h-full mt-5 flex flex-row flex-wrap gap-5 gap-y-16 overflow-y-auto items-center justify-center">
                                    <div onClick={()=>setIsShowModal(true)} className="h-44 w-36 shadow-lg ">
                                        <img width={100} className="w-full" src="/assets/tools/card-tool.png" alt="tool" />
                                    </div>
                                    <div onClick={()=>setIsShowModal(true)} className="h-44 w-36 shadow-lg ">
                                        <img width={100} className="w-full" src="/assets/tools/card-tool.png" alt="tool" />
                                    </div>
                                    <div onClick={()=>setIsShowModal(true)} className="h-44 w-36 shadow-lg ">
                                        <img width={100} className="w-full" src="/assets/tools/card-tool.png" alt="tool" />
                                    </div>
                                    <div onClick={()=>setIsShowModal(true)} className="h-44 w-36 shadow-lg ">
                                        <img width={100} className="w-full" src="/assets/tools/card-tool.png" alt="tool" />
                                    </div>
                                    <div onClick={()=>setIsShowModal(true)} className="h-44 w-36 shadow-lg ">
                                        <img width={100} className="w-full" src="/assets/tools/card-tool.png" alt="tool" />
                                    </div>
                                    <div onClick={()=>setIsShowModal(true)} className="h-44 w-36 shadow-lg ">
                                        <img width={100} className="w-full" src="/assets/tools/card-tool.png" alt="tool" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    )
                }
            </div>
            
        </div>
    )
}

export default Mining;