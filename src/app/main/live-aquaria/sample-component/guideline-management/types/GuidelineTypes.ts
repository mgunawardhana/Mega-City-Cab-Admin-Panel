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

