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

export type GuideType = {
	guidanceId?: any;
	title?: string;
	description?: string;
	category?: any;
	priority?: any;
	relatedTo?: any;
};

