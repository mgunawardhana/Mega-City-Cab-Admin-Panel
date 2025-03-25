// @ts-nocheck
import React, { useState } from 'react';
import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import { ShippingCreateType } from '../types/ShippingTypes';
import TextFormDateField from '../../../../../common/FormComponents/TextFormDateField';

interface Image {
	id: number;
	link: string;
	file: File;
	base64: string;
}

interface Props {
	isOpen?: boolean;
	toggleModal?: () => void;
	clickedRowData: any;
	fetchAllShippingTypes?: () => void;
	isTableMode?: string;
}

function NewShippingTypeModel({ isOpen, toggleModal, clickedRowData, fetchAllShippingTypes, isTableMode }: Props) {
	const { t } = useTranslation('shippingTypes');
	const [isDataLoading, setDataLoading] = useState(false);
	const [images, setImages] = useState<Image[]>([]);

	const schema = yup.object().shape({
		bookingNumber: yup.string().required(t('Booking Number is required')),
		bookingDate: yup.string().required(t('Booking Date is required')),
		pickupLocation: yup.string().required(t('Pickup Location is required')),
		dropOffLocation: yup.string().required(t('Drop Off Location is required')),
		carNumber: yup.string().required(t('Car Number is required')),
		taxes: yup.number().typeError(t('Taxes must be a number')).required(t('Taxes are required')),
		distance: yup.number().typeError(t('Distance must be a number')).required(t('Distance is required')),
		estimatedTime: yup.number().typeError(t('Estimated Time must be a number')).required(t('Estimated Time is required')),
		taxWithoutCost: yup.number().typeError(t('Tax Without Cost must be a number')).required(t('Tax Without Cost is required')),
		totalAmount: yup.number().typeError(t('Total Amount must be a number')).required(t('Total Amount is required')),
		customerRegistrationNumber: yup.string().required(t('Customer Registration Number is required')),
		driverId: yup.string().required(t('Driver Name is required')),
		status: yup.string().required(t('Status is required'))
	});

	const initialValues = {
		bookingNumber: clickedRowData?.bookingNumber || '',
		bookingDate: clickedRowData?.bookingDate || '',
		pickupLocation: clickedRowData?.pickupLocation || '',
		dropOffLocation: clickedRowData?.dropOffLocation || '',
		carNumber: clickedRowData?.carNumber || '',
		taxes: clickedRowData?.taxes || '',
		distance: clickedRowData?.distance || '',
		estimatedTime: clickedRowData?.estimatedTime || '',
		taxWithoutCost: clickedRowData?.taxWithoutCost || '',
		totalAmount: clickedRowData?.totalAmount || '',
		customerRegistrationNumber: clickedRowData?.customerRegistrationNumber || '',
		driverId: clickedRowData?.driverId || '',
		status: clickedRowData?.status || ''
	};

	const handleUpdateShippingType = async (values: ShippingCreateType) => {
		const data = {
			discount: values.discount,
			title: values.title,
			description: values.description,
			author: values.author,
			media: images.length > 0 ? images[0].base64 : null,
			is_active: values.is_active
		};

		console.log('Form Data:', data);
	};

	return (<Dialog
			open={isOpen}
			maxWidth="md"
			onClose={toggleModal}
			PaperProps={{ style: { top: '40px', margin: 0, position: 'absolute' } }}
		>
			<DialogTitle>
				<h6 className="text-gray-600 font-400">{t('Website Management model')}</h6>
			</DialogTitle>
			<DialogContent>
				<Formik
					initialValues={initialValues}
					onSubmit={(values: ShippingCreateType) => handleUpdateShippingType(values)}
					validationSchema={schema}
				>
					{({ setFieldValue }) => (<Form>
							<Grid container spacing={2}>
								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Booking Number')}<span className="text-red"> *</span></Typography>
									<Field name="bookingNumber" component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Booking Date')}<span className="text-red"> *</span></Typography>
									<TextFormDateField
										name="bookingDate"
										id="dateFieldId"
										placeholder="Select a date"
										type="date"
										min={new Date().toISOString().split('T')[0]} // Set min to today's date (23rd)
										max="2025-12-31"
										changeInput={(value, form) => {
											console.log(value);
										}}
									/>
								</Grid>

								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Pick Up Location')}<span className="text-red"> *</span></Typography>
									<Field name="pickupLocation" component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Drop Off Location')}<span
										className="text-red"> *</span></Typography>
									<Field name="dropOffLocation" component={TextFormField} fullWidth
										   size="small" />
								</Grid>

								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Card Number')}<span className="text-red"> *</span></Typography>
									<Field name="carNumber" component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Taxes ')}<span className="text-green"> (Rs)</span><span
										className="text-red"> *</span></Typography>
									<Field name="taxes" disabled={isDataLoading || isTableMode === 'view'}
										   component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Distance ')}<span className="text-green"> (km)</span><span
										className="text-red"> *</span></Typography>
									<Field name="distance" disabled={isDataLoading || isTableMode === 'view'}
										   component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Estimated Time')}<span className="text-green"> (min)</span><span
										className="text-red"> *</span></Typography>
									<Field name="estimatedTime" disabled={isDataLoading || isTableMode === 'view'}
										   component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Tax Without Cost ')}<span className="text-green"> (Rs)</span><span
										className="text-red"> *</span></Typography>
									<Field name="taxWithoutCost" disabled={isDataLoading || isTableMode === 'view'}
										   component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Total Amount ')}<span className="text-green"> (Rs)</span><span
										className="text-red"> *</span></Typography>
									<Field name="totalAmount" disabled={isDataLoading || isTableMode === 'view'}
										   component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Customer Registration Number')}<span className="text-red"> *</span></Typography>
									<Field name="customerRegistrationNumber" component={TextFormField} fullWidth
										   size="small" />
								</Grid>

								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Driver Name')}<span className="text-red"> *</span></Typography>
									<Field type="driverId" name="driverId" component={TextFormField} fullWidth
										   size="small" />
								</Grid>

								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Status')}<span className="text-red"> *</span></Typography>
									<Field name="status" component={TextFormField} fullWidth size="small" />
								</Grid>


								<Grid item lg={12} className="flex justify-end gap-2">
									<Button type="submit" variant="contained"
											className="bg-yellow-800 text-white searchButton">
										{t('Save')}
										{isDataLoading && <CircularProgress size={24} className="ml-2" />}
									</Button>
									<Button variant="contained"
											className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
											onClick={toggleModal}>
										{t('Cancel')}
									</Button>
								</Grid>
							</Grid>
						</Form>)}
				</Formik>
			</DialogContent>
		</Dialog>);
}

export default NewShippingTypeModel;