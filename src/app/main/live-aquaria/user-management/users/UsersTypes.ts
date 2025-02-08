export type FormType = {
	userId?: string;
	phoneNumber?: string;
	roleId: string;
	isActive: boolean;
	email: string;
	employeeName: string;
	password?: string;
	passwordConfirm?: string;
	createdBy?: string;
	updatedBy?: string;
	userName?: string;
	status?: string;
};

export interface RolesLOV {
	value: string;
	label: string;
}

export interface UserType {
	firstName: string;
	lastName: string;
	role: string;
	address: string;
	registration_number: string | number;
	root_user_id: string | number;
	nic: string | number;
	phone_number: string | number;
	id: string | number;
	email: string;
}