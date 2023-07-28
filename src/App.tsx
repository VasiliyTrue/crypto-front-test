import React, { useEffect } from 'react'
import '@rainbow-me/rainbowkit/styles.css'
import {
	ConnectButton,
	getDefaultWallets,
	RainbowKitProvider,
	Chain,
} from '@rainbow-me/rainbowkit'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'

import { CreateMarketForm } from './CreateMarketForm'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { ethers } from 'ethers'

const mumbai: Chain = {
	id: 80001,
	name: 'Mumbai',
	network: 'Mumbai',
	nativeCurrency: {
		decimals: 18,
		name: 'Mumbai',
		symbol: 'Mumbai',
	},
	rpcUrls: {
		myNet: {
			http: [
				'https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78',
			],
		},
		default: {
			http: [
				'https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78',
			],
		},
		public: {
			http: [
				'https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78',
			],
		},
	},
	blockExplorers: {
		default: { name: 'Mumbai', url: 'https://mumbai.polygonscan.com' },
		etherscan: { name: 'Mumbai', url: 'https://mumbai.polygonscan.com' },
	},
	testnet: true,
}

const { publicClient, chains } = configureChains(
	[mumbai],
	[
		jsonRpcProvider({
			rpc: chain => ({ http: chain.rpcUrls.default.http[0] }),
		}),
	]
)

const { connectors } = getDefaultWallets({
	appName: 'My RainbowKit App',
	projectId: 'YOUR_PROJECT_ID',
	chains,
})

const wagmiConfig = createConfig({
	autoConnect: true,
	connectors,
	publicClient,
})
export function App() {
	return (
		<WagmiConfig config={wagmiConfig}>
			<RainbowKitProvider chains={chains}>
				<ConnectButton />
				<CreateMarketForm />
			</RainbowKitProvider>
		</WagmiConfig>
	)
}
