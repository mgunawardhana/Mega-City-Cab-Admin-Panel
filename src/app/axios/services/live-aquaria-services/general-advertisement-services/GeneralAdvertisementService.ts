import { get, post, put, del } from '../../../http/LiveAquariaServiceMethods';
import * as url from '../url_helper';

export const fetchDetailsBySKU = (skuId: string) => get(`${url.FETCH_DETAILS_BY_SKU + skuId}/search`);
export const updateGeneralDetails = (skuId: string, data: any) => put(url.UPDATE_GENERAL_DETAILS + skuId, data);
export const fetchAllProductList = (pageNo: string | number, pageSize: string | number) =>
	get(`${url.GET_ALL_PRODUCT_LIST}limit=${pageSize}&page=${pageNo}`);
export const fetchAllProductListByID = (id: string | number) => get(`${url.GET_PRODUCT_BY_ID}${id}`);
export const publishGeneralAdvertisement = (id: string | number, data) =>
	put(`${url.PUBLISHED_GENERAL_ADVERTISEMENT}${id}`, data);
export const updateVarietyDetails = (skuId, varietyId, data: any) =>
	put(url.UPDATE_VARIETY_DETAILS + skuId + url.VARIATION + varietyId, data);
export const uploadThumbnails = (id: string | number, data: any) => post(`${url.UPLOAD_THUMBNAILS}${id}/upload`, data);
export const getRelatedProducts = () => get(url.GET_RELATED_PRODUCTS);
export const taggedRelatedProducts = (advertisementID: string, ids: { related_products: string[] }) =>
	post(`${url.TAG_RELATED_PRODUCTS}${advertisementID}/related-products`, ids);
export const getAllRelatedProductArticle = () => get(url.GET_ALL_RELATED_PRODUCT_ARTICLE);
export const taggedRelatedArticles = (advertisementID: string, ids: { related_articles: string[] }) =>
	post(`${url.TAG_RELATED_ARTICLES}${advertisementID}/related-articles`, ids);
export const updateGeneralAdvertisementGuaranteeOptions = (id: string | number, data: any) =>
	put(`${url.GENERAL_ADVERTISEMENT_GUARANTEE_OPTIONS}${id}`, data);

export const rejectGeneralAdvertisementByID = (id, data) => put(`${url.GENERAL_ADVERTISEMENT_REJECT}${id}`, data);
export const deleteGeneralAdvertisementByID = (id, mediaId) =>
	del(`${url.UPDATE_VARIETY_DETAILS + id}/media/${mediaId}`);
export const getAllAdvanceFilteringGeneralAdvertisementWithPagination = (
	code,
	common_name,
	item_category,
	status,
	pageNo,
	pageSize
) =>
	get(
		`${url.ADVANCE_FILTERING_GENERAL_ADVERTISEMENT}code,${code}|common_name,${common_name}|itemCategory.name,${item_category}|status,${status}&limit=${pageSize}&page=${pageNo}`
	);
export const deleteVarietyMedia = (skuId, varietyId, mediaId) =>
	del(`${url.UPDATE_VARIETY_DETAILS}${skuId}${url.VARIATION}${varietyId}/${mediaId}`);
export const fetchAllPublishProductList = (pageNo, pageSize) =>
	get(`${url.GET_ALL_PUBLISH_PRODUCT_LIST}limit=${pageSize}&page=${pageNo}`);
export const getAllAdvanceFilteringGeneralAdvertisementPublishWithPagination = (
	code,
	common_name,
	item_category,
	status,
	pageNo,
	pageSize
) =>
	get(
		`${url.ADVANCE_FILTERING_GENERAL_ADVERTISEMENT_PUBLISH}code,${code}|common_name,${common_name}|itemCategory.name,${item_category}|status,${status}&limit=${pageSize}&page=${pageNo}`
	);
