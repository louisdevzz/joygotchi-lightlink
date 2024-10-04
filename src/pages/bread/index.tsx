"use client"
import axios from "axios"
import Footer from "@/components/Footer";
import { getContract, getGasPrice } from "thirdweb";
import Header from "@/components/Header";
import { useState, useMemo, useEffect } from "react";
import { client } from "@/utils/utils";
import { useActiveAccount, useReadContract,} from "thirdweb/react";
import { petAddress } from "@/utils/abi";
import Web3 from "web3";

const BreadPet = () => {

    const [allListPet, setAllListPet] = useState<any>([])
    const [currentIndexPet, setCurrentIndexPet] = useState<number>(0)
    const [gas, setGas] = useState<bigint|null>(null)
    const [petInfoList, setPetInfoList] = useState<any>([])
    const [isShow, setIsShow] = useState<boolean>(false)
    const [isShowBreed, setIsShowBreed] = useState<boolean>(false)

    const account = useActiveAccount()
    const contractAddress = "0x5D31C0fF4AAF1C906B86e65fDd3A17c7087ab1E3"
    const web3 = new Web3('https://replicator-01.pegasus.lightlink.io/rpc/v1'); 
    const raiGotchiContract = new web3.eth.Contract(petAddress, contractAddress);

    const chain = {
        id:1891,
        rpc:"https://endpoints.omniatech.io/v1/lightlink/pegasus/public"
    }

    const contractPet = getContract({
        client,
        address: contractAddress,
        chain,
        abi: petAddress
    });

    useEffect(()=>{
        loadPet()
    },[])

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

    const loadPet = async() =>{
        const response = await axios.get(`https://pegasus.lightlink.io/api/v2/tokens/0x5D31C0fF4AAF1C906B86e65fDd3A17c7087ab1E3/instances`,{
            headers:{
                "Content-Type": "application/json"
            }
        })
        const data = response.data.items;
        // const dataFilter = data.filter((opponent:any)=> opponent.owner.hash !== account?.address)
        // console.log("dataFilter",dataFilter)
        setAllListPet(data)
    }

    const [pets, oponents] = useMemo(() => {
        const pets   = allListPet.filter((opponent:any)=> opponent.owner.hash === account?.address )
        const oponents = allListPet.filter((opponent:any)=> opponent.owner.hash !== account?.address )
        return [pets, oponents];
    }, [allListPet,account]);
    //console.log(oponents)
    const { data: dataPet, isError,refetch } = useReadContract({
        contract: contractPet,
        method: "getPetInfo",
        params: [pets[currentIndexPet]?.id],
        gas: gas as bigint
    });
    
    if(isError){
        console.log('You have not pet')
    }

    const loadPetInfo = async() =>{
        if(pets.length > 0){
            const petInfomation:any = []
            for(let i = 0; i < pets.length; i++){
                const petInfo = await raiGotchiContract.methods.getPetInfo(pets[i].id).call();
                const cleanPetInfo = {
                    _id:pets[i].id,
                    _name: petInfo._name,
                    _status: petInfo._status,
                    _score: petInfo._score,
                    _level: petInfo._level,
                    _timeUntilStarving: petInfo._timeUntilStarving,
                    _owner: petInfo._owner,
                    _rewards: petInfo._rewards,
                    _genes: petInfo._genes
                };
                petInfomation.push(cleanPetInfo)
                //console.log(`[INFO] Pet ${pets[i].id} Info:`, cleanPetInfo);
            }
            setPetInfoList(petInfomation)
            //console.log("petinfo",petInfomation)
        }
    }

    const nFormatter = (num:number, digits:number) => {
        const lookup = [
            { value: 1, symbol: "" },
            { value: 1e3, symbol: "k" },
            { value: 1e6, symbol: "M" },
            { value: 1e9, symbol: "G" },
            { value: 1e12, symbol: "T" },
            { value: 1e15, symbol: "P" },
            { value: 1e18, symbol: "E" }
        ];
        const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
        const item = lookup.findLast(item => num >= item.value);
        return item ? (num / item.value).toFixed(digits).replace(regexp, "").concat(item.symbol) : "0";
    }

    const truncateNamePet = (str: string)=>{
        if(str&&str.length > 10){
            return str.slice(0,10)+"..."
        }
        return str
    }

    useEffect(()=>{
        loadPetInfo()
    },[pets])

    return (
        <div className="h-screen w-full flex flex-row justify-center items-center">
            <div className="background h-full md:max-h-[700px] w-full md:max-w-[400px] rounded-lg shadow-lg relative">
                <div className="flex flex-col h-full w-full relative">
                    <Header/>
                    <div className="h-full overflow-y-auto w-full scrollbar overflow-x-hidden">
                        <div className="h-full flex flex-col relative w-full text-center p-2">
                            <div className="w-full h-[250px] rounded-md flex justify-center flex-row relative">
                                <img width={60} className="w-full h-full rounded-md" src={`/assets/background/pet_background.png`} alt="screen" />
                                <div className="flex">
                                    <img width={140} className="absolute top-[10%] left-[24%]" src={pets[currentIndexPet]?.metadata?.image} alt={pets[currentIndexPet]?.metadata?.name} />
                                    <img width={140} className="absolute top-[10%] right-[19%] oponent" src={pets[1]?.metadata?.image} alt={pets[1]?.metadata?.name} />
                                </div>
                            </div>
                            <div className="mt-5 relative">
                                <img width={100} className="w-full" src="/assets/asset/breed_menu.png" alt="breed_menu" />
                                <img width={60} className="absolute top-[47%] left-1/2 transform -translate-x-1/2 -translate-y-1/2" src="/assets/asset/heart.gif" alt="heart" />
                                <div className="flex flex-row gap-2 absolute bottom-6 left-4">
                                    <img width={85} src={pets[currentIndexPet]?.metadata?.image} alt={pets[currentIndexPet]?.metadata?.name} />
                                    <div className="flex flex-col items-start mt-2 font-outline">
                                        <span className='text-lg'>RAI</span>
                                        <div className='flex flex-row gap-10 text-sm'>
                                            <div className='flex flex-col'>
                                                <span>ATK: 100</span>
                                                <span>DEF: 100</span>
                                            </div>
                                            <div className='flex flex-col items-start'>
                                                <span>STAUS: HAPPY</span>
                                                <span>SCORE: 0</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row-reverse gap-6">
                                    <img width={85} className="oponent absolute top-0 right-4" src={pets[1]?.metadata?.image} alt={pets[1]?.metadata?.name} />
                                    <div className="flex flex-col items-start mt-6 font-outline absolute top-0 left-10">
                                        <span className='text-lg'>RAI</span>
                                        <div className='flex flex-row gap-10 text-sm'>
                                            <div className='flex flex-col'>
                                                <span>ATK: 100</span>
                                                <span>DEF: 100</span>
                                            </div>
                                            <div className='flex flex-col items-start'>
                                                <span>STAUS: HAPPY</span>
                                                <span>SCORE: 0</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 flex justify-center items-center pb-5">
                                <button className="">
                                    <img width={140} src="/assets/asset/breed_button.png" alt="breed_menu" />  
                                </button>
                            </div>
                        </div>
                        {
                            isShow&&(
                                <div className="fixed top-0 left-0 z-20 h-screen w-full flex flex-row justify-center items-center">
                                    <div className="h-full md:max-h-[700px] w-full md:max-w-[400px] rounded-lg shadow-lg relative background overflow-y-auto scrollbar overflow-x-hidden">
                                        <div className="h-screen w-full rounded-lg p-2 font-outline pb-10 mt-16"> 
                                            <img width={200} className="w-full" src="/assets/asset/breed_list_header.png" alt="breed" />
                                            <div className="flex flex-col gap-2 mt-5">
                                                {
                                                    pets.length > 0 && (
                                                        pets.map((pet: any, idx: number) => (
                                                            <div key={idx} className="flex flex-col gap-2 relative">
                                                                <img width={200} className="w-full" src="/assets/asset/breed_list_pet.png" alt="breed" />
                                                                <img width={80} className="absolute bottom-6 left-4" src={pet.metadata.image} alt="pet" />
                                                                <span className="absolute top-5 left-[27%] text-sm">
                                                                    {petInfoList[idx]?._name!='' ? truncateNamePet(petInfoList[idx]?._name) : truncateNamePet(pet.metadata.name)}
                                                                </span>
                                                                <span className="absolute top-5 right-[24%] text-sm">ID: {pet.id}</span>
                                                                <div className="flex flex-col absolute bottom-5 left-[27%] text-[13px]">
                                                                    <span>x{petInfoList[idx] ? nFormatter(Number(petInfoList[idx]?._score), 2) : '0000000'}</span>
                                                                    <div className="flex flex-row gap-2">
                                                                        <span>ATK: {petInfoList[idx] ? petInfoList[idx]?._genes[0] : '100'}</span>
                                                                        <span>DEF: {petInfoList[idx] ? petInfoList[idx]?._genes[1] : '100'}</span>
                                                                    </div>
                                                                </div>
                                                                <button className="absolute bottom-5 right-4" >
                                                                    <img width={20} className="w-24" src="/assets/asset/breed_list_button.png" alt="breed" />
                                                                </button>   
                                                            </div>
                                                        ))
                                                    )
                                                }
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        {
                            isShowBreed&&(
                                <div className="fixed top-0 left-0 z-20 h-screen w-full flex flex-row justify-center items-center">
                                    <div className="h-full md:max-h-[700px] w-full md:max-w-[400px] rounded-lg shadow-lg relative bg-black bg-opacity-65 overflow-y-auto scrollbar overflow-x-hidden">
                                        <div className="w-full rounded-lg p-2 font-outline pb-10 mt-16 flex flex-col justify-center items-center"> 
                                            <div className="flex justify-center items-center relative mt-5">
                                                <img width={200} className="w-full" src="/assets/asset/breed_result.png" alt="breed" />
                                                <img width={140} className="absolute top-[12%] left-[33%]" src={pets[currentIndexPet]?.metadata?.image} alt={pets[currentIndexPet]?.metadata?.name} />
                                                <span className="font-outline-pink absolute top-[64%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm">{petInfoList[0]._name!='' ? truncateNamePet(petInfoList[0]._name) : truncateNamePet(pets[0]?.metadata?.name)}</span>
                                                <div className="mt-5 absolute top-[75%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm flex flex-col">
                                                    <span className="font-outline-red">ATK: {petInfoList[0]._genes[0]}</span>
                                                    <span className="font-outline-red">DEF: {petInfoList[0]._genes[1]}</span>
                                                    <span className="font-outline-red">SCORE: {nFormatter(Number(petInfoList[0]?._score), 2)}</span>
                                                </div>
                                            </div>
                                            <button className="mt-5" onClick={()=>setIsShowBreed(false)}>
                                                <img width={60} className="w-36" src="/assets/asset/breed_ok.png" alt="breed" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    <Footer/>
                </div>
            </div>
        </div>
    )
}

export default BreadPet;