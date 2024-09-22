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
    const [isShowModal, setIsShowModal] = useState<boolean>(false);
    const [isClaim, setIsClaim] = useState<boolean>(false)
    const [gas, setGas] = useState<bigint|null>(null)
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
                    <div className="overflow-y-auto w-full h-full scrollbar">
                        <div className="mt-2 px-2 flex flex-col gap-3 text-center justify-center">
                            <span className="text-black font-semibold text-xl">Auto Mining</span>
                            <div className="border-2 border-[#304053] shadow-sm w-full h-60 rounded-lg relative">
                                <img width={70} className="w-full h-60 rounded-lg" src="/assets/background/mining-background.png" alt="gif" />
                                <img width={70} className="absolute top-[35%] left-[60%]" src="/assets/background/stone.png" alt="stone" />
                                <img width={150} className="absolute top-[25%] left-[35%]" src="/assets/pet/mining.gif" alt="mining" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-black">Profit per hour: <strong className="text-orange-500 font-semibold">499999K</strong></span>
                                <div className="flex flex-row justify-center items-center">
                                    <span className="text-black flex flex-row justify-center items-center gap-1">&#61; Base x &#40;1 &#43; <img width={13} src="/assets/icon/people.svg"/>&#41; &#43; <img width={23} src="/assets/icon/electric.svg"/></span>
                                    <img className="ml-2" width={20} src="/assets/icon/question.svg" alt="icon" />
                                </div>
                            </div>
                            <div className="h-16 rounded-lg border border-[#304053] border-opacity-35 bg-[#D3E0EA] w-full flex flex-row gap-3 items-center justify-center">
                                <img width={35} src="/assets/icon/rgt.svg" alt="coin" />
                                <span className="text-orange-500 text-4xl">150</span>
                            </div>
                            <div className="h-full rounded-lg border border-[#304053] border-opacity-35 bg-[#D3E0EA] w-full flex flex-col">
                                <div className="border-b border-[#304053] border-opacity-35 text-start">
                                    <div className="p-2">
                                        <span className="text-black">Brone Mining Machine</span>
                                    </div>
                                </div>
                                <div className="p-2 flex flex-row gap-2 justify-between items-center">
                                    <div className="w-20 h-20 rounded-lg relative">
                                        <img width={70} className="h-20 w-20 rounded-lg" src="/assets/background/mining-background.png" alt="gif" />
                                        <img width={20} className="absolute top-[35%] right-5" src="/assets/background/stone.png" alt="stone" />
                                        <img width={50} className="absolute top-[25%] left-[4%]" src="/assets/pet/mining.gif" alt="mining" />
                                    </div>
                                    <div className="flex gap-2 flex-col text-start text-black">
                                        <small>Base&#58; &#43;20&#47;h</small>
                                        <small>Offline work time: 3h</small>
                                    </div>
                                    <button onClick={()=>setIsShowModal(true)} className="border p-2 h-8 flex items-center border-[#304053] rounded-lg">
                                        <small className="text-black">Upgrade</small>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer/>
                </div>
                {
                    isShowModal&&(
                        <div className="fixed top-0 left-0 z-50 h-screen w-full flex flex-row justify-center items-center rounded-lg">
                            <div className="h-full md:max-h-[700px] p-3 w-full md:max-w-[400px] rounded-lg shadow-lg relative bg-black bg-opacity-40">
                                <div className="bg-white h-full w-full rounded-lg text-black p-3">
                                    <div className="flex flex-col">
                                        <div className="flex justify-between flex-row">
                                            <span className="text-black text-2xl">Tool Slot</span>
                                            <button onClick={()=>setIsShowModal(false)}>
                                                <img width={35} src="/assets/icon/close.svg" alt="close" />
                                            </button>
                                        </div>
                                        
                                        {/* <div className="flex flex-row justify-end items-center mt-1">
                                            <button className="text-white bg-red-500 px-2 py-1 rounded-lg flex flex-row gap-2 items-center">
                                                <img width={20} src="/assets/icon/close-btn.svg" alt="closeBtn" />
                                                <span className="">Remove tool</span>
                                            </button>
                                        </div> */}
                                        <div className="w-full h-full max-h-[550px] mt-5 flex flex-row flex-wrap gap-2 overflow-y-auto items-center justify-center scrollbar">
                                            <div className="h-full w-40 rounded-lg border border-[#304053] border-opacity-35 bg-[#D3E0EA]">
                                                <div className="flex flex-row justify-between gap-3 p-2">
                                                    <img width={40} height={40} src="/assets/tools/pickaxe.svg" alt="tool" />
                                                    <div className="flex flex-col gap-1 text-black">
                                                        <small>Pickaxe</small>
                                                        <small className="text-[#505050]">Profit per hour: &#43;20</small>
                                                    </div>
                                                </div>
                                                <div className="border-t border-[#304053] border-opacity-35">
                                                    <div className="px-2 flex flex-row gap-2">
                                                        <small className="border-r py-1 pr-2 border-[#304053] border-opacity-35">Lvl 4</small>
                                                        <div className="flex py-1 flex-row gap-2">
                                                            <img width={15} src="/assets/icon/rgt.svg" alt="coin" />
                                                            <small>500</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="h-full w-40 rounded-lg border border-[#304053] border-opacity-35 bg-[#D3E0EA]">
                                                <div className="flex flex-row justify-between gap-3 p-2">
                                                    <img width={40} height={40} src="/assets/tools/pickaxe.svg" alt="tool" />
                                                    <div className="flex flex-col gap-1 text-black">
                                                        <small>Pickaxe</small>
                                                        <small className="text-[#505050]">Profit per hour: &#43;20</small>
                                                    </div>
                                                </div>
                                                <div className="border-t border-[#304053] border-opacity-35">
                                                    <div className="px-2 flex flex-row gap-2">
                                                        <small className="border-r py-1 pr-2 border-[#304053] border-opacity-35">Lvl 4</small>
                                                        <div className="flex py-1 flex-row gap-2">
                                                            <img width={15} src="/assets/icon/rgt.svg" alt="coin" />
                                                            <small>500</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="h-full w-40 rounded-lg border border-[#304053] border-opacity-35 bg-[#D3E0EA]">
                                                <div className="flex flex-row justify-between gap-3 p-2">
                                                    <img width={40} height={40} src="/assets/tools/pickaxe.svg" alt="tool" />
                                                    <div className="flex flex-col gap-1 text-black">
                                                        <small>Pickaxe</small>
                                                        <small className="text-[#505050]">Profit per hour: &#43;20</small>
                                                    </div>
                                                </div>
                                                <div className="border-t border-[#304053] border-opacity-35">
                                                    <div className="px-2 flex flex-row gap-2">
                                                        <small className="border-r py-1 pr-2 border-[#304053] border-opacity-35">Lvl 4</small>
                                                        <div className="flex py-1 flex-row gap-2">
                                                            <img width={15} src="/assets/icon/rgt.svg" alt="coin" />
                                                            <small>500</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="h-full w-40 rounded-lg border border-[#304053] border-opacity-35 bg-[#D3E0EA]">
                                                <div className="flex flex-row justify-between gap-3 p-2">
                                                    <img width={40} height={40} src="/assets/tools/pickaxe.svg" alt="tool" />
                                                    <div className="flex flex-col gap-1 text-black">
                                                        <small>Pickaxe</small>
                                                        <small className="text-[#505050]">Profit per hour: &#43;20</small>
                                                    </div>
                                                </div>
                                                <div className="border-t border-[#304053] border-opacity-35">
                                                    <div className="px-2 flex flex-row gap-2">
                                                        <small className="border-r py-1 pr-2 border-[#304053] border-opacity-35">Lvl 4</small>
                                                        <div className="flex py-1 flex-row gap-2">
                                                            <img width={15} src="/assets/icon/rgt.svg" alt="coin" />
                                                            <small>500</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
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