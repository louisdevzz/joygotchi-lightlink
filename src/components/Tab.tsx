
type Button = {
    name: string,
}

const Tabs = ({setCurrentIndex,currentIndex}:{setCurrentIndex:any,currentIndex:number}) =>{
    const listButton = [
        {
            name:"Mint NFT",
        },
        {
            name:"SWAP",
        },
        {
            name:"Setting"
        }
    ];
    
    return(
        <div className="flex flex-row justify-between md:max-w-[360px] items-center bg-[#a9c6e4] rounded-lg">
                {listButton.map((btn:Button,id:number)=>(
                    <button onClick={()=>setCurrentIndex(id)} key={id}>
                        <div className={` hover:bg-[#628ab4] ${currentIndex==id&&"bg-[#628ab4]"} p-2 w-28 flex justify-center rounded-lg`}>
                            <span>{btn.name}</span>
                        </div>
                    </button>
                ))}
            </div>
    )
}

export default Tabs;