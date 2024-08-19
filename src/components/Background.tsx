const Background = ({backgroundPet,data}:Background) =>{

    const onChangeBackground = (bg: string)=>{
        backgroundPet(bg)
        localStorage.setItem("backgroundPet",bg)
    }

    return(
        <div className="flex flex-col gap-3 mt-5">
            <div className="flex flex-row gap-3 flex-wrap">
                {
                    data.length > 0 &&(data.map((bg:string)=>(
                        <div onClick={()=>onChangeBackground(bg)} className="flex flex-col bg-[#628ab4] shadow-lg justify-center items-center w-24 h-24 rounded-lg relative">
                            <img width={45} className="w-full h-full rounded-lg" src={`/assets/background/${bg}`} alt="background" />
                            <div className="absolute -bottom-2">
                                <div className="p-1 flex justify-center items-center bg-white rounded-lg min-w-20">
                                    <small className="text-black">10 coin</small>
                                </div>
                            </div>
                        </div>
                    ))
                        
                    )
                }
            </div>
        </div>
    )
}

export default Background;