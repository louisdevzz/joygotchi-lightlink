import Play from '@/components/Play';
import type { Metadata } from 'next';
import Login from '@/components/Login';
import {useAccount, useDisconnect} from 'wagmi';

export const metadata: Metadata = {
  title: 'LEAF GUARDIAN',
  description: 'Tree Pot RPG battle',
}


export default function Home() {
  // const {ready, user, authenticated, login, connectWallet, logout, linkWallet} = usePrivy();
  const {address, isConnected, isConnecting, isDisconnected} = useAccount();
  console.log("isConnected",isConnected)
  return (
    <div className='flex justify-center w-full h-screen items-center'>
      {isConnected?(
        <Play/>
      ):(
        <Login/>
      )}
    </div>
  );
}
