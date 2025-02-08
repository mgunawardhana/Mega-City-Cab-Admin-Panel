import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Checkbox, Grid, IconButton, Select } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import clsx from 'clsx';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CircularProgress from '@mui/material/CircularProgress';
import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import InputAdornment from '@mui/material/InputAdornment';
import { PhotoCamera, Visibility, VisibilityOff } from '@mui/icons-material';
import { SAVE_ADMIN_USER, UPDATE_ADMIN_USER } from 'src/app/axios/services/AuthServices';
import { UserInterface } from './UsersApp';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import { useTranslation } from 'react-i18next';
import TextFormDateField from '../../../../common/FormComponents/TextFormDateField';
import { DateField } from '@mui/x-date-pickers';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Avatar from '@mui/material/Avatar';
import { SelectChangeEvent } from '@mui/material/Select';

interface Role {
	id: number;
	name: string;
	description: string | null;
	is_active: number;
}

interface User {
	id: string;
	title: string;
	first_name: string;
	last_name: string;
	user_name: string;
	email: string;
	mobile: string | null;
	nic: string;
	is_active: number | null;
	roles: Role[];
	customer_address: string;
}

interface SingleUserSaveResponse {
	data: User;
}

interface Image {
	id: number;
	link: string;
	file: File;
	base64: string;
}


const schema = z
	.object({
		firstName: z.string().min(3, 'Must be at least 3 characters').max(30, 'Must be maximum 30 characters'),
		lastName: z.string().min(3, 'Must be at least 3 characters').max(30, 'Must be maximum 30 characters'),
		email: z
			.string()
			.email('Invalid email')
			.min(5, 'Must be at least 5 characters')
			.max(50, 'Must be maximum 50 characters')

			.regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov)$/, 'Email must end with .com, .org, .net, .edu, or .gov'),
		password: z
			.string()
			.min(1, 'Please enter your password.')
			.min(8, 'Password is too short - should be 8 characters minimum.')
			.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.')
			.regex(/^[^;/=+_-]*$/, 'Password should not contain ;/=+_- special characters'),
		passwordConfirm: z.string().min(1, 'Password confirmation is required'),
		customerAddress: z.string().min(3, 'please enter your address')
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: 'Passwords must match', path: ['passwordConfirm']
	});

const schemaOnEdit = z.object({
	firstName: z.string().min(3, 'Must be at least 3 characters').max(30, 'Must be maximum 30 characters'),
	lastName: z.string().min(3, 'Must be at least 3 characters').max(30, 'Must be maximum 30 characters'), // user_name: z.string().min(3, 'Must be at least 3 characters').max(30, 'Must be maximum 30 characters'),
	email: z
		.string()
		.email('Invalid email')
		.min(5, 'Must be at least 5 characters')
		.max(50, 'Must be maximum 50 characters')
		.regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov)$/, 'Email must end with .com, .org, .net, .edu, or .gov'),
	customerAddress: z.string().min(3, 'please enter your address')
});

interface Props {
	isAdd: boolean;
	className?: string;
	isOpen: boolean;
	setIsFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
	isEdit?: boolean;
	selectedRow?: any;
	onCloseHandler?: () => void;
	isView?: boolean;
	userRoles?: { value: number; label: string }[];
}

function UsersForm(props: Props) {

	console.log("user form ",props)

	const { t } = useTranslation('sampleComponent');
	const [images, setImages] = useState<Image[]>([]);
	const maxImageCount = 2;
	const maxImageSize = 5 * 1024 * 1024; // 5MB
	const { isAdd, className, isOpen, setIsFormOpen, isEdit, selectedRow, onCloseHandler, isView } = props;
	const [openDialog, setOpenDialog] = useState(isOpen);
	const [userRoles, setUserRoles] = useState<{ value: string; label: string }[]>([]);
	const [driverStatus, setDriverStatus] = useState<{ value: string; label: string }[]>([]);
	const [selectedRole, setSelectedRole] = useState<string>('');
	const [profilePic, setProfilePic] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [fullWidth] = useState(true);
	const defaultValues = {
		id: selectedRow ? selectedRow.id : '',
		firstName: selectedRow ? selectedRow.firstName : '',
		lastName: selectedRow ? selectedRow.lastName : '',
		email: selectedRow ? selectedRow.email : '',
		password: selectedRow ? selectedRow.password : '',
		passwordConfirm: selectedRow ? selectedRow.password : '',
		role: selectedRow ? selectedRow.role : '',
		customerRegistrationNumber: selectedRow ? selectedRow.customerRegistrationNumber : '',
		rootUserId: selectedRow ? selectedRow.rootUserId : '',
		customerAddress: selectedRow ? selectedRow.customerAddress : '',
		customerNIC: selectedRow ? selectedRow.customerNIC : '',
		phoneNumber: selectedRow ? selectedRow.phoneNumber : ''
	};
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const { handleSubmit, formState, control, reset } = useForm<UserInterface>({
		mode: 'onChange', defaultValues, resolver: zodResolver(isEdit ? schemaOnEdit : schema)
	});

	const { errors } = formState;

	function handleCloseDialog() {
		setOpenDialog(false);
		setIsFormOpen(false);
		onCloseHandler();
	}

	function onSubmit(data: UserInterface) {
		saveRole(data).then(r => (r));
	}

	useEffect(() => {
		setUserRoles([{ value: 'MANAGER', label: t('MANAGER') }, {
			value: 'CUSTOMER', label: t('CUSTOMER')
		}, { value: 'GUEST', label: t('GUEST') }, { value: 'DRIVER', label: t('DRIVER') }]);
	}, [t]);

	useEffect(() => {
		setDriverStatus([{value: 'AVAILABLE', label: 'AVAILABLE'}, {value: 'UNAVAILABLE', label: 'UNAVAILABLE'}]);
	}, []);

	async function saveRole(data: UserInterface) {
		setLoading(true);
		try {
			const data_save = {
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				password: data.password,
				role: data.role,
				address: data.address,
				nic: data.nic,
				phone_number: data.phone_number
			};

			console.log('data_save', data_save);
			const response: AxiosResponse<SingleUserSaveResponse> = await axios.post(SAVE_ADMIN_USER, data_save);
			toast.success('Admin User created successfully');
		} catch (error) {
			toast.error(error.response.data.message);
		} finally {
			setLoading(false);
			onCloseHandler();
		}
	}

	const handleRoleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setSelectedRole(event.target.value as string);
	};


	async function updateRole(data: UserInterface) {
		setLoading(true);
		try {
			const data_update = {};
			await axios.put(`${UPDATE_ADMIN_USER}/${selectedRow.id}`, data_update);
			toast.success('Admin User updated successfully');
		} catch (error) {
			toast.error(error.response.data.message);
		} finally {
			setLoading(false);
			onCloseHandler();
		}
	}
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


	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const handleRemoveImage = (id: number) => {
		setImages((prevImages) => prevImages.filter((image) => image.id !== id));
	};

	const toggleConfirmPasswordVisibility = () => {
		setShowConfirmPassword(!showConfirmPassword);
	};
	const handleProfilePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => setProfilePic(reader.result as string);
			reader.readAsDataURL(file);
		}
	};


	const getTitle = (value: string): string => {
		if (isEdit) {
			return `Edit ${value}`;
		}

		if (isView) {
			return `View ${value}`;
		}

		return `Add ${value}`;
	};

	return loading ? (<div
		className="flex justify-center items-center w-[111.2vw] h-[111.2svh] fixed top-0 left-0 z-[10000] bg-white/95">
		<div className="flex-col gap-4 w-full flex items-center justify-center">
			<div
				className="w-[60px] h-[60px] border-4 border-transparent text-primaryPurple text-4xl animate-spin flex items-center justify-center border-t-primaryPurple rounded-full">
				<div
					className="w-[50px] h-[50px] border-4 border-transparent text-primaryPurple text-2xl animate-spin flex items-center justify-center border-t-primaryPurple rounded-full" />
			</div>
		</div>
	</div>) : (<div className={clsx('', className)}>
		<Dialog
			fullWidth={fullWidth}
			open={openDialog}
			onClose={handleCloseDialog}
			aria-labelledby="form-dialog-title"
			scroll="body"
			maxWidth="xl"
		>
			<DialogTitle className="pb-0">
				<h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400">
					{('Add Profile Picture')}
				</h6>
			</DialogTitle>

			<DialogContent>
				<Grid container spacing={2} className="mb-4">
					<Grid item xs={12} sm={3} className="flex ">
						<div className="flex flex-col ">
							<Avatar
								src={profilePic || ''}
								alt="Profile Picture"
								sx={{ width: 100, height: 100 }}
							/>
							<IconButton
								color="primary"
								aria-label="upload picture"
								component="label"
								className="mt-2"
							>
								<input
									hidden
									accept="image/*"
									type="file"
									onChange={handleProfilePicChange}
								/>
								<PhotoCamera />
							</IconButton>
						</div>
					</Grid>
				</Grid>
				<form
					noValidate
					onSubmit={handleSubmit(onSubmit)}
					className="w-full"
				>
					<Grid
						container
						spacing={2}
						className="pt-[10px]"
					>
						<Grid
							item
							xs={12}
							md={6}
							lg={3}
							className="formikFormField pt-[5px!important]"
						>
							<Typography className="formTypography">
								Role <span className="text-red">*</span>
							</Typography>
							<Controller
								name="role"
								control={control}
								render={({ field }) => (<FormControl
									fullWidth
									required
								>
									<Select
										{...field}
										size="small"
										onChange={(e: SelectChangeEvent<string>) => {
											field.onChange({ target: { value: e.target.value } } as ChangeEvent<{ value: unknown }>);
											// @ts-ignore
											handleRoleChange(e);
										}}
									>


									{userRoles.map(role => (
											<MenuItem key={role.value} value={role.value}>{role.label}</MenuItem>))}
									</Select>
									<FormHelperText error>{errors?.role?.message}</FormHelperText>
								</FormControl>)}
							/>
						</Grid>
						<Grid
							item
							xs={12}
							md={6}
							lg={3}
							className="formikFormField pt-[5px!important]"
						>
							<Typography className="formTypography">
								First Name <span className="text-red">*</span>
							</Typography>
							<Controller
								name="firstName"
								control={control}
								render={({ field }) => (<TextField
									{...field}
									className="m-0"
									id="firstName"
									variant="outlined"
									fullWidth
									size="small"
									error={!!errors.firstName}
									helperText={errors?.firstName?.message}
									required
									disabled={isView}
								/>)}
							/>
						</Grid>
						<Grid
							item
							xs={12}
							md={6}
							lg={3}
							className="formikFormField pt-[5px!important]"
						>
							<Typography className="formTypography">
								Last Name <span className="text-red">*</span>
							</Typography>
							<Controller
								name="lastName"
								control={control}
								render={({ field }) => (<TextField
									{...field}
									className="m-0"
									id="lastName"
									variant="outlined"
									fullWidth
									size="small"
									error={!!errors.lastName}
									helperText={errors?.lastName?.message}
									required
									disabled={isView}
								/>)}
							/>
						</Grid>
						<Grid
							item
							xs={12}
							md={6}
							lg={3}
							className="formikFormField pt-[5px!important]"
						>
							<Typography className="formTypography">
								Email <span className="text-red">*</span>
							</Typography>
							<Controller
								name="email"
								control={control}
								render={({ field }) => (<TextField
									{...field}
									className="m-0"
									id="email"
									variant="outlined"
									fullWidth
									size="small"
									error={!!errors.email}
									helperText={errors?.email?.message}
									required
									disabled={isView}
								/>)}
							/>
						</Grid>
						<Grid
							item
							xs={12}
							md={6}
							lg={3}
							className="formikFormField pt-[5px!important]"
						>
							<Typography className="formTypography">
								Password <span className="text-red">*</span>
							</Typography>
							<Controller
								name="password"
								control={control}
								render={({ field }) => (<TextField
									{...field}
									className="m-0"
									type={showPassword ? 'text' : 'password'}
									id="password"
									variant="outlined"
									fullWidth
									size="small"
									error={!!errors.password}
									helperText={errors?.password?.message}
									disabled={isView}
									required
									InputProps={{
										endAdornment: (<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												onClick={togglePasswordVisibility}
												edge="end"
												size="small"
											>
												{showPassword ? <Visibility /> : <VisibilityOff />}
											</IconButton>
										</InputAdornment>)
									}}
								/>)}
							/>
						</Grid>
						<Grid
							item
							xs={12}
							md={6}
							lg={3}
							className="formikFormField pt-[5px!important]"
						>
							<Typography className="formTypography">
								Confirm Password <span className="text-red">*</span>
							</Typography>
							<Controller
								name="passwordConfirm"
								control={control}
								render={({ field }) => (<TextField
									{...field}
									type={showConfirmPassword ? 'text' : 'password'}
									id="passwordConfirm"
									variant="outlined"
									className="m-0"
									fullWidth
									size="small"
									error={!!errors.passwordConfirm}
									helperText={errors?.passwordConfirm?.message}
									disabled={isView}
									required
									InputProps={{
										endAdornment: (<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												onClick={toggleConfirmPasswordVisibility}
												edge="end"
												size="small"
											>
												{showConfirmPassword ? (<Visibility />) : (<VisibilityOff />)}
											</IconButton>
										</InputAdornment>)
									}}
								/>)}
							/>
						</Grid>
						<Grid
							item
							xs={12}
							md={6}
							lg={3}
							className="formikFormField pt-[5px!important]"
						>
							<Typography className="formTypography">
								Address <span className="text-red">*</span>
							</Typography>
							<Controller
								name="address"
								control={control}
								render={({ field }) => (<TextField
									{...field}
									className="m-0"
									id="address"
									variant="outlined"
									fullWidth
									size="small"
									error={!!errors.address}
									helperText={errors?.address?.message}
									required
									disabled={isView}
								/>)}
							/>
						</Grid>
						<Grid
							item
							xs={12}
							md={6}
							lg={3}
							className="formikFormField pt-[5px!important]"
						>
							<Typography className="formTypography">
								NIC <span className="text-red">*</span>
							</Typography>
							<Controller
								name="nic"
								control={control}
								render={({ field }) => (<TextField
									{...field}
									className="m-0"
									id="nic"
									variant="outlined"
									fullWidth
									size="small"
									error={!!errors.nic}
									helperText={errors?.nic?.message}
									required
									disabled={isView}
								/>)}
							/>
						</Grid>
						<Grid
							item
							xs={12}
							md={6}
							lg={3}
							className="formikFormField pt-[5px!important]"
						>
							<Typography className="formTypography">
								Mobile <span className="text-red">*</span>
							</Typography>
							<Controller
								name="phone_number"
								control={control}
								render={({ field }) => (<TextField
									{...field}
									className="m-0"
									id="phone_number"
									variant="outlined"
									fullWidth
									size="small"
									error={!!errors.phone_number}
									helperText={errors?.phone_number?.message}
									required
									disabled={isView}
								/>)}
							/>
						</Grid>
						{selectedRole === 'DRIVER' && (
							<>
								<Grid item xs={12} md={6} lg={3}>
									<Typography>License Expiry data <span className="text-red">*</span></Typography>
									<Controller
										name="licenseExpiryDate"
										control={control}
										render={({ field }) => (<TextField
											{...field}
											className="m-0"
											id="licenseExpiryDate"
											variant="outlined"
											fullWidth
											size="small"
											error={!!errors.licenseExpiryDate}
											helperText={errors?.licenseExpiryDate?.message}
											required
											disabled={isView}
										/>)}
									/>
								</Grid>
								<Grid item xs={12} md={6} lg={3} className="flex items-center">
									<Typography>Vehicle Assigned <span className="text-red">*</span></Typography>
									<Controller
										name="vehicleAssigned"
										control={control}
										render={({ field }) => (
											<Checkbox
												{...field}
												color="primary"
												checked={field.value}
												onChange={(event) => field.onChange(event.target.checked)}
											/>
										)}
									/>

								</Grid>
								<Grid
									item
									xs={12}
									md={6}
									lg={3}
									className="formikFormField"
								>
									<Typography className="formTypography">Driver Status <span className="text-red">*</span></Typography>
									<Controller
										name="driverStatus"
										control={control}
										render={({ field }) => (<FormControl
											fullWidth
											required
										>
											<Select {...field} size="small" onChange={(e) => {
												field.onChange(e);
											}}>
												{driverStatus.map(role => (
													<MenuItem key={role.value} value={role.value}>{role.label}</MenuItem>))}
											</Select>
											<FormHelperText error>{errors?.driverStatus?.message}</FormHelperText>
										</FormControl>)}
									/>
								</Grid>
								<Grid item xs={12} md={6} lg={3}>
									<Typography>Emergency Contact <span className="text-red">*</span></Typography>
									<Controller
										name="emergencyContact"
										control={control}
										render={({ field }) => (<TextField
											{...field}
											className="m-0"
											id="emergencyContact"
											variant="outlined"
											fullWidth
											size="small"
											error={!!errors.emergencyContact}
											helperText={errors?.emergencyContact?.message}
											required
											disabled={isView}
										/>)}
									/>
								</Grid>

								<Grid item xs={12} md={6} lg={3}>
									<Typography>Date of Birth <span className="text-red">*</span></Typography>
									<Controller
										name="dateOfBirth"
										control={control}
										render={({ field }) => (<DateField
											{...field}
											className="m-0"
											id="dateOfBirth"
											variant="outlined"
											fullWidth
											size="small"
											helperText={errors?.dateOfBirth?.message}
											required
											disabled={isView}
										/>)}
									/>
								</Grid>
								<Grid item xs={12} md={6} lg={3}>
									<Typography>Date of Joining <span className="text-red">*</span></Typography>
									<Controller
										name="dateOfJoining"
										control={control}
										render={({ field }) => (<TextField
											{...field}
											className="m-0"
											id="dateOfJoining"
											variant="outlined"
											fullWidth
											size="small"
											error={!!errors.dateOfJoining}
											helperText={errors?.dateOfJoining?.message}
											required
											disabled={isView}
										/>)}
									/>
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
													onClick={() => document.getElementById('imageUpload')?.click()}
												>
													<AddCircleIcon fontSize="large" />
												</IconButton>
												<input
													id="imageUpload"
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
							</>


						)}
						<Grid
							item
							md={12}
							sm={12}
							xs={12}
							className="flex justify-end items-center gap-[10px] pt-[10px!important]"
						>
							<Button
								variant="contained"
								color="error"
								// disabled={_.isEmpty(dirtyFields) || !isValid}
								onClick={handleCloseDialog}
								className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
							>
								Close
							</Button>
							{!isView && (<Button
								variant="contained"
								type="submit"
								className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-yellow-800 hover:bg-yellow-800/80"
								// disabled={_.isEmpty(dirtyFields) || !isValid}
								disabled={loading}
							>
								{loading ? (<CircularProgress
									className="text-white ml-[5px]"
									size={24}
								/>) : isEdit ? ('Update') : ('Save')}
							</Button>)}
						</Grid>
					</Grid>
				</form>
			</DialogContent>
		</Dialog>
	</div>);
}

export default UsersForm;
