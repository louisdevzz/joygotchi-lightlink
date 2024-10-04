import Footer from "./Footer";
import Header from "./Header";

const BreadPet = () => {
    return (
        <div className="h-screen w-full flex flex-row justify-center items-center">
            <div className="h-full md:max-h-[700px] w-full md:max-w-[400px] rounded-lg shadow-lg relative">
                <div className="background flex flex-col h-full w-full relative">
                    <Header/>
                </div>
                <Footer/>
            </div>
        </div>
    )
}

export default BreadPet;