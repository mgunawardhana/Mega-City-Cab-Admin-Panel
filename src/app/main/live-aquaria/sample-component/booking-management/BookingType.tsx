// @ts-nocheck
// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import ShippingTypeEditModal from './components/ShippingTypeEditModel';
import NewShippingTypeModel from './components/NewShippingType';
import {
	fetchAllBookings,
	updateShippingTypeStatus
} from '../../../../axios/services/live-aquaria-services/shipping-services/ShippingTypeService';
import { BookingDetails, WebTypeResp } from './types/ShippingTypes';
import ShippingTypeActiveComp from './components/ShippingTypeActiveComp';
import ShippingTypeDeleteAlertForm from './components/ShippingTypeDeleteAlertForm';
import DownloadIcon from '@mui/icons-material/Download';
import CircularProgress from '@mui/material/CircularProgress';
import { axiosApiAuth } from '../../../../axios/axios_instances';
import TextFormField from '../../../../common/FormComponents/FormTextField';
import SearchIcon from '@mui/icons-material/Search';
import { handleAdvancedFiltrationAPI } from '../../../../axios/services/mega-city-services/bookings/BookingService';

interface AdvanceFilteringTypes {
	bookingDate: string;
	createdDate: string;
	pickupLocation: string;
	dropOffLocation: string;
	carNumber: string;
	driverName: string;
	status: string;
}

function BookingType() {
	const { t } = useTranslation('shippingTypes');

	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count, setCount] = useState<number>(100);
	const [isDownloading, setIsDownloading] = useState(false);

	const [isOpenShippingTypeViewModal, setIsOpenShippingTypeViewModal] = useState<boolean>(false);
	const toggleShippingTypeViewModal = () => setIsOpenShippingTypeViewModal(!isOpenShippingTypeViewModal);

	const [isOpenShippingTypeEditModal, setIsOpenShippingTypeEditModal] = useState<boolean>(false);
	const toggleShippingTypeEditModal = () => setIsOpenShippingTypeEditModal(!isOpenShippingTypeEditModal);

	const [isOpenNewShippingTypeModal, setIsOpenNewShippingTypeModal] = useState<boolean>(false);
	const toggleNewShippingTypeModal = () => setIsOpenNewShippingTypeModal(!isOpenNewShippingTypeModal);

	const [sampleData, setSampleData] = useState<WebTypeResp[]>();
	const [isTableLoading, setTableLoading] = useState(false);
	const [selectedActiveRowData, setSelectedActiveRowData] = useState<BookingDetails>(null);
	const [selectedDeleteRowData, setSelectedDeleteRowData] = useState<BookingDetails>(null);
	const [selectedViewRowData, setSelectedViewRowData] = useState<BookingDetails>(null);
	const [selectedEditRowData, setSelectedEditRowData] = useState<BookingDetails>(null);
	const [isOpenActiveModal, setOpenActiveModal] = useState(false);
	const [isOpenDeleteModal, setOpenDeleteModal] = useState(false);
	const toggleActiveModal = () => setOpenActiveModal(!isOpenActiveModal);
	const toggleDeleteModal = () => setOpenDeleteModal(!isOpenDeleteModal);

	useEffect(() => {
		fetchAllShippingTypes().then(r => (r));
	}, [pageNo, pageSize]);

	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (newPageSize: number) => {
		setPageSize(newPageSize);
	};

	const tableColumns = [{
		title: t('Booking Id'), field: 'bookingNumber', cellStyle: {
			padding: '6px 8px'
		}
	}, {
		title: t('Customer Name'), field: 'customerName', cellStyle: {
			padding: '4px 8px'
		}
	}, {
		title: t('Driver Name'), field: 'driverId', cellStyle: {
			padding: '4px 8px'
		}
	}, {
		title: t('Time Estimation'), field: 'estimatedTime', cellStyle: {
			padding: '4px 8px'
		}
	}, {
		title: t('Distance'), field: 'distance', cellStyle: {
			padding: '4px 8px'
		}
	}, {
		title: t('Tax'), field: 'taxes', cellStyle: {
			padding: '4px 8px'
		}
	}, {
		title: t('Cost'), field: 'totalAmount', cellStyle: {
			padding: '4px 8px'
		}
	}, {
		title: t('Payment Status'), field: 'status', cellStyle: {
			padding: '4px 8px'
		}, render: rowData => {
			const statusColors = {
				PENDING: { text: '#FF9800', background: '#FFF3E0' },
				CANCELLED: { text: '#F44336', background: '#FFEBEE' },
				COMPLETED: { text: '#4CAF50', background: '#E8F5E9' },
				CLOSED: { text: '#9E9E9E', background: '#F5F5F5' }
			};

			const status = rowData.status || 'PENDING';
			const colors = statusColors[status] || statusColors.PENDING;

			return (<span
				style={{
					display: 'inline-block',
					padding: '4px 12px',
					borderRadius: '16px',
					color: colors.text,
					backgroundColor: colors.background,
					fontSize: '12px',
					fontWeight: 500,
					textAlign: 'center',
					minWidth: '80px'
				}}
			>
                {t(status)}
            </span>);
		}
	}];

	const handleConfirmStatusChange = async () => {
		toggleActiveModal();

		const id = selectedActiveRowData?.id ?? null;
		try {
			const data = {
				is_active: !selectedActiveRowData?.active
			};
			await updateShippingTypeStatus(id, data);
			await fetchAllShippingTypes();
			toast.success('Status updated successfully');
		} catch (error) {
			toast.error('Error updating status:');
		}
	};


	const exportAsExcel = async () => {
		setIsDownloading(true);
		try {
			const response = await axiosApiAuth.get('api/v1/booking/export', { responseType: 'blob' });
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', 'bookings.xlsx');
			document.body.appendChild(link);
			link.click();
			link.remove();
		} catch (error) {
			console.error('Error fetching the Excel file:', error);
			toast.error('Error downloading the Excel file');
		} finally {
			setIsDownloading(false);
		}
	};

	const fetchAllShippingTypes = async () => {
		setSampleData([]);
		setTableLoading(true);
		try {
			const response = await fetchAllBookings(pageNo, pageSize);
			if (response && Array.isArray(response.result)) {
				const transformedData: WebTypeResp[] = response.result.map((item) => ({
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

	const handleAdvancedFiltration = async (values: AdvanceFilteringTypes) => {
		setSampleData([]);
		console.log('Advanced Filtration Values:', {
			bookingDate: values.bookingDate,
			createdDate: values.createdDate,
			pickupLocation: values.pickupLocation,
			dropOffLocation: values.dropOffLocation,
			carNumber: values.carNumber,
			driverName: values.driverName,
			status: values.status
		});

		const response = await handleAdvancedFiltrationAPI(values.bookingDate, values.createdDate, values.pickupLocation, values.dropOffLocation, values.carNumber, values.driverName, values.status);
		if (response && Array.isArray(response.result)) {
			const transformedData: WebTypeResp[] = response.result.map((item) => ({
				...item
			}));
			setSampleData(transformedData);
		} else {
			console.error('Unexpected data format:', response);
			fetchAllShippingTypes();
		}
	};

	const handleRowDelete = async (rowData: BookingDetails) => {
		setSelectedDeleteRowData(rowData);
		toggleDeleteModal();
	};

	const handleView = async (rowData: BookingDetails) => {
		setSelectedViewRowData(rowData);
		toggleShippingTypeViewModal();
	};

	const handleEdit = async (rowData: BookingDetails) => {
		setSelectedEditRowData(rowData);
		toggleShippingTypeEditModal();
	};

	const handleNewShippingType = () => {
		toggleNewShippingTypeModal();
	};

	return (
		<div className="min-w-full max-w-[100vw]">
			<NavigationViewComp title="Bookings" />

			<Formik
				initialValues={{
					bookingDate: '',
					createdDate: '',
					pickupLocation: '',
					dropOffLocation: '',
					carNumber: '',
					driverName: '',
					status: ''
				}}
				validationSchema={null}
				onSubmit={handleAdvancedFiltration}
			>
				{({ handleSubmit }) => (
					<Form onSubmit={handleSubmit}>
						<Grid
							container
							spacing={2}
							className="pt-[10px] pr-[30px] mx-auto"
						>
							<Grid item lg={2} md={2} sm={6} xs={12}>
								<Typography>{t('Booking Date')}</Typography>
								<Field name="bookingDate" component={TextFormField}
									   fullWidth size="small" />
							</Grid>
							<Grid item lg={2} md={2} sm={4} xs={12}>
								<Typography>{t('Created Date')}</Typography>
								<Field name="createdDate" component={TextFormField}
									   fullWidth size="small" />
							</Grid>
							<Grid item lg={2} md={2} sm={4} xs={12}>
								<Typography>{t('Pickup Location')}</Typography>
								<Field name="pickupLocation" component={TextFormField}
									   fullWidth size="small" />
							</Grid>
							<Grid item lg={2} md={2} sm={4} xs={12}>
								<Typography>{t('Drop Off Location')}</Typography>
								<Field name="dropOffLocation" component={TextFormField}
									   fullWidth size="small" />
							</Grid>
							<Grid item lg={2} md={2} sm={4} xs={12}>
								<Typography>{t('Car Number')}</Typography>
								<Field name="carNumber" component={TextFormField}
									   fullWidth size="small" />
							</Grid>
							<Grid item lg={2} md={2} sm={4} xs={4}>
								<Typography>{t('Driver Name')}</Typography>
								<Field name="driverName" component={TextFormField}
									   fullWidth size="small" />
							</Grid>
							<Grid item lg={2} md={2} sm={4} xs={4}>
								<Typography>{t('Status')}</Typography>
								<Field name="status" component={TextFormField}
									   fullWidth size="small" />
							</Grid>

							<Grid
								item
								xs={12}
								sm={6}
								md={12}
								lg={3}
								xl={6}
								className="flex justify-end items-center gap-[10px] pt-[5px!important] ml-auto mt-12"
							>
								<Button
									className="min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-deep-orange-600 hover:bg-deep-orange-600/80"
									type="submit"
									variant="contained"
									size="medium"
								>
									{t('Advanced Filter')}<SearchIcon className="text-white text-[20px] ml-2" />
								</Button>
								<Button
									className="min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-green-900 hover:bg-green-900/80 flex items-center gap-2"
									type="button"
									variant="contained"
									size="medium"
									onClick={exportAsExcel}
									disabled={isDownloading}
								>
									{isDownloading ? (
										<>
											{t('Processing...')}
											<CircularProgress size={20} className="text-green-900 ml-2" />
										</>
									) : (
										<>
											{t('Export to Excel')}
											<DownloadIcon className="text-white text-[20px] ml-2" />
										</>
									)}
								</Button>
								<Button
									className="min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-yellow-800 hover:bg-yellow-800/80"
									type="button"
									variant="contained"
									size="medium"
									onClick={handleNewShippingType}
								>
									{t('Place New Booking')}
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
						title="Booking Management Table"
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
		{isOpenNewShippingTypeModal && (<NewShippingTypeModel
			isOpen={isOpenNewShippingTypeModal}
			toggleModal={toggleNewShippingTypeModal}
			clickedRowData={{}}
			isTableMode="new"
			fetchAllShippingTypes={fetchAllShippingTypes}
		/>)}

		{/* View Modal */}
		{isOpenShippingTypeViewModal && (<ShippingTypeEditModal
			isOpen={isOpenShippingTypeViewModal}
			toggleModal={toggleShippingTypeViewModal}
			clickedRowData={selectedViewRowData}
			isTableMode="view"
			fetchAllShippingTypes={fetchAllShippingTypes}
		/>)}

		{/* Edit Modal */}
		{isOpenShippingTypeEditModal && (<ShippingTypeEditModal
			isOpen={isOpenShippingTypeEditModal}
			toggleModal={toggleShippingTypeEditModal}
			clickedRowData={selectedEditRowData}
			isTableMode="edit"
			fetchAllShippingTypes={fetchAllShippingTypes}
		/>)}

		{isOpenActiveModal && (<ShippingTypeActiveComp
			toggleModal={toggleActiveModal}
			isOpen={isOpenActiveModal}
			clickedRowData={selectedActiveRowData}
			handleAlertForm={handleConfirmStatusChange}
		/>)}

		{isOpenDeleteModal && (<ShippingTypeDeleteAlertForm
			toggleModal={toggleDeleteModal}
			isOpen={isOpenDeleteModal}
			clickedRowData={selectedDeleteRowData}
			handleAlertForm={handleAlertForm}
		/>)}
	</div>);
}

export default BookingType;
