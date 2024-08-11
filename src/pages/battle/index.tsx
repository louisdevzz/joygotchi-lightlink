'use client'
import BattleLayout from "@/components/BattleLayout";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useState } from "react";

const Battle = () =>{
    const [status, setStaus] = useState<string|null>(null)
    const [error, setError] = useState<string|null>(null)
    const [allListPet, setAllListPet] = useState<any>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [currentIndexPet, setCurrentIndexPet] = useState<number>(0);
    const [isShow, setIsShow] = useState<boolean>(false);
    const [isAttack, setIsAttack] = useState<boolean>(false)
    const [pets, setPets] = useState<any>([])
    const [oponents, setOponents] = useState<any>([])

    const onAttack = () =>{
        setIsAttack(true)
        setTimeout(() => {
            setIsAttack(false)
        }, 120);
    }

    const handlSelectPet = (idx: number) => {
        setCurrentIndexPet(idx);
        setIsShow(false);
    }

    return(
        <div className="h-screen w-full flex flex-row justify-center items-center">
            <div className="h-full md:max-h-[700px] w-full md:max-w-[400px] rounded-lg shadow-lg relative overflow-hidden">
                <div className="bg-[#e5f2f8] flex flex-col h-full w-full overflow-hidden">
                    {status&&(
                        <div className="fixed z-50 bg-[#d4edda] w-60 h-10 top-5 left-[52%] rounded-lg border-2 border-[#c3e6cb] shadow-sm transform -translate-x-1/2 transition-all delay-75">
                            <div className="flex flex-row w-full px-3 items-center h-full gap-2">
                                <img width={22} src="/assets/icon/success.svg" alt="success" />
                                <small className="text-[#155724] text-sm font-semibold">{status}</small>
                            </div>
                        </div>
                    )}
                    {error&&(
                        <div className="fixed z-50 bg-[#f8d7da] w-60 h-10 top-5 left-[52%] rounded-lg border-2 border-[#FF0000] shadow-sm transform -translate-x-1/2 transition-all delay-75">
                            <div className="flex flex-row w-full px-3 items-center h-full gap-2">
                                <img width={22} src="/assets/icon/error.svg" alt="error" />
                                <small className="text-[#FF0000] text-sm font-semibold">{error}</small>
                            </div>
                        </div>
                    )}
                    <Header/>
                    <div className="h-full overflow-y-auto w-full scrollbar">
                        <div className="h-full flex flex-col relative w-full">
                            <div className="mt-2 text-center flex justify-center flex-row px-2">
                                <p className="text-black px-2 py-1 bg-slate-300 w-full rounded-lg">Next Attack: 00:15:00</p>
                            </div>
                            <div className="mt-2 relative px-2">
                                <div className="w-full responsive rounded-md flex justify-center flex-row relative">
                                    {
                                        pets.length > 0 &&(
                                            <div className="absolute top-[65%] left-[52%] text-black">
                                                <small>{pets[currentIndexPet].name}</small>
                                            </div>
                                        )
                                    }
                                    <img width={60} className="w-full h-full rounded-md" src="/assets/background/battle.png" alt="screen" />
                                    {pets.length > 0 && pets[currentIndexPet] &&(
                                        <img className="absolute mg" src={`/assets/animation/${pets[currentIndexPet].category}/${pets[currentIndexPet].pet_evolution_phase}.gif`} alt="pet" />
                                    )}
                                    <div className="flex flex-row justify-between">
                                        <div className="absolute position">
                                            <BattleLayout petList={oponents} setIndex={setCurrentIndex}/>
                                        </div>
                                    </div>
                                </div>
                                {
                                pets.length > 0 &&(
                                    <div onClick={()=>setIsShow((prv)=>!prv)} className="mt-2 bg-[#a9c6e4] p-3 relative rounded-lg flex flex-row justify-between items-center text-black">
                                        <div className="flex flex-row items-center gap-2">
                                            {pets.length > 0 &&(
                                                <img className="-mt-2" width={62} src={`/assets/animation/${pets[currentIndexPet].category}/${pets[currentIndexPet].pet_evolution_phase}.gif`} alt="pet" />
                                            )}
                                            <div className="flex flex-col">
                                                <p className="text-sm">{pets[currentIndexPet].name}</p>
                                                <div className="flex flex-row gap-3">
                                                    <div className="flex flex-col">
                                                        <small>ATK: 100</small>
                                                        <small>DEF: 100</small>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <small>Status: {pets[currentIndexPet].status}</small>
                                                        <small>Score: {pets[currentIndexPet].score}</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button>
                                            <img width={20} className="rotate-90" src="/assets/icon/arrow_right.png" alt="arrow" />
                                        </button>
                                    </div>
                                )
                                }
                                <div className="mt-2 border-2 border-gray-300 flex flex-row justify-center gap-5 w-full px-2 py-3 rounded-lg text-black">
                                    <button onClick={onAttack}>
                                        {
                                            isAttack?(
                                                <img width={260} src="/assets/button/button-attack-enter.png" alt="btn" />
                                            ):(
                                                <img width={260} src="/assets/button/button-attack.png" alt="btn" />
                                            )
                                        }
                                    </button>
                                </div>
                            </div>
                            
                            {
                                isShow &&(
                                    <div className="bg-black fixed top-0 bg-opacity-60 z-50 h-screen screen overflow-hidden">
                                        
                                        <div className="h-[72%] w-[98%] absolute overflow-hidden border-2 p-2 border-slate-300 shadow-sm bg-slate-100 rounded-lg top-[10%] z-50 left-1/2 transform -translate-x-1/2 flex flex-col gap-2">
                                            <div className="flex flex-row justify-end">
                                                <button onClick={()=>setIsShow(false)}>
                                                    <img width={40} src="/assets/icon/close.svg" alt="close" />
                                                </button>
                                            </div>
                                            <div className="overflow-y-auto gap-2 mt-2 h-full flex flex-col">
                                                {pets.length > 0&&pets.map((pet:any,idx:number)=>(
                                                    <div key={idx} onClick={()=>handlSelectPet(idx)} className="w-full bg-[#a9c6e4] px-1 py-2 cursor-pointer hover:bg-opacity-75 focus:bg-opacity-75 rounded-lg flex flex-row justify-between items-center text-black">
                                                        <div className="flex flex-row items-center gap-2">
                                                            <img className="-mt-2" width={62} src={`/assets/animation/${pet.category}/${pet.pet_evolution_phase}.gif`} alt="pet" />
                                                            <div className="flex flex-col">
                                                                <p className="text-sm">{pet.name}</p>
                                                                <div className="flex flex-row gap-3">
                                                                    <div className="flex flex-col">
                                                                        <small>ATK: 100</small>
                                                                        <small>DEF: 100</small>
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <small>Status: {pet.status}</small>
                                                                        <small>Score: {pet.score}</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
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

export default Battle;