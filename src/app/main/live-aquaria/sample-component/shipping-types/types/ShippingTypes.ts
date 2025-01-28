export type ShippingTypeItemCategoryResponse = {
	id?: string;
	name?: string;
	reference?: string;
	goods_type?: string;
	attachment?: string;
	is_active?: number;
};

export type ShippingTypeResponse = {
	allow_transit_delay?: number;
	id?: string;
	name?: string;
	is_active?: number;
	created_at?: string;
	updated_at?: string;
	item_category?: ShippingTypeItemCategoryResponse[];
};

export type Meta = {
	total?: number;
};

export type ShippingTypeApiResponse = {
	data?: ShippingTypeResponse[];
	meta?: Meta;
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
	discount?: string;
	title?: string;
	description?: string;
	author?: string;
	media?: string;
	is_active?: boolean;
};

