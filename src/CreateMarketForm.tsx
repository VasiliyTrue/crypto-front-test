import React, { useEffect, useState } from 'react'
import { ethers, formatEther, parseEther, parseUnits } from 'ethers'
import { abi } from './Abi'
import { Button, Form, Input, InputNumber, DatePicker } from 'antd'

export const CreateMarketForm = () => {
	const [market, setMarket] = useState('')
	const [account, setAccount] = useState('')
	const [contractData, setContractData] = useState('')
	const address = '0x595A74DDE1b1d08a48943A81602bc334474ce487'

	// const provider = new ethers.InfuraProvider('maticmum')
	let signer
	let contract: ethers.Contract

	const { ethereum } = window
	const connectMetamask = async () => {
		if (window.ethereum !== 'undefined') {
			const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
			setAccount(accounts[0])
		}
	}

	const connectContract = async () => {
		const provider = await new ethers.BrowserProvider(window.ethereum)
		signer = await provider.getSigner()
		contract = await new ethers.Contract(address, abi, signer)
		console.log('contract', contract)
		console.log('signer', signer)
	}

	// const getData = async () => {
	// 	const phrase = await contract.myFlower()
	// 	setContractData(phrase)
	// }

	// const changeData = async () => {
	// 	const txResponse = await contract.createMarket()
	// 	const txReceipt = await txResponse.wait()
	// 	console.log(txReceipt)
	// }

	const searchMarket = async (
		cutoffDate: number,
		decisionDate: number,
		decisionProvider: string,
		description: string
	) => {
		// const marketData = await contract.getMarket(description, cutoffDate)
		console.log('contract', contract)

		const marketData = await contract.createMarket(
			cutoffDate,
			decisionDate,
			decisionProvider,
			description
		)
		const txReceipt = await marketData.wait()
		console.log('answer', txReceipt)
		// setMarket(formatEther(marketData))
	}

	const { RangePicker } = DatePicker

	const onFinish = (fieldsValue: any) => {
		const rangeTimeFrom = new Date(
			fieldsValue['timePeriod'][0].format('YYYY-MM-DD')
		).getTime()
		const rangeTimeTo = new Date(
			fieldsValue['timePeriod'][1].format('YYYY-MM-DD')
		).getTime()

		searchMarket(
			rangeTimeFrom,
			rangeTimeTo,
			fieldsValue.decisionProvider,
			fieldsValue.description
		)
	}

	return (
		<div>
			<button onClick={connectMetamask}>CONNECT TO METAMASK</button>
			<p>{account}</p>
			<button onClick={connectContract}>CONNECT TO CONTRACT</button> <br />{' '}
			<br />
			<Form
				name='time_related_controls'
				// {...formItemLayout}
				onFinish={onFinish}
				style={{ maxWidth: 600 }}
			>
				<Form.Item
					name='timePeriod'
					label='time period'
					rules={[
						{
							required: true,
							message: 'please select a time period',
						},
					]}
				>
					<RangePicker showTime format='YYYY-MM-DD' />
				</Form.Item>
				<Form.Item
					name='decisionProvider'
					label='decision provider'
					rules={[
						{
							required: true,
							message: 'please fill in the decision provider!',
						},
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name='description'
					label='description'
					rules={[
						{
							required: true,
							message: 'please fill in the description!',
						},
					]}
				>
					<Input.TextArea />
				</Form.Item>
				<Form.Item
					wrapperCol={{
						xs: { span: 24, offset: 0 },
						sm: { span: 16, offset: 8 },
					}}
				>
					<Button type='primary' htmlType='submit'>
						Submit
					</Button>
				</Form.Item>
			</Form>
		</div>
	)
}
