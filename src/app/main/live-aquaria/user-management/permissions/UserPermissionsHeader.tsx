import { Autocomplete, FormControl, Grid, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { RolesLOV } from '../users/UsersTypes';
import { FormType } from './UserPermissionsType';

/**
 * The UserPermissionsHeader component.
 */
function UserPermissionsHeader({
	userRoles,
	handleRoleChange
}: {
	userRoles: RolesLOV[];
	handleRoleChange: (role: string) => void;
}) {
	const { formState, control } = useForm<FormType>({
		mode: 'onChange'
	});
	const { errors } = formState;

	return (
		<div className="w-full pt-[10px]">
			<Grid
				container
				spacing={2}
				className="pr-[15px] mx-auto mb-[-15px]"
			>
				<Grid
					item
					xs={12}
					md={12}
				>
					<h6 className="text-[14px] sm:text-[16px] lg:text-[18px] text-textColor font-500 leading-[1.6]">
						User Permissions
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
						name="userRole"
						control={control}
						defaultValue=""
						render={({ field }) => (
							<FormControl
								fullWidth
								error={!!errors.userRole}
							>
								<Autocomplete
									size="small"
									{...field}
									options={userRoles.map((role) => role.value)} // map the userRoles to the values
									getOptionLabel={(option) =>
										userRoles.find((role) => role.value === option)?.label || ''
									}
									renderInput={(params) => (
										<TextField
											{...params}
											label="Select User Role"
											error={!!errors.userRole}
											helperText={errors.userRole?.message}
										/>
									)}
									onChange={(event: any, newValue: string | null) => {
										field.onChange(newValue); // Use newValue instead of event.target.value
										handleRoleChange(newValue); // Pass newValue to handleRoleChange
									}}
									disableClearable // To prevent clearing the selection
									openOnFocus // Automatically open dropdown when the field is focused
								/>
							</FormControl>
						)}
					/>
				</Grid>
			</Grid>
		</div>
	);
}

export default UserPermissionsHeader;
