import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { Autocomplete, Chip, Grid, TextField } from '@mui/material';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import Typography from '@mui/material/Typography';
import useDebounce from 'app/shared-components/useDebounce';
import {
	fetchAllProductList,
	getAllAdvanceFilteringGeneralAdvertisementWithPagination,
	updateGeneralDetails
} from '../../../../../axios/services/live-aquaria-services/general-advertisement-services/GeneralAdvertisementService';

import MaterialTableWrapper from '../../../../../common/tableComponents/MaterialTableWrapper';
import {
	GeneralAdvModifiedDataType,
	GeneralAdvResponseType,
	GeneralAdvSearchSubmitData
} from '../types/general-advertisement-types';

import GeneralAdvertisementActiveComp from './GeneralAdvertisementActiveComp';
import CustomFormTextField from '../../../../../common/FormComponents/CustomFormTextField';
import { dropDown } from '../../../customer/customer-profile/customer-types/CustomerTypes';

interface GeneralAdvertisementViewProps {
	onCreateClick?: () => void;
	onUpdateClick?: () => void;
	onViewClick?: (rowData: GeneralAdvModifiedDataType, isTableMode: string) => void;
	onEditClick?: (rowData: GeneralAdvModifiedDataType, isTableMode: string) => void;
}

function GeneralAdvertisementView({
	onCreateClick,
	onViewClick,
	onEditClick,
	onUpdateClick
}: GeneralAdvertisementViewProps) {
	const { t } = useTranslation('sampleComponent');

	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count, setCount] = useState(100);
	const [isTableLoading, setTableLoading] = useState(false);
	const [sampleTypes, setSampleTypes] = useState([]);
	const [tableActiveRowData, setTableActiveRowData] = useState({} as GeneralAdvModifiedDataType);
	const [isOpenActiveMaterialsModal, setOpenActiveMaterialsModal] = useState(false);
	const [tableData, setTableData] = useState<GeneralAdvModifiedDataType[]>([]);
	const toggleActiveMaterialsModal = () => setOpenActiveMaterialsModal(!isOpenActiveMaterialsModal);
	const schema = yup.object().shape({});
	const [filteredValues, setFilteredValues] = useState<GeneralAdvSearchSubmitData>({
		productId: null,
		productName: null,
		category: null,
		status: null
	});
	const debouncedFilter = useDebounce<GeneralAdvSearchSubmitData>(filteredValues, 1000);

	useEffect(() => {
		setSampleTypes([
			{ label: 'Pending', value: '0' },
			{ label: 'Approved', value: '1' },
			{ label: 'Rejected', value: '2' },
			{ label: 'Published', value: '3' },
			{ label: 'Sold Out', value: '4' }
		]);
	}, []);

	useEffect(() => {
		if (debouncedFilter) changePageNoOrPageSize(filteredValues);
	}, [debouncedFilter]);

	useEffect(() => {
		changePageNoOrPageSize(filteredValues);
	}, [pageNo, pageSize]);

	const loadAllPublishedGeneralAdvertisements = async () => {
		setTableLoading(true);
		try {
			const response: GeneralAdvResponseType = await fetchAllProductList(pageNo, pageSize);

			setCount(response.meta.total);

			const modifiedData: GeneralAdvModifiedDataType[] = response?.data?.map((item) => ({
				...item,
				itemNumber: item?.id,
				code: item?.code,
				productName: item?.common_name,
				category: item?.item_category?.name || 'No Category',
				description: item?.short_description,
				active: item?.is_active === 1
			}));

			setTableData(modifiedData);
			setTableLoading(false);
		} catch (error) {
			setTableLoading(false);
		}
	};

	const tableColumns = [
		{
			title: t('ITEM_NUMBER'),
			field: 'itemCode',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('ITEM_NUMBER'),
			field: 'code',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('PRODUCT_NAME'),
			field: 'productName',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('CATEGORY'),
			field: 'category',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('STATUS'),
			field: 'status',
			cellStyle: {
				padding: '2px 4px'
			},
			render: (rowData: GeneralAdvModifiedDataType, index: number) => {
				const statusLabels = ['Pending', 'Approved', 'Rejected', 'Published', 'Sold Out'];
				let chipColor;
				switch (rowData?.status) {
					case 0:
						chipColor = 'bg-orange-50 [&>*]:!text-orange-800';
						break;
					case 1:
						chipColor = 'bg-green-50 [&>*]:!text-green-800';
						break;
					case 2:
						chipColor = 'bg-red-50 [&>*]:!text-red-800';
						break;
					case 3:
						chipColor = 'bg-blue-50 [&>*]:!text-blue-800';
						break;
					default:
						chipColor = 'bg-gray-50 [&>*]:!text-gray-800';
				}

				return (
					<div className="flex flex-wrap gap-[5px]">
						<span>
							<Chip
								className={`min-w-[85px] ${chipColor} text-[10px] sm:text-[12px] font-[500] px-[6px] py-[2px]`}
								size="small"
								key={index}
								label={statusLabels[rowData.status] || 'Unknown'}
							/>
						</span>
					</div>
				);
			}
		},
		{
			title: t('ACTIVE'),
			field: 'active',
			render: (rowData: GeneralAdvModifiedDataType, index) => (
				<FormGroup>
					<FormControlLabel
						control={
							<Switch
								checked={rowData.active}
								onChange={handleSwitchChange(rowData.id, rowData)}
								aria-label="login switch"
								size="small"
								sx={{
									'& .muiltr-kpgjex-MuiButtonBase-root-MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track':
										{
											backgroundColor: '#387ed4'
										}
								}}
							/>
						}
						label=""
					/>
				</FormGroup>
			)
		}
	];

	const handleSwitchChange = (index, rowData: GeneralAdvModifiedDataType) => async (event) => {
		setTableActiveRowData(rowData);
		toggleActiveMaterialsModal();
	};

	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (pageSize: number) => {
		setPageSize(pageSize);
	};

	const tableRowEditHandler = (rowData: GeneralAdvModifiedDataType) => {
		// if (rowData?.status === 0 || rowData?.status === 2){
		onEditClick(rowData, 'edit');
		// }else {
		//	toast.error('The edit feature is only enabled for rows with "Pending" or "Rejected" status');
		// }
	};

	const tableRowViewHandler = (rowData: GeneralAdvModifiedDataType) => {
		onViewClick(rowData, 'view');
	};

	const handleActiveAlertForm = async () => {
		const id: string = tableActiveRowData.id ? tableActiveRowData.id : '';
		setTableLoading(true);
		const requestData = {
			is_active: tableActiveRowData.active === true ? 0 : 1
		};
		toggleActiveMaterialsModal();
		try {
			const response = await updateGeneralDetails(id, requestData);
			setTableLoading(false);
			toast.success('Successfully');
			loadAllPublishedGeneralAdvertisements();
		} catch (error) {
			setTableLoading(false);
			toast.error('fail');
		}
	};

	const changePageNoOrPageSize = async (filteredValues: GeneralAdvSearchSubmitData) => {
		setTableLoading(true);
		try {
			const response: GeneralAdvResponseType = await getAllAdvanceFilteringGeneralAdvertisementWithPagination(
				filteredValues.productId,
				filteredValues.productName,
				filteredValues.category,
				filteredValues.status,
				pageNo,
				pageSize
			);
			setCount(response.meta.total);

			const modifiedData: GeneralAdvModifiedDataType[] = response?.data?.map((item) => ({
				...item,
				itemNumber: item?.id,
				code: item?.code,
				productName: item?.common_name,
				category: item?.item_category?.name || 'No Category',
				description: item?.short_description,
				active: item?.is_active === 1
			}));

			setTableData(modifiedData);
			setTableLoading(false);
		} catch (error) {
			setTableLoading(false);
		}
	};
	const changeProductId = async (value: string, form: FormikProps<GeneralAdvSearchSubmitData>) => {
		form.setFieldValue('productId', value);
		setFilteredValues({
			...filteredValues,
			productId: value
		});
	};

	const changeProductName = async (value: string, form: FormikProps<GeneralAdvSearchSubmitData>) => {
		form.setFieldValue('productName', value);
		setFilteredValues({
			...filteredValues,
			productName: value
		});
	};

	const changeCategory = async (value: string, form: FormikProps<GeneralAdvSearchSubmitData>) => {
		form.setFieldValue('category', value);
		setFilteredValues({
			...filteredValues,
			category: value
		});
	};

	const changeStatus = async (value: string) => {
		setFilteredValues({
			...filteredValues,
			status: value
		});
	};
	const handleClearForm = (resetForm: FormikHelpers<GeneralAdvSearchSubmitData>['resetForm']) => {
		resetForm();
		setFilteredValues({
			productId: null,
			productName: null,
			category: null,
			status: null
		});
	};

	return (
		<div className="min-w-full max-w-[100vw]">
			<Formik
				initialValues={{
					productId: '',
					productName: '',
					category: '',
					status: ''
				}}
				validationSchema={schema}
				onSubmit={(values: GeneralAdvSearchSubmitData) => {
					// console.log(values);
				}}
			>
				{({ values, setFieldValue, isValid, resetForm }) => (
					<Form>
						<Grid
							container
							spacing={2}
							className="pt-[10px] pr-[30px] mx-auto"
						>
							<Grid
								item
								xs={12}
								sm={6}
								md={4}
								lg={3}
								xl={2}
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="formTypography">{t('PRODUCT_ID')}</Typography>
								<CustomFormTextField
									name="productId"
									id="productId"
									type="text"
									placeholder=""
									disabled={false}
									changeInput={changeProductId}
								/>
							</Grid>

							<Grid
								item
								xs={12}
								sm={6}
								md={4}
								lg={3}
								xl={2}
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="formTypography">{t('PRODUCT_NAME')}</Typography>
								<CustomFormTextField
									name="productName"
									id="productName"
									type="text"
									placeholder=""
									disabled={false}
									changeInput={changeProductName}
								/>
							</Grid>

							<Grid
								item
								xs={12}
								sm={6}
								md={4}
								lg={3}
								xl={2}
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="formTypography">{t('CATEGORY')}</Typography>
								<CustomFormTextField
									name="category"
									id="category"
									type="text"
									placeholder=""
									disabled={false}
									changeInput={changeCategory}
								/>
							</Grid>

							<Grid
								item
								xs={12}
								sm={6}
								md={4}
								lg={3}
								xl={2}
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="formTypography">{t('STATUS')}</Typography>
								<Autocomplete
									size="small"
									disablePortal
									options={sampleTypes}
									className="w-full"
									value={values?.status || null}
									renderInput={(params) => (
										<TextField
											{...params}
											name="status"
											label=""
										/>
									)}
									onChange={(event: React.ChangeEvent<HTMLInputElement>, value: dropDown | null) => {
										setFieldValue('status', value?.label || null);
										changeStatus(value?.value || null);
									}}
								/>
							</Grid>

							<Grid
								item
								xs={12}
								sm={12}
								md={8}
								lg={12}
								xl={4}
								className="flex flex-wrap justify-between items-end gap-[10px] pt-[10px!important]"
							>
								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
									type="submit"
									variant="contained"
									size="medium"
									disabled={false}
									onClick={() => handleClearForm(resetForm)}
								>
									{t('CLEAR_FILTERS')}
								</Button>
								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
									type="button"
									variant="contained"
									size="medium"
									disabled={false}
									onClick={onCreateClick}
								>
									{t('ADD_NEW_ADVERTISEMENT')}
								</Button>
							</Grid>
						</Grid>
					</Form>
				)}
			</Formik>

			<Grid
				container
				spacing={2}
				className="pt-[20px] pr-[30px] mx-auto"
			>
				<Grid
					item
					md={12}
					sm={12}
					xs={12}
					className="pt-[5px!important]"
				>
					<MaterialTableWrapper
						title=""
						filterChanged={null}
						handleColumnFilter={null}
						tableColumns={tableColumns.filter((column) => column.field !== 'itemCode')}
						handlePageChange={handlePageChange}
						handlePageSizeChange={handlePageSizeChange}
						handleCommonSearchBar={null}
						pageSize={pageSize}
						disableColumnFiltering
						pageIndex={pageNo}
						setPageSize={setPageSize}
						searchByText=""
						loading={isTableLoading}
						count={count}
						exportToExcel={null}
						handleRowDeleteAction={null}
						externalAdd={null}
						externalEdit={null}
						externalView={null}
						selection={false}
						selectionExport={null}
						isColumnChoser
						records={tableData}
						tableRowEditHandler={tableRowEditHandler}
						tableRowViewHandler={tableRowViewHandler}
						disableSearch
					/>
				</Grid>
			</Grid>

			{isOpenActiveMaterialsModal && (
				<GeneralAdvertisementActiveComp
					isOpen={isOpenActiveMaterialsModal}
					toggleModal={toggleActiveMaterialsModal}
					clickedRowData={tableActiveRowData}
					handleAlertForm={handleActiveAlertForm}
				/>
			)}
		</div>
	);
}

export default GeneralAdvertisementView;
