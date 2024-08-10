"use client"
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useState } from "react";

const Space = () =>{
    const [countSpace, setCoutSpace] = useState<number>(0);
    const [status, setStatus] = useState<string|null>(null);

    const addSpace = () =>{
        setCoutSpace(countSpace+1)
    }

    const minusSpace = () =>{
        if(countSpace > 0){
            setCoutSpace(countSpace-1)
        }
    }
    
    const onBuy = () =>{
        setStatus("BUY SUCCSEFFULL!")
        setTimeout(function(){
            setStatus(null)
        },1200)
    }
    return(
        <div className="h-screen w-full flex flex-row justify-center items-center">
            <div className="h-full md:max-h-[700px] w-full md:max-w-[380px] rounded-lg shadow-lg relative overflow-hidden">
                <div className="bg-[#e5f2f8] flex flex-col h-full w-full overflow-hidden">
                    {status&&(
                        <div className="fixed z-50 bg-[#97b5d5] w-56 h-10 top-5 left-[52%] rounded-lg border-2 border-[#e5f2f8] shadow-sm transform -translate-x-1/2 transition-all delay-75">
                            <div className="flex flex-row w-full px-3 items-center h-full gap-2">
                                <img width={22} src="/assets/icon/success.svg" alt="success" />
                                <small className="text-[#2d3c53] text-sm font-semibold">{status}</small>
                            </div>
                        </div>
                    )}
                    <Header/>
                    <div className="h-full overflow-y-auto w-full scrollbar">
                        <div className="h-full flex flex-col relative w-full">
                        <div className="mt-3 px-2">
                            <div className="px-3 py-2 items-center text-black w-full flex justify-between rounded-lg border-2 border-[#2d3c53] bg-[#97b5d5] bg-opacity-40">
                                <div className="flex flex-col gap-1">
                                    <span>Peacekeepers</span>
                                    <span>ID: 3765</span>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <div className="flex flex-row gap-2 items-center">
                                        <img width={18} src="/assets/icon/planet.svg" alt="planet" />
                                        <span>3674</span>
                                    </div>
                                    <div className="bg-[#E5F2F8] bg-opacity-75 flex flex-row gap-1 px-2 py-1 rounded-full">
                                        <img src="/assets/icon/ethereum.svg" alt="ethereum" />
                                        <small className="text-black">45.000</small>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 w-full flex justify-center">
                                <img width={20} className="w-[60%]" src="/assets/nft/nft_1.gif" alt="nft" />
                            </div>
                            <div className="mt-5 flex flex-row gap-5 border-2 border-[#2d3c53] items-center w-full rounded-lg py-2 px-3">
                                <img width={45} src="/assets/icon/diamond.svg" alt="diamond" />
                                <div className="flex flex-col gap-1">
                                    <span className="text-black">Starting in: 6h:45m:20s</span>
                                    <div>
                                        <span className="text-[#6251A2]">Battle:</span>
                                        <span className="ml-3 text-black">4 weeks</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 px-3 py-2 h-42 text-black w-full flex justify-between rounded-lg border-2 border-[#2d3c53] bg-[#97b5d5] bg-opacity-40">
                                <div className="flex flex-row justify-between items-center w-full">
                                    <div className="flex flex-col gap-2 items-center">
                                        <small>100 token per space</small>
                                        <div className="flex flex-row justify-between gap-2 items-center h-10 w-full bg-[#8fa6ca] p-2 rounded-lg">
                                            <div onClick={addSpace} className="bg-[#2d3c53] hover:bg-opacity-85 rounded-full w-7 h-7 flex items-center justify-center">
                                                <img width={20} src="/assets/icon/add.svg" alt="add" />
                                            </div>
                                            <div className="w-20">
                                                <input value={countSpace&&countSpace} onChange={(e)=>setCoutSpace(Number(e.target.value))} placeholder="0" className="w-full placeholder:text-[#2d3c539c] text-2xl bg-transparent text-center text-[#2d3c53] outline-none focus:outline-none px-2 py-1" type="text" />
                                            </div>
                                            <div onClick={minusSpace} className="bg-[#2d3c53] hover:bg-opacity-85 rounded-full w-7 h-7 flex items-center justify-center">
                                                <img width={20} src="/assets/icon/minus.svg" alt="minus" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 items-center">
                                        <small>65 space</small>
                                        <button disabled onClick={onBuy} className="bg-[#2d3c53] w-38 h-10 rounded-lg hover:bg-opacity-85 text-[#fff]">
                                            <span>coming soon</span>
                                        </button>
                                    </div>
                                </div>
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

export default Space;