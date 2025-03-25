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
	Typography,
	Box,
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
	CardElement,
	Elements,
	useStripe,
	useElements
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import { ShippingCreateType, BookingDetails } from '../types/ShippingTypes';
import * as yup from 'yup';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51Ns7qGITsPkHapHWDHBLZQiJEf5zCYpIE0kJgRjcWXAXmCgfTCZBBExwUqYSuzNzzv7aNpSohvcXOeni81naWMSd00lPAchCPs');

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

const PaymentForm = ({ amount, onPaymentSuccess, onPaymentError, disabled }) => {
	const stripe = useStripe();
	const elements = useElements();
	const [processing, setProcessing] = useState(false);
	const [error, setError] = useState(null);

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!stripe || !elements) {
			return;
		}

		setProcessing(true);
		setError(null);

		try {
			// Create payment intent on your server
			const response = await fetch('/api/create-payment-intent', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					amount: amount * 100, // Convert to cents
				}),
			});

			const { clientSecret } = await response.json();

			const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
				clientSecret,
				{
					payment_method: {
						card: elements.getElement(CardElement),
					},
				}
			);

			if (stripeError) {
				setError(stripeError.message);
				onPaymentError(stripeError);
			} else if (paymentIntent.status === 'succeeded') {
				onPaymentSuccess(paymentIntent);
			}
		} catch (err) {
			setError('An error occurred while processing your payment.');
			onPaymentError(err);
		} finally {
			setProcessing(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<Box sx={{ mb: 2 }}>
				<Typography variant="h6" gutterBottom>
					Payment Details
				</Typography>
				<CardElement
					options={{
						style: {
							base: {
								fontSize: '16px',
								color: '#424770',
								'::placeholder': {
									color: '#aab7c4',
								},
							},
							invalid: {
								color: '#9e2146',
							},
						},
					}}
				/>
			</Box>
			{error && (
				<Typography color="error" sx={{ mt: 1, mb: 1 }}>
					{error}
				</Typography>
			)}
			<Button
				type="submit"
				variant="contained"
				disabled={!stripe || processing || disabled}
				sx={{
					bgcolor: 'primary.main',
					color: 'white',
					'&:hover': {
						bgcolor: 'primary.dark',
					},
				}}
			>
				{processing ? 'Processing...' : `Pay ${amount} Rs`}
			</Button>
		</form>
	);
};

function ShippingTypeEditModal({ isOpen, toggleModal, clickedRowData, fetchAllShippingTypes, isTableMode }: Props) {
	const { t } = useTranslation('shippingTypes');
	const [isDataLoading, setDataLoading] = useState(false);
	const [images, setImages] = useState<Image[]>([]);
	const [showPayment, setShowPayment] = useState(false);

	useEffect(() => {
		if (clickedRowData.media) {
			setImages([{ id: Date.now(), link: clickedRowData.media, file: null as unknown as File, base64: clickedRowData.media }]);
		}
	}, [clickedRowData]);

	const schema = yup.object().shape({
		bookingNumber: yup.string().required(t('Booking Number is required')),
		bookingDate: yup.string().required(t('Booking Date is required')),
		pickupLocation: yup.string().required(t('Pickup Location is required')),
		dropOffLocation: yup.string().required(t('Drop Off Location is required')),
		taxes: yup.number().required(t('Taxes are required')),
		distance: yup.number().required(t('Distance is required')),
		estimatedTime: yup.number().required(t('Estimated Time is required')),
		totalAmount: yup.number().required(t('Total Amount is required')),
	});

	const handlePaymentSuccess = async (paymentIntent) => {
		try {
			const response = await fetch('/api/update-booking', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					bookingId: clickedRowData.id,
					paymentIntentId: paymentIntent.id,
					status: 'paid',
				}),
			});

			if (response.ok) {
				toast.success('Payment successful!');
				if (fetchAllShippingTypes) {
					fetchAllShippingTypes();
				}
				toggleModal();
			} else {
				throw new Error('Failed to update booking status');
			}
		} catch (error) {
			toast.error('Error updating booking status');
			console.error('Error:', error);
		}
	};

	const handlePaymentError = (error) => {
		toast.error(`Payment failed: ${error.message}`);
	};

	const handleProceedToPayment = (values) => {
		setShowPayment(true);
	};

	return (
		<Dialog
			open={isOpen}
			maxWidth="md"
			onClose={toggleModal}
			PaperProps={{ style: { width: '80%', maxHeight: '90vh', overflow: 'auto' } }}
		>
			<DialogTitle>
				<h6 className="text-gray-600 font-400">
					{showPayment ? t('Payment Details') : t('Booking Details')}
				</h6>
			</DialogTitle>
			<DialogContent>
				{!showPayment ? (
					<Formik
						initialValues={{
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
						onSubmit={handleProceedToPayment}
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
											{t('Proceed to Payment')}
										</Button>

									</Grid>
								</Grid>
							</Form>
						)}
					</Formik>
				) : (
					<Elements stripe={stripePromise}>
						<PaymentForm
							amount={clickedRowData.totalAmount}
							onPaymentSuccess={handlePaymentSuccess}
							onPaymentError={handlePaymentError}
							disabled={isDataLoading || isTableMode === 'view'}
						/>
					</Elements>
				)}
			</DialogContent>
		</Dialog>
	);
}

export default ShippingTypeEditModal;