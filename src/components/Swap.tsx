const Swap = () =>{
    return(
        <div className="h-full w-full flex flex-col gap-5 items-center">
            <div className="flex flex-col bg-[#a9c6e4] bg-opacity-95 border border-[#628ab4] w-full h-24 rounded-lg p-2">
                <div className="flex flex-row justify-between w-full">
                    <span>You Pay</span>
                    <small>Max: 0.322 WETH</small>
                </div>
                <div className="flex mt-2 flex-row justify-between w-full">
                    <input placeholder="0" className="h-10 placeholder:text-[#628ab4] focus:outline-none outline-none text-white text-2xl font-semibold bg-transparent w-2/3 px-2 py-3" type="text" />
                    <button className="flex cursor-pointer flex-row justify-between items-center gap-2 border border-gray-200 p-1 rounded-lg">
                        <div className="flex flex-row gap-1">
                            <img width={18} height={18} src="/assets/icon/near.svg" alt="near" />
                            <span className="text-2xl">NEAR</span>
                        </div>
                        <img width={10} className="h-5 w-5" src="/assets/icon/arrow-down.svg" alt="arrow" />
                    </button>
                </div>
            </div>
            <div className="flex flex-col -mt-3 -mb-3">
                <img width={30} className="rotate-90" src="/assets/icon/arrow-next.png" alt="arrow" />
                <img width={30} className="rotate-90 -mt-4" src="/assets/icon/arrow-next.png" alt="arrow" />
                <img width={30} className="rotate-90 -mt-4" src="/assets/icon/arrow-next.png" alt="arrow" />
            </div>
            <div className="flex flex-col bg-[#a9c6e4] bg-opacity-95 border border-[#628ab4] w-full h-24 rounded-lg p-2">
                <div className="flex flex-row justify-between w-full">
                    <span>You Receive</span>
                    <small>Max: 0.322 WETH</small>
                </div>
                <div className="flex mt-2 flex-row justify-between w-full">
                    <input placeholder="0" className="h-10 placeholder:text-[#628ab4] focus:outline-none outline-none text-white text-2xl font-semibold bg-transparent w-2/3 px-2 py-3" type="text" />
                    <button className="flex cursor-pointer flex-row justify-between items-center gap-2 border border-gray-200 p-1 rounded-lg">
                        <div className="flex flex-row gap-1">
                            <img width={18} height={18} src="/assets/icon/near.svg" alt="near" />
                            <span className="text-2xl">NEAR</span>
                        </div>
                        <img width={10} className="h-5 w-5" src="/assets/icon/arrow-down.svg" alt="arrow" />
                    </button>
                </div>
            </div>
            <div className="flex flex-row justify-center w-full">
                <button disabled className="w-3/4 h-12 bg-[#2d3c53] hover:bg-opacity-80 px-3 py-2 rounded-lg">
                    <span className="text-white font-semibold text-xl">Coming soon</span>
                </button>
            </div>
            <div className="swap"/>
        </div>
    )
}

export default Swap;