'use client'
import { useEffect, useState } from "react"
import Link from "next/link";
import { Near } from "@/utils/near";
import { usePrivy } from "@privy-io/react-auth";

const Settings = () =>{
    const [isSound, setIsSound] = useState<boolean>(false);
    const [account, setAccount] = useState<string|null>(null);
    const {ready, authenticated, logout} = usePrivy();
    const disableLogout = !ready || (ready && !authenticated);

    const copyAddress = () => {
        if(account){
            navigator.clipboard.writeText(account as string)
            alert("Copied")
        }
    }

    return(
        <div className="h-full w-full flex flex-col">
            <div className="mt-3 border-2 border-[#304053] h-12 w-full flex flex-row justify-between items-center p-2 rounded-lg">
                <span className="text-black">Wallet address</span>
                <div className="flex cursor-pointer flex-row gap-1" onClick={copyAddress}>
                    <span className="text-black">{account?account:"-"}</span>
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
                        <img width={16} className="mt-1" src="/assets/icon/near-dark.svg" alt="near" />
                        <span className="text-lg">NEAR</span>
                    </div>
                    <span>0.001</span>
                </div>
                <div className="flex mt-1 flex-row justify-between items-center">
                    <div className="flex flex-row gap-1 items-center">
                        <img width={16} className="mt-1" src={Near} alt="near" />
                        <span className="text-lg">HOT</span>
                    </div>
                    <span>0.001</span>
                </div>
            </div>
            <button disabled={disableLogout} onClick={logout} className="w-full mt-4 bg-[#304053] hover:bg-opacity-85 rounded-lg h-14">
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