// @ts-nocheck
import React, { useState } from 'react';
import {
	Button,
	Checkbox,
	CircularProgress,
	Dialog,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	Grid,
	Typography,
	IconButton,
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { ShippingCreateType } from '../types/ShippingTypes';

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
	const maxImageCount = 1;
	const maxImageSize = 5 * 1024 * 1024; // 5MB

	const schema = yup.object().shape({
		shippingType: yup.string().required(t('Shipping type name is required')),
	});

	const convertToBase64 = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onloadend = () => resolve(reader.result as string);
			reader.onerror = (error) => reject(error);
		});
	};

	const validateImageDimensions = (file: File): Promise<boolean> => {
		return new Promise((resolve) => {
			const img = new Image();
			img.src = URL.createObjectURL(file);
			img.onload = () => {
				if (file.size <= maxImageSize) {
					resolve(true);
				} else {
					toast.error('Image upload failed: Size should be <= 5MB.');
					resolve(false);
				}
			};
		});
	};

	const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const { files } = event.target;

		if (files) {
			if (images.length + files.length > maxImageCount) {
				toast.error(`You can only upload a maximum of ${maxImageCount} images.`);
				return;
			}

			const validImages: Image[] = [];
			for (const file of Array.from(files)) {
				const isValid = await validateImageDimensions(file);

				if (isValid) {
					const base64 = await convertToBase64(file);
					validImages.push({
						id: Date.now(),
						link: URL.createObjectURL(file),
						file,
						base64,
					});
				}
			}

			if (validImages.length > 0) {
				setImages((prevImages) => [...prevImages, ...validImages]);
			}
		}
	};

	const handleRemoveImage = (id: number) => {
		setImages((prevImages) => prevImages.filter((image) => image.id !== id));
	};

	const handleUpdateShippingType = async (values: ShippingCreateType) => {
		const data = {
			discount: values.discount,
			title: values.title,
			description: values.description,
			author: values.author,
			media: images.length > 0 ? images[0].base64 : null,
			is_active: values.is_active,
		};

		console.log('Form Data:', data);
	};

	return (
		<Dialog
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
					initialValues={{}}
					onSubmit={(values: ShippingCreateType) => handleUpdateShippingType(values)}
					validationSchema={schema}
				>
					{({ setFieldValue }) => (
						<Form>
							<Grid container spacing={2}>
								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Booking Number')}<span className="text-red"> *</span></Typography>
									<Field name="bookingNumber" component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Booking Date')}<span className="text-red"> *</span></Typography>
									<Field name="bookingDate" component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Pick Up Location')}<span className="text-red"> *</span></Typography>
									<Field name="pickupLocation" component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Drop Off Location')}<span className="text-red"> *</span></Typography>
									<Field type="dropOffLocation" name="discount" component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Card Number')}<span className="text-red"> *</span></Typography>
									<Field name="carNumber" component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Taxes')}<span className="text-red"> *</span></Typography>
									<Field name="taxes" component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Distance')}<span className="text-red"> *</span></Typography>
									<Field name="distance" component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Estimated Time')}<span className="text-red"> *</span></Typography>
									<Field type="estimatedTime" name="discount" component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Tax Without Cost')}<span className="text-red"> *</span></Typography>
									<Field name="taxWithoutCost" component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Total Amount')}<span className="text-red"> *</span></Typography>
									<Field name="totalAmount" component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Customer Registration Number')}<span className="text-red"> *</span></Typography>
									<Field name="customerRegistrationNumber" component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Driver Name')}<span className="text-red"> *</span></Typography>
									<Field type="driverId" name="discount" component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Status')}<span className="text-red"> *</span></Typography>
									<Field  name="status" component={TextFormField} fullWidth size="small" />
								</Grid>


								<Grid item lg={12} className="flex justify-end gap-2">
									<Button type="submit" variant="contained" className="bg-yellow-800 text-white searchButton">
										{t('Save')}
										{isDataLoading && <CircularProgress size={24} className="ml-2" />}
									</Button>
									<Button variant="contained" className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80" onClick={toggleModal}>
										{t('Cancel')}
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

export default NewShippingTypeModel;
