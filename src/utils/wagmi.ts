import { http, createConfig } from "wagmi";
import { sepolia,lightlinkPegasus } from "wagmi/chains";
import { coinbaseWallet, injected,safe } from "wagmi/connectors";

export const config = createConfig({
    chains: [lightlinkPegasus,sepolia],
    transports: {
        [lightlinkPegasus.id]: http(),
        [sepolia.id]: http(),
    },
});

declare module "wagmi" {
	interface Register {
		config: typeof config;
	}
}