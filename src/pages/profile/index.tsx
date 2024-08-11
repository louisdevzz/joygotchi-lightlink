"use client"
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Mint from "@/components/Mint";
import Settings from "@/components/Settings";
import Swap from "@/components/Swap";
import Tabs from "@/components/Tab";
import { useState } from "react";


const Profile = () =>{
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    return(
        <div className="h-screen w-full flex flex-row justify-center items-center">
            <div className="h-full md:max-h-[700px] w-full md:max-w-[400px] rounded-lg shadow-lg relative overflow-hidden">
                <div className="bg-[#e5f2f8] flex flex-col h-full w-full overflow-hidden">
                    <Header/>
                    <div className="h-full overflow-y-auto w-full scrollbar overflow-x-hidden">
                        <div className="h-full flex flex-col relative w-full">
                            <div className="mt-4 px-2 w-full">
                                <div className="mb-5 w-full">
                                    <Tabs setCurrentIndex={setCurrentIndex} currentIndex={currentIndex}/>
                                </div>
                                {currentIndex==0?(
                                    <Mint/>
                                ):currentIndex==1?(
                                    <Swap/>
                                ):currentIndex==2&&(
                                    <Settings/>
                                )}
                            </div>
                        </div>
                    </div>
                    <Footer/>
                </div>
            </div>
        </div>
    )
}

export default Profile;