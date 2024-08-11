"use client"
import { createThirdwebClient } from "thirdweb";
import { ConnectButton, lightTheme, useActiveAccount } from "thirdweb/react";
import { useRouter } from "next/router";
const client = createThirdwebClient({
    clientId: process.env.CLIENT_ID!
});
import { inAppWallet } from "thirdweb/wallets";

const Login = () =>{
	const wallets = [inAppWallet()];
	const account = useActiveAccount()
	const router = useRouter()

	if(account){
		router.push("/")
	}
    return(
        <div className="max-h-[700px] max-w-[400px] align-middle overflow-hidden rounded-lg shadow-lg">
            <div className="bg-[#e5f2f8] w-[400px] h-[700px]">
                <div className="p-3 flex flex-col h-full w-full justify-center items-center">
					<div>
						<ConnectButton connectModal={{ size: "wide" }} detailsButton={{
							render:()=>{
								return(
									<div className="bg-green-600 px-3 py-2 rounded-lg">
										<span>Connect Successfull!</span>
									</div>
								)
							}
						}} theme={"dark"} signInButton={{
							label: "Connect Wallet"
						}} autoConnect client={client} wallets={wallets} />
					</div>
                </div>
            </div>
        </div>
    )
}
export default Login;