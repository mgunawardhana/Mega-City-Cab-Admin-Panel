import { Button, Grid, TextField, Autocomplete } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Form, Formik, FormikState } from 'formik';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import axios, { AxiosResponse } from 'axios';
import { GET_PERMISSIONS_BY_ID, GET_USER_ROLES, UPDATE_PERMISSIONS } from 'src/app/axios/services/AdminServices';
import MaterialTable, { Column } from 'material-table';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';

interface AdvanceFilteringTypes {
	roleName: string;
	status: string;
}

export interface Role {
	id: number;
	name: string;
	description: string | null;
	is_active: number;
}

interface Links {
	first: string;
	last: string;
	prev: string | null;
	next: string | null;
}

interface Meta {
	current_page: number;
	from: number;
	last_page: number;
	links: any;
	path: string;
	per_page: number;
	to: number;
	total: number;
}

interface GetRoleResponse {
	data: Role[];
	links: Links;
	meta: Meta;
}

function UserPermissionsApp() {
	const [pageNo, setPageNo] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(5);
	const [filteredValues, setFilteredValues] = useState<AdvanceFilteringTypes>({
		roleName: '',
		status: ''
	});

	const [count, setCount] = useState(100);
	const [isTableLoading, setTableLoading] = useState(false);
	const [isModelOpen, setIsModelOpen] = useState(false);
	const [isAdd, setIsAdd] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [isView, setIsView] = useState(false);
	const [selectedRow, setSelectedRow] = useState<Role | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [userRoles, setUserRoles] = useState<{ value: number; label: string }[]>([]);

	const [permissions, setPermissions] = useState<any[]>([]);
	const [selectedRoleId, setSelectedRoleId] = useState<number>(0);
	useEffect(() => {
		fetchUserRoles();
	}, []);

	const fetchUserRoles = async () => {
		try {
			const response: AxiosResponse<GetRoleResponse> = await axios.get(GET_USER_ROLES);
			const userRolesLOV: { label: string; value: number }[] = response.data.data.map((role: Role) => {
				return {
					label: role.name,
					value: role.id
				};
			});

			setUserRoles(userRolesLOV);
		} catch (error) {
			toast.error(error.response.data.message);
		}
	};

	const filterPermissionsForRole = async (roleId: number) => {
		try {
			const response: AxiosResponse<any> = await axios.get(GET_PERMISSIONS_BY_ID + roleId);

			const permissionModified = [];

			Object.entries(response.data).forEach(([key, value], mainIndex) => {
				permissionModified.push({
					id: mainIndex,
					name: key,
					index: false,
					store: false,
					show: false,
					update: false,
					destroy: false,
					parentId: null,
					type: 'adult'
				});
				console.log('value', mainIndex);

				Object.entries(value).forEach(([subKey, subValue], subIndex) => {
					console.log(mainIndex, {
						id: subIndex,
						name: subKey,
						index: subValue.find((item) => item.name === 'index'),
						store: subValue.find((item) => item.name === 'store'),
						show: subValue.find((item) => item.name === 'show'),
						update: subValue.find((item) => item.name === 'update'),
						destroy: subValue.find((item) => item.name === 'destroy'),
						parentId: mainIndex,
						type: 'child'
					});

					permissionModified.push({
						id: subIndex,
						name: subKey,
						index: subValue.find((item) => item.name === 'index'),
						store: subValue.find((item) => item.name === 'store'),
						show: subValue.find((item) => item.name === 'show'),
						update: subValue.find((item) => item.name === 'update'),
						destroy: subValue.find((item) => item.name === 'destroy'),
						parentId: mainIndex,
						type: 'child'
					});
				});

				console.log('=========================');
			});

			console.log('permissionModified', permissionModified);

			setPermissions(permissionModified);
		} catch (error) {
			toast.error('Error occurred while fetching Permissions');
		}
	};

	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (pageSize: number) => {
		setPageSize(pageSize);
	};

	const tableColumns: Column<any>[] = [
		{
			title: 'Module Name',
			field: 'name',
			render: (rowData) => (
				<div
					style={{
						paddingLeft: rowData.type === 'child' ? '20px' : '0', // Apply tab space
						fontWeight: rowData.type === 'child' ? 'normal' : 'bold' // Bold for main categories
					}}
				>
					{rowData.name}
				</div>
			)
		},
		{
			title: 'View',
			field: 'show',
			render: (rowData) => (
				<input
					type="checkbox"
					className="cursor-pointer"
					defaultChecked={rowData.show.action}
					onChange={(e) => (rowData.show.action = e.target.checked)}
				/>
			)
		},
		{
			title: 'Create',
			field: 'store',
			render: (rowData) => (
				<input
					type="checkbox"
					className="cursor-pointer"
					defaultChecked={rowData.store.action}
					onChange={(e) => (rowData.store.action = e.target.checked)}
				/>
			)
		},
		{
			title: 'Update',
			field: 'update',
			render: (rowData) => (
				<input
					className="cursor-pointer"
					defaultChecked={rowData.update.action}
					type="checkbox"
					onChange={(e) => (rowData.update.action = e.target.checked)}
				/>
			)
		},
		{
			title: 'Delete',
			field: 'destroy',
			render: (rowData) => (
				<input
					type="checkbox"
					defaultChecked={rowData.destroy.action}
					className="cursor-pointer"
					onChange={(e) => (rowData.destroy.action = e.target.checked)}
				/>
			)
		}
	];

	const schema = yup.object().shape({});

	const onSubmit = async (values: any) => {
		// not need
	};

	const handleFormModelOpen = (isNew: boolean, isEdit: boolean, isView: boolean, seletedData: any) => {
		setIsAdd(isNew);
		setIsEdit(isEdit);
		setIsView(isView);
		setSelectedRow(seletedData);
		setIsModelOpen(true);
	};

	const tableRowViewHandler = (rowData: Role) => {
		handleFormModelOpen(false, false, true, rowData);
	};

	const tableRowEditHandler = (rowData: Role) => {
		handleFormModelOpen(false, true, false, rowData);
	};

	const onCloseHandler = () => {
		setIsModelOpen(false);
	};

	const handleClearForm = (resetForm: (nextState?: Partial<FormikState<any>>) => void) => {
		resetForm();
	};

	const StatusOptions = [
		{ value: 'ACTIVE', label: 'Active' },
		{ value: 'DEACTIVE', label: 'Deactive' }
	];

	const onChangeRole = (role: number | null) => {
		if (role === null) {
			setSelectedRoleId(null);
			setPermissions([]);
		} else {
			setSelectedRoleId(role);
			filterPermissionsForRole(role);
		}
	};

	const updatePermissions = async () => {
		const selectedPermissionsIds = [];

		permissions.forEach((permission: any) => {
			if (permission.index && permission.index.action === true) {
				selectedPermissionsIds.push(permission.index.id);
			}

			if (permission.show && permission.show.action === true) {
				selectedPermissionsIds.push(permission.show.id);
			}

			if (permission.store && permission.store.action === true) {
				selectedPermissionsIds.push(permission.store.id);
			}

			if (permission.update && permission.update.action === true) {
				selectedPermissionsIds.push(permission.update.id);
			}

			if (permission.destroy && permission.destroy.action === true) {
				selectedPermissionsIds.push(permission.destroy.id);
			}
		});

		try {
			const response: AxiosResponse<any> = await axios.put(UPDATE_PERMISSIONS + selectedRoleId, {
				permissions: selectedPermissionsIds
			});
			toast.success('Permissions Updated Successfully');
		} catch (error) {
			toast.error(error.response.data.message);
		}
	};

	return (
		<div className="min-w-full max-w-[100vw]">
			<NavigationViewComp title="Permissions" />

			<Formik
				initialValues={
					{
						status: null
					} as {
						status: number | null;
					}
				}
				validationSchema={schema}
				onSubmit={onSubmit}
			>
				{({ values, setFieldValue, isValid, resetForm, touched, errors }) => (
					<Form>
						<Grid
							container
							spacing={2}
							className="pr-[30px] mx-auto"
						>
							<Grid
								item
								xs={12}
								sm={6}
								md={4}
								lg={3}
								xl={2}
								className="formikFormField"
							>
								<Typography className="formTypography">Select Role</Typography>
								<Autocomplete
									size="small"
									options={userRoles}
									getOptionLabel={(option) => option.label}
									onChange={(event, newValue) => {
										console.log('newValue', newValue);
										setFieldValue('status', newValue); // Set the entire object
										onChangeRole(newValue ? newValue.value : null); // Pass only the ID to your handler
									}}
									renderInput={(params) => (
										<TextField
											{...params}
											name="status"
											variant="outlined"
											fullWidth
											placeholder="Select Role"
											error={touched.status && Boolean(errors.status)}
											helperText={touched.status && errors.status}
										/>
									)}
									value={values.status || null} // Set the current object value or null
								/>

								{/* <Autocomplete
                  size="small"
                  options={userRoles}
                  getOptionLabel={(option) => option.label}
                  onChange={(event, newValue) => {
                    console.log('event', event);
                    console.log('newValue', newValue);
                    setFieldValue("status", newValue ? newValue.value : "");
                    onChangeRole(newValue ? newValue.value : "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="status"
                      variant="outlined"
                      fullWidth
                      placeholder="Select Role"
                      error={touched.status && Boolean(errors.status)}
                      helperText={touched.status && errors.status}
                    />
                  )}
                  value={
                    StatusOptions.find(
                      (option) => option.value === values.status
                    ) || null
                  }
                /> */}
							</Grid>
						</Grid>
					</Form>
				)}
			</Formik>
			<Grid
				container
				spacing={2}
				className="pr-[30px] mx-auto mt-0"
			>
				<Grid
					item
					xs={12}
				>
					<MaterialTable
						title="Permissions Management"
						data={permissions}
						columns={tableColumns}
						parentChildData={(row, rows) => rows.find((a) => a.id === row.parentId)}
						options={{
							selection: true
						}}
					/>
				</Grid>
			</Grid>
			<Button
				style={{ float: 'right', margin: '15px' }}
				variant="contained"
				color="secondary"
				onClick={updatePermissions}
			>
				Update Permissions
			</Button>
		</div>
	);
}

export default UserPermissionsApp;
