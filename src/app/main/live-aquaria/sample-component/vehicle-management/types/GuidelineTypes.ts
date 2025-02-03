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

export type VehicleResp = {
	id: number;
	make: string;
	model: string;
	yearOfManufacture: number;
	color: string;
	engineCapacity: string;
	fuelType: string;
	seatingCapacity: number;
	vehicleType: string;
	registrationNumber: string;
	licensePlateNumber: string;
	chassisNumber: string;
	permitType: string;
	ownerName: string;
	ownerContact: string;
	ownerAddress: string;
	insuranceProvider: string;
	insurancePolicyNumber: string;
	insuranceExpiryDate: string; // ISO date format (YYYY-MM-DD)
	airConditioning: boolean;
	additionalFeatures: string; // "Wireless Charging"
	vehicleImage: string; // Base64 image string
	vehiclePhoto: string; // Image file name
};


export type ShippingTypeModifiedData = {
	allow_transit_delay?: string;
	id?: string;
	name?: string;
	is_active?: number;
	created_at?: string;
	updated_at?: string;
	item_category?: ShippingTypeItemCategoryResponse[];
	shipping_type_name?: string;
	product_category?: string[];
	create_date?: string;
	active?: boolean;
};

export type ShippingCreateType = {
	ratings?: number;
	title?: string;
	description?: string;
	author?: string;
	media?: string;
	is_active?: boolean;
};

