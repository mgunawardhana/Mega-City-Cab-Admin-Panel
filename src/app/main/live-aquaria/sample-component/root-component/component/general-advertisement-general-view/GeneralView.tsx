import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import { Field, Form, Formik } from 'formik';
import { CircularProgress, Grid, MenuItem } from '@mui/material';
import Typography from '@mui/material/Typography';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import TextFormField from '../../../../../../common/FormComponents/FormTextField';
import { GeneralAdvGeneralViewSubmitDataType, GeneralAdvMainObject } from '../../types/general-advertisement-types';
import {
	updateGeneralDetails
} from '../../../../../../axios/services/live-aquaria-services/general-advertisement-services/GeneralAdvertisementService';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { Controller } from 'react-hook-form';
import FormHelperText from '@mui/material/FormHelperText';
import TextFormDateField from '../../../../../../common/FormComponents/TextFormDateField';

interface Props {
	clickedRowData: GeneralAdvMainObject;
	isTableMode: string;
	fetchDataForProfileView: () => void;
}

function GeneralView({ clickedRowData, isTableMode, fetchDataForProfileView }: Props) {
	const { t } = useTranslation('sampleComponent');
	const [isProductSubmitDataLoading, setProductSubmitDataLoading] = useState(false);
	const schema = yup.object().shape({});
	const [userRoles, setUserRoles] = useState<{ value: string; label: string }[]>([]);
	useEffect(() => {
		// Hardcoded role values
		setUserRoles([
			{ value: 'admin', label: t('Admin') },
			{ value: 'user', label: t('User') },
			{ value: 'guest', label: t('Guest') },
		]);
	}, [t]);

	const handleUpdate = async (values: GeneralAdvGeneralViewSubmitDataType) => {
		const generalDetails = {
			type: 'LAQ',
			title: values.title,
			common_name: values.product_name,
			scientific_name: values.scientific_name,
			short_description: values.short_description,
			long_description: values.long_description,
			meta_keywords: values.product_tag_keywords.join(', ') ?? null,
			meta_description: values.meta_description,
			additional_information: values.additional_information
		};

		const id = clickedRowData?.id || '';
		setProductSubmitDataLoading(true);

		const message: string = isTableMode === 'edit' ? 'Updated successfully' : 'Created successfully';

		try {
			if (clickedRowData?.id) {
				await updateGeneralDetails(id, generalDetails);
				fetchDataForProfileView();
				toast.success(message);
				setProductSubmitDataLoading(false);
			} else {
				toast.error('General advertisement Id is required');
				setProductSubmitDataLoading(false);
			}
		} catch (error) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			if (error?.response && error?.response?.data?.message) {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
				toast.error(error?.response?.data?.message);
			} else {
				toast.error('Internal server error');
			}

			setProductSubmitDataLoading(false);
		}
	};

	return (<div className="min-w-full max-w-[100vw]">
			<Paper className="p-[16px] mt-[-5px] rounded-[4px]">
				<Formik
					enableReinitialize
					initialValues={{
						product_name: clickedRowData?.common_name || '',
						title: clickedRowData?.title || '',
						scientific_name: clickedRowData?.scientific_name || '',
						category: clickedRowData?.item_category?.name || '',
						short_description: clickedRowData?.short_description || '',
						meta_description: clickedRowData?.meta_description || '',
						long_description: clickedRowData?.long_description || '',
						additional_information: clickedRowData?.additional_information || '',
						product_tag_keywords: clickedRowData?.meta_keywords?.split(', ') || [],
						role_id: clickedRowData?.role_id || '',
					}}
					validationSchema={schema}
					onSubmit={handleUpdate}
				>
					{({ errors, touched, handleChange, values }) => {
						// @ts-ignore
						// @ts-ignore
						// @ts-ignore
						return (<Form>
								<Grid
									container
									spacing={2}
									className="pt-0"
								>
									<Grid
										item
										xl={3}
										lg={3}
										md={4}
										sm={6}
										xs={12}
										className="formikFormField pt-[5px!important]"
										key="driverFirstName"
									>
										<Typography className="formTypography">{t('First Name')} <span
											className="text-red">*</span></Typography>
										<Field
											disabled
											name="driverFirstName"
											placeholder="Placeholder"
											component={TextFormField}
											fullWidth
											size="small"
										/>
									</Grid>
									<Grid
										item
										xl={3}
										lg={3}
										md={8}
										sm={6}
										xs={12}
										className="formikFormField pt-[5px!important]"
										key="driverLastName"
									>
										<Typography className="formTypography">{t('Last Name')}</Typography>
										<Field
											disabled
											name="driverLastName"
											placeholder="Placeholder"
											component={TextFormField}
											fullWidth
											size="small"
										/>
									</Grid>
									<Grid
										item
										xl={3}
										lg={3}
										md={4}
										sm={6}
										xs={12}
										className="formikFormField pt-[5px!important]"
										key="driverNIC"
									>
										<Typography className="formTypography">{t('Driver NIC')} <span
											className="text-red">*</span></Typography>
										<Field
											disabled
											name="driverNIC"
											placeholder="Placeholder"
											component={TextFormField}
											fullWidth
											size="small"
										/>
									</Grid>
									<Grid
										item
										xl={3}
										lg={3}
										md={4}
										sm={6}
										xs={12}
										className="formikFormField pt-[5px!important]"
										key="phoneNumber"
									>
										<Typography className="formTypography">{t('Contact')} <span
											className="text-red">*</span></Typography>
										<Field
											disabled
											name="phoneNumber"
											placeholder=""
											component={TextFormField}
											fullWidth
											size="small"
										/>
									</Grid>

									{/* Editable Fields */}
									<Grid
										item
										xl={3}
										md={6}
										sm={12}
										xs={12}
										className="formikFormField pt-[5px!important]"
										key="emailAddress"
									>
										<Typography className="formTypography">{t('Email Address')} <span
											className="text-red">*</span></Typography>
										<Field
											disabled={isTableMode === 'view'}
											name="emailAddress"
											placeholder=""
											component={TextFormField}
											fullWidth
											size="small"
											multiline
										/>
									</Grid>
									<Grid
										item
										xl={3}
										md={6}
										sm={12}
										xs={12}
										className="formikFormField pt-[5px!important]"
										key="driverAddress"
									>
										<Typography className="formTypography">{t('Driver Address')} <span
											className="text-red">*</span></Typography>
										<Field
											disabled={isTableMode === 'view'}
											name="driverAddress"
											placeholder=""
											component={TextFormField}
											fullWidth
											size="small"
											multiline
										/>
									</Grid>
									<Grid
										item
										xl={3}
										md={6}
										sm={12}
										xs={12}
										className="formikFormField pt-[5px!important]"
										key="emergencyContact"
									>
										<Typography className="formTypography">{t('Emergency Contact')} <span
											className="text-red">*</span></Typography>
										<Field
											disabled={isTableMode === 'view'}
											name="emergencyContact"
											placeholder=""
											component={TextFormField}
											fullWidth
											size="small"
											multiline
										/>
									</Grid>
									<Grid
										item
										xl={3}
										md={6}
										sm={12}
										xs={12}
										className="formikFormField pt-[5px!important]"
										key="licenseNumber"
									>
										<Typography className="formTypography">{t('License Number')} <span
											className="text-red">*</span></Typography>
										<Field
											disabled={isTableMode === 'view'}
											name="licenseNumber"
											placeholder=""
											component={TextFormField}
											fullWidth
											size="small"
											multiline
											number
										/>
									</Grid>
									<Grid item xl={3} md={6} sm={12} xs={12} className="formikFormField pt-[5px!important]" key="role_id">
										<Typography htmlFor="role_id" className="formTypography">
											{t('Role')} <span className="text-red">*</span>
										</Typography>
										<FormControl fullWidth size="small">
											<Select
												id="role_id"
												name="role_id"
												value={values.role_id}
												onChange={handleChange}
												disabled={isTableMode === 'view'}
											>
												{userRoles.map((role) => (
													<MenuItem key={role.value} value={role.value}>
														{role.label}
													</MenuItem>
												))}
											</Select>
										</FormControl>

									</Grid>

									<Grid
										item
										xl={3}
										md={6}
										sm={12}
										xs={12}
										className="formikFormField pt-[5px!important]"
										key="long_description"
									>
										<Typography className="formTypography">{t('License Expiry Date')}</Typography>
										<TextFormDateField
											name="licenseExpiryDate"
											type="date"
											placeholder=""
											id="licenseExpiryDate"
											min=""
											max={new Date().toISOString().split('T')[0]}
											disablePastDate
											changeInput={(value, form) => {
												form.setFieldValue('licenseExpiryDate', value);
											}}
										/>
									</Grid>
									<Grid
										item
										xl={3}
										md={6}
										sm={12}
										xs={12}
										className="formikFormField pt-[5px!important]"
										key="long_description"
									>
										<Typography className="formTypography">{t('Date Of Join')}</Typography>
										<TextFormDateField
											name="dateOfJoining"
											type="date"
											placeholder=""
											id="dateOfJoining"
											min=""
											max={new Date().toISOString().split('T')[0]}
											disablePastDate
											changeInput={(value, form) => {
												form.setFieldValue('dateOfJoining', value);
											}}
										/>
									</Grid><Grid
									item
									xl={3}
									md={6}
									sm={12}
									xs={12}
									className="formikFormField pt-[5px!important]"
									key="long_description"
								>
									<Typography className="formTypography">{t('Date Of Birth')}</Typography>
									<TextFormDateField
										name="dateOfBirth"
										type="date"
										placeholder=""
										id="dateOfBirth"
										min=""
										max={new Date().toISOString().split('T')[0]}
										disablePastDate
										changeInput={(value, form) => {
											form.setFieldValue('dateOfBirth', value);
										}}
									/>
								</Grid>

									<Grid
										item
										md={12}
										sm={12}
										xs={12}
										className="flex justify-end items-center gap-[10px] pt-[10px!important]"
									>
										{isTableMode !== 'view' && (<Button
												className="flex justify-center items-center min-w-[100px] max-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-yellow-800 hover:bg-yellow-800/80"
												type="submit"
												variant="contained"
												color="primary"
												fullWidth
												disabled={false}
											>
												{isTableMode === 'edit' ? 'Update' : 'Save'}
												{isProductSubmitDataLoading ? (<CircularProgress
														className="text-white ml-[5px]"
														size={24}
													/>) : null}
											</Button>)}
									</Grid>
								</Grid>
							</Form>);
					}}
				</Formik>
			</Paper>
		</div>);
}

export default GeneralView;
