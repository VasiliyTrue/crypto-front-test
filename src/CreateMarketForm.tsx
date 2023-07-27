import React, { useEffect, useState } from 'react'
import { Formik, Form, Field } from 'formik'
import { ethers, formatEther, parseEther, parseUnits } from 'ethers'
import { abi } from './Abi'

export const CreateMarketForm = () => {
	const [market, setMarket] = useState('')
	const address = '0x595A74DDE1b1d08a48943A81602bc334474ce487'
	const provider = new ethers.InfuraProvider('maticmum')
	const daiContract = new ethers.Contract(address, abi, provider)

	const searchMarket = async (
		cutoffDate: number,
		decisionDate: number,
		decisionProvider: string,
		description: string
	) => {
		// const marketData = await daiContract.getMarket(description, cutoffDate)

		// setMarket(formatEther(marketData))
		// if (
		// 	market === '' ||
		// 	market === '0x0000000000000000000000000000000000000000'
		// ) {
		// const createMarketData = await daiContract.createMarket(
		// 	cutoffDate,
		// 	decisionDate,
		// 	decisionProvider,
		// 	description
		// )
		// setMarket(formatEther(createMarketData))
		const createMarketData = await daiContract.createMarket(
			cutoffDate,
			decisionDate,
			decisionProvider,
			description
		)
		setMarket(formatEther(createMarketData))
		// }
	}

	console.log('DAAAAATAAA2222222', market)

	const validateField = (value: string) => {
		let error
		if (!value) {
			error = 'Required'
			return error
		}
		return null
	}

	return (
		<div>
			<Formik
				initialValues={{
					cutoffDate: 0,
					decisionDate: 0,
					decisionProvider: '',
					description: '',
				}}
				onSubmit={(values, { setSubmitting }) => {
					searchMarket(
						values.cutoffDate,
						values.decisionDate,
						values.decisionProvider,
						values.description
					)
					alert(JSON.stringify(values, null, 2))
					setSubmitting(false)
				}}
			>
				{({ isSubmitting, errors }) => (
					<Form>
						<Field
							name='cutoffDate'
							type='number'
							placeholder='cutoff Date'
							validate={validateField}
						/>
						{errors.cutoffDate ? (
							<div style={{ color: 'red' }}>{errors.cutoffDate}</div>
						) : null}
						<Field
							name='decisionDate'
							type='number'
							placeholder='decision Date'
							validate={validateField}
						/>
						{errors.decisionDate ? (
							<div style={{ color: 'red' }}>{errors.decisionDate}</div>
						) : null}
						<Field
							name='decisionProvider'
							type='string'
							placeholder='decision Provider'
							validate={validateField}
						/>
						{errors.decisionProvider ? (
							<div style={{ color: 'red' }}>{errors.decisionProvider}</div>
						) : null}
						<Field
							name='description'
							type='string'
							placeholder='description'
							validate={validateField}
						/>
						{errors.description ? (
							<div style={{ color: 'red' }}>{errors.description}</div>
						) : null}
						<button type='submit' disabled={isSubmitting}>
							Create
						</button>
					</Form>
				)}
			</Formik>
		</div>
	)
}
