"use client"
import { useState } from "react";

const BattleLayout = ({petList,setIndex}:{petList: any,setIndex:any}) =>{
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [petName, setPetName] = useState<string|null>(null);

    const goToPrevious = () =>{
        const isFirstIndex = currentIndex == 0;
        const newIndex = isFirstIndex ? petList.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex)
        setIndex(newIndex)
    }
    const goToNext = () =>{
        const isLastIndex = currentIndex == petList.length - 1;
        const newIndex = isLastIndex ? 0: currentIndex + 1;
        setCurrentIndex(newIndex)
        setIndex(newIndex)
    }

    const truncateNamePet = (str: string)=>{
        if(str&&str.length > 10){
            return str.slice(0,10)+"..."
        }
        return str
    }

    return(
        petList.length > 0 && petList[currentIndex] && <div className="flex flex-row gap-3 justify-center items-center">
            <button onClick={goToPrevious}>
                <img width={10} height={10} className="w-6" src="/assets/icon/arrow_left.png" alt="arrow" />
            </button>
            <img className="-mt-10 w-44 h-44" src={petList[currentIndex].metadata.image} alt={petList[currentIndex].metadata.name} />
            <button onClick={goToNext}>
                <img width={10} height={10} className="w-6" src="/assets/icon/arrow_right.png" alt="arrow" />
            </button>
            <div className="absolute w-full -top-12 left-1 text-black">
                <span className="font-semibold">{petList[currentIndex].metadata.name}</span>
            </div>
        </div>
    )
}

export default BattleLayout;