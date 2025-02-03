import { Button, Grid } from '@mui/material';
import { useState } from 'react';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import UsersForm from './UsersForm';

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
	const [pageSize, setPageSize] = useState<number>(10);
	const [filteredValues, setFilteredValues] = useState<AdvanceFilteringTypes>({
		userName: null,
		status: null,
		firstName: null,
		lastName: null,
		email: null,
		mobile: null
	});
	const [userRoles, setUserRoles] = useState<{ label: string; value: number }[]>([]);
	const [users, setUsers] = useState<UserInterface[]>([]);
	const [count, setCount] = useState(100);
	const [isTableLoading] = useState(false);
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
			field: 'mobile'
		},
		{
			title: 'Role',
			field: 'role'
		},
		// {
		// 	title: 'Status',
		// 	field: 'is_active',
		// 	render: (data: UserInterface) => (data.is_active === 1 ? 'Active' : 'Inactive')
		// }
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
						title=""
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
						disableSearch
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
