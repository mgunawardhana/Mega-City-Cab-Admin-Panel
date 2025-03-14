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

export type GuidelineType = {
	guidanceId: number;
	title:string;
	description: string;
	category:string;
	priority:string;
	relatedTo:string;
};


export type ShippingTypeModifiedData = {

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
	insuranceExpiryDate: string;
	airConditioning: boolean;
	additionalFeatures: string;
	vehicleImage: string;
	vehiclePhoto: string;
};

export type GuideType = {
	guidanceId?: any;
	title?: string;
	description?: string;
	category?: any;
	priority?: any;
	relatedTo?: any;
};

