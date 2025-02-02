import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { Checkbox, Grid, IconButton, Select } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import clsx from 'clsx';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CircularProgress from '@mui/material/CircularProgress';
import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import InputAdornment from '@mui/material/InputAdornment';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { SAVE_ADMIN_USER, UPDATE_ADMIN_USER } from 'src/app/axios/services/AuthServices';
import { UserInterface } from './UsersApp';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import { useTranslation } from 'react-i18next';
import TextFormDateField from '../../../../common/FormComponents/TextFormDateField';
import { DateField } from '@mui/x-date-pickers';

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
	const { t } = useTranslation('sampleComponent');

	const { isAdd, className, isOpen, setIsFormOpen, isEdit, selectedRow, onCloseHandler, isView } = props;
	const [openDialog, setOpenDialog] = useState(isOpen);
	const [userRoles, setUserRoles] = useState<{ value: string; label: string }[]>([]);
	const [driverStatus, setDriverStatus] = useState<{ value: string; label: string }[]>([]);
	const [selectedRole, setSelectedRole] = useState<string>('');
	const [loading, setLoading] = useState(false);
	const [fullWidth] = useState(true);
	const defaultValues = {
		id: selectedRow ? selectedRow.id : '',
		firstName: selectedRow ? selectedRow.firstName : '',
		lastName: selectedRow ? selectedRow.lastName : '',
		email: selectedRow ? selectedRow.email : '',
		password: selectedRow ? selectedRow.password : '',
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

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const toggleConfirmPasswordVisibility = () => {
		setShowConfirmPassword(!showConfirmPassword);
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
					{getTitle('User')}
				</h6>
			</DialogTitle>

			<DialogContent>
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
									<Select {...field} size="small" onChange={(e) => {
										field.onChange(e);
										handleRoleChange(e);
									}}>
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
								<Grid item xs={12} md={6} lg={9}></Grid>
								<br />
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

								//TODO i have to give solutions -------------------------------------------------------------
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
								color="secondary"
								type="submit"
								className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
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
