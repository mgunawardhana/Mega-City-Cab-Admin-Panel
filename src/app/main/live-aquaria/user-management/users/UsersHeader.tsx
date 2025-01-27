import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Autocomplete, Button, FormControl, Grid, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

/**
 * The UserRolesHeader component.
 */

export interface UsersLOV {
	value: string;
	label: string;
}

interface UserRolesHeaderProps {
	setIsFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
	onInputRoleHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onInputUserHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
	usersLOV: { label: string; value: string }[];
	rolesLOV: { label: string; value: string }[];
	handleSearchResult: (userValue: UsersLOV | null, roleValue: UsersLOV | null, statusValue: UsersLOV | null) => void;
	permissionToCreate: boolean;
	externalAddHandler: () => void;
}

function UsersHeader(props: UserRolesHeaderProps) {
	const {
		setIsFormOpen,
		onInputRoleHandler,
		onInputUserHandler,
		usersLOV,
		rolesLOV,
		handleSearchResult,
		permissionToCreate,
		externalAddHandler
	} = props;
	const { formState, control } = useForm({
		mode: 'onChange'
	});
	const { errors } = formState;
	const [userRolesLOV, setUserRolesLOV] = useState<{ label: string; value: string }[]>([]);
	const [usersLOVs, setUsersLOVs] = useState<{ label: string; value: string }[]>([]);
	const [userValue, setUserValue] = useState<UsersLOV | null>(null);
	const [roleValue, setRoleValue] = useState<UsersLOV | null>(null);
	const [statusValue, setStatusValue] = useState<UsersLOV | null>(null);

	useEffect(() => {
		setUsersLOVs(usersLOV);
	}, [usersLOV]);

	useEffect(() => {
		setUserRolesLOV(rolesLOV);
	}, [rolesLOV]);

	useEffect(() => {
		handleSearchResult(userValue, roleValue, statusValue);
	}, [roleValue, statusValue, userValue]);

	const statusLOV = [
		{ label: 'Active', value: 'ACTIVE' },
		{ label: 'Inactive', value: 'INACTIVE' }
	];

	return (
		<div className="w-full pt-[10px]">
			<Grid
				container
				spacing={2}
				className="pr-[30px] mx-auto mb-[-5px]"
			>
				<Grid
					item
					xs={12}
					sm={12}
				>
					<h6 className="text-[14px] sm:text-[16px] lg:text-[18px] text-textColor font-500 leading-[1.6]">
						All Users
					</h6>
				</Grid>
				<Grid
					item
					xs={12}
					sm={6}
					md={4}
					lg={3}
					className="pt-[10px!important]"
				>
					<Controller
						name="user"
						control={control}
						defaultValue=""
						render={() => (
							<FormControl
								fullWidth
								error={!!errors.userRole}
							>
								<Autocomplete
									disablePortal
									id="combo-box-demo"
									options={usersLOVs}
									className="w-full"
									size="small"
									renderInput={(params) => (
										<TextField
											{...params}
											label="Employee"
										/>
									)}
									onChange={(event: any, newValue: UsersLOV | null) => {
										setUserValue(newValue);
									}}
									onInput={onInputUserHandler}
								/>
							</FormControl>
						)}
					/>
				</Grid>

				<Grid
					item
					xs={12}
					sm={6}
					md={4}
					lg={3}
					className="pt-[10px!important]"
				>
					<Controller
						name="userRole"
						control={control}
						defaultValue=""
						render={() => (
							<FormControl
								fullWidth
								error={!!errors.userRole}
							>
								<Autocomplete
									disablePortal
									id="combo-box-demo"
									options={userRolesLOV}
									className="w-full"
									size="small"
									renderInput={(params) => (
										<TextField
											{...params}
											label="User Role"
										/>
									)}
									onChange={(event: any, newValue: UsersLOV | null) => {
										setRoleValue(newValue);
									}}
									onInput={onInputRoleHandler}
								/>
							</FormControl>
						)}
					/>
				</Grid>

				<Grid
					item
					xs={12}
					sm={6}
					md={4}
					lg={3}
					className="pt-[10px!important]"
				>
					<Controller
						name="userStatus"
						control={control}
						defaultValue=""
						render={() => (
							<FormControl
								fullWidth
								error={!!errors.userRole}
							>
								<Autocomplete
									disablePortal
									id="combo-box-demo"
									options={statusLOV}
									className="w-full"
									size="small"
									renderInput={(params) => (
										<TextField
											{...params}
											label="User Status"
										/>
									)}
									onChange={(event: any, newValue: UsersLOV | null) => {
										setStatusValue(newValue);
									}}
								/>
							</FormControl>
						)}
					/>
				</Grid>
				{permissionToCreate ? (
					<Grid
						item
						xs={12}
						sm={6}
						md={4}
						lg={3}
						className="flex items-center gap-[10px] pt-[5px!important]"
					>
						<Button
							className="whitespace-nowrap text-white bg-primaryPurple hover:bg-primaryPurple"
							variant="contained"
							size="small"
							startIcon={<FuseSvgIcon size={20}>heroicons-outline:plus-circle</FuseSvgIcon>}
							onClick={externalAddHandler}
						>
							Add User
						</Button>
					</Grid>
				) : (
					''
				)}
			</Grid>
		</div>
	);
}

export default UsersHeader;
