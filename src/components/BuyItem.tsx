import { useCallback, useEffect, useState } from "react"
import { getContract, getGasPrice, prepareContractCall, toWei } from "thirdweb";
import { useActiveAccount, useReadContract, useSendTransaction } from "thirdweb/react";
import { client } from "@/utils/utils";
import { itemAbi, petAddress, tokenAbi } from "@/utils/abi";


type Button = {
    name: string,
    url: string,
    width: number
}

interface options{
    fetchEthBalance?:any,
    fetchRaiToken?:any
}


const BuyItem = ({petList,index,status,loading,error, refetch, optionFetchs}:{petList:any,index:number,status:any,loading: any,error:any,refetch:any, optionFetchs:options}) =>{
    const account = useActiveAccount()
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [gas, setGas] = useState<bigint|null>(null)
    const [itemId, setItemId] = useState<number>(0)
    const { mutate: sendTransaction, data: txResult,isSuccess: isSuccessTx,isPending: isPendingTx,isError,error: errorTx } = useSendTransaction();
    const { mutate: sendTx, error: errorApprove,isSuccess: isSuccessApprove,isPending: isPendingApprove,data: dataApprove } = useSendTransaction();
    const immidiateUseItemsContract = "0x0beA242D563fc68f47FDf0A6444DaF701b80F013"
    const contractAddress = "0x5D31C0fF4AAF1C906B86e65fDd3A17c7087ab1E3"
    const tokenAddress = "0x774683C155327424f3d9b12a85D78f410F6E53A1"
    const approveAmount = toWei("20000")

    const chain ={
        id: 1891,
        rpc: "https://replicator.pegasus.lightlink.io/rpc/v1"
    }

    useEffect(()=>{
        const loadGasPrice = async()=>{
            const gasPrice = await getGasPrice({
                client,
                chain
            })
            setGas(gasPrice)
        }
        loadGasPrice()
    },[gas])

    const contractPet = getContract({
        client,
        address: contractAddress,
        chain,
        abi: petAddress
    });
    const contractToken = getContract({
        client,
        address: tokenAddress,
        chain,
        abi: tokenAbi
    });
    
    const { data: isPetAlive, refetch: refetchPet } = useReadContract({
        contract: contractPet,
        method: "isPetAlive",
        params: [petList[index]?.id],
    });
    //console.log("isPetAlive",isPetAlive)
    const { data: allowance, error: errorAllowance, isError: isErrorAllownce } = useReadContract({
        contract: contractToken,
        method: "allowance",
        params: [account?.address as string,immidiateUseItemsContract],
    });
    //console.log("allowanceapprove",allowance)

    useEffect(()=>{
        if(Number(localStorage.getItem("allowanceApprove")) == 0 || allowance == BigInt(0)){
            approveSpending()
        }
        localStorage.setItem("allowanceApprove",allowance?.toString() as string)
    },[allowance])


    useEffect(()=>{
        if(isSuccessTx){
            loading(false)
            status("Feed successful")
            refetchPet()
            refetch()
            optionFetchs.fetchEthBalance()
            optionFetchs.fetchRaiToken()
            setTimeout(() => {
                status(null)
            }, 1200); 
        }
        if(isError){
            console.log(errorTx)
            loading(false)
            error("Feed failed!")
            setTimeout(() => {
                error(null)
            }, 1200); 
        }
        if(isPendingTx){
            loading(true)
        }
    },[isSuccessTx,isError,isPendingTx])

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

    const approveSpending = () =>{
        const itemsContract = getContract({
            client,
            address: tokenAddress,
            chain,
            abi: tokenAbi
        });
        const transaction = prepareContractCall({
            contract: itemsContract,
            method: "approve",
            params: [immidiateUseItemsContract,approveAmount],
            gas: gas as bigint
        });
        sendTx(transaction as any); 
    }

    const onBuyAccessory = async(itemId:any) =>{
        console.log("itemid",itemId)
        if(isPetAlive || itemId==3){
            if(allowance&&(allowance > BigInt(0))){
                const itemsContract = getContract({
                    client,
                    address: immidiateUseItemsContract,
                    chain,
                    abi: itemAbi
                });
                const transaction = prepareContractCall({
                    contract: itemsContract,
                    method: "buyImidiateUseItem",
                    params: [petList[index]?.id,BigInt(itemId)],
                    gas: gas as bigint
                });
                sendTransaction(transaction as any); 
            }else{
                error("Insufficient allowance")
                setTimeout(() => {
                    error(null)
                }, 1200); 
                return ;
            }
        }else{
            error("Pet not is Alive!")
            setTimeout(() => {
                error(null)
            }, 500); 
            error("Please buy item revive pet!")
            setTimeout(() => {
                error(null)
            }, 1200); 
        }
    }
    
    return(
        <div className="flex flex-col mt-5 relative">
            {/* <div className="mt-3 flex flex-row w-full justify-between items-center gap-5">
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
                        <p>Feed 1 {listButton[currentIndex].name}</p>
                        <p>1 RGT</p>
                    </div>
                    <div className="flex flex-row justify-center w-full mt-2">
                        <button onClick={()=>onBuyAccessory(currentIndex)} className="bg-[#2f3b53] w-48 h-10 rounded-lg">
                            <span className="text-[#fff] font-semibold">Feed</span>
                        </button>
                    </div>
                </div>
            ):currentIndex==1?(
                <div className="mt-3 bg-[#a9c6e4] w-full max-h-36 rounded-lg px-3 py-4">
                    <div className="flex flex-row justify-between w-full">
                        <p>Feed 1 {listButton[currentIndex].name}</p>
                        <p>1 RGT</p>
                    </div>
                    <div className="flex flex-row justify-center w-full mt-2">
                        <button onClick={()=>onBuyAccessory(currentIndex)} className="bg-[#2f3b53] w-48 h-10 rounded-lg">
                            <span className="text-[#fff] font-semibold">Feed</span>
                        </button>
                    </div>
                </div>
            ):currentIndex==2?(
                <div className="mt-3 bg-[#a9c6e4] w-full max-h-36 rounded-lg px-3 py-4">
                    <div className="flex flex-row justify-between w-full">
                        <p>Feed 1 {listButton[currentIndex].name}</p>
                        <p>1 RGT</p>
                    </div>
                    <div className="flex flex-row justify-center w-full mt-2">
                        <button onClick={()=>onBuyAccessory(currentIndex)} className="bg-[#2f3b53] w-48 h-10 rounded-lg">
                            <span className="text-[#fff] font-semibold">Feed</span>
                        </button>
                    </div>
                </div>
            ):currentIndex==3&&(
                <div className="mt-3 bg-[#a9c6e4] w-full max-h-36 rounded-lg px-3 py-4">
                    <div className="flex flex-row justify-between w-full">
                        <p>Feed 1 {listButton[currentIndex].name}</p>
                        <p>1 RGT</p>
                    </div>
                    <div className="flex flex-row justify-center w-full mt-2">
                        <button onClick={()=>onBuyAccessory(currentIndex)} className="bg-[#2f3b53] w-48 h-10 rounded-lg">
                            <span className="text-[#fff] font-semibold">Feed</span>
                        </button>
                    </div>
                </div>
            )} */}
            <img width={100} className="w-full h-full" src="/assets/asset/shop_item.png" alt="asset" />
            <div className="flex flex-row gap-8 absolute top-5 left-12">
                <button className="flex flex-col items-center gap-2">
                    <img width={33} src="/assets/items/water.png" alt="item" />
                </button>
                <button className="flex flex-col items-center gap-2 mt-5">
                    <img width={66} src="/assets/items/meat.png" alt="item" />
                </button>
                <button className="flex flex-col items-center gap-2 mt-1">
                    <img width={35} src="/assets/items/shield.png" alt="item" />
                </button>
                <button className="flex flex-col items-center gap-2">
                    <img width={65} src="/assets/items/holy_water.png" alt="item" />
                </button>
            </div>
            <div className="flex flex-row gap-[2.2rem] items-center absolute bottom-[3rem] left-9 text-sm">
                <span className="font-outline">Water</span>
                <span className="font-outline">Meat</span>
                <span className="font-outline">Shield</span>
                <span className="font-outline">Holy Water</span>
            </div>
            <div className="flex flex-row gap-[4.2rem] items-center absolute bottom-[1.6rem] left-[2.8rem] text-sm">
                <span>8</span>
                <span>10</span>
                <span>5</span>
                <span>20</span>
            </div>
        </div>
    )
}

export default BuyItem;