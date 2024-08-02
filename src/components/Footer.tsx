"use client"

import Link from "next/link";
import { useEffect, useState } from "react";

type Button = {
    src: string,
    title: string,
    url: string
}

const Footer = () =>{
    
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    useEffect(()=>{
        setCurrentIndex(Number(localStorage.getItem("linkIndex")))
    },[])

    const ImageButton = [
        {src: "/assets/button/home.png",title: "home",url:"/"},
        {src: "/assets/button/mining.png",title: "mining", url: "/mining"},
        {src: "/assets/button/attack.png",title: "attack", url: "/battle"},
        {src: "/assets/button/petlist.png",title:"petlist", url: "/profile"},
        {src: "/assets/button/training.png",title: "training", url: "/mission"},
    ]

    const handleSelectIndex = (i:number) =>{
        localStorage.setItem("linkIndex",i.toString())
    }

    return(
        <div className="bg-[#e5f2f8] sticky w-full bottom-0 mt-1
        
        ">
            <img width={200} height={100} className="w-full h-[108px]" src="/assets/background/frame_bottom.png" alt="frame" />
            <div className="absolute top-2 left-0 flex justify-center w-full">
                <div className="flex flex-row gap-2 justify-between w-full px-2 items-center">
                    {ImageButton.map((btn:Button,i:number)=>(
                        <Link href={btn.url} key={i} onClick={()=>handleSelectIndex(i)}>
                            <img width={60} height={60} className={currentIndex==i?"w-[80px] h-[80px]":"w-[65px] h-[65px] focus:w-[80px] focus:h-[80px] hover:w-[80px] hover:h-[80px] transition-all delay-100"} src={btn.src} alt={btn.title} />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Footer;