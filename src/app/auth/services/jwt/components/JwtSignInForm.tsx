import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { z } from 'zod';
import _ from '@lodash';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import ClassicForgotPasswordPage from 'src/app/main/pages/authentication/forgot-password/ClassicForgotPasswordPage';
import { Link } from 'react-router-dom';
import useJwtAuth from '../useJwtAuth';

/**
 * Form Validation Schema
 */
const schema = z.object({
	email: z.string().email('You must enter a valid email').min(1, 'Email is Required'),
	password: z.string().min(1, 'Password is Required').min(4, 'Password is too short - must be at least 4 characters.')
});

type FormType = {
	email: string;
	password: string;
	remember?: boolean;
};

const defaultValues = {
	email: '',
	password: '',
	remember: true
};


function JwtSignInForm() {
	const { signIn } = useJwtAuth();

	const { control, formState, handleSubmit, setValue, setError } = useForm<FormType>({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	const [open, setOpen] = useState(false);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const modalStyle = {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: 400,
		bgcolor: 'background.paper',
		border: '2px solid #000',
		boxShadow: 24
		// p: 4,
	};

	const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	useEffect(() => {
		setValue('email', 'maneesha@gmail.com', {
			shouldDirty: true,
			shouldValidate: true
		});
		setValue('password', 'maneesha@123', {
			shouldDirty: true,
			shouldValidate: true
		});
	}, [setValue]);

	function onSubmit(formData: FormType) {
		const { email, password } = formData;

		signIn({
			email,
			password
		}).catch(
			(
				error: AxiosError<
					{
						type: 'email' | 'password' | 'remember' | `root.${string}` | 'root';
						message: string;
					}[]
				>
			) => {
				const errorData = error.response.data;

				errorData.forEach((err) => {
					setError(err.type, {
						type: 'manual',
						message: err.message
					});
				});
			}
		);
	}

	return (
		<div>
			<form
				name="loginForm"
				noValidate
				className="mt-32 flex w-full flex-col justify-center"
				onSubmit={handleSubmit(onSubmit)}
			>
				<Controller
					name="email"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mb-24"
							label="Email"
							autoFocus
							error={!!errors.email}
							helperText={errors?.email?.message}
							variant="outlined"
							required
							fullWidth
						/>
					)}
				/>

				<Controller
					name="password"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mb-16"
							label="Password"
							type={showPassword ? 'text' : 'password'}
							error={!!errors.password}
							helperText={errors?.password?.message}
							variant="outlined"
							required
							fullWidth
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

				<div className="flex flex-col items-center justify-center sm:flex-row sm:justify-between">
					{/* <Controller
						name="remember"
						control={control}
						render={({ field }) => (
							<FormControl>
								<FormControlLabel
									label="Remember me"
									control={
										<Checkbox
											size="small"
											{...field}
										/>
									}
								/>
							</FormControl>
						)}
					/> */}

					<Link
						className="text-md font-medium"
						to="/forgot-password"
					>
						Forgot password?
					</Link>

					{/* <Button
						className="text-md font-medium hover:bg-transparent active:bg-transparent focus:bg-transparent"
						// to="/pages/auth/forgot-password"
						to="/forgot-password"
						// onClick={handleOpen}
					>
						Forgot password?
					</Button> */}
				</div>

				<Button
					variant="contained"
					className="w-full text-white text-lg mt-16 rounded-[6px] bg-yellow-800 hover:bg-yellow-700"
					aria-label="Sign in"
					disabled={_.isEmpty(dirtyFields) || !isValid}
					type="submit"
					size="large"
				>
					Sign In
				</Button>
			</form>
			<Modal
				open={open}
				onClose={handleClose}
			>
				<Box sx={modalStyle}>
					<ClassicForgotPasswordPage />
				</Box>
			</Modal>
		</div>
	);
}

export default JwtSignInForm;
