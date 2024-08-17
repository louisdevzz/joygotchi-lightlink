import Play from '@/components/Play';
import type { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'LEAF GUARDIAN',
  description: 'Tree Pot RPG battle',
}


export default function PlayGame() {
  return (
    <div className='flex justify-center w-full h-screen items-center'>
      <Play/>
    </div>
  );
}
