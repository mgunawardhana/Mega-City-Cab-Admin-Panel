export type FormType = {
	id: string;
	module: string;
	subModuleName?: string;
	create?: boolean;
	read?: boolean;
	submit?: boolean;
	delete?: boolean;
	print?: boolean;
	cancel?: boolean;
	report?: boolean;
	export?: boolean;
	parentId?: string;
	userRole?: string;
};

export type FormProps = {
	className?: string;
	isOpen?: boolean;
	setIsFormOpen?: React.Dispatch<React.SetStateAction<boolean>>;
	selectedRow?: FormType;
	isEdit?: boolean;
	onCloseHandler?: () => void;
};
