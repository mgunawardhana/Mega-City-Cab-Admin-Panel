import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { Grid, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import clsx from 'clsx';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { FormProps, FormType } from './AllCustomersTypes';
// import _ from 'lodash';
// import { IconButton } from 'material-ui';

/**
 * Form Validation Schema
 */
const schema = z.object({
	code: z.string().min(2, 'Must be at least 2 characters').max(10, 'Must be maximum 10 characters'),
	role: z.string().min(3, 'Must be at least 3 characters').max(10, 'Must be maximum 10 characters'),
	status: z.boolean(),
	description: z.string().min(5, 'Must be at least 5 characters')
});

function CustomersForm(props: FormProps) {
	const { className, isOpen, setIsFormOpen, isEdit, selectedRow, onCloseHandler, isView } = props;
	const [openDialog, setOpenDialog] = useState(isOpen);
	const [fullWidth] = useState(true);
	const selectedRowData = {
		...selectedRow,
		lastLotteryPurchasedDate: selectedRow.lastLotteryPurchasedDate
			? new Date(selectedRow.lastLotteryPurchasedDate)
			: null,
		registeredDate: selectedRow.registeredDate ? new Date(selectedRow.registeredDate) : null
	};
	const defaultValues =
		isEdit || (isView && selectedRow)
			? selectedRowData
			: {
					customerId: '',
					firstName: '',
					lastName: '',
					contactNo: '',
					nic: '',
					lastLotteryPurchasedDate: null,
					status: '',
					salesCount: 0,
					age: 0,
					email: '',
					registeredDate: null,
					walletBalance: 0
				};

	const { handleSubmit, formState, control, reset } = useForm<FormType>({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});

	useEffect(() => {
		if (isEdit || (isView && selectedRowData)) {
			reset(selectedRowData);
		}
	}, [isEdit, isView, selectedRowData, reset]);

	const { errors } = formState;

	function handleCloseDialog() {
		setOpenDialog(false);
		setIsFormOpen(false);
		onCloseHandler();
	}

	function onSubmit() {
		onCloseHandler();
	}

	return (
		<div className={clsx('', className)}>
			<Dialog
				fullWidth={fullWidth}
				open={openDialog}
				onClose={handleCloseDialog}
				aria-labelledby="form-dialog-title"
				scroll="body"
				maxWidth="xl"
			>
				<AppBar
					position="static"
					color="secondary"
					elevation={0}
				>
					<Toolbar className="flex w-full">
						<Typography
							variant="subtitle1"
							color="inherit"
						>
							{isEdit ? 'Edit' : 'View'} Customer
						</Typography>
					</Toolbar>
				</AppBar>

				<form
					noValidate
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col"
				>
					<DialogContent classes={{ root: 'p-16 pb-0 sm:p-32 sm:pb-0' }}>
						<Grid
							container
							spacing={2}
						>
							<Grid
								item
								xs={12}
								md={12}
							>
								<Grid
									container
									spacing={2}
								>
									<Grid
										item
										xs={12}
										md={6}
									>
										<Controller
											name="customerId"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													className="mt-8 mb-16"
													label="Customer Id"
													id="id"
													variant="outlined"
													fullWidth
													error={!!errors.customerId}
													helperText={errors?.customerId?.message}
													required
													inputProps={{ readOnly: !isEdit }}
												/>
											)}
										/>
									</Grid>
									<Grid
										item
										xs={12}
										md={6}
									>
										<Controller
											name="firstName"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													className="mt-8 mb-16"
													label="First Name"
													id="firstName"
													variant="outlined"
													fullWidth
													error={!!errors.firstName}
													helperText={errors?.firstName?.message}
													required
													inputProps={{ readOnly: !isEdit }}
												/>
											)}
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid
								item
								xs={12}
								md={12}
							>
								<Grid
									container
									spacing={2}
								>
									<Grid
										item
										xs={12}
										md={6}
									>
										<Controller
											name="lastName"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													className="mt-8 mb-16"
													label="Last Name"
													id="lastName"
													variant="outlined"
													fullWidth
													error={!!errors.lastName}
													helperText={errors?.lastName?.message}
													required
													inputProps={{ readOnly: !isEdit }}
												/>
											)}
										/>
									</Grid>
									<Grid
										item
										xs={12}
										md={6}
									>
										<Controller
											name="nic"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													className="mt-8 mb-16"
													label="NIC/Passport"
													id="nic"
													variant="outlined"
													fullWidth
													error={!!errors.nic}
													helperText={errors?.nic?.message}
													required
													inputProps={{ readOnly: !isEdit }}
												/>
											)}
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid
								item
								xs={12}
								md={12}
							>
								<Grid
									container
									spacing={2}
								>
									<Grid
										item
										xs={12}
										md={6}
									>
										<Controller
											name="age"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													className="mt-8 mb-16"
													label="Age"
													id="age"
													variant="outlined"
													fullWidth
													error={!!errors.age}
													helperText={errors?.age?.message}
													required
													inputProps={{ readOnly: !isEdit }}
												/>
											)}
										/>
									</Grid>
									<Grid
										item
										xs={12}
										md={6}
									>
										<Controller
											name="contactNo"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													className="mt-8 mb-16"
													label="Contact No"
													id="contactNo"
													variant="outlined"
													fullWidth
													error={!!errors.contactNo}
													helperText={errors?.contactNo?.message}
													required
													inputProps={{ readOnly: !isEdit }}
												/>
											)}
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid
								item
								xs={12}
								md={12}
							>
								<Grid
									container
									spacing={2}
								>
									<Grid
										item
										xs={12}
										md={6}
									>
										<Controller
											name="email"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													className="mt-8 mb-16"
													label="Email"
													id="email"
													variant="outlined"
													fullWidth
													error={!!errors.email}
													helperText={errors?.email?.message}
													required
													inputProps={{ readOnly: !isEdit }}
												/>
											)}
										/>
									</Grid>
									<Grid
										item
										xs={12}
										md={6}
									>
										{isEdit ? (
											<Controller
												name="registeredDate"
												control={control}
												render={({ field }) => (
													<LocalizationProvider dateAdapter={AdapterDateFns}>
														<DatePicker
															{...field}
															label="Registered Date"
															sx={{ display: 'flex', justifyContent: 'center' }}
														/>
													</LocalizationProvider>
												)}
											/>
										) : (
											<Controller
												name="registeredDate"
												control={control}
												render={({ field }) => (
													<TextField
														{...field}
														className="mt-8 mb-16"
														label="Registered Date"
														id="registeredDate"
														variant="outlined"
														fullWidth
														error={!!errors.registeredDate}
														helperText={errors?.registeredDate?.message}
														required
														inputProps={{ readOnly: true }}
													/>
												)}
											/>
										)}
									</Grid>
								</Grid>
							</Grid>
							<Grid
								item
								xs={12}
								md={12}
							>
								<Grid
									container
									spacing={2}
								>
									<Grid
										item
										xs={12}
										md={6}
									>
										<Controller
											name="salesCount"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													className="mt-8 mb-16"
													label="Purchased Lottery Count"
													id="salesCount"
													variant="outlined"
													fullWidth
													error={!!errors.salesCount}
													helperText={errors?.salesCount?.message}
													required
													inputProps={{ readOnly: !isEdit }}
												/>
											)}
										/>
									</Grid>
									<Grid
										item
										xs={12}
										md={6}
									>
										{isEdit ? (
											<Controller
												name="lastLotteryPurchasedDate"
												control={control}
												render={({ field }) => (
													<LocalizationProvider dateAdapter={AdapterDateFns}>
														<DatePicker
															{...field}
															label="Last Lottery Purchased Date"
															sx={{ display: 'flex', justifyContent: 'center' }}
														/>
													</LocalizationProvider>
												)}
											/>
										) : (
											<Controller
												name="lastLotteryPurchasedDate"
												control={control}
												render={({ field }) => (
													<TextField
														{...field}
														className="mt-8 mb-16"
														label="Last Lottery Purchased Date"
														id="lastLotteryPurchasedDate"
														variant="outlined"
														fullWidth
														error={!!errors.lastLotteryPurchasedDate}
														helperText={errors?.lastLotteryPurchasedDate?.message}
														required
														inputProps={{ readOnly: true }}
													/>
												)}
											/>
										)}
									</Grid>
								</Grid>
							</Grid>
							<Grid
								item
								xs={12}
								md={12}
							>
								<Grid
									container
									spacing={2}
								>
									<Grid
										item
										xs={12}
										md={6}
									>
										<Controller
											name="walletBalance"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													className="mt-8 mb-16"
													label="Wallet Balance"
													id="walletBalance"
													variant="outlined"
													fullWidth
													error={!!errors.walletBalance}
													helperText={errors?.walletBalance?.message}
													required
													inputProps={{ readOnly: !isEdit }}
												/>
											)}
										/>
									</Grid>
									<Grid
										item
										xs={12}
										md={6}
									>
										<Controller
											name="status"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													className="mt-8 mb-16"
													label="Status"
													id="status"
													variant="outlined"
													fullWidth
													error={!!errors.status}
													helperText={errors?.status?.message}
													required
													inputProps={{ readOnly: !isEdit }}
												/>
											)}
										/>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</DialogContent>

					<DialogActions className="flex flex-col sm:flex-row sm:items-center justify-between py-16 sm:py-24 px-24">
						<div className="flex items-center ml-auto space-x-16 mt-16 sm:mt-0">
							<Button
								variant="contained"
								color="error"
								// disabled={_.isEmpty(dirtyFields) || !isValid}
								onClick={handleCloseDialog}
								sx={{ borderRadius: '5px', width: '10rem' }}
							>
								Cancel
							</Button>
							{isEdit ? (
								<Button
									variant="contained"
									color="secondary"
									type="submit"
									sx={{ borderRadius: '5px', width: '10rem' }}
									// disabled={_.isEmpty(dirtyFields) || !isValid}
								>
									Save
								</Button>
							) : null}
						</div>
					</DialogActions>
				</form>
			</Dialog>
		</div>
	);
}

export default CustomersForm;
