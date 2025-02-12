// @ts-nocheck
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import {
	Button,
	Checkbox,
	CircularProgress,
	Dialog,
	DialogContent,
	DialogTitle,
	Grid,
	IconButton,
	Typography
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import { ShippingCreateType, BookingDetails } from '../types/ShippingTypes';
import * as yup from 'yup';

interface Props {
	toggleModal: () => void;
	isOpen: boolean;
	clickedRowData: BookingDetails;
	fetchAllShippingTypes?: () => void;
	isTableMode?: string;
}

interface Image {
	id: number;
	link: string;
	file: File;
	base64: string;
}

function ShippingTypeEditModal({ isOpen, toggleModal, clickedRowData, fetchAllShippingTypes, isTableMode }: Props) {
	const { t } = useTranslation('shippingTypes');
	const [isDataLoading, setDataLoading] = useState(false);
	const [images, setImages] = useState<Image[]>([]);

	useEffect(() => {
		if (clickedRowData.media) {
			setImages([{ id: Date.now(), link: clickedRowData.media, file: null as unknown as File, base64: clickedRowData.media }]);
		}
	}, [clickedRowData]);

	const schema = yup.object().shape({
		title: yup.string().required(t('Title is required')),
		description: yup.string().required(t('Description is required')),
		author: yup.string().required(t('Author is required')),
		ratings: yup.number().required(t('Ratings are required')).min(0).max(10),
		is_active: yup.boolean()
	});

	const handleUpdateShippingType = async (values: ShippingCreateType) => {
		const data = {
			title: values.title,
			description: values.description,
			author: values.author,
			ratings: parseFloat(values.ratings.toString()), // Ensure ratings are stored as numbers
			is_active: values.is_active,
			media: images.length > 0 ? images[0].base64 : null // Store image as base64
		};

		console.log('Form Data:', data);
		// Call API or function to update shipping type
	};

	return (
		<Dialog
			open={isOpen}
			maxWidth="md"
			onClose={toggleModal}
			PaperProps={{ style: { top: '40px', margin: 0, position: 'absolute' } }}
		>
			<DialogTitle>
				<h6 className="text-gray-600 font-400">{t('Website management model')}</h6>
			</DialogTitle>
			<DialogContent>
				<Formik
					initialValues={{
						title: clickedRowData.title || '',
						bookingNumber: clickedRowData.bookingNumber || '',
						bookingDate: clickedRowData.bookingDate || '',
						pickupLocation: clickedRowData.pickupLocation || '',
						dropOffLocation: clickedRowData.dropOffLocation || '',
						carNumber: clickedRowData.carNumber || '',
						taxes: clickedRowData.taxes || '',
						distance: clickedRowData.distance || '',
						estimatedTime: clickedRowData.estimatedTime || '',
						taxWithoutCost: clickedRowData.taxWithoutCost || '',
						totalAmount: clickedRowData.totalAmount || '',
						customerRegistrationNumber: clickedRowData.customerRegistrationNumber || '',
						driverId: clickedRowData.driverId || '',
						status: clickedRowData.status || '',
					}}
					validationSchema={schema}
					onSubmit={(values) => handleUpdateShippingType(values)}
				>
					{({ setFieldValue, values }) => (
						<Form>
							<Grid container spacing={2}>
								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Booking Number')}<span className="text-red"> *</span></Typography>
									<Field name="bookingNumber" disabled component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Booking Date')}<span className="text-red"> *</span></Typography>
									<Field name="bookingDate" disabled={isDataLoading || isTableMode === 'view'} component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Pick Up Location')}<span className="text-red"> *</span></Typography>
									<Field name="pickupLocation" disabled={isDataLoading || isTableMode === 'view'} component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Drop Off Location')}<span className="text-red"> *</span></Typography>
									<Field  name="dropOffLocation" disabled={isDataLoading || isTableMode === 'view'} component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Taxes ')}<span className="text-green"> (Rs)</span><span
										className="text-red"> *</span></Typography>
									<Field name="taxes" disabled={isDataLoading || isTableMode === 'view'} component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Distance ')}<span className="text-green"> (km)</span><span
										className="text-red"> *</span></Typography>
									<Field name="distance" disabled={isDataLoading || isTableMode === 'view'} component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Estimated Time')}<span className="text-green"> (min)</span><span
										className="text-red"> *</span></Typography>
									<Field name="estimatedTime" disabled={isDataLoading || isTableMode === 'view'} component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Tax Without Cost ')}<span className="text-green"> (Rs)</span><span
										className="text-red"> *</span></Typography>
									<Field name="taxWithoutCost" disabled={isDataLoading || isTableMode === 'view'} component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Total Amount ')}<span className="text-green"> (Rs)</span><span
										className="text-red"> *</span></Typography>
									<Field name="totalAmount" disabled={isDataLoading || isTableMode === 'view'} component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Customer Registration Number')}<span className="text-red"> *</span></Typography>
									<Field name="customerRegistrationNumber" disabled={isDataLoading || isTableMode === 'view'} component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Driver Name')}<span className="text-red"> *</span></Typography>
									<Field name="driverId" disabled={isDataLoading || isTableMode === 'view'} component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Status')}<span className="text-red"> *</span></Typography>
									<Field  name="status" disabled={isDataLoading || isTableMode === 'view'}  component={TextFormField} fullWidth size="small" />
								</Grid>


								<Grid item lg={12} className="flex justify-end gap-2">
									<Button
										className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
										variant="contained" onClick={toggleModal}>
										{t('Cancel')}
									</Button>
									<Button
										className="min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-yellow-800 hover:bg-yellow-800/80"
										type="submit"
										variant="contained"
										disabled={isDataLoading || isTableMode === 'view'}
									>
										{t('Save')}
									</Button>

								</Grid>
							</Grid>
						</Form>
					)}
				</Formik>
			</DialogContent>
		</Dialog>

	);
}

export default ShippingTypeEditModal;
