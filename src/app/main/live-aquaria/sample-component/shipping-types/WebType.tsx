import React, { useEffect, useState } from 'react';
import { Box, Button, Chip, FormControlLabel, FormGroup, Grid, Switch, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import FormDropdown from '../../../../common/FormComponents/FormDropdown';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import ShippingTypeEditModal from './components/ShippingTypeEditModel';
import NewShippingTypeModel from './components/NewShippingType';
import {
	deleteShippingType,
	fetchAllShippingTypesData,
	updateShippingTypeStatus
} from '../../../../axios/services/live-aquaria-services/shipping-services/ShippingTypeService';
import { ShippingTypeApiResponse, ShippingTypeModifiedData, ShippingTypeResponse } from './types/ShippingTypes';
import ShippingTypeActiveComp from './components/ShippingTypeActiveComp';
import ShippingTypeDeleteAlertForm from './components/ShippingTypeDeleteAlertForm';

function WebType() {
	const { t } = useTranslation('shippingTypes');

	const [pageNo, setPageNo] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count, setCount] = useState<number>(100);

	const [isOpenShippingTypeViewModal, setIsOpenShippingTypeViewModal] = useState<boolean>(false);
	const toggleShippingTypeViewModal = () => setIsOpenShippingTypeViewModal(!isOpenShippingTypeViewModal);

	const [isOpenShippingTypeEditModal, setIsOpenShippingTypeEditModal] = useState<boolean>(false);
	const toggleShippingTypeEditModal = () => setIsOpenShippingTypeEditModal(!isOpenShippingTypeEditModal);

	const [isOpenNewShippingTypeModal, setIsOpenNewShippingTypeModal] = useState<boolean>(false);
	const toggleNewShippingTypeModal = () => setIsOpenNewShippingTypeModal(!isOpenNewShippingTypeModal);

	const [sampleData, setSampleData] = useState<ShippingTypeModifiedData[]>([]);
	const [isTableLoading, setTableLoading] = useState(false);
	const [selectedActiveRowData, setSelectedActiveRowData] = useState<ShippingTypeModifiedData>(null);
	const [selectedDeleteRowData, setSelectedDeleteRowData] = useState<ShippingTypeModifiedData>(null);
	const [selectedViewRowData, setSelectedViewRowData] = useState<ShippingTypeModifiedData>(null);
	const [selectedEditRowData, setSelectedEditRowData] = useState<ShippingTypeModifiedData>(null);
	const [isOpenActiveModal, setOpenActiveModal] = useState(false);
	const [isOpenDeleteModal, setOpenDeleteModal] = useState(false);
	const toggleActiveModal = () => setOpenActiveModal(!isOpenActiveModal);
	const toggleDeleteModal = () => setOpenDeleteModal(!isOpenDeleteModal);

	useEffect(() => {
		fetchAllShippingTypes();
	}, [pageNo, pageSize]);

	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (newPageSize: number) => {
		setPageSize(newPageSize);
	};

	const tableColumns = [
		{
			title: t('SHIPPING_TYPE_NAME'),
			field: 'shipping_type_name',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('PRODUCT_CATEGORY'),
			field: 'product_category',
			render: (rowData: ShippingTypeModifiedData) => (
				<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
					{rowData.product_category.map((category: string, index: number) => (
						<Chip
							className="text-[11px] [&>*]:!text-primaryBlueLight font-700 capitalize bg-primaryBlueLight/10"
							size="small"
							key={index}
							label={category}
						/>
					))}
				</Box>
			)
		},
		{
			title: t('ALLOW_TRANSIT_DELAY'),
			field: 'allow_transit_delay',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('ACTIVE'),
			field: 'active',
			cellStyle: {
				padding: '4px 8px'
			},
			render: (rowData: ShippingTypeModifiedData) => (
				<FormGroup>
					<FormControlLabel
						control={
							<Switch
								checked={rowData.active}
								onClick={() => handleSwitchClick(rowData)}
								aria-label="active switch"
								size="small"
								sx={{
									'& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
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

	const handleSwitchClick = (rowData: ShippingTypeModifiedData) => {
		setSelectedActiveRowData(rowData);
		toggleActiveModal();
	};

	const handleConfirmStatusChange = async () => {
		toggleActiveModal();

		const id = selectedActiveRowData?.id ?? null;
		try {
			const data = {
				is_active: !selectedActiveRowData?.active
			};
			await updateShippingTypeStatus(id, data);
			fetchAllShippingTypes();
			toast.success('Status updated successfully');
		} catch (error) {
			toast.error('Error updating status:');
		}
	};

	const fetchAllShippingTypes = async () => {
		setTableLoading(true);
		try {
			const response: ShippingTypeApiResponse = await fetchAllShippingTypesData(pageNo, pageSize);

			const transformedData: ShippingTypeModifiedData[] = response.data.map((item: ShippingTypeResponse) => ({
				...item,
				shipping_type_name: item.name,
				product_category: item.item_category.map((category: { name: string }) => category.name),
				create_date: item.created_at.slice(0, 10),
				allow_transit_delay: item.allow_transit_delay === 1 ? 'Allowed' : 'Disallowed',
				active: item.is_active === 1
			}));

			setSampleData(transformedData);
			setCount(count);
			setTableLoading(false);
		} catch (error) {
			toast.error('Error fetching data');
			setTableLoading(false);
		}
	};

	const handleRowDelete = async (rowData: ShippingTypeModifiedData) => {
		setSelectedDeleteRowData(rowData);
		toggleDeleteModal();
	};

	const handleAlertForm = async () => {
		toggleDeleteModal();
		const id = selectedDeleteRowData?.id ?? null;
		try {
			await deleteShippingType(id);
			fetchAllShippingTypes();
			toast.success('Shipping Type deleted successfully');
		} catch (e) {
			toast.error('Error deleting Shipping Type');
		}
	};

	const handleView = async (rowData: ShippingTypeModifiedData) => {
		setSelectedViewRowData(rowData);
		toggleShippingTypeViewModal();
	};

	const handleEdit = async (rowData: ShippingTypeModifiedData) => {
		setSelectedEditRowData(rowData);
		toggleShippingTypeEditModal();
	};

	const handleNewShippingType = () => {
		toggleNewShippingTypeModal();
	};

	const handleSubmit1 = (values) => {};

	return (
		<div className="min-w-full max-w-[100vw]">
			<NavigationViewComp title="Shipping / Shipping Types" />

			<Formik
				initialValues={{ shippingType: '', category: '', status: '' }}
				validationSchema={null}
				onSubmit={handleSubmit1}
			>
				{/* eslint-disable-next-line unused-imports/no-unused-vars */}
				{({ values }) => (
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
								<Typography className="formTypography">{t('SHIPPING_TYPE')}</Typography>
								<FormDropdown
									name="shippingType"
									id="shippingType"
									placeholder=""
									optionsValues={[]}
									disabled={false}
									onChange={() => {}}
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
								<FormDropdown
									name="category"
									id="category"
									placeholder=""
									optionsValues={[]}
									disabled={false}
									onChange={() => {}}
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
								<FormDropdown
									name="status"
									id="status"
									placeholder=""
									optionsValues={[]}
									disabled={false}
									onChange={() => {}}
								/>
							</Grid>

							<Grid
								item
								xs={12}
								sm={6}
								md={12}
								lg={3}
								xl={6}
								className="flex justify-end items-center gap-[10px] pt-[5px!important]"
							>
								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
									type="submit"
									variant="contained"
									size="medium"
									disabled={false}
								>
									{t('FILTER_ALL')}
								</Button>

								<Button
									className="min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
									type="button"
									variant="contained"
									size="medium"
									onClick={handleNewShippingType}
								>
									{t('NEW_SHIPPING_TYPE')}
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
						tableColumns={tableColumns}
						handlePageChange={handlePageChange}
						handlePageSizeChange={handlePageSizeChange}
						handleCommonSearchBar={null}
						pageSize={pageSize}
						disableColumnFiltering
						loading={isTableLoading}
						setPageSize={setPageSize}
						pageIndex={pageNo}
						searchByText=""
						count={count}
						exportToExcel={null}
						externalAdd={null}
						externalEdit={null}
						externalView={null}
						selection={false}
						selectionExport={null}
						isColumnChoser
						disableSearch
						records={sampleData}
						tableRowViewHandler={handleView}
						tableRowEditHandler={handleEdit}
						tableRowDeleteHandler={handleRowDelete}
					/>
				</Grid>
			</Grid>

			{/* New Shipping Type Modal */}
			{isOpenNewShippingTypeModal && (
				<NewShippingTypeModel
					isOpen={isOpenNewShippingTypeModal}
					toggleModal={toggleNewShippingTypeModal}
					clickedRowData={{}}
					fetchAllShippingTypes={fetchAllShippingTypes}
				/>
			)}

			{/* View Modal */}
			{isOpenShippingTypeViewModal && (
				<ShippingTypeEditModal
					isOpen={isOpenShippingTypeViewModal}
					toggleModal={toggleShippingTypeViewModal}
					clickedRowData={selectedViewRowData}
					isTableMode="view"
					fetchAllShippingTypes={fetchAllShippingTypes}
				/>
			)}

			{/* Edit Modal */}
			{isOpenShippingTypeEditModal && (
				<ShippingTypeEditModal
					isOpen={isOpenShippingTypeEditModal}
					toggleModal={toggleShippingTypeEditModal}
					clickedRowData={selectedEditRowData}
					isTableMode="edit"
					fetchAllShippingTypes={fetchAllShippingTypes}
				/>
			)}

			{isOpenActiveModal && (
				<ShippingTypeActiveComp
					toggleModal={toggleActiveModal}
					isOpen={isOpenActiveModal}
					clickedRowData={selectedActiveRowData}
					handleAlertForm={handleConfirmStatusChange}
				/>
			)}

			{isOpenDeleteModal && (
				<ShippingTypeDeleteAlertForm
					toggleModal={toggleDeleteModal}
					isOpen={isOpenDeleteModal}
					clickedRowData={selectedDeleteRowData}
					handleAlertForm={handleAlertForm}
				/>
			)}
		</div>
	);
}

export default WebType;
