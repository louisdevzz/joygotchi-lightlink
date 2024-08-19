"use client"
import AccessorieItems from "@/components/Accessories";
import Background from "@/components/Background";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScreenPetAccessories from "@/components/ScreenPetAccessories";
import Tabs from "@/components/Tab";
import axios from "axios";
import { useState,useEffect, use } from "react";
import { useActiveAccount } from "thirdweb/react";

const Accessories = () =>{
    const account = useActiveAccount();
    const [petList, setPetList] = useState<any|null>([]);
    const [loadingFetch, setLoadingFetch] = useState<boolean>(true)
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [backgroundPet, setPackgroundPet] = useState<string|null>(null)
    const [index, setIndex] = useState<number>(0)
    
    const listTabs = [
        {
            name: "Accessories"
        },
        {
            name: "Background"
        }
    ]

    useEffect(()=>{
        if(localStorage.getItem("backgroundPet")){
            setPackgroundPet(localStorage.getItem("backgroundPet"))
        }else{
            setPackgroundPet("screen_pet.png")
        }
    },[])

    useEffect(()=>{
        if(account){
            loadNFT()
        }
    },[account])

    const loadNFT = async() =>{
        try{
            const response = await axios.get(`https://pegasus.lightlink.io/api/v2/addresses/${account?.address}/nft?type=ERC-721`,{
                headers:{
                    "Content-Type":"application/json"
                }
            })
            if(response.status == 404){
                return ;
            }
            const data = response.data;
            setPetList(data.items)
            console.log(data.items)
            setLoadingFetch(false)
        }catch(error){
            setLoadingFetch(false)
            console.log("not pet in wallet")
        }
    }

    const dataBackground = ["screen_pet.png","battle.png","bg.png"]
    //console.log("petlist",account?.address)

    return(
        <div className="flex flex-row justify-center items-center h-screen">
            <div className="h-full md:max-h-[700px] w-full md:max-w-[400px] rounded-lg shadow-lg relative">
                <div className="bg-[#e5f2f8] h-full w-full flex flex-col relative">
                    <div className="invisible absolute top-0">
                        <Header/>
                    </div>
                    <div className="h-full overflow-y-auto w-full scrollbar overflow-x-hidden">
                        <div className="h-full flex flex-col relative w-full">
                            {
                                !loadingFetch&&petList.length > 0 &&(
                                    <div className="flex flex-col">
                                        <div className="h-full">
                                            <div className="w-full h-[300px] rounded-md flex justify-center flex-row relative">
                                                <img width={60} className="w-full h-full rounded-md" src={`/assets/background/${backgroundPet}`} alt="screen" />
                                                <div className="flex flex-row justify-between">
                                                    <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2">
                                                        <ScreenPetAccessories petList={petList} setIndex={setIndex}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-3 mt-3">
                                            <Tabs listButton={listTabs} setCurrentIndex={setCurrentIndex} currentIndex={currentIndex}/>
                                            {
                                                currentIndex==0?(
                                                    <AccessorieItems/>
                                                ):currentIndex==1&&(
                                                    <Background backgroundPet={setPackgroundPet} data={dataBackground}/>
                                                )
                                            }
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

export default Accessories;