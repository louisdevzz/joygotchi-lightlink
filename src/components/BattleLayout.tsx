"use client"
import { useState } from "react";

const BattleLayout = ({petList,setIndex}:{petList: any,setIndex:any}) =>{
    const [currentIndex, setCurrentIndex] = useState<number>(0);

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
    return(
        petList.length > 0 && petList[currentIndex] && <div className="relative">
            <button onClick={goToPrevious}>
                <img width={10} height={10} className="absolute arrow-left " src="/assets/icon/arrow_left.png" alt="arrow" />
            </button>
            <img className="-mt-10 pet" src={`/assets/animation/${petList[currentIndex].category}/${petList[currentIndex].pet_evolution_phase}.gif`} alt={petList[currentIndex].name} />
            <button onClick={goToNext}>
                <img width={10} height={10} className="absolute arrow-right" src="/assets/icon/arrow_right.png" alt="arrow" />
            </button>
            <div className="absolute top-[70%] left-[20%] text-black">
                <small>{petList[currentIndex].name}</small>
            </div>
        </div>
    )
}

export default BattleLayout;