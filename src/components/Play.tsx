import {useAccount} from 'wagmi';
import Footer from './Footer';
import Header from './Header';
import { useState } from 'react';
import Link from 'next/link';
import CountDownTimer from './CountDownTimer';
import BuyItem from './BuyItem';
import ScreenPet from './ScreenPet';

const Play = () => {
    const {address, isConnected, isConnecting, isDisconnected} = useAccount();
    const [account, setAccount] = useState<string|null>(address||null);
    const [isShow, setIsShow] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false);
    const [namePet,setNamePet] = useState<string|null>(null);
    const [petLists, setPetLists] = useState<any|null>([]);
    const [index, setIndex] = useState<number>(0);
    const [status, setStatus] = useState<string|null>(null);
    const seconds = Number(localStorage.getItem("seconds"))??0;
    const [isSign, setIsSign] = useState<boolean>(false);
    const [error, setError] = useState<string|null>(null)
    //console.log("address",address)

    const onChangeName = async() =>{
        try{
            setStatus("Loading....")
            
            setStatus("CHANGE SUCCSEFFULL!")
            setTimeout(function(){
                setStatus(null)
            },1200)
            setIsShow(false)
        }catch(err){
            console.log(err)
            setError(err as string)
            setTimeout(function(){
                setError(null)
            },1200)
            
        }
        
    }

    const truncateString = (str: string)=>{
        const format = str.replace("0x","");
        if(format.length > 6) return "0x"+format.slice(0,2)+'...'+format.slice(-2);
        return "0x"+format
    }

    return(
        <div className="h-full md:max-h-[700px] w-full md:max-w-[380px] rounded-lg shadow-lg relative">
            <div className="bg-[#e5f2f8 h-full w-full">
                <div className="w-full fix-header sticky top-0 z-20">
                        {
                            isShow&&(
                                <div className="fixed h-screen w-full bg-black bg-opacity-45 z-40 overflow-hidden overscroll-none">
                                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#e5f2f8] pb-5 w-[375px] rounded-lg">
                                        <div className="flex flex-row justify-between items-center w-full bg-[#2d3c53] h-12 rounded-t-lg px-3">
                                            <span>Change Name Pet</span>
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
                                                <span>Change</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        <div className="border-b border-gray-300 h-20 w-full bg-[#2d3c53] relative">
                            <div className="flex flex-row justify-between px-2 py-2">
                                <div className="flex flex-col gap-1">
                                    <div className="flex flex-row gap-2">
                                        <img width={25} src="/assets/item/coin.png" alt="coin" />
                                        <p className="text-[#fff]">0.01</p>
                                    </div>
                                    <div className="flex flex-row gap-2">
                                        <img width={25} src="/assets/item/credit_card.png" alt="coin" />
                                        <p className="text-[#fff]">19000</p>
                                    </div>
                                </div>
                                <div onClick={()=>setIsShow(true)} className="flex flex-row gap-1 items-center -mt-1 ml-4">
                                    <p className="text-[#fff]">{namePet}</p>
                                    <img width={14} src="/assets/icon/pen.svg" alt="pen" />
                                </div>
                                <div className="flex flex-row gap-4 mt-5 items-center">
                                {
                                    account&&(
                                    <Link href={"/mint?tab=2"} className="px-2 cursor-pointer py-0.5 h-8 rounded-full bg-[#a9c6e4]">
                                        <small className="text-white">{truncateString(account)}</small>
                                    </Link>
                                    )
                                }
                                </div>
                            </div>
                            <div className="px-3 py-2 w-[150px] rounded-full text-center absolute top-2/3 left-1/3  h-10 bg-[#f48f59]">
                                {/* <span>0h:57m:35s</span> */}
                                <CountDownTimer seconds={seconds}/>
                            </div>
                        </div>
                </div>
                <div className="overflow-y-auto h-full w-full">
                    <div className="h-full bg-[#e5f2f8] w-full flex flex-col flex-1 relative ">
                        <div className="p-3 h-full flex flex-col relative w-full">
                            <div className="flex flex-col">
                            <div className="mt-2 h-full">
                                <div className="w-full h-[250px] rounded-md flex justify-center flex-row relative">
                                    <img width={60} className="w-full h-full rounded-md" src="/assets/background/screen_pet.png" alt="screen" />
                                    <div className="flex flex-row justify-between">
                                        {/* <img width={10} height={10} className="w-6 h-6 absolute top-1/2 left-[70px] " src="/assets/icon/arrow_left.png" alt="arrow" /> */}
                                        {/* <img width={150} className="absolute top-1/2 left-[53%] transform -translate-x-1/2 -translate-y-1/2" src="/assets/pet/pet.png" alt="pet" /> */}
                                        <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2">
                                            <ScreenPet petList={petLists} changeName={setNamePet} setIndex={setIndex}/>
                                        </div>
                                        {/* <img width={10} height={10} className="w-6 h-6 absolute top-1/2 right-[60px] " src="/assets/icon/arrow_right.png" alt="arrow" /> */}
                                    </div>
                                    {/* <p className="text-[#fff] font-semibold absolute top-3/4 mt-3 left-1/2 transform -translate-x-1/2 ">Pet Name</p> */}
                                </div>
                            </div>
                            <div className="mt-2 bg-[#a9c6e4] w-full flex-row flex justify-between rounded-lg px-3 py-4">
                                <div className="flex flex-col text-center">
                                    <p className="text-xl">{petLists.length > 0 ? petLists[index].reward_debt:"-"} NEAR</p>
                                    <span className="text-[#00000088]">REWARDS</span>
                                </div>
                                <div className="flex flex-col text-center">
                                    <p className="text-xl">{petLists.length > 0 ? petLists[index].level:"-"}</p>
                                    <span className="text-[#00000088]">LEVEL</span>
                                </div>
                                <div className="flex flex-col text-center">
                                    <p className="text-xl">{petLists.length > 0 ? petLists[index].status:"-"}</p>
                                    <span className="text-[#00000088]">STATUS</span>
                                </div>
                                <div className="flex flex-col text-center">
                                    <p className="text-xl">{petLists.length > 0 ? petLists[index].star:"-"}</p>
                                    <span className="text-[#00000088]">STAR</span>
                                </div>
                            </div>
                            <BuyItem petLists={petLists} index={index} status={setStatus} error={setError}/>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
            
        </div>
    )
}

export default Play;