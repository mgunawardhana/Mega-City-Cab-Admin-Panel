export interface GeneralViewProps {
	generalViewValues: {
		data?: {
			id?: string;
			common_name?: string | null;
			title?: string;
			scientific_name?: string;
			location?: string;
			item_category?: {
				id?: string;
				name?: string;
			};
			short_description?: string;
			meta_description?: string;
			long_description?: string;
			additional_information?: string;
			meta_keywords?: string;
			is_completed?: boolean;
			is_published?: boolean;
		};
	};
	isSaveBtnEnabled?: boolean;
	clickedRowData?: {
		id?: string;
		common_name?: string | null;
		title?: string;
		scientific_name?: string;
		location?: string;
		item_category?: {
			id?: string;
			name?: string;
		};
		short_description?: string;
		meta_description?: string;
		long_description?: string;
		additional_information?: string;
		meta_keywords?: string;
	};
	ifWeNeedClearForm?: string;
}

export interface FormValues {
	id?: string;
	product_name: string;
	title: string;
	scientific_name: string;
	location: string;
	category: string;
	short_description: string;
	meta_description: string;
	long_description: string;
	additional_information: string;
	product_tag_keywords: string;
}

export interface PackingMaterialsProps {
	isSaveBtnEnabled?: unknown;
}

export interface Attribute {
	name: string;
	attributes?: { name: string }[];
}

export interface GeneralViewValues {
	data?: {
		item_attributes: Attribute[][];
	};
}

export interface QuickStatusViewProps {
	generalViewValues?: GeneralViewValues;
	clickedRowData?: { item_attributes?: Attribute[][] };
}

export interface ShippingMethodsProps {
	isSaveBtnEnabled?: unknown;
}

export interface UploadThumbnailsProps {
	clickedRowData?: unknown;
	isSaveBtnEnabled?: unknown;
	generalViewValues?: any;
}

export interface VarietyProps {
	generalViewValues?: any;
	clickedRowData?: {
		item_selection: any;
		data: any;
		id?: string;
		item_variations?: Array<any>;
	};
	isSaveBtnEnabled?: unknown;
	ifWeNeedClearForm?: string;
}

export interface ProductOffering {
	type: string;
	sellingPrice: number;
	displayPrice: number;
	quantity: number;
	considerStock: boolean;
}

export interface Variety {
	id: string;
	cis_code: string;
	selling_price: number;
	display_price: number;
	stock: number;
	consider_stock: number;
	remark: string;
	is_active: number;
	item_size: any;
	item_origin_country: any;
	item_image: { id: number; link: string }[];
	item_video: { id: number; link: string }[];
	productOfferings: ProductOffering[];
}

export interface VarietyEditModelProps {
	open: boolean;
	handleClose: () => void;
	variety: Variety | null;
	itemId: string;
	isSaveBtnEnabled?: unknown;
}

/* @shiran ts types */

export type GeneralAdvItemAttribute = {
	id?: string;
	name?: string;
	is_active?: number;
};

export type GeneralAdvOneAttributeType = {
	id?: string;
	name?: string;
	is_active?: number;
	attributes?: GeneralAdvItemAttribute[];
};

export type GeneralAdvMasterData = {
	id?: string;
	master_code?: string;
	cis_code?: string;
	member_code?: string;
	vendor_code?: string;
	country?: string;
	common_name?: string;
	scientific_name?: string;
	description?: string;
	gender?: string;
	size?: string;
	age?: string;
	origins?: string;
	length?: string;
	selling_type?: string;
	regular_price?: string;
	inventory_qty?: number;
	is_active?: number;
	created_date?: string;
};

export type GeneralAdvSelectionType = {
	id?: number;
	item_selection_id?: number;
	display_name?: string;
	selling_price?: string | null;
	display_price?: string;
	discount_rate?: string | null;
	discount_price?: string | null;
	consider_stock?: number;
	remark?: string | null;
	is_active?: number;
	master_data?: GeneralAdvMasterData;
};

export type GeneralAdvItemSelection = {
	id?: number;
	name?: string;
	is_active?: number;
	selection_types?: GeneralAdvSelectionType[];
	item_media?: GeneralAdvItemMedia[];
};

export type GeneralAdvItemCategory = {
	id?: string;
	name?: string;
	reference?: string;
	goods_type?: string;
	attachment?: string;
	is_active?: number;
};

export type GeneralAdvItemMedia = {
	id?: number;
	type?: string;
	link?: string;
};

export type GeneralAdvRelatedProduct = {
	id?: string;
	code?: string;
	type?: number;
	title?: string;
	common_name?: string | null;
	scientific_name?: string | null;
	short_description?: string | null;
	long_description?: string;
	meta_keywords?: string;
	meta_description?: string | null;
	additional_information?: string | null;
	is_advertisement?: number;
	is_active?: number;
	is_admin_only?: number;
	reject_reason?: string | null;
	status?: number;
};

export type GeneralAdvGuaranteeOption = {
	id?: string;
	name?: string;
	descriptions?: string | null;
	is_active?: number;
	attachment?: string | null;
};

export type GeneralAdvRelatedArticle = {
	id?: string;
	article_id?: string;
	code?: string;
	article_category_id?: string;
	author?: string;
	start_date?: string;
	end_date?: string;
	title?: string;
	is_active?: number;
	attachment?: string;
	created_at?: string;role_id: string;
};

export type GeneralAdvMainObject = {
	id?: string;
	code?: string;
	type?: number;
	title?: string;
	common_name?: string;
	scientific_name?: string;
	short_description?: string;
	long_description?: string;
	meta_keywords?: string;
	meta_description?: string;
	additional_information?: string;
	is_loyalty_rewards?: number;
	is_weekly_special?: number;
	is_auto_delivery?: number;
	is_availability_emails?: number;
	special_message?: string;
	is_admin_only?: number;
	reject_reason?: string | null;
	status?: number;
	is_advertisement?: number;
	is_active?: number;
	role_id: string;
	average_product_rating?: number;
	average_delivery_rating?: number;
	item_selection?: GeneralAdvItemSelection[];
	item_attributes?: GeneralAdvOneAttributeType[][];
	item_category?: GeneralAdvItemCategory;
	item_media?: GeneralAdvItemMedia[];
	related_article?: GeneralAdvRelatedArticle[];
	related_product?: GeneralAdvRelatedProduct[];
	guarantee_options?: GeneralAdvGuaranteeOption[];
};

export type Meta = {
	total?: number;
};

export type GeneralAdvResponseType = {
	data?: GeneralAdvMainObject[];
	meta?: Meta;
};

export type GeneralAdvSearchByIdResponseType = {
	data?: GeneralAdvMainObject;
};

export type GeneralAdvModifiedDataType = {
	id?: string;
	code?: string;
	type?: number;
	title?: string;
	common_name?: string;
	scientific_name?: string;
	short_description?: string;
	long_description?: string;
	meta_keywords?: string;
	meta_description?: string;
	additional_information?: string;
	is_loyalty_rewards?: number;
	is_weekly_special?: number;
	is_auto_delivery?: number;
	is_availability_emails?: number;
	special_message?: string;
	is_admin_only?: number;
	reject_reason?: string | null;
	status?: number;
	is_advertisement?: number;
	is_active?: number;
	average_product_rating?: number;
	average_delivery_rating?: number;
	item_selection?: GeneralAdvItemSelection[];
	item_attributes?: GeneralAdvOneAttributeType[][];
	item_category?: GeneralAdvItemCategory;
	item_media?: GeneralAdvItemMedia[];
	related_article?: any[];
	related_product?: GeneralAdvRelatedProduct[];
	guarantee_options?: GeneralAdvGuaranteeOption[];
	itemNumber?: string;
	productName?: string;
	category?: string;
	description?: string;
	active?: boolean;
};

export type GeneralAdvGeneralViewSubmitDataType = {
	product_name?: string;
	title?: string;
	scientific_name?: string;
	location?: string;
	category?: string;
	short_description?: string;
	meta_description?: string;
	long_description?: string;
	additional_information?: string;
	product_tag_keywords?: string[];
};

export type imageType = {
	id?: number;
	link?: string;
};

export type MediaModifyResponseData = {
	video_link?: string;
	imagesIn?: imageType[];
	videoIn?: imageType[];
};

export type GeneralAdvShippingMethodSubmitData = {
	selectedGuaranteeOption?: string | null;
	allowEmails?: boolean;
	loyaltyRewards?: boolean;
	weeklySpecial?: boolean;
	autoDelivery?: boolean;
	specialMessage?: string;
};

export type GeneralAdvSearchSubmitData = {
	productId?: string;
	productName?: string;
	category?: string;
	status?: string;
};
