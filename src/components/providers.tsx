
'use client';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {http} from 'viem';
import {mainnet, sepolia} from 'viem/chains';

import type {PrivyClientConfig} from '@privy-io/react-auth';
import {PrivyProvider} from '@privy-io/react-auth';
import {WagmiProvider, createConfig} from '@privy-io/wagmi';

const queryClient = new QueryClient();

export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    createOnLogin: 'users-without-wallets',
    requireUserPasswordOnCreate: true,
    noPromptOnSignature: false,
  },
  loginMethods: ['wallet', 'email'],
  appearance: {
    showWalletLoginFirst: true,
  },
};

export default function Providers({children}: {children: React.ReactNode}) {
  return (
    <PrivyProvider
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      appId="clyob5f2n06osr8l805kx698r"
      config={privyConfig}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}