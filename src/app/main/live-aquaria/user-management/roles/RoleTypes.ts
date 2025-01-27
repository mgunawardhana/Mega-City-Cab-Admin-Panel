export type FormType = {
	id: string;
	role: string;
	status: boolean;
	description: string;
};

export type FormProps = {
	className?: string;
	isOpen?: boolean;
	setIsFormOpen?: React.Dispatch<React.SetStateAction<boolean>>;
	selectedRow?: FormType;
	isEdit?: boolean;
	onCloseHandler?: () => void;
	isView?: boolean;
	isAdd?: boolean;
};

export interface FormData {
	id: string;
	code: string;
	role: string;
	status: boolean;
	description: string;
}
