export type ShippingTypeItemCategoryResponse = {
	id?: string;
	name?: string;
	reference?: string;
	goods_type?: string;
	attachment?: string;
	is_active?: number;
};

export type WebTypeResp = {
	articleId?:string;
	ratings?:string;
	title?:string;
	description?:string;
	author?:string;
	is_active?:string;
};

export type Meta = {
	total?: number;
};

export type WebTypeApiResponse = {
	data?: WebTypeResp[];
	meta?: Meta;
};

export type BookingDetails = {
	bookingNumber: number;
	bookingDate: string;
	pickupLocation: string;
	dropOffLocation: string;
	carNumber: string;
	taxes: number;
	distance: number;
	estimatedTime: number;
	taxWithoutCost: number;
	totalAmount: number;
	customerRegistrationNumber: string;
	driverId: string;
	status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'CLOSED';
};

export type ShippingCreateType = {
	ratings?: number;
	title?: string;
	description?: string;
	author?: string;
	media?: string;
	is_active?: boolean;
};

