// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Button, Grid } from '@mui/material';
import { Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import VehicleEditModel from './components/GuidelineManagementEditModel';
import NewVehicleManagement from './components/GuidelineEditModel';
import {
	deleteShippingType,
	fetchAllShippingTypesData, fetchAllVehicleData,
	updateShippingTypeStatus
} from '../../../../axios/services/live-aquaria-services/shipping-services/ShippingTypeService';
import { GuidelineType, GuideType, ShippingTypeModifiedData, VehicleResp, WebTypeResp } from './types/GuidelineTypes';
import NewGuidelineActiveComp from './components/NewGuidelineActiveComp';
import NewGuidelineDeleteAlertForm from './components/NewGuidelineDeleteAlertForm';
import Chip from '@mui/material/Chip';
import {
	deleteGuideline,
	fetchAllGuideLines
} from '../../../../axios/services/mega-city-services/guideline-services/GuidelineService';
import GuidelineEditModel from './components/GuidelineEditModel';

function GuidelineManagement() {
	const { t } = useTranslation('GuidelineTypes');

	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count, setCount] = useState<number>(100);

	const [isOpenShippingTypeViewModal, setIsOpenShippingTypeViewModal] = useState<boolean>(false);
	const toggleShippingTypeViewModal = () => setIsOpenShippingTypeViewModal(!isOpenShippingTypeViewModal);

	const [isOpenShippingTypeEditModal, setIsOpenShippingTypeEditModal] = useState<boolean>(false);
	const toggleShippingTypeEditModal = () => setIsOpenShippingTypeEditModal(!isOpenShippingTypeEditModal);

	const [isOpenNewShippingTypeModal, setIsOpenNewShippingTypeModal] = useState<boolean>(false);
	const toggleNewShippingTypeModal = () => setIsOpenNewShippingTypeModal(!isOpenNewShippingTypeModal);

	const [sampleData, setSampleData] = useState<WebTypeResp[]>();
	const [isTableLoading, setTableLoading] = useState(false);
	const [selectedActiveRowData, setSelectedActiveRowData] = useState<ShippingTypeModifiedData>(null);
	const [selectedDeleteRowData, setSelectedDeleteRowData] = useState<GuideType>(null);
	const [selectedViewRowData, setSelectedViewRowData] = useState<ShippingTypeModifiedData>(null);
	const [selectedEditRowData, setSelectedEditRowData] = useState<ShippingTypeModifiedData>(null);
	const [isOpenActiveModal, setOpenActiveModal] = useState(false);
	const [isOpenDeleteModal, setOpenDeleteModal] = useState(false);
	const toggleActiveModal = () => setOpenActiveModal(!isOpenActiveModal);
	const toggleDeleteModal = () => setOpenDeleteModal(!isOpenDeleteModal);

	useEffect(() => {
		fetchAllGuidelines().then(r => (r));
	}, [pageNo, pageSize]);

	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (newPageSize: number) => {
		setPageSize(newPageSize);
	};

	const tableColumns = [{
		title: t('Guidance No'), field: 'guidanceId', cellStyle: {
			padding: '6px 8px'
		}
	}, {
		title: t('Title'), field: 'title', cellStyle: {
			padding: '4px 8px'
		}
	}, {
		title: t('Description'), field: 'description', cellStyle: {
			padding: '4px 8px'
		}
	},{
		title: t('Category'),
		field: 'category',
		cellStyle: {
			padding: '4px 8px'
		},
		render: rowData => {
			const categoryColors = {
				Safety: { text: '#1E88E5', bg: '#E3F2FD' },     // Blue tones
				Maintenance: { text: '#43A047', bg: '#E8F5E9' }, // Green tones
				Training: { text: '#e87b22', bg: '#f6e8dc' },    // Yellow tones
				Pricing: { text: '#E53935', bg: '#FFEBEE' }      // Red tones
			};

			const { text, bg } = categoryColors[rowData.category] || {
				text: '#424242', bg: '#E0E0E0'
			}; // Default color for unknown categories

			return (
				<span
					style={{
						display: 'inline-block',
						padding: '4px 12px',
						borderRadius: '16px',
						color: text,
						backgroundColor: bg,
						fontSize: '12px',
						fontWeight: 500,
						textAlign: 'center',
						minWidth: '70px'
					}}
				>
                {t(rowData.category)}
            </span>
			);
		}
	},
		{
			title: t('Related To'), field: 'relatedTo', cellStyle: {
				padding: '4px 8px'
			}
		},

		{
			title: t('Priority'),
			field: 'priority',
			cellStyle: {
				padding: '4px 8px'
			},
			render: rowData => {
				const priorityColors = {
					Medium: { text: '#1E88E5', bg: '#E3F2FD' },     // Blue tones
					High: { text: '#E53935', bg: '#FFEBEE' }      // Red tones
				};

				const { text, bg } = priorityColors[rowData.priority] || {
					text: '#424242', bg: '#E0E0E0'
				}; // Default color for unknown priorities

				return (
					<span
						style={{
							display: 'inline-block',
							padding: '4px 12px',
							borderRadius: '16px',
							color: text,
							backgroundColor: bg,
							fontSize: '12px',
							fontWeight: 500,
							textAlign: 'center',
							minWidth: '70px'
						}}
					>
                {t(rowData.priority)}
            </span>
				);
			}
		}
	];

	const handleConfirmStatusChange = async () => {
		toggleActiveModal();

		const id = selectedActiveRowData?.id ?? null;
		try {
			const data = {
				is_active: !selectedActiveRowData?.active
			};
			await updateShippingTypeStatus(id, data);
			await fetchAllGuidelines();
			toast.success('Status updated successfully');
		} catch (error) {
			toast.error('Error updating status:');
		}
	};

	const fetchAllGuidelines = async () => {
		setTableLoading(true);
		try {
			const response = await fetchAllGuideLines(pageNo, pageSize);

			console.log('guideline details:', response);

			if (response && Array.isArray(response.result)) {
				const transformedData: GuidelineType[] = response.result.map((item) => ({
					...item
				}));

				setSampleData(transformedData);
			} else {
				console.error('Unexpected data format:', response);
				setSampleData([]);
			}
		} catch (error) {
			console.error('Error fetching shipping types:', error);
			toast.error('Error fetching data');
			setSampleData([]);
		} finally {
			setTableLoading(false);
		}
	};


	const handleRowDelete = async (rowData: GuideType) => {
		setSelectedDeleteRowData(rowData);
		toggleDeleteModal();
	};

	const handleAlertForm = async () => {
		toggleDeleteModal();
		console.log('selectedDeleteRowData:', selectedDeleteRowData);
		try {
			await deleteGuideline(selectedDeleteRowData.guidanceId);
			await fetchAllGuidelines();
			toast.success('Guideline deleted successfully');
		} catch (e) {
			toast.error('Error deleting Guideline');
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

	const handleSubmit1 = (values) => {
	};

	return (<div className="min-w-full max-w-[100vw]">
		<NavigationViewComp title="Guidelines" />

		<Formik
			initialValues={{ shippingType: '', category: '', status: '' }}
			validationSchema={null}
			onSubmit={handleSubmit1}
		>
			{/* eslint-disable-next-line unused-imports/no-unused-vars */}
			{({ values }) => (<Form>
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
						{/*<Button*/}
						{/*	className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"*/}
						{/*	type="submit"*/}
						{/*	variant="contained"*/}
						{/*	size="medium"*/}
						{/*	disabled={false}*/}
						{/*>*/}
						{/*	{t('FILTER_ALL')}*/}
						{/*</Button>*/}

						<Button
							className="min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-yellow-800 hover:bg-yellow-800/80"
							type="button"
							variant="contained"
							size="medium"
							onClick={handleNewShippingType}
						>
							{t('Create Guidelines')}
						</Button>
					</Grid>
				</Grid>
			</Form>)}
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
					title="Guideline Management Table"
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
					records={sampleData}
					tableRowViewHandler={handleView}
					tableRowEditHandler={handleEdit}
					tableRowDeleteHandler={handleRowDelete}
				/>
			</Grid>
		</Grid>

		{/* New Shipping Type Modal */}
		{isOpenNewShippingTypeModal && (<GuidelineEditModel
			isOpen={isOpenNewShippingTypeModal}
			toggleModal={toggleNewShippingTypeModal}
			isTableMode="new"
			clickedRowData={{}}
			fetchAllShippingTypes={fetchAllGuidelines}
		/>)}

		{/* View Modal */}
		{isOpenShippingTypeViewModal && (<NewVehicleManagement
			isOpen={isOpenShippingTypeViewModal}
			toggleModal={toggleShippingTypeViewModal}
			clickedRowData={selectedViewRowData}
			isTableMode="view"
			fetchAllShippingTypes={fetchAllGuidelines}
		/>)}

		{/* Edit Modal */}
		{isOpenShippingTypeEditModal && (<NewVehicleManagement
			isOpen={isOpenShippingTypeEditModal}
			toggleModal={toggleShippingTypeEditModal}
			clickedRowData={selectedEditRowData}
			isTableMode="edit"
			fetchAllShippingTypes={fetchAllGuidelines}
		/>)}

		{isOpenActiveModal && (<NewGuidelineActiveComp
			toggleModal={toggleActiveModal}
			isOpen={isOpenActiveModal}
			clickedRowData={selectedActiveRowData}
			handleAlertForm={handleConfirmStatusChange}
		/>)}

		{isOpenDeleteModal && (<NewGuidelineDeleteAlertForm
			toggleModal={toggleDeleteModal}
			isOpen={isOpenDeleteModal}
			clickedRowData={selectedDeleteRowData}
			handleAlertForm={handleAlertForm}
		/>)}
	</div>);
}

export default GuidelineManagement;
