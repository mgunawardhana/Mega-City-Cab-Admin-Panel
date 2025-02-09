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
import { ShippingCreateType, ShippingTypeModifiedData } from '../types/ShippingTypes';
import * as yup from 'yup';

interface Props {
	toggleModal: () => void;
	isOpen: boolean;
	clickedRowData: ShippingTypeModifiedData;
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
	const maxImageCount = 1;
	const maxImageSize = 5 * 1024 * 1024; // 5MB

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

	const convertToBase64 = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onloadend = () => resolve(reader.result as string);
			reader.onerror = (error) => reject(error);
		});
	};

	const validateImage = async (file: File): Promise<boolean> => {
		if (file.size > maxImageSize) {
			toast.error('Image size should be ≤ 5MB.');
			return false;
		}
		return true;
	};

	const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const { files } = event.target;

		if (files && files.length > 0) {
			if (images.length >= maxImageCount) {
				toast.error(`You can only upload a maximum of ${maxImageCount} image.`);
				return;
			}

			const file = files[0]; // Only allow one file
			const isValid = await validateImage(file);

			if (isValid) {
				const base64 = await convertToBase64(file);
				setImages([{ id: Date.now(), link: URL.createObjectURL(file), file, base64 }]);
			}
		}
	};

	const handleRemoveImage = () => {
		setImages([]);
	};

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
						description: clickedRowData.description || '',
						author: clickedRowData.author || '',
						ratings: clickedRowData.ratings || 0,
						is_active: clickedRowData.is_active || false
					}}
					validationSchema={schema}
					onSubmit={(values) => handleUpdateShippingType(values)}
				>
					{({ setFieldValue, values }) => (
						<Form>
							<Grid container spacing={2}>
								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Title')}<span className="text-red"> *</span></Typography>
									<Field
										name="title"
										component={TextFormField}
										fullWidth
										size="small"
										disabled={isTableMode === 'view'}
									/>
								</Grid>

								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Description')}<span className="text-red"> *</span></Typography>
									<Field
										name="description"
										component={TextFormField}
										fullWidth
										size="small"
										disabled={isTableMode === 'view'}
									/>
								</Grid>

								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Author')} <span className="text-red"> *</span></Typography>
									<Field
										name="author"
										component={TextFormField}
										fullWidth
										size="small"
										disabled={isTableMode === 'view'}
									/>
								</Grid>

								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Ratings')}<span className="text-red"> *</span></Typography>
									<Field
										type="number"
										name="ratings"
										component={TextFormField}
										fullWidth
										size="small"
										disabled={isTableMode === 'view'}
									/>
								</Grid>

								<Grid item lg={4} md={4} sm={6} xs={12}>
									<Typography>{t('Is Active')}</Typography>
									<Checkbox
										className="yellow-800"
										checked={values.is_active}
										onChange={(event) => setFieldValue('is_active', event.target.checked)}
										disabled={isTableMode === 'view'}
									/>
								</Grid>

								<Grid item md={8} xs={12}>
									<Typography>{t('Upload Thumbnail Image')}</Typography>
									<div className="relative flex gap-2 overflow-x-auto">
										{images.length > 0 && (
											<div className="relative inline-block w-[440px] h-[220px]">
												<img src={images[0].link} alt="Thumbnail" className="w-full h-full object-cover" />
												<IconButton
													className="absolute top-0 right-0"
													onClick={handleRemoveImage}
													disabled={isTableMode === 'view'}
												>
													<CancelIcon fontSize="small" />
												</IconButton>
											</div>
										)}
										{images.length === 0 && (
											<IconButton
												onClick={() => document.getElementById('imageUpload')?.click()}
												disabled={isTableMode === 'view'}
											>
												<AddCircleIcon fontSize="large" />
											</IconButton>
										)}
										<input
											id="imageUpload"
											type="file"
											accept="image/*"
											hidden
											onChange={handleImageUpload}
											disabled={isTableMode === 'view'}
										/>
									</div>
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
