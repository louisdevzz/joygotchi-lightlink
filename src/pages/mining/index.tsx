'use client'
import CountDownTimer from "@/components/CountDownTimer";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { faucetAbi } from "@/utils/abi";
import { use, useEffect, useState } from "react";
import { createThirdwebClient, getContract, getGasPrice, prepareContractCall} from "thirdweb";
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
    const [isShowUpgrade, setIsShowUpgrade] = useState<boolean>(false);
    const [isClaim, setIsClaim] = useState<boolean>(false)
    const [gas, setGas] = useState<bigint|null>(null)
    const [isShowBuy, setIsShowBuy] = useState<boolean>(false)
    const faucetAddress= "0x937529264EBF13a0203cfAf7bBf09a3822f6636a"
    const acccont = useActiveAccount();
    const { mutate: sendTx, data: transactionResult,isSuccess,isError,isPending } = useSendTransaction();
    const chain = {
        id:1891,
        rpc:"https://endpoints.omniatech.io/v1/lightlink/pegasus/public"
    }
	//console.log("address", acccont?.address);

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
            params: [acccont?.address.toString() as string],
            gas: gas as bigint
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
                <div className="background h-full w-full flex flex-col relative">
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
                    <div className="overflow-y-auto w-full h-full scrollbar">
                        <div className="mt-2 px-2 flex flex-col gap-3 text-center justify-center items-center">
                            <div className="border-2 border-[#304053] shadow-sm w-full h-60 rounded-lg relative">
                                <img width={70} className="w-full h-60 rounded-lg" src="/assets/background/mining-background.png" alt="gif" />
                                <img width={70} className="absolute top-[35%] left-[60%]" src="/assets/background/stone.png" alt="stone" />
                                <img width={150} className="absolute top-[25%] left-[35%]" src="/assets/pet/mining.gif" alt="mining" />
                            </div>
                            <img width={200} className="w-full" src="/assets/asset/mining_screen_coin.png" alt="background" />
                            <div className="relative w-full h-full">
                                <img width={20} className="w-full" src="/assets/asset/mining_screen_info.png" alt="info" />
                                <span className="font-outline absolute top-4 left-4 text-lg">BRONE MINING MACHINE</span>
                                <div className="absolute top-16 left-4 flex flex-col gap-2">
                                    <div className="flex flex-row gap-5 items-center">
                                        <div className="w-20 h-20 rounded-lg relative">
                                            <img width={70} className="h-20 w-20 rounded-lg" src="/assets/background/mining-background.png" alt="gif" />
                                            <img width={20} className="absolute top-[35%] right-5" src="/assets/background/stone.png" alt="stone" />
                                            <img width={50} className="absolute top-[25%] left-[4%]" src="/assets/pet/mining.gif" alt="mining" />
                                        </div>
                                        <div className="flex gap-2 flex-col text-start font-outline text-lg">
                                            <small>Base&#58; &#43;20&#47;h</small>
                                            <small>Offline work time: 3h</small>
                                        </div>
                                    </div>
                                    
                                </div>
                                <button className="absolute bottom-3 right-3" onClick={()=>setIsShowUpgrade(!isShowUpgrade)}>
                                    <img width={120} src="/assets/asset/mining_upgrade_button.png" alt="upgrade" />
                                </button>
                            </div>
                            {
                                isShowUpgrade&&(
                                    <div className="relative">
                                        <div className="flex flex-row gap-2">
                                            <img className="w-[7.5rem]" src="/assets/asset/break.png" alt="break" />
                                            <img className="w-[7.5rem]" src="/assets/asset/break.png" alt="break" />
                                            <img className="w-[7.5rem]" src="/assets/asset/break.png" alt="break" />
                                        </div>
                                        <div className="mt-1 grid grid-cols-2 gap-2">
                                            <div className="relative">
                                                <img className="w-[12rem]" src="/assets/asset/mining_info_machine.png" alt="machine" />
                                                <img width={65} className="absolute top-1 left-0" src="/assets/icons/ai.png" alt="ai" />
                                            </div>
                                            <div className="relative">
                                                <img className="w-[12rem]" src="/assets/asset/mining_info_machine.png" alt="machine" />
                                                <img width={65} className="absolute top-1 left-0" src="/assets/icons/ai.png" alt="ai" />
                                            </div>
                                            <div className="relative">
                                                <img className="w-[12rem]" src="/assets/asset/mining_info_machine.png" alt="machine" />
                                                <img width={65} className="absolute top-1 left-0" src="/assets/icons/ai.png" alt="ai" />
                                            </div>
                                            <div className="relative">
                                                <img className="w-[12rem]" src="/assets/asset/mining_info_machine.png" alt="machine" />
                                                <img width={65} className="absolute top-1 left-0" src="/assets/icons/ai.png" alt="ai" />
                                            </div>
                                            <div className="relative">
                                                <img className="w-[12rem]" src="/assets/asset/mining_info_machine.png" alt="machine" />
                                                <img width={65} className="absolute top-1 left-0" src="/assets/icons/ai.png" alt="ai" />
                                            </div>
                                            <div className="relative">
                                                <img className="w-[12rem]" src="/assets/asset/mining_info_machine.png" alt="machine" />
                                                <img width={65} className="absolute top-1 left-0" src="/assets/icons/ai.png" alt="ai" />
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            {
                                isShowBuy&&(
                                    <div className="fixed top-0 left-0 z-20 h-screen w-full flex flex-row justify-center items-center">
                                        <div className="h-full md:max-h-[700px] w-full md:max-w-[400px] rounded-lg shadow-lg relative bg-black bg-opacity-50 overflow-y-auto scrollbar overflow-x-hidden ">
                                            <div className="w-full rounded-lg p-2 font-outline pb-10 mt-16"> 
                                                <img width={200} className="w-full" src="/assets/asset/mining_confirm_buy.png" alt="background" />
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <Footer/>
                </div>
            </div>
            
        </div>
    )
}

export default Mining;