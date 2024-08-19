
type Button = {
    name: string,
}

const Tabs = ({listButton,setCurrentIndex,currentIndex}:{listButton:any,setCurrentIndex:any,currentIndex:number}) =>{

    return(
        <div className="flex flex-row gap-3 md:max-w-[380px] items-center rounded-lg">
                {listButton.map((btn:Button,id:number)=>(
                    <button onClick={()=>setCurrentIndex(id)} key={id}>
                        <div className={` hover:bg-[#628ab4] ${currentIndex==id?"bg-[#628ab4]":"bg-[#628ab4] bg-opacity-60"} p-2 max-w-30 flex justify-center rounded-lg`}>
                            <span>{btn.name}</span>
                        </div>
                    </button>
                ))}
            </div>
    )
}

export default Tabs;