import React, { useEffect, useState } from 'react'
import { formatEther } from 'ethers'
import { abi } from './Abi'
import {
	useConnect,
	useContractEvent,
	useContractRead,
	useContractWrite,
	usePublicClient,
	useWalletClient,
} from 'wagmi'
import {
	Form,
	Input,
	DatePicker,
	Button,
	Radio,
	Typography,
	Alert,
	Space,
	Spin,
	List,
} from 'antd'

interface fetchedMarkets {
	id: string
	description: string
	address: string
	providerAddress: string
	state: boolean
	winToken: any
	lastEventDate: number
}

export const CreateMarketForm = () => {
	const [searchMarketData, setSearchMarketData] = useState<string>('')
	const [contractTransactionReceipt, setContractTransactionReceipt] =
		useState<string>('')
	const [contractTransactionLoading, setContractTransactionLoading] =
		useState<boolean>(false)
	const [fetchedMarkets, setFetchedMarkets] = useState<fetchedMarkets[]>([])

	const address = '0x595A74DDE1b1d08a48943A81602bc334474ce487'

	const { connect } = useConnect()

	const { data, write } = useContractWrite({
		address: address,
		abi: abi,
		functionName: 'createMarket',
	})

	useEffect(() => {
		connect()
	}, [connect])

	const searchMarket = async (description: string, cutoffDate: number) => {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const { data } = await useContractRead({
			address: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1',
			abi: abi,
			functionName: 'getHunger',
			args: [description, cutoffDate],
		})
		if (formatEther(data) !== '0.0') {
			setSearchMarketData(searchMarketData)
		}
		return searchMarketData
	}

	const createMarket = async (
		cutoffDate: number,
		decisionDate: number,
		decisionProvider: string,
		description: string
	) => {
		setContractTransactionLoading(true)
		const marketData = await write.createMarket(
			cutoffDate,
			decisionDate,
			decisionProvider,
			description
		)
		const txReceipt = await marketData.wait()
		setContractTransactionReceipt(txReceipt.blockHash)
		setContractTransactionLoading(false)
	}

	const handleFetchMarkets = async () => {
		const response = await fetch(`https://emp-backend-test.fly.dev/markets`)
		const data: fetchedMarkets[] = await response.json()
		setFetchedMarkets(
			data.sort((objA, objB) => objA.lastEventDate - objB.lastEventDate)
		)
	}

	const searchOrCreateMarket = async (
		cutoffDate: number,
		decisionDate: number,
		decisionProvider: string,
		description: string
	) => {
		const searchMarketAnswer = await searchMarket(description, cutoffDate)
		if (formatEther(searchMarketAnswer) === '0.0') {
			await createMarket(
				cutoffDate,
				decisionDate,
				decisionProvider,
				description
			)
		}
		await handleFetchMarkets()
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

		searchOrCreateMarket(
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
					style={{ maxWidth: 800 }}
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
						<Button
							type='primary'
							htmlType='submit'
							disabled={contractTransactionLoading}
						>
							Submit
						</Button>
					</Form.Item>
				</Form>
			</div>
			<div className='contractAnswer'>
				{contractTransactionLoading && (
					<Space size='large'>
						<Spin size='large' />
					</Space>
				)}
				{searchMarketData && (
					<Alert
						message={`Market  already exist: ${searchMarketData}`}
						type='success'
						showIcon
					/>
				)}
				{contractTransactionReceipt && (
					<Alert
						message='Market created successfully'
						type='success'
						showIcon
					/>
				)}
			</div>
			{fetchedMarkets.length > 0 && (
				<>
					<Title level={4}>Markets list:</Title>
					<List
						size='small'
						bordered
						dataSource={fetchedMarkets}
						renderItem={item => <List.Item>{item.address}</List.Item>}
					/>
				</>
			)}
		</div>
	)
}
