import { zodResolver } from '@hookform/resolvers/zod';
import { FormControlLabel, Grid, Switch } from '@mui/material';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import clsx from 'clsx';
import { z } from 'zod';
import axios, { AxiosResponse } from 'axios';
import { SAVE_ADMIN_ROLE, UPDATE_ADMIN_ROLE } from 'src/app/axios/services/AdminServices';
import { toast } from 'react-toastify';
import { Role } from './UserRolesApp';

interface Data {
	id: number;
	name: string;
	description: string;
	is_active: number;
}

interface RoleSaveResponse {
	data: Data;
}

const schema = z.object({
	name: z.string().min(3, 'Must be at least 3 characters').max(25, 'Must be maximum 25 characters'),
	is_active: z.number(),
	description: z.string().min(3, 'Must be at least 3 characters')
});

interface Props {
	isAdd: boolean;
	className?: string;
	isOpen: boolean;
	setIsFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
	isEdit?: boolean;
	selectedRow?: Role;
	onCloseHandler?: () => void;
	isView?: boolean;
}

function UserRolesForm(props: Props) {
	const { isAdd, className, isOpen, setIsFormOpen, isEdit, selectedRow, onCloseHandler, isView } = props;
	const [openDialog, setOpenDialog] = useState(isOpen);
	const [loading, setLoading] = useState(false);
	const [fullWidth] = useState(true);
	const defaultValues = {
		id: selectedRow ? Number(selectedRow.id) : 0,
		name: selectedRow ? selectedRow.name : '',
		is_active: selectedRow ? selectedRow?.is_active : 1,
		description: selectedRow && selectedRow?.description !== null ? selectedRow.description : ''
	};

	const { handleSubmit, formState, control, reset } = useForm<Role>({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});

	const { errors } = formState;

	function handleCloseDialog() {
		setOpenDialog(false);
		setIsFormOpen(false);
		onCloseHandler();
	}

	function onSubmit(data: Role) {
		if (isEdit) {
			updateRole(data);
		} else {
			saveRole(data);
		}
	}

	async function saveRole(data: Role) {
		setLoading(true);
		try {
			const data_save = {
				name: data.name,
				description: data.description,
				is_active: data.is_active
			};
			await axios.post(SAVE_ADMIN_ROLE, data_save);
			toast.success('Admin Role created successfully');
		} catch (error) {
			toast.error(error.response.data.message);
		} finally {
			setLoading(false);
			onCloseHandler();
		}
	}

	async function updateRole(data: Role) {
		setLoading(true);
		try {
			const data_update = {
				name: data.name,
				description: data.description,
				is_active: data.is_active
			};
			const response: AxiosResponse<RoleSaveResponse> = await axios.put(
				UPDATE_ADMIN_ROLE + selectedRow.id,
				data_update
			);
			toast.success('Admin Role updated successfully');
		} catch (error) {
			toast.error(error.response.data.message);
		} finally {
			setLoading(false);
			onCloseHandler();
		}
	}

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
				maxWidth="sm"
			>
				<DialogTitle className="pb-0">
					<h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400">
						{getTitle('User Role')}
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
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="formTypography">
									User Role <span className="text-red">*</span>
								</Typography>
								<Controller
									name="name"
									control={control}
									render={({ field }) => (
										<TextField
											{...field}
											className="w-full m-0"
											// label='User Role'
											id="role"
											variant="outlined"
											fullWidth
											size="small"
											error={!!errors.name}
											helperText={errors?.name?.message}
											required
											disabled={isView}
											// inputProps={{ readOnly: true }}
										/>
									)}
								/>
							</Grid>
							<Grid
								item
								xs={12}
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="formTypography">
									Description <span className="text-red">*</span>
								</Typography>
								<Controller
									name="description"
									control={control}
									render={({ field }) => (
										<TextField
											{...field}
											className="mb-0"
											// label='Description'
											id="description"
											variant="outlined"
											fullWidth
											size="small"
											multiline
											rows={4}
											disabled={isView}
											error={!!errors.description}
											helperText={errors?.description?.message}
											required
										/>
									)}
								/>
							</Grid>
							<Grid
								item
								xs={12}
								className="formikFormField pt-[5px!important]"
							>
								<Controller
									name="is_active"
									control={control}
									// defaultValue={}
									render={({ field }) => (
										<FormControlLabel
											control={
												<Switch
													{...field}
													defaultChecked={field.value == 1}
													disabled={isView || isAdd}
													onChange={(e) => field.onChange(e.target.checked === true ? 1 : 0)}
													size="small"
													sx={{
														'& .muiltr-kpgjex-MuiButtonBase-root-MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track':
															{
																backgroundColor: '#387ed4!important'
															},
														'& .MuiSwitch-thumb': {
															backgroundColor: '#387ed4'
														},
														'& .MuiButtonBase-root.MuiSwitch-switchBase.Mui-disabled .MuiSwitch-thumb':
															{
																backgroundColor: '#b2d4fe'
															}
													}}
												/>
											}
											label={`Role ${field.value === 1 ? 'Active' : 'Inactive'}`}
										/>
									)}
								/>
							</Grid>

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

export default UserRolesForm;
