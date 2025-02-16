// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Button, Grid } from '@mui/material';
import { Form, Formik } from 'formik';
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
			await fetchAllShippingTypes();
			toast.success('Status updated successfully');
		} catch (error) {
			toast.error('Error updating status:');
		}
	};

	const exportAsExcel = async () => {
		setIsDownloading(true); // Start the loading animation
		try {
			console.log("Starting Excel export...");
			const response = await axiosApiAuth.get('api/v1/booking/export', { responseType: 'blob' });
			console.log("Received response:", response);

			const url = window.URL.createObjectURL(new Blob([response.data]));
			console.log("Blob URL created:", url);

			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', 'bookings.xlsx');
			document.body.appendChild(link);
			link.click();
			link.remove();

			console.log('Excel sheet downloaded successfully');
		} catch (error) {
			console.error('Error fetching the Excel file:', error);
			toast.error('Error downloading the Excel file');
		} finally {
			setIsDownloading(false); // Stop the loading animation
		}
	};


	const fetchAllShippingTypes = async () => {
		setTableLoading(true);
		try {
			const response = await fetchAllBookings(pageNo, pageSize);

			console.log('API Response:', response);

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


	const handleSubmit1 = (values) => {
	};

	return (<div className="min-w-full max-w-[100vw]">
		<NavigationViewComp title="Bookings" />

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
						<Button
							className="min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-green-900 hover:bg-green-900/80 flex items-center gap-2"
							type="button"
							variant="contained"
							size="medium"
							onClick={exportAsExcel}
							disabled={isDownloading} // Disable the button while downloading
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
