// @ts-nocheck
import React, { useEffect, useState } from 'react';
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
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { handleSaveVehicleAPI } from '../../../../../axios/services/mega-city-services/vehicle-service/VehicleService';

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

function VehicleEditModel({ isOpen, toggleModal, clickedRowData, fetchAllShippingTypes, isTableMode }: Props) {
	console.log('clickedRowData:', clickedRowData);

	const { t } = useTranslation('shippingTypes');
	const [images, setImages] = useState<Image[]>([]);
	const maxImageCount = 1;
	const maxImageSize = 20 * 1024 * 1024; // 20MB
	const [isDataLoading, setDataLoading] = useState(false);

	useEffect(() => {
		if (clickedRowData?.vehicleImage) {
			setImages([{
				id: Date.now(), link: clickedRowData.vehicleImage, base64: clickedRowData.vehicleImage
			}]);
		} else {
			setImages([]);
		}
	}, [clickedRowData]);

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
					toast.error('Image upload failed: Size should be <= 20MB.');
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
						id: Date.now(), link: URL.createObjectURL(file), file, base64
					});
				}
			}

			if (validImages.length > 0) {
				setImages(validImages);
			}
		}
	};

	const handleRemoveImage = (id: number) => {
		setImages([]);
	};

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
		permit_type: yup.string().required(t('Permit type required'))
	});

	const handleSave = async (values: VehicleFormValues) => {
		setDataLoading(true);

		try {
			const vehicleImage = images?.[0]?.base64 || '';

			const formData = {
				registrationNumber: values.registration_number,
				make: values.make,
				model: values.model,
				yearOfManufacture: values.year_of_manufacture,
				color: values.color,
				engineCapacity: values.engine_capacity,
				fuelType: values.fuel_type,
				chassisNumber: values.chassis_number,
				vehicleType: values.vehicle_type,
				ownerName: values.owner_name,
				ownerContact: values.owner_contact,
				ownerAddress: values.owner_address,
				insuranceProvider: values.insurance_provider,
				insurancePolicyNumber: values.insurance_policy_number,
				insuranceExpiryDate: values.insurance_expiry_date,
				seatingCapacity: values.seating_capacity,
				licensePlateNumber: values.license_plate_number,
				permitType: values.permit_type,
				airConditioning: values.air_conditioning,
				additionalFeatures: values.additional_features,
				vehicleImage: vehicleImage
			};

			console.log('formData checking now :', formData);
			await handleSaveVehicleAPI(formData);
			toast.success('Vehicle created successfully');
			toggleModal?.();
			fetchAllShippingTypes?.();

		} catch (error) {
			console.error('Error saving vehicle:', error);
			toast.error('Error while saving vehicle');
		} finally {
			setDataLoading(false);
		}
	};


	return (<Dialog
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
					id: '',
					registration_number: `REG-${Math.floor(Math.random() * 1000000)}`,
					make: '',
					model: '',
					year_of_manufacture: '',
					color: '',
					engine_capacity: '',
					fuel_type: '',
					chassis_number: '',
					vehicle_type: '',
					owner_name: '',
					owner_contact: '',
					owner_address: '',
					insurance_provider: '',
					insurance_policy_number: '',
					insurance_expiry_date: '',
					seating_capacity: '',
					license_plate_number: '',
					permit_type: '',
					air_conditioning: false,
					additional_features: '',
					vehicleImage: ''
				}}
				onSubmit={handleSave}
				validationSchema={schema}
			>
				{({ setFieldValue, errors, touched }) => (<Form>
					<Grid container spacing={2}>
						<Grid item lg={3} md={3} sm={6} xs={12}>
							<Typography>{t('Registration Number')}<span
								className="text-red"> *</span></Typography>
							<Field name="registration_number" disabled={isTableMode === 'view'}
								   component={TextFormField} fullWidth size="small" />
						</Grid>

						<Grid item lg={3} md={3} sm={6} xs={12}>
							<Typography>{t('Make')}</Typography>
							<Field name="make" disabled={isTableMode === 'view'} component={TextFormField}
								   fullWidth size="small" />
						</Grid>

						<Grid item lg={3} md={3} sm={6} xs={12}>
							<Typography>{t('Model')}<span className="text-red"> *</span></Typography>
							<Field name="model" component={TextFormField} fullWidth size="small" />
						</Grid>

						<Grid item lg={3} md={3} sm={6} xs={12}>
							<Typography>{t('Year of Manufacturer')}<span
								className="text-red"> *</span></Typography>
							<Field type="number" name="year_of_manufacture" component={TextFormField} fullWidth
								   size="small" />
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
							<Field name="chassis_number" component={TextFormField} fullWidth size="small" />
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
							<Field name="owner_address" component={TextFormField} fullWidth size="small" />
						</Grid>


						<Grid item lg={3} md={3} sm={6} xs={12}>
							<Typography>{t('Insurance Provider')}<span
								className="text-red"> *</span></Typography>
							<Field name="insurance_provider" component={TextFormField} fullWidth size="small" />
						</Grid>

						<Grid item lg={3} md={3} sm={6} xs={12}>
							<Typography>{t('Insurance Policy Number')}<span
								className="text-red"> *</span></Typography>
							<Field name="insurance_policy_number" component={TextFormField} fullWidth
								   size="small" />
						</Grid>

						<Grid item lg={3} md={3} sm={6} xs={12}>
							<Typography>{t('Insurance Exp Date')}<span
								className="text-red"> *</span></Typography>
							<Field name="insurance_expiry_date" component={TextFormField} fullWidth
								   size="small" />
						</Grid>

						<Grid item lg={3} md={3} sm={6} xs={12}>
							<Typography>{t('Seating Capacity')}<span className="text-red"> *</span></Typography>
							<Field type="number" name="seating_capacity" component={TextFormField} fullWidth
								   size="small" />
						</Grid>


						<Grid item lg={3} md={3} sm={6} xs={12}>
							<Typography>{t('License Plate Number')}<span
								className="text-red"> *</span></Typography>
							<Field name="license_plate_number" component={TextFormField} fullWidth
								   size="small" />
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
							<Field name="additional_features" component={TextFormField} fullWidth
								   size="small" />
						</Grid>


						<Grid item md={6} xs={12}>
							<Typography className="text-[10px] sm:text-[12px] lg:text-[14px] font-600 mb-[5px]">
								{t('Upload Thumbnail Image')}
							</Typography>
							<div className="relative flex gap-[10px] overflow-x-auto"
								 style={{ whiteSpace: 'nowrap' }}>
								{images.map((image) => (<div
									key={image.id}
									className="relative inline-block w-[550px] h-[240px] border-[2px] border-[#ccc] rounded-[10px] overflow-hidden"
								>
									<img
										src={image.base64}
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
								</div>))}

								{images.length < maxImageCount && (<div
									className="relative flex justify-center items-center w-[100px] h-[100px] border-[2px] border-[#ccc] rounded-[10px]">
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
										onChange={handleImageUpload}
									/>
								</div>)}
							</div>
							<span className="text-[10px] text-gray-700 italic">
                    <b className="text-red">Note:</b> Image size should be ≤ 20MB.
                  </span>
						</Grid>

						<Grid item lg={12} className="flex justify-end gap-2">
							<Button
								type="submit"
								variant="contained"
								className="min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-yellow-800 hover:bg-yellow-800/80"
								disabled={isTableMode === 'view' || isDataLoading}
							>
								{t('Save')}
								{isDataLoading && <CircularProgress size={24} className="ml-2" />}
							</Button>
							<Button
								variant="contained"
								className="min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-grey-300 hover:bg-grey-300/80"
								onClick={toggleModal}
							>
								{t('Cancel')}
							</Button>
						</Grid>
					</Grid>
				</Form>)}
			</Formik>
		</DialogContent>
	</Dialog>);
}

export default VehicleEditModel;
