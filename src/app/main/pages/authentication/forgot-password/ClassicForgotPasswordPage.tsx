import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { PasswordResetResponse } from 'src/app/axios/services/responseInterfaces';
import { CONFIRM_RESET_PASSWORD, RESET_PASSWORD } from 'src/app/axios/services/AuthServices';
import { toast } from 'react-toastify';
import { CircularProgress, Grid } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Visibility, VisibilityOff } from '@mui/icons-material';

/**
 * Form Validation Schema
 */
// const schema = z.object({
// 	// email: z.string().email('You must enter a valid email').nonempty('You must enter an email')
// 	email: z.string().email('You must enter a valid email').nonempty('You must enter an email')
// });

// const defaultValues = {
// 	email: ''
// };

const sendResetLinkSchema = z.object({
	userName: z.string().nonempty('You must enter an email')
});

const resetPasswordSchema = z
	.object({
		newPassword: z
			.string()
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
				'Password must contain at least 8 characters, including uppercase, lowercase letters, numbers, and special characters'
			),
		email: z.string().email('Email is required').min(1, 'Email is required'),
		confirmPassword: z.string().min(1, 'Confirm password is required')
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword']
	});

type SendResetLinkFormType = {
	userName: string;
};

type ResetPasswordFormType = {
	newPassword: string;
	email: string;
	confirmPassword: string;
};

const sendResetLinkDefaultValues = {
	userName: ''
};

/**
 * THe classic forgot password page.
 */

function ClassicForgotPasswordPage() {
	const url = new URL(window.location.href);
	const email = url.searchParams.get('email');
	const token = url.pathname.split('/').pop();

	const resetPasswordDefaultValues = {
		newPassword: '',
		email,
		confirmPassword: ''
	};

	const [loading, setLoading] = useState(false);
	const [pwdResetFormView, setPwdResetFormView] = useState(!!email);
	const navigate = useNavigate();

	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const toggleNewPasswordVisibility = () => {
		setShowNewPassword(!showNewPassword);
	};

	const toggleConfirmPasswordVisibility = () => {
		setShowConfirmPassword(!showConfirmPassword);
	};

	const {
		control: sendResetLinkControl,
		formState: sendResetLinkFormState,
		handleSubmit: handleSendResetLinkSubmit
	} = useForm<SendResetLinkFormType>({
		mode: 'onChange',
		defaultValues: sendResetLinkDefaultValues,
		resolver: zodResolver(sendResetLinkSchema)
	});

	const {
		control: resetPasswordControl,
		formState: resetPasswordFormState,
		handleSubmit: handleResetPasswordSubmit
	} = useForm<ResetPasswordFormType>({
		mode: 'onChange',
		defaultValues: resetPasswordDefaultValues,
		resolver: zodResolver(resetPasswordSchema)
	});

	const { errors: sendResetLinkErrors } = sendResetLinkFormState;
	const { errors: resetPasswordErrors } = resetPasswordFormState;

	async function sendResetLink(data: SendResetLinkFormType) {
		setLoading(true);
		try {
			const data_update = {
				userName: data.userName
			};
			const response: AxiosResponse<PasswordResetResponse> = await axios.post(RESET_PASSWORD, data_update);
			toast.success(response.data.message);
			setPwdResetFormView(true);
		} catch (error) {
			const axiosError = error as AxiosError;

			if (
				axiosError?.response?.data &&
				typeof axiosError.response.data === 'object' &&
				'message' in axiosError.response.data
			) {
				const errorMessage = (axiosError.response.data as { message: string }).message;
				toast.error(errorMessage);
			} else if (axiosError.message) {
				toast.error(axiosError.message);
			} else {
				toast.error('An unexpected error occurred');
			}
		} finally {
			setLoading(false);
		}
	}

	async function resetPassword(data: ResetPasswordFormType) {
		console.log('Form data submitted:', data);
		setLoading(true);
		try {
			const data_update = {
				token,
				email: data.email,
				password: data.newPassword,
				password_confirmation: data.confirmPassword
			};
			const response: AxiosResponse<{ status: string }> = await axios.post(CONFIRM_RESET_PASSWORD, data_update);
			toast.success(response.data.status);
		} catch (error) {
			const axiosError = error as AxiosError;

			if (
				axiosError?.response?.data &&
				typeof axiosError.response.data === 'object' &&
				'message' in axiosError.response.data
			) {
				const errorMessage = (axiosError.response.data as { message: string }).message;
				toast.error(errorMessage);
			} else if (axiosError.message) {
				toast.error(axiosError.message);
			} else {
				toast.error('An unexpected error occurred');
			}
		} finally {
			setLoading(false);
			setTimeout(() => {
				navigate('/sign-in');
			}, 2000);
		}
	}

	async function onSubmit(data: SendResetLinkFormType) {
		setLoading(true);
		try {
			const response: AxiosResponse<{ status: string }> = await axios.post(RESET_PASSWORD, {
				email: data.userName
			});

			toast.success(response.data.status);
		} catch (error) {
			const axiosError = error as AxiosError;

			if (
				axiosError?.response?.data &&
				typeof axiosError.response.data === 'object' &&
				'message' in axiosError.response.data
			) {
				const errorMessage = (axiosError.response.data as { message: string }).message;
				toast.error(errorMessage);
			} else if (axiosError.message) {
				toast.error(axiosError.message);
			} else {
				toast.error('An unexpected error occurred');
			}
		} finally {
			setLoading(false);
			setTimeout(() => {
				navigate('/sign-in');
			}, 2000);
		}
	}

	function onSubmitResetPwd(data: ResetPasswordFormType) {
		resetPassword(data);
	}

	// const { isValid, dirtyFields, errors } = formState;

	// function onSubmit() {
	// 	reset(defaultValues);
	// }
	// function onSubmit(data) {
	// 	console.log('Form data submitted:', data);
	// 	reset(defaultValues);
	// }

	return (
		<div className="flex min-w-0 flex-auto flex-col items-center sm:justify-center">
			<Paper className="min-h-full w-full rounded-0 px-16 py-32 sm:min-h-auto sm:w-auto sm:rounded-2xl sm:p-48 sm:shadow">
				<div className="mx-auto w-full max-w-320 sm:mx-0 sm:w-320">

					{pwdResetFormView ? (
						<form
							name="passwordResetForm"
							// name="forgotPasswordForm"
							noValidate
							className="mt-32 flex w-full flex-col justify-center"
							onSubmit={handleResetPasswordSubmit(onSubmitResetPwd)}
						>
							<Typography
								variant="h4"
								component="h1"
								className="text-4xl text-gray-800 font-extrabold leading-tight tracking-tight text-center mb-[10px]"
							>
								Reset Your Password
							</Typography>

							<Grid
								container
								spacing={2}
							>
								<Grid
									item
									xs={12}
									md={12}
								>
									<Controller
										name="email"
										control={resetPasswordControl}
										render={({ field }) => (
											<TextField
												{...field}
												className="mb-0"
												label="Email"
												type="confirmationCode"
												size="small"
												error={!!resetPasswordErrors.email}
												helperText={resetPasswordErrors?.email?.message}
												variant="outlined"
												required
												fullWidth
												disabled
											/>
										)}
									/>
								</Grid>
								<Grid
									item
									xs={12}
									md={12}
								>
									<Controller
										name="newPassword"
										control={resetPasswordControl}
										render={({ field }) => (
											<TextField
												{...field}
												className="mb-0"
												label="New Password"
												type={showNewPassword ? 'text' : 'password'}
												size="small"
												error={!!resetPasswordErrors.newPassword}
												helperText={resetPasswordErrors?.newPassword?.message}
												variant="outlined"
												required
												fullWidth
												InputProps={{
													endAdornment: (
														<InputAdornment position="end">
															<IconButton
																aria-label="toggle password visibility"
																onClick={toggleNewPasswordVisibility}
																edge="end"
																size="small"
															>
																{showNewPassword ? <Visibility /> : <VisibilityOff />}
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
									md={12}
								>
									<Controller
										name="confirmPassword"
										control={resetPasswordControl}
										render={({ field }) => (
											<TextField
												{...field}
												className="mb-0"
												label="Confirm Password"
												type={showConfirmPassword ? 'text' : 'password'}
												size="small"
												error={!!resetPasswordErrors.confirmPassword}
												helperText={resetPasswordErrors?.confirmPassword?.message}
												variant="outlined"
												required
												fullWidth
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
								<Grid
									item
									xs={12}
									md={12}
								>
									<Button
										sx={{ width: 'fit-content' }}
										variant="contained"
										color="secondary"
										className="w-full text-white text-lg mt-4 rounded-[6px] bg-yellow-800 hover:bg-yellow-800"
										aria-label="Reset Password"
										type="submit"
										size="large"
									>
										Confirm Password
										{loading ? <CircularProgress size={20} /> : null}
									</Button>
									{/* <Typography className='text-md font-medium text-center mt-[20px]' color='text.secondary'>
										<span>Return to</span>
										<Link className='ml-4' to='/sign-in'>
											Sign in
										</Link>
									</Typography> */}
								</Grid>
							</Grid>
							{/* <Controller
								name="email"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										className="mb-24"
										label="Email"
										type="email"
										error={!!errors.email}
										helperText={errors?.email?.message}
										variant="outlined"
										required
										fullWidth
									/>
								)}
							/> */}

							{/* <Button
								variant="contained"
								color="secondary"
								className=" mt-4 w-full"
								// aria-label="Register"
								aria-label="Send Reset Link"
								disabled={_.isEmpty(dirtyFields) || !isValid}
								type="submit"
								size="large"
							>
								Send reset link
							</Button> */}

							<Typography
								className="mt-32 text-md font-medium"
								color="text.secondary"
							>
								<span>Return to</span>
								<Link
									className="ml-4"
									to="/"
								>
									sign in
								</Link>
							</Typography>
						</form>
					) : (
						<form
							name="sendResetLinkForm"
							noValidate
							className="flex w-full flex-col justify-center mt-[15px]"
							onSubmit={handleSendResetLinkSubmit(onSubmit)}
						>
							<Typography
								variant="h4"
								component="h1"
								className="text-4xl text-gray-800 font-extrabold leading-tight tracking-tight text-center mb-[10px]"
							>
								Enter Your Email
							</Typography>

							<Controller
								name="userName"
								control={sendResetLinkControl}
								render={({ field }) => (
									<TextField
										{...field}
										className="m-0"
										label="Email"
										type="text"
										size="small"
										// style={{ marginTop: '50px' }}
										error={!!sendResetLinkErrors.userName}
										helperText={sendResetLinkErrors?.userName?.message}
										variant="outlined"
										required
										fullWidth
									/>
								)}
							/>

							<Button
								variant="contained"
								color="secondary"
								className="w-full text-white text-lg mt-16 rounded-[6px] bg-yellow-800 hover:bg-yellow-800"
								// style={{ width: 'fit-content', display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: '30px' }}
								aria-label="Send Reset Link"
								type="submit"
								size="large"
							>
								Verify Email
								{loading ? <CircularProgress size={20} /> : null}
							</Button>

							{/* <Typography className='text-md font-medium text-center mt-[20px]' color='text.secondary'>
								<span>Return to</span>
								<Link className='ml-4' to='/sign-in'>
									Sign in
								</Link>
							</Typography> */}
						</form>
					)}
				</div>
			</Paper>
		</div>
	);
}

export default ClassicForgotPasswordPage;
