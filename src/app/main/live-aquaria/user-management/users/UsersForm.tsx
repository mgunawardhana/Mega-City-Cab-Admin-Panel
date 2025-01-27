import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Grid, IconButton } from '@mui/material';
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
}

interface SingleUserSaveResponse {
	data: User;
}

const schema = z
	.object({
		// role_id: z.number().min(1, 'Role Selection is required'),
		first_name: z.string().min(3, 'Must be at least 3 characters').max(30, 'Must be maximum 30 characters'),
		last_name: z.string().min(3, 'Must be at least 3 characters').max(30, 'Must be maximum 30 characters'),
		// user_name: z.string().min(3, 'Must be at least 3 characters').max(30, 'Must be maximum 30 characters'),
		// mobile: z.string().min(10, 'Must be at least 10 characters').max(15, 'Must be maximum 15 characters'),
		// nic: z.string().min(10, 'Must be at least 10 characters').max(15, 'Must be maximum 15 characters'),
		email: z
			.string()
			.email('Invalid email')
			.min(5, 'Must be at least 5 characters')
			.max(50, 'Must be maximum 50 characters')

			.regex(
				/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov)$/,
				'Email must end with .com, .org, .net, .edu, or .gov'
			),
		password: z
			.string()
			.min(1, 'Please enter your password.')
			.min(8, 'Password is too short - should be 8 characters minimum.')
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
				'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
			)
			.regex(/^[^;/=+_-]*$/, 'Password should not contain ;/=+_- special characters'),
		passwordConfirm: z.string().min(1, 'Password confirmation is required')
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: 'Passwords must match',
		path: ['passwordConfirm']
	});

const schemaOnEdit = z.object({
	// role_id: z.number().min(1, 'Role Selection is required'),
	first_name: z.string().min(3, 'Must be at least 3 characters').max(30, 'Must be maximum 30 characters'),
	last_name: z.string().min(3, 'Must be at least 3 characters').max(30, 'Must be maximum 30 characters'),
	// user_name: z.string().min(3, 'Must be at least 3 characters').max(30, 'Must be maximum 30 characters'),
	// is_active: z.number(),
	email: z
		.string()
		.email('Invalid email')
		.min(5, 'Must be at least 5 characters')
		.max(50, 'Must be maximum 50 characters')

		.regex(
			/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov)$/,
			'Email must end with .com, .org, .net, .edu, or .gov'
		)
	// mobile: z.string().min(10, 'Must be at least 10 characters').max(15, 'Must be maximum 15 characters'),
	// nic: z.string().min(10, 'Must be at least 10 characters').max(15, 'Must be maximum 15 characters')
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
	const { isAdd, className, isOpen, setIsFormOpen, isEdit, selectedRow, onCloseHandler, isView, userRoles } = props;
	const [openDialog, setOpenDialog] = useState(isOpen);
	const [loading, setLoading] = useState(false);
	const [fullWidth] = useState(true);
	const defaultValues = {
		id: selectedRow ? selectedRow.id : '',
		first_name: selectedRow ? selectedRow.first_name : '',
		last_name: selectedRow ? selectedRow?.last_name : '',
		user_name: selectedRow ? selectedRow.user_name : '',
		email: selectedRow ? selectedRow.email : '',
		mobile: selectedRow ? selectedRow.mobile : '',
		password: selectedRow ? selectedRow.password : '',
		is_active: selectedRow ? selectedRow?.is_active : 1,
		role_id: selectedRow ? selectedRow.roles[0].id : 0,
		nic: selectedRow ? selectedRow.nic : ''
	};
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const { handleSubmit, formState, control, reset } = useForm<UserInterface>({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(isEdit ? schemaOnEdit : schema)
	});

	const { errors } = formState;

	function handleCloseDialog() {
		setOpenDialog(false);
		setIsFormOpen(false);
		onCloseHandler();
	}

	function onSubmit(data: UserInterface) {
		// if (isEdit) {
		// 	updateRole(data);
		// } else {
		//
		// }
		saveRole(data);
	}

	async function saveRole(data: UserInterface) {
		setLoading(true);
		try {
			const data_save = {
				// title_id: 1,
				firstName: data.first_name,
				lastName: data.last_name,
				// user_name: data.user_name,
				email: data.email,
				// mobile: data.mobile,
				password: data.password
				// nic: data.nic,
				// roles: data.role_id
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

	async function updateRole(data: UserInterface) {
		setLoading(true);
		try {
			const data_update = {
				title_id: 1,
				first_name: data.first_name,
				last_name: data.last_name,
				user_name: data.user_name,
				email: data.email,
				mobile: data.mobile,
				password: data.password,
				nic: data.nic,
				roles: data.role_id,
				is_active: data.is_active
			};
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

	return loading ? (
		<div className="flex justify-center items-center w-[111.2vw] h-[111.2svh] fixed top-0 left-0 z-[10000] bg-white/95">
			<div className="flex-col gap-4 w-full flex items-center justify-center">
				<div className="w-[60px] h-[60px] border-4 border-transparent text-primaryPurple text-4xl animate-spin flex items-center justify-center border-t-primaryPurple rounded-full">
					<div className="w-[50px] h-[50px] border-4 border-transparent text-primaryPurple text-2xl animate-spin flex items-center justify-center border-t-primaryPurple rounded-full" />
				</div>
			</div>
		</div>
	) : (
		<div className={clsx('', className)}>
			<Dialog
				fullWidth={fullWidth}
				open={openDialog}
				onClose={handleCloseDialog}
				aria-labelledby="form-dialog-title"
				scroll="body"
				maxWidth="lg"
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
							{/* <Grid */}
							{/*	item */}
							{/*	xs={12} */}
							{/*	md={6} */}
							{/*	lg={4} */}
							{/*	className="formikFormField pt-[5px!important]" */}
							{/* > */}
							{/*	<Typography className="formTypography"> */}
							{/*		Role <span className="text-red">*</span> */}
							{/*	</Typography> */}
							{/*	<Controller */}
							{/*		name="role_id" */}
							{/*		control={control} */}
							{/*		render={({ field }) => ( */}
							{/*			<FormControl */}
							{/*				fullWidth */}
							{/*				required */}
							{/*			> */}
							{/*				<Select */}
							{/*					autoFocus */}
							{/*					{...field} */}
							{/*					className="m-0" */}
							{/*					size="small" */}
							{/*					disabled={isView} */}
							{/*					error={!!errors.role_id} */}
							{/*				> */}
							{/*					{userRoles?.map((role) => ( */}
							{/*						<MenuItem */}
							{/*							key={role.value} */}
							{/*							value={role.value} */}
							{/*						> */}
							{/*							{role.label} */}
							{/*						</MenuItem> */}
							{/*					))} */}
							{/*				</Select> */}
							{/*				<FormHelperText error>{errors?.role_id?.message}</FormHelperText> */}
							{/*			</FormControl> */}
							{/*		)} */}
							{/*	/> */}
							{/* </Grid> */}
							{/* <Grid */}
							{/*	item */}
							{/*	xs={12} */}
							{/*	md={6} */}
							{/*	lg={4} */}
							{/*	className="formikFormField pt-[5px!important]" */}
							{/* > */}
							{/*	<Typography className="formTypography"> */}
							{/*		User Name <span className="text-red">*</span> */}
							{/*	</Typography> */}
							{/*	<Controller */}
							{/*		name="user_name" */}
							{/*		control={control} */}
							{/*		render={({ field }) => ( */}
							{/*			<TextField */}
							{/*				{...field} */}
							{/*				className="m-0" */}
							{/*				id="user_name" */}
							{/*				variant="outlined" */}
							{/*				fullWidth */}
							{/*				size="small" */}
							{/*				error={!!errors.user_name} */}
							{/*				helperText={errors?.user_name?.message} */}
							{/*				required */}
							{/*				disabled={isView} */}
							{/*			/> */}
							{/*		)} */}
							{/*	/> */}
							{/* </Grid> */}
							<Grid
								item
								xs={12}
								md={6}
								lg={4}
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="formTypography">
									First Name <span className="text-red">*</span>
								</Typography>
								<Controller
									name="first_name"
									control={control}
									render={({ field }) => (
										<TextField
											{...field}
											className="m-0"
											id="first_name"
											variant="outlined"
											fullWidth
											size="small"
											error={!!errors.first_name}
											helperText={errors?.first_name?.message}
											required
											disabled={isView}
										/>
									)}
								/>
							</Grid>
							<Grid
								item
								xs={12}
								md={6}
								lg={4}
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="formTypography">
									Last Name <span className="text-red">*</span>
								</Typography>
								<Controller
									name="last_name"
									control={control}
									render={({ field }) => (
										<TextField
											{...field}
											className="m-0"
											id="last_name"
											variant="outlined"
											fullWidth
											size="small"
											error={!!errors.last_name}
											helperText={errors?.last_name?.message}
											required
											disabled={isView}
										/>
									)}
								/>
							</Grid>
							<Grid
								item
								xs={12}
								md={6}
								lg={4}
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="formTypography">
									Email <span className="text-red">*</span>
								</Typography>
								<Controller
									name="email"
									control={control}
									render={({ field }) => (
										<TextField
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
										/>
									)}
								/>
							</Grid>
							{/* <Grid */}
							{/*	item */}
							{/*	xs={12} */}
							{/*	md={6} */}
							{/*	lg={4} */}
							{/*	className="formikFormField pt-[5px!important]" */}
							{/* > */}
							{/*	<Typography className="formTypography"> */}
							{/*		Employee ID <span className="text-red">*</span> */}
							{/*	</Typography> */}
							{/*	<Controller */}
							{/*		name="nic" */}
							{/*		control={control} */}
							{/*		render={({ field }) => ( */}
							{/*			<TextField */}
							{/*				{...field} */}
							{/*				className="m-0" */}
							{/*				id="nic" */}
							{/*				variant="outlined" */}
							{/*				fullWidth */}
							{/*				size="small" */}
							{/*				error={!!errors.nic} */}
							{/*				helperText={errors?.nic?.message} */}
							{/*				required */}
							{/*				disabled={isView} */}
							{/*			/> */}
							{/*		)} */}
							{/*	/> */}
							{/* </Grid> */}
							{/* <Grid */}
							{/*	item */}
							{/*	xs={12} */}
							{/*	md={6} */}
							{/*	lg={4} */}
							{/*	className="formikFormField pt-[5px!important]" */}
							{/* > */}
							{/*	<Typography className="formTypography"> */}
							{/*		Mobile <span className="text-red">*</span> */}
							{/*	</Typography> */}
							{/*	<Controller */}
							{/*		name="mobile" */}
							{/*		control={control} */}
							{/*		render={({ field }) => ( */}
							{/*			<TextField */}
							{/*				{...field} */}
							{/*				className="m-0" */}
							{/*				id="mobile" */}
							{/*				variant="outlined" */}
							{/*				fullWidth */}
							{/*				size="small" */}
							{/*				error={!!errors.mobile} */}
							{/*				helperText={errors?.mobile?.message} */}
							{/*				required */}
							{/*				disabled={isView} */}
							{/*			/> */}
							{/*		)} */}
							{/*	/> */}
							{/* </Grid> */}
							{!isView && !isEdit && (
								<>
									<Grid
										item
										xs={12}
										md={6}
										lg={4}
										className="formikFormField pt-[5px!important]"
									>
										<Typography className="formTypography">
											Password <span className="text-red">*</span>
										</Typography>
										<Controller
											name="password"
											control={control}
											render={({ field }) => (
												<TextField
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
														endAdornment: (
															<InputAdornment position="end">
																<IconButton
																	aria-label="toggle password visibility"
																	onClick={togglePasswordVisibility}
																	edge="end"
																	size="small"
																>
																	{showPassword ? <Visibility /> : <VisibilityOff />}
																</IconButton>
															</InputAdornment>
														)
													}}
												/>
											)}
										/>
									</Grid>

									<Grid
										item
										xs={12}
										md={6}
										lg={4}
										className="formikFormField pt-[5px!important]"
									>
										<Typography className="formTypography">
											Confirm Password <span className="text-red">*</span>
										</Typography>
										<Controller
											name="passwordConfirm"
											control={control}
											render={({ field }) => (
												<TextField
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
														endAdornment: (
															<InputAdornment position="end">
																<IconButton
																	aria-label="toggle password visibility"
																	onClick={toggleConfirmPasswordVisibility}
																	edge="end"
																	size="small"
																>
																	{showConfirmPassword ? (
																		<Visibility />
																	) : (
																		<VisibilityOff />
																	)}
																</IconButton>
															</InputAdornment>
														)
													}}
												/>
											)}
										/>
									</Grid>
								</>
							)}

							{/* <Grid */}
							{/*	item */}
							{/*	xs={12} */}
							{/*	className="formikFormField pt-[5px!important]" */}
							{/* > */}
							{/*	<Controller */}
							{/*		name="is_active" */}
							{/*		control={control} */}
							{/*		defaultValue={0} */}
							{/*		render={({ field }) => ( */}
							{/*			<FormControlLabel */}
							{/*				control={ */}
							{/*					<Switch */}
							{/*						{...field} */}
							{/*						defaultChecked={field.value === 1} */}
							{/*						disabled={isView || isAdd} */}
							{/*						onChange={(e) => { */}
							{/*							field.onChange(e.target.checked === true ? 1 : 0); */}
							{/*						}} */}
							{/*						size="small" */}
							{/*						sx={{ */}
							{/*							'& .muiltr-kpgjex-MuiButtonBase-root-MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track': */}
							{/*								{ */}
							{/*									backgroundColor: '#387ed4' */}
							{/*								}, */}
							{/*							'& .MuiSwitch-thumb': { */}
							{/*								backgroundColor: '#387ed4' */}
							{/*							}, */}
							{/*							'& .MuiButtonBase-root.MuiSwitch-switchBase.Mui-disabled .MuiSwitch-thumb': */}
							{/*								{ */}
							{/*									backgroundColor: '#b2d4fe' */}
							{/*								} */}
							{/*						}} */}
							{/*					/> */}
							{/*				} */}
							{/*				label={`User ${field.value === 1 ? 'Active' : 'Inactive'}`} */}
							{/*			/> */}
							{/*		)} */}
							{/*	/> */}
							{/* </Grid> */}

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
								{!isView && (
									<Button
										variant="contained"
										color="secondary"
										type="submit"
										className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
										// disabled={_.isEmpty(dirtyFields) || !isValid}
										disabled={loading}
									>
										{loading ? (
											<CircularProgress
												className="text-white ml-[5px]"
												size={24}
											/>
										) : isEdit ? (
											'Update'
										) : (
											'Save'
										)}
									</Button>
								)}
							</Grid>
						</Grid>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default UsersForm;
