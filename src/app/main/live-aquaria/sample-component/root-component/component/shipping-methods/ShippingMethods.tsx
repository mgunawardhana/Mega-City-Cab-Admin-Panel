import { Button, CircularProgress } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { updateGeneralAdvertisementGuaranteeOptions } from '../../../../../../axios/services/live-aquaria-services/general-advertisement-services/GeneralAdvertisementService';
import { getAllGuaranteeOptionsWithOutPagination } from '../../../../../../axios/services/live-aquaria-services/master-data-services/MasterDataServices';
import CommonHeading from '../../../../../../common/FormComponents/CommonHeading';
import {
	GuaranteeOptionsDataType,
	GuaranteeOptionType
} from '../../../../laq-master-data/guarantee-options/guarantee-options-types/GuaranteeOptions';

import { GeneralAdvMainObject, GeneralAdvShippingMethodSubmitData } from '../../types/general-advertisement-types';

interface GuaranteeOptionsGeneralAdvertisementsType {
	id: string;
	guaranteeName: string;
	checked: boolean;
}

interface FormData {
	guaranteeOptions: number;
	allowEmails: boolean;
	loyaltyRewards: boolean;
	weeklySpecial: boolean;
	autoDelivery: boolean;
	specialMessage: string;
	guaranteeOptionSelected?: string;
}

export const defaultValues: FormData = {
	guaranteeOptions: 0,
	allowEmails: true,
	loyaltyRewards: false,
	weeklySpecial: false,
	autoDelivery: false,
	specialMessage: '',
	guaranteeOptionSelected: undefined
};

interface RelatedProductProps {
	clickedRowData: GeneralAdvMainObject;
	isTableMode: string;
	fetchDataForProfileView: () => void;
	initialShippingValues: GeneralAdvShippingMethodSubmitData;
}

export default function ShippingMethods({
	clickedRowData,
	isTableMode,
	fetchDataForProfileView,
	initialShippingValues
}: RelatedProductProps) {
	const [loading, setLoading] = useState(false);
	const [guaranteeOptionsData, setGuaranteeOptionsData] = useState<GuaranteeOptionsGeneralAdvertisementsType[]>([]);
	const [isProductSubmitDataLoading, setProductSubmitDataLoading] = useState(false);

	const [initialValues, setInitialValues] = useState<GeneralAdvShippingMethodSubmitData>(
		initialShippingValues || {
			allowEmails: true,
			loyaltyRewards: false,
			weeklySpecial: false,
			autoDelivery: false,
			specialMessage: '',
			selectedGuaranteeOption: null
		}
	);

	useEffect(() => {
		getAllGuaranteeOptions();
	}, []);

	const getAllGuaranteeOptions = async () => {
		try {
			const response: GuaranteeOptionsDataType = await getAllGuaranteeOptionsWithOutPagination();
			const options = response.data.map((item: GuaranteeOptionType) => ({
				id: item.id,
				guaranteeName: item.name,
				checked: false
			}));

			setGuaranteeOptionsData(options);
		} catch (error) {
			console.log(error);
		}
	};

	const handleCheckboxChange = (
		index: number,
		setFieldValue: FormikHelpers<GeneralAdvShippingMethodSubmitData>['setFieldValue']
	) => {
		const updatedOptions = guaranteeOptionsData.map((option, idx) => ({
			...option,
			checked: idx === index ? !option.checked : false
		}));
		setGuaranteeOptionsData(updatedOptions);

		// Toggle selectedGuaranteeOption based on checked status
		const selectedId: string | null = updatedOptions[index].checked ? updatedOptions[index].id : null;
		setFieldValue('selectedGuaranteeOption', selectedId);
	};

	const handleSubmit = async (values: GeneralAdvShippingMethodSubmitData) => {
		const data = {
			is_availability_emails: values.allowEmails,
			is_loyalty_rewards: values.loyaltyRewards,
			is_weekly_special: values.weeklySpecial,
			is_auto_delivery: values.autoDelivery,
			special_message: values.specialMessage,
			is_advertisement: 1,
			guarantee_option_id: values.selectedGuaranteeOption
		};

		const id = clickedRowData?.id || '';
		const message: string = isTableMode === 'edit' ? 'Updated successfully' : 'Created successfully';
		setProductSubmitDataLoading(true);
		try {
			if (clickedRowData?.id) {
				await updateGeneralAdvertisementGuaranteeOptions(id, data);
				fetchDataForProfileView();
				setProductSubmitDataLoading(false);
				toast.success(message);
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

	return (
		<div className="min-w-full max-w-[100vw]">
			<Paper className="rounded-[0px] p-[16px]">
				<Formik
					initialValues={initialValues}
					onSubmit={handleSubmit}
				>
					{({ values, setFieldValue }) => (
						<Form>
							<Grid
								container
								spacing={2}
							>
								<Grid
									item
									xs={12}
									className="pt-[10px!important]"
								>
									<CommonHeading title="Guarantee Options" />
								</Grid>
								<Grid
									item
									xs={12}
									className="pt-[5px!important]"
								>
									<Grid
										container
										spacing={2}
									>
										{guaranteeOptionsData.map((option, index) => (
											<Grid
												item
												xl={2}
												lg={3}
												md={4}
												sm={6}
												xs={12}
												key={option.id}
												className="pt-[10px!important]"
											>
												<FormControlLabel
													control={
														<Checkbox
															disabled={isTableMode === 'view'}
															checked={values.selectedGuaranteeOption === option.id}
															onChange={() => handleCheckboxChange(index, setFieldValue)}
															color="primary"
														/>
													}
													label={option.guaranteeName}
												/>
											</Grid>
										))}
									</Grid>
								</Grid>

								{/* Additional Options */}
								<Grid
									item
									xs={12}
									className="pt-[10px!important]"
								>
									<CommonHeading title="Additional Options" />
								</Grid>
								<Grid
									item
									xs={12}
									className="pt-[5px!important]"
								>
									<Grid
										container
										spacing={2}
									>
										<Grid
											item
											xl={2}
											lg={3}
											md={4}
											sm={6}
											xs={12}
											className="pt-[10px!important]"
										>
											<FormControlLabel
												control={
													<Field
														disabled={isTableMode === 'view'}
														as={Checkbox}
														type="checkbox"
														name="allowEmails"
													/>
												}
												label="Allow Availability Emails"
											/>
										</Grid>
										<Grid
											item
											xl={2}
											lg={3}
											md={4}
											sm={6}
											xs={12}
											className="pt-[10px!important]"
										>
											<FormControlLabel
												control={
													<Field
														disabled={isTableMode === 'view'}
														as={Checkbox}
														type="checkbox"
														name="loyaltyRewards"
													/>
												}
												label="Display Loyalty Rewards"
											/>
										</Grid>
										<Grid
											item
											xl={2}
											lg={3}
											md={4}
											sm={6}
											xs={12}
											className="pt-[10px!important]"
										>
											<FormControlLabel
												control={
													<Field
														disabled={isTableMode === 'view'}
														as={Checkbox}
														type="checkbox"
														name="weeklySpecial"
													/>
												}
												label="Enable Weekly Special"
											/>
										</Grid>
										<Grid
											item
											xl={2}
											lg={3}
											md={4}
											sm={6}
											xs={12}
											className="pt-[10px!important]"
										>
											<FormControlLabel
												control={
													<Field
														disabled={isTableMode === 'view'}
														as={Checkbox}
														type="checkbox"
														name="autoDelivery"
													/>
												}
												label="Auto Delivery"
											/>
										</Grid>
									</Grid>
								</Grid>

								{/* Special Message */}
								<Grid
									item
									xs={12}
									className="pt-[10px!important]"
								>
									<Field
										as={TextField}
										fullWidth
										disabled={isTableMode === 'view'}
										label="Special Message"
										placeholder=""
										name="specialMessage"
										multiline
										rows={3}
										variant="outlined"
									/>
								</Grid>

								{/* Optional Submit Button */}
								<Grid
									item
									md={12}
									sm={12}
									xs={12}
									className="flex justify-end items-center gap-[10px] pt-[10px!important]"
								>
									{isTableMode !== 'view' && (
										<Button
											type="submit"
											disabled={loading}
											className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
										>
											{isTableMode === 'edit' ? 'Update' : 'Save'}
											{isProductSubmitDataLoading && (
												<CircularProgress
													className="text-white ml-[5px]"
													size={24}
												/>
											)}
										</Button>
									)}
								</Grid>
							</Grid>
						</Form>
					)}
				</Formik>
			</Paper>
		</div>
	);
}
