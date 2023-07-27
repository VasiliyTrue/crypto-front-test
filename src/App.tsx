import React from 'react'
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

let signer = null

let provider
if (window.ethereum == null) {
	// If MetaMask is not installed, we use the default provider,
	// which is backed by a variety of third-party services (such
	// as INFURA). They do not have private keys installed so are
	// only have read-only access
	console.log('MetaMask not installed; using read-only defaults')
	provider = ethers.getDefaultProvider()
} else {
	// Connect to the MetaMask EIP-1193 object. This is a standard
	// protocol that allows Ethers access to make all read-only
	// requests through MetaMask.
	provider = new ethers.BrowserProvider(window.ethereum)

	// It also provides an opportunity to request access to write
	// operations, which will be performed by the private key
	// that MetaMask manages for the user.
	signer = await provider.getSigner()
}

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
