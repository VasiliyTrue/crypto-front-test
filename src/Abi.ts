export const abi = [
	{ inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'previousOwner',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'newOwner',
				type: 'address',
			},
		],
		name: 'OwnershipTransferred',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'marketAddress',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'cutoffDate',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'decisionDate',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'decisionProvider',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'string',
				name: 'description',
				type: 'string',
			},
		],
		name: 'marketCreatedEvent',
		type: 'event',
	},
	{
		inputs: [
			{ internalType: 'uint256', name: 'cutoffDate', type: 'uint256' },
			{ internalType: 'uint256', name: 'decisionDate', type: 'uint256' },
			{ internalType: 'address', name: 'decisionProvider', type: 'address' },
			{ internalType: 'string', name: 'description', type: 'string' },
		],
		name: 'createMarket',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address payable', name: '_to', type: 'address' }],
		name: 'destroy',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'string', name: 'description', type: 'string' },
			{ internalType: 'uint256', name: 'cutoffDate', type: 'uint256' },
		],
		name: 'getMarket',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
		name: 'markets',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'owner',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'renounceOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
		name: 'transferOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
]