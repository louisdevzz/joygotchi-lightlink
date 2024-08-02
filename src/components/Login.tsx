import {usePrivy} from '@privy-io/react-auth';

const Login = () =>{
    const {login,logout} = usePrivy();
    return(
        <div className="max-h-[700px] max-w-[380px] align-middle overflow-hidden rounded-lg shadow-lg">
            <div className="bg-[#e5f2f8] w-[380px] h-[700px]">
                <div className="p-3">
                    <div className="w-full flex justify-center items-center h-[700px]">
                        <button className="button" onClick={login}>
                            <span className="button_top">Connect Wallet</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Login;