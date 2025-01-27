export type FormType = {
	customerId?: string;
	firstName: string;
	lastName: string;
	contactNo?: string;
	nic?: string;
	lastLotteryPurchasedDate?: Date;
	status?: string;
	salesCount?: number;
	age?: number;
	email?: string;
	registeredDate?: Date;
	walletBalance?: number;
};

export type FormProps = {
	className?: string;
	isOpen?: boolean;
	setIsFormOpen?: React.Dispatch<React.SetStateAction<boolean>>;
	selectedRow?: FormType;
	isEdit?: boolean;
	isView?: boolean;
	onCloseHandler?: () => void;
};

export interface FormData {
	customerId?: string;
	firstName: string;
	lastName: string;
	contactNo?: string;
	nic?: string;
	lastLotteryPurchasedDate?: Date;
	status?: string;
	salesCount?: number;
	age?: number;
	email?: string;
	registeredDate?: Date;
	walletBalance?: number;
}
