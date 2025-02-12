import { Button, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import UsersForm from './UsersForm';
import { t } from 'i18next';
import { fetchAllGuideLines } from '../../../../axios/services/mega-city-services/guideline-services/GuidelineService';
import { GuidelineType, WebTypeResp } from '../../sample-component/guideline-management/types/GuidelineTypes';
import { toast } from 'react-toastify';
import { UserType } from './UsersTypes';
import { fetchAllUsers } from '../../../../axios/services/mega-city-services/user-service/UserService';

interface AdvanceFilteringTypes {
	userName: string;
	status: string;
	firstName: string;
	lastName: string;
	email: string;
	mobile: string;
}

export type UserInterface = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	role: string;
	address:string;
	nic:string;
	phone_number:string;
	passwordConfirm: string;
	licenseNumber : string;
	licenseExpiryDate: string;
	vehicleAssigned:boolean;
	driverStatus:boolean;
	emergencyContact:string;
	dateOfBirth:string;
	dateOfJoining:string;

};

function UsersApp() {
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [userRoles, setUserRoles] = useState<{ label: string; value: number }[]>([]);
	const [users, setUsers] = useState<UserInterface[]>([]);
	const [isTableLoading, setTableLoading] = useState(false);
	const [sampleData, setSampleData] = useState<UserType[]>();
	const [count, setCount] = useState(100);
	const [isModelOpen, setIsModelOpen] = useState(false);
	const [isAdd, setIsAdd] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [isView, setIsView] = useState(false);
	const [selectedRow, setSelectedRow] = useState<UserInterface | null>(null);

	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (pageSize: number) => {
		setPageSize(pageSize);
	};

	useEffect(() => {
		fetchAllGuidelines().then(r => (r));
	}, [pageNo, pageSize]);

	const fetchAllGuidelines = async () => {
		setTableLoading(true);
		try {
			const response = await fetchAllUsers(pageNo, pageSize);

			console.log("sample -----------------------",response)

			if (response && Array.isArray(response.result)) {
				setUsers(response.result);
			} else {
				console.error('Unexpected data format:', response);
				setUsers([]);
			}
		} catch (error) {
			console.error('Error fetching users:', error);
			toast.error('Error fetching data');
			setUsers([]);
		} finally {
			setTableLoading(false);
		}
	};

	const tableColumns = [
		{
			title: 'User Id',
			field: 'id'
		},
		{
			title: 'First Name',
			field: 'firstName'
		},
		{
			title: 'Last Name',
			field: 'lastName'
		},
		{
			title: 'Email',
			field: 'email'
		},
		{
			title: 'Mobile No',
			field: 'phone_number'
		},
		{
			title: 'Role',
			field: 'role',
			cellStyle: {
				padding: '4px 8px'
			},
			render: rowData => {
				const roleColors = {
					CUSTOMER: { text: '#1E88E5', bg: '#E3F2FD' }, // Blue tones
					MANAGER: { text: '#E53935', bg: '#FFEBEE' },
					DRIVER: { text: '#e57835', bg: '#ffebde' },
				};

				const { text, bg } = roleColors[rowData.role] || {
					text: '#424242', bg: '#E0E0E0'
				}; // Default color for unknown roles

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
        {t(rowData.role)}
      </span>
				);
			}
		}

	];

	const handleFormModelOpen = (isNew: boolean, isEdit: boolean, isView: boolean, seletedData: any) => {
		setIsAdd(isNew);
		setIsEdit(isEdit);
		setIsView(isView);
		setSelectedRow(seletedData);
		setIsModelOpen(true);
	};

	const tableRowViewHandler = (rowData: UserInterface) => {
		handleFormModelOpen(false, false, true, rowData);
	};

	const tableRowEditHandler = (rowData: UserInterface) => {
		handleFormModelOpen(false, true, false, rowData);
	};

	const onCloseHandler = () => {
		setIsModelOpen(false);
	};

	return (
		<div className="min-w-full max-w-[100vw]">
			<NavigationViewComp title="Users" />

			<Grid
				container
				spacing={2}
				className="pt-[10px] pr-[30px] mx-auto"
			>
				<Grid
					item
					xs={12}
					sm={12}
					md={4}
					lg={6}
					xl={12}
					className="flex flex-wrap justify-end items-end gap-[10px] formikFormField pt-[10px!important]"
				>
					<Button
						className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-yellow-800 hover:bg-yellow-900/80"
						type="button"
						variant="contained"
						size="medium"
						disabled={false}
						onClick={() => handleFormModelOpen(true, false, false, null)}
					>
						New User
					</Button>
				</Grid>
			</Grid>
			<Grid
				container
				spacing={2}
				className="pr-[30px] mx-auto mt-0"
			>
				<Grid
					item
					xs={12}
					className="!pt-[5px]"
				>
					<MaterialTableWrapper
						title="User Management Table"
						filterChanged={null}
						handleColumnFilter={null}
						tableColumns={tableColumns}
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
						records={users}
						tableRowViewHandler={tableRowViewHandler}
						tableRowEditHandler={tableRowEditHandler}
					/>
				</Grid>
			</Grid>

			{isModelOpen && (
				<UsersForm
					isOpen={isModelOpen}
					isAdd={isAdd}
					isEdit={isEdit}
					isView={isView}
					selectedRow={selectedRow}
					setIsFormOpen={setIsModelOpen}
					onCloseHandler={onCloseHandler}
					userRoles={userRoles}
				/>
			)}
		</div>
	);
}

export default UsersApp;
