import { useState } from 'react';
import MaterialTableWrapper from 'app/shared-components/material-table/MaterialTableWrapper';
import { Grid } from '@mui/material';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { motion } from 'framer-motion';
import moment from 'moment';
import { FormType } from './AllCustomersTypes';
// import AllCustomersHeader from './AllCustomersHeader';
import CustomersForm from './CustomersForm';

/**  All Interfaces */
interface TableColumn {
	title: string;
	field: string;
}

// Define the interface for a data row

// Define the interface for the entire table data structure
interface TableDataStructure {
	title: string;
	columns: TableColumn[];
	data: FormType[];
	externalAddButton?: boolean;
	externalAddHandler?: () => void;
	editRowHandler?: (data: FormType) => void;
	viewRowHandler?: (data: FormType) => void;
}

const container = {
	show: {
		transition: {
			staggerChildren: 0.04
		}
	}
};

// const item = {
// 	hidden: { opacity: 0, y: 20 },
// 	show: { opacity: 1, y: 0 }
// };

/**
 * The Users app.
 */

function AllCustomersApp() {
	// const { data: widgets, isLoading } = useGetFinanceDashboardWidgetsQuery();
	const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [isView, setIsView] = useState<boolean>(false);
	const [selectedRow, setSelectedRow] = useState<FormType | null>(null);
	// if (isLoading) {
	// 	return <FuseLoading />;
	// }

	// if (!widgets) {
	// 	return null;
	// }

	// const userRoles = [
	// 	{ value: 'admin', label: 'Admin' },
	// 	{ value: 'user', label: 'User' },
	// 	{ value: 'guest', label: 'Guest' }
	// ];

	const tableDatas: TableDataStructure = {
		title: 'All Registered Customers',
		columns: [
			{ title: 'ID', field: 'customerId' },
			{ title: 'Full Name', field: 'firstName' },
			{ title: 'Contact No', field: 'contactNo' },
			{ title: 'NIC', field: 'nic' },
			{
				title: 'Last Lottery Purchased Date',
				field: 'lastLotteryPurchasedDate'
			},
			{ title: 'Sales Count', field: 'salesCount' },
			{ title: 'Status', field: 'status' }
		],
		data: [
			{
				customerId: '001',
				firstName: 'John',
				lastName: 'Doe',
				contactNo: '0734567890',
				nic: '199802350067',
				lastLotteryPurchasedDate: new Date('2024-05-22'),
				status: 'On Hold',
				salesCount: 100
			},
			{
				customerId: '002',
				firstName: 'Peter',
				lastName: 'Parker',
				contactNo: '0734567892',
				nic: '199802354567',
				lastLotteryPurchasedDate: new Date('2024-05-22'),
				status: 'Active',
				salesCount: 100
			}
		],
		externalAddButton: true,
		editRowHandler: (data) => {
			setIsFormOpen(true);
			setIsEdit(true);
			setSelectedRow(data);
		},
		viewRowHandler: (data) => {
			setIsFormOpen(true);
			setIsView(true);
			setSelectedRow(data);
		}
	};

	function onCloseHandler() {
		setIsFormOpen(false);
		setIsEdit(false);
		setIsView(false);
	}

	const formattedData = tableDatas.data.map((item) => ({
		...item,
		lastLotteryPurchasedDate: item.lastLotteryPurchasedDate
			? moment(item.lastLotteryPurchasedDate).format('YYYY-MM-DD')
			: '',
		registeredDate: item.registeredDate ? moment(item.registeredDate).format('YYYY-MM-DD') : ''
	}));

	return (
		<FusePageSimple
			// header={<AllCustomersHeader />}
			content={
				<div className="w-full px-24 md:px-32 pb-24">
					<motion.div
						className="w-full"
						variants={container}
						initial="hidden"
						animate="show"
					>
						{/* <div className="mb-24 mt-12">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Lottery Name</InputLabel>
                    <Select
                      name="status"
                      //   value={filter.status}
                      //   onChange={handleFilterChange}
                    ></Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Design Approval Status</InputLabel>
                    <Select
                      name="status"
                      //   value={filter.status}
                      //   onChange={handleFilterChange}
                    >
                      <MenuItem value="">Approved</MenuItem>
                      <MenuItem value="Active">In Progress</MenuItem>
                      <MenuItem value="Inactive">Pending</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Lottery Status</InputLabel>
                    <Select
                      name="status"
                      //   value={filter.status}
                      //   onChange={handleFilterChange}
                    >
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Inactive">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2} className="mb-24 mt-12">
                <Grid item xs={4} sm={2}>
                  <Button
                    className="whitespace-nowrap"
                    variant="contained"
                    color="secondary"
                    // onClick={handleResetFilters}
                    fullWidth
                  >
                    Reset Filters
                  </Button>
                </Grid>
              </Grid>
            </div> */}
						<div className="grid grid-cols-1  gap-32 w-full mt-32">
							<Grid>
								<MaterialTableWrapper
									title={tableDatas?.title}
									data={formattedData}
									columns={tableDatas?.columns}
									editRowHandler={tableDatas?.editRowHandler}
									viewRowHandler={tableDatas?.viewRowHandler}
								/>
							</Grid>
						</div>

						{isFormOpen && (
							<CustomersForm
								isOpen={isFormOpen}
								setIsFormOpen={setIsFormOpen}
								isEdit={isEdit}
								isView={isView}
								selectedRow={selectedRow}
								onCloseHandler={onCloseHandler}
							/>
						)}
					</motion.div>
				</div>
			}
		/>
	);
}

export default AllCustomersApp;
