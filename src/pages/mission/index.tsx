import Footer from "@/components/Footer";
import Header from "@/components/Header";

const Mission = () =>{
    return(
        <div className="h-screen w-full flex flex-row justify-center items-center">
            <div className="h-full md:max-h-[700px] w-full md:max-w-[380px] rounded-lg shadow-lg relative overflow-hidden">
                <div className="bg-[#e5f2f8] flex flex-col h-full w-full overflow-hidden">
                    <Header/>
                    <div className="h-full overflow-y-auto w-full scrollbar">
                        <div className="p-3 h-full flex flex-col relative w-full">
                            
                        </div>
                    </div>
                    <Footer/>
                </div>
            </div>
        </div>
    )
}

export default Mission;