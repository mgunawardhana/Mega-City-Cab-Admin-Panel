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

export type FormProps = {
	className?: string;
	isOpen?: boolean;
	setIsFormOpen?: React.Dispatch<React.SetStateAction<boolean>>;
	selectedRow?: FormType;
	isEdit?: boolean;
	isView?: boolean;
	isAdd?: boolean;
	onCloseHandler?: () => void;
	userRoles?: RolesLOV[];
};

export interface FormData {
	code: string;
	role: string;
	status: boolean;
	description: string;
}

export interface RolesLOV {
	value: string;
	label: string;
}
