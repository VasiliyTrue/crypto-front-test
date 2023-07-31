import React, { useEffect, useState } from 'react'
import { ethers, formatEther, parseEther, parseUnits } from 'ethers'
import { abi } from './Abi'
import { Form, Input, DatePicker, Button, Radio, Typography } from 'antd'

export const CreateMarketForm = () => {
	const [market, setMarket] = useState('')
	const [account, setAccount] = useState('')
	const [contractTransactionReceipt, setContractTransactionReceipt] =
		useState('')

	const address = '0x595A74DDE1b1d08a48943A81602bc334474ce487'
	let signer
	let contract: ethers.Contract
	const { ethereum } = window

	const connectMetamask = async () => {
		if (window.ethereum !== 'undefined') {
			const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
			setAccount(accounts[0])
		}
		const provider = await new ethers.BrowserProvider(window.ethereum)
		signer = await provider.getSigner()
		contract = await new ethers.Contract(address, abi, signer)
		console.log('DOOOONEEE', contract)
		console.log('ACCOUNTT', account)
	}

	// const connectContract = async () => {
	// 	const provider = await new ethers.BrowserProvider(window.ethereum)
	// 	signer = await provider.getSigner()
	// 	contract = await new ethers.Contract(address, abi, signer)
	// }

	useEffect(() => {
		connectMetamask()
	}, [account])

	const searchMarket = async (
		cutoffDate: number,
		decisionDate: number,
		decisionProvider: string,
		description: string
	) => {
		const marketData = await contract.createMarket(
			cutoffDate,
			decisionDate,
			decisionProvider,
			description
		)
		const txReceipt = await marketData.wait()
		console.log('answer', txReceipt.blockHash)
		setContractTransactionReceipt(txReceipt.blockHash)
	}

	const { RangePicker } = DatePicker
	const { Title } = Typography

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
		<div className='container'>
			<Title level={3}>Will aliens land on earth?</Title>
			<Radio.Group className='option'>
				<Radio.Button value='yes'>YES</Radio.Button>
				<Radio.Button value='no'>NO</Radio.Button>
			</Radio.Group>
			<div className='center'>
				<Form
					name='time_related_controls'
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
			<div className='contractAnswer'>{contractTransactionReceipt}</div>
		</div>
	)
}
