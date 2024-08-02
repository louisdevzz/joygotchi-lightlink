import { useState } from "react"

type Button = {
    name: string,
    url: string,
    width: number
}

const BuyItem = ({petLists,index,status,error}:{petLists:any,index:number,status:any,error:any}) =>{
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const listButton = [
        {
            name:"water",
            url: "/assets/items/water.png",
            width: 20
        },
        {
            name:"beef",
            url: "/assets/items/beef.png",
            width: 40
        },
        {
            name:"shield",
            url: "/assets/items/shield.png",
            width: 40
        },
        {
            name:"holy water",
            url: "/assets/items/holy_water.png",
            width: 40
        }
    ];

    const onBuyAccessory = async(itemId:any) =>{
        try{
            status("Loading...")
            status(null)
            error('Pet is not Alive')
            setTimeout(() => {
                error(null)
            }, 1000);
        }catch(err){
            console.log(err)
            error(error)
            setTimeout(() => {
                error(null)
            }, 1000);
        }
    }
    
    return(
        <div className="flex flex-col">
            <div className="mt-3 flex flex-row w-full justify-between items-center gap-5">
                {listButton.map((btn:Button,id:number)=>(
                    <button onClick={()=>setCurrentIndex(id)} key={id}>
                        <div className={`${currentIndex==id?"bg-[#628ab4]":"bg-[#a9c6e4]"} hover:bg-[#628ab4] p-2 h-16 w-16 flex justify-center rounded-lg`}>
                            <img width={btn.width} src={btn.url} alt={btn.name} />
                        </div>
                    </button>
                ))}
            </div>
            {currentIndex==0?(
                <div className="mt-3 bg-[#a9c6e4] w-full max-h-36 rounded-lg px-3 py-4">
                    <div className="flex flex-row justify-between w-full">
                        <p>BUY 1 {listButton[currentIndex].name}</p>
                        <p>1 JOY</p>
                    </div>
                    {/* <div className="flex flex-row justify-center w-full mt-2">
                        <p className="text-[#00000088]">50 PTS & 12 HOURS TOD</p>
                    </div> */}
                    <div className="flex flex-row justify-center w-full mt-2">
                        <button onClick={()=>onBuyAccessory(currentIndex+1)} className="bg-[#2f3b53] w-48 h-10 rounded-lg">
                            <span className="text-[#fff] font-semibold">BUY</span>
                        </button>
                    </div>
                </div>
            ):currentIndex==1?(
                <div className="mt-3 bg-[#a9c6e4] w-full max-h-36 rounded-lg px-3 py-4">
                    <div className="flex flex-row justify-between w-full">
                        <p>BUY 1 {listButton[currentIndex].name}</p>
                        <p>1 JOY</p>
                    </div>
                    {/* <div className="flex flex-row justify-center w-full mt-2">
                        <p className="text-[#00000088]">50 PTS & 12 HOURS TOD</p>
                    </div> */}
                    <div className="flex flex-row justify-center w-full mt-2">
                        <button onClick={()=>onBuyAccessory(currentIndex+1)} className="bg-[#2f3b53] w-48 h-10 rounded-lg">
                            <span className="text-[#fff] font-semibold">BUY</span>
                        </button>
                    </div>
                </div>
            ):currentIndex==2?(
                <div className="mt-3 bg-[#a9c6e4] w-full max-h-36 rounded-lg px-3 py-4">
                    <div className="flex flex-row justify-between w-full">
                        <p>BUY 1 {listButton[currentIndex].name}</p>
                        <p>1 JOY</p>
                    </div>
                    {/* <div className="flex flex-row justify-center w-full mt-2">
                        <p className="text-[#00000088]">50 PTS & 12 HOURS TOD</p>
                    </div> */}
                    <div className="flex flex-row justify-center w-full mt-2">
                        <button onClick={()=>onBuyAccessory(currentIndex+1)} className="bg-[#2f3b53] w-48 h-10 rounded-lg">
                            <span className="text-[#fff] font-semibold">BUY</span>
                        </button>
                    </div>
                </div>
            ):currentIndex==3&&(
                <div className="mt-3 bg-[#a9c6e4] w-full max-h-36 rounded-lg px-3 py-4">
                    <div className="flex flex-row justify-between w-full">
                        <p>BUY 1 {listButton[currentIndex].name}</p>
                        <p>1 JOY</p>
                    </div>
                    {/* <div className="flex flex-row justify-center w-full mt-2">
                        <p className="text-[#00000088]">50 PTS & 12 HOURS TOD</p>
                    </div> */}
                    <div className="flex flex-row justify-center w-full mt-2">
                        <button onClick={()=>onBuyAccessory(currentIndex+1)} className="bg-[#2f3b53] w-48 h-10 rounded-lg">
                            <span className="text-[#fff] font-semibold">BUY</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BuyItem;