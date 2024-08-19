import { useEffect, useState } from "react";

const ScreenPetAccessories = ({petList,setIndex}:{petList: any,setIndex:any}) =>{
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const goToPrevious = () =>{
        const isFirstIndex = currentIndex == 0;
        const newIndex = isFirstIndex ? petList.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex)
        setIndex(newIndex)
        localStorage.setItem("namePet",petList[newIndex].metadata.name)
        localStorage.setItem("indexPet",newIndex.toString())
        localStorage.setItem("seconds",JSON.stringify(petList[newIndex].time_until_starving/10000000))
    }
    const goToNext = () =>{
        const isLastIndex = currentIndex == petList.length - 1;
        const newIndex = isLastIndex ? 0: currentIndex + 1;
        setCurrentIndex(newIndex)
        setIndex(newIndex)
        localStorage.setItem("indexPet",newIndex.toString())
        localStorage.setItem("namePet",petList[newIndex].metadata.name)
        localStorage.setItem("seconds",JSON.stringify(petList[newIndex].time_until_starving/10000000))
    }
    return(
        petList.length > 0 && <div>
            <button onClick={goToPrevious}>
                <img width={10} height={10} className="w-6 h-6 absolute top-1/2 -left-[30px] " src="/assets/icon/arrow_left.png" alt="arrow" />
            </button>
            <img className="ml-6" width={150} src={petList[currentIndex].image_url} alt={petList[currentIndex].metadata&&petList[currentIndex].metadata.name} />
            <button onClick={goToNext}>
                <img width={10} height={10} className="w-6 h-6 absolute top-1/2 -right-[40px] " src="/assets/icon/arrow_right.png" alt="arrow" />
            </button>
        </div>
    )
}

export default ScreenPetAccessories;