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
import { ShippingCreateType } from '../types/GuidelineTypes';

interface Image {
	id: number;
	link: string;
	file: File;
	base64: string;
}

type Vehicle = {
	model?:string;
	yearOfManufacture?:string;
	color?:string;
	engineCapacity?:string;
	fuelType?:string;
	chassisNumber?:string;
	vehicleType?:string;
	ownerName?:string;
	ownerContact?:string;
	ownerAddress?:string;
	insuranceProvider?:string;
	insurancePolicyNumber?:string;
	insuranceExpiryDate?:string;
	seatingCapacity?:string;
	licensePlateNumber?:string;
	permitType?:string;
	airConditioning?:string;
	vehicleImage?:string;
};



interface Props {
	isOpen?: boolean;
	toggleModal?: () => void;
	clickedRowData: Vehicle;
	fetchAllShippingTypes?: () => void;
	isTableMode?: string;
}

function NewVehicleManagement({ isOpen, toggleModal, clickedRowData, isTableMode }: Props) {
	console.log("clickedRowData?.vehicleImage.....", clickedRowData?.vehicleImage);

	const { t } = useTranslation('shippingTypes');
	const [isDataLoading, setDataLoading] = useState(false);
	const [images, setImages] = useState<Image[]>([]);
	const maxImageCount = 1;
	const maxImageSize = 20 * 1024 * 1024; // 5MB

	const schema = yup.object().shape({
		model: yup.string().required(t('Model name is required')),
		year_of_manufacture: yup.string().required(t('Year of manufacturer name is required')),
		color: yup.string().required(t('Color name is required')),
		engine_capacity: yup.string().required(t('Engine capacity name is required')),
		fuel_type: yup.string().required(t('Fuel type name is required')),
		chassis_number: yup.string().required(t('Chassis number name is required')),
		vehicle_type: yup.string().required(t('Vehicle type name is required')),
		owner_name: yup.string().required(t('Owner name is required')),
		owner_contact: yup.string().required(t('Owner contact name is required')),
		owner_address: yup.string().required(t('Owner address is required')),
		insurance_provider: yup.string().required(t('Insurance provider name is required')),
		insurance_policy_number: yup.string().required(t('Insurance policy number required')),
		insurance_expiry_date: yup.string().required(t('Insurance expiry date required')),
		seating_capacity: yup.string().required(t('seating capacity required')),
		license_plate_number: yup.string().required(t('License plate number required')),
		permit_type: yup.string().required(t('Permit type required')),
		air_conditioning: yup.string().required(t('Air conditioning required')),
		vehicle_photo: yup.string().required(t('Vehicle	photo required')),
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
			media: images.length > 0 ? images[0].base64 : null, // Sending image as base64
			is_active: values.is_active,
		};

		console.log('Form Data:', data);
	};

	return (
		<Dialog
			open={isOpen}
			maxWidth="xl"
			onClose={toggleModal}
			PaperProps={{ style: { top: '40px', margin: 0, position: 'absolute' } }}
		>
			<DialogTitle>
				<h6 className="text-gray-600 font-400">{t('Vehicle management model')}</h6>
			</DialogTitle>
			<DialogContent>
				<Formik
					initialValues={{
						registration_number: clickedRowData?.registrationNumber || '',
						make: clickedRowData?.make || '',
						model: clickedRowData?.model || '',
						year_of_manufacture: clickedRowData?.yearOfManufacture || '',
						color:clickedRowData?.color || '',
						engine_capacity:clickedRowData?.engineCapacity || '',
						fuel_type: clickedRowData?.fuelType || '',
						chassis_number: clickedRowData?.chassisNumber || '',
						vehicle_type: clickedRowData?.vehicleType || '',
						owner_name: clickedRowData?.ownerName || '',
						owner_contact: clickedRowData?.ownerContact || '',
						owner_address: clickedRowData?.ownerAddress || '',
						insurance_provider: clickedRowData?.insuranceProvider || '',
						insurance_policy_number: clickedRowData?.insurancePolicyNumber || '',
						insurance_expiry_date: clickedRowData?.insuranceExpiryDate || '',
						seating_capacity: clickedRowData?.seatingCapacity || '',
						license_plate_number: clickedRowData?.licensePlateNumber || '',
						permit_type: clickedRowData?.permitType || '',
						air_conditioning: clickedRowData?.airConditioning || '',
						vehicle_photo: clickedRowData?.vehiclePhoto || '',
						additional_features: clickedRowData?.additionalFeatures || '',
						imageUpload:clickedRowData?.vehicleImage || '',
					}}
					onSubmit={(values: ShippingCreateType) => handleUpdateShippingType(values)}
					validationSchema={schema}
				>
					{({ setFieldValue }) => (
						<Form>
							<Grid container spacing={2}>
								<Grid item lg={3} md={3} sm={6} xs={12}>
									<Typography>{t('Registration Number')}<span className="text-red"> *</span></Typography>
									<Field name="registration_number" disabled={isTableMode === 'view'} component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={3} md={3} sm={6} xs={12}>
									<Typography>{t('Make')}</Typography>
									<Field name="make" disabled={isTableMode === 'view'} component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={3} md={3} sm={6} xs={12}>
									<Typography>{t('Model')}<span className="text-red"> *</span></Typography>
									<Field name="model" disabled={isTableMode === 'view'} component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={3} md={3} sm={6} xs={12}>
									<Typography>{t('Year of Manufacturer')}<span className="text-red"> *</span></Typography>
									<Field type="number" name="year_of_manufacture" disabled={isTableMode === 'view'} component={TextFormField} fullWidth size="small" />
								</Grid>




								<Grid item lg={3} md={3} sm={6} xs={12}>
									<Typography>{t('Color')}<span className="text-red"> *</span></Typography>
									<Field name="color" component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={3} md={3} sm={6} xs={12}>
									<Typography>{t('Fuel Type')}<span className="text-red"> *</span></Typography>
									<Field name="fuel_type" component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={3} md={3} sm={6} xs={12}>
									<Typography>{t('Engine Capacity')}<span className="text-red"> *</span></Typography>
									<Field name="engine_capacity" component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={3} md={3} sm={6} xs={12}>
									<Typography>{t('Chassis Number')}<span className="text-red"> *</span></Typography>
									<Field type="chassis_number" name="discount" component={TextFormField} fullWidth size="small" />
								</Grid>




								<Grid item lg={3} md={3} sm={6} xs={12}>
									<Typography>{t('Vehicle Type')}<span className="text-red"> *</span></Typography>
									<Field name="vehicle_type" component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={3} md={3} sm={6} xs={12}>
									<Typography>{t('Owner Name')}<span className="text-red"> *</span></Typography>
									<Field name="owner_name" component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={3} md={3} sm={6} xs={12}>
									<Typography>{t('Owner Contact')}<span className="text-red"> *</span></Typography>
									<Field name="owner_contact" component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={3} md={3} sm={6} xs={12}>
									<Typography>{t('Owner Address')}<span className="text-red"> *</span></Typography>
									<Field  name="owner_address" component={TextFormField} fullWidth size="small" />
								</Grid>




								<Grid item lg={3} md={3} sm={6} xs={12}>
									<Typography>{t('Insurance Provider')}<span className="text-red"> *</span></Typography>
									<Field name="insurance_provider" component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={3} md={3} sm={6} xs={12}>
									<Typography>{t('Insurance Policy Number')}<span className="text-red"> *</span></Typography>
									<Field name="insurance_policy_number" component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={3} md={3} sm={6} xs={12}>
									<Typography>{t('Insurance Exp Date')}<span className="text-red"> *</span></Typography>
									<Field name="insurance_expiry_date" component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={3} md={3} sm={6} xs={12}>
									<Typography>{t('Seating Capacity')}<span className="text-red"> *</span></Typography>
									<Field type="number" name="seating_capacity" component={TextFormField} fullWidth size="small" />
								</Grid>



								<Grid item lg={3} md={3} sm={6} xs={12}>
									<Typography>{t('License Plate Number')}<span className="text-red"> *</span></Typography>
									<Field name="license_plate_number" component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={3} md={3} sm={6} xs={12}>
									<Typography>{t('Permit Type')}<span className="text-red"> *</span></Typography>
									<Field name="permit_type" component={TextFormField} fullWidth size="small" />
								</Grid>

								<Grid item lg={3} md={3} sm={6} xs={12} className="flex items-center">
									<Typography className="mr-3">{t('Air Condition')}<span
										className="text-red"> *</span></Typography>
									<Checkbox
										color="primary"
										onChange={(event) => setFieldValue('air_conditioning', event.target.checked)}
									/>
								</Grid>

								<Grid item lg={3} md={3} sm={6} xs={12}>
									<Typography>{t('Additional Features')}</Typography>
									<Field name="additional_features" component={TextFormField} fullWidth size="small" />
								</Grid>




								<Grid item md={6} xs={12}>
									<Typography className="text-[10px] sm:text-[12px] lg:text-[14px] font-600 mb-[5px]">
										{t('Upload Thumbnail Image')}
									</Typography>
									<div className="relative flex gap-[10px] overflow-x-auto" style={{ whiteSpace: 'nowrap' }}>
										{images.map((image) => (
											<div
												key={image.id}
												className="relative inline-block w-[550px] h-[240px] border-[2px] border-[#ccc] rounded-[10px] overflow-hidden"
											>
												<img
													src={image.link}
													alt={`Thumbnail ${image.id}`}
													className="w-full h-full rounded-[10px] object-contain object-center"
												/>
												<IconButton
													size="small"
													className="absolute top-0 right-0 text-white p-[2px] rounded-full bg-black/5 hover:text-red"
													onClick={() => handleRemoveImage(image.id)}
												>
													<CancelIcon fontSize="small" />
												</IconButton>
											</div>
										))}

										{images.length < maxImageCount && (
											<div className="relative flex justify-center items-center w-[100px] h-[100px] border-[2px] border-[#ccc] rounded-[10px]">
												<IconButton
													className="text-primaryBlue"
													onClick={() => document.getElementById('vehicleImage')?.click()}
												>
													<AddCircleIcon fontSize="large" />
												</IconButton>
												<input
													id="vehicleImage"
													type="file"
													accept="image/*"
													style={{ display: 'none' }}
													multiple
													onChange={handleImageUpload}
												/>
											</div>
										)}
									</div>
									<span className="text-[10px] text-gray-700 italic">
                                        <b className="text-red">Note:</b> Image dimensions must be 2:1, and size ≤ 5MB.
                                    </span>
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

export default NewVehicleManagement;
