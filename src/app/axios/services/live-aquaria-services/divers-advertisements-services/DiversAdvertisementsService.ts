import { get, post, put, del } from '../../../http/LiveAquariaServiceMethods';
import * as url from '../url_helper';

export const updateDiversAdvertisementsData = (data, id) => put(url.UPDATE_DRIVERS_DEN_ADVERTISEMENTS_DATA + id, data);
export const updateDiversAdvertisementsUploadData = (data, id) =>
	post(`${url.UPDATE_DRIVERS_DEN_ADVERTISEMENTS_DATA + id}/upload`, data);
export const getAllDriversDenAdvertisementsWithPagination = (pageNo, pageSize) =>
	get(`${url.GET_ALL_DRIVERS_DEN_ADVERTISEMENTS_DATA}limit=${pageSize}&page=${pageNo}`);
export const getAllProductWithOutPagination = () => get(url.GET_ALL_PRODUCTS_WITHOUT_PAGINATION);
export const createDiversAdvertisements = (data) => post(`${url.CREATE_DRIVERS_DEN_ADVERTISEMENTS}`, data);
export const getOneDriversDenAdvertisements = (id) => get(url.UPDATE_DRIVERS_DEN_ADVERTISEMENTS_DATA + id);
export const updateDiversAdvertisementsRelatedProductsData = (data, id) =>
	post(`${url.UPDATE_DRIVERS_DEN_ADVERTISEMENTS_RELATED_PRODUCTS}${id}/related-products`, data);
export const publishDiversAdvertisements = (data) => post(`${url.PUBLISH_DRIVERS_DEN_ADVERTISEMENTS}`, data);
export const rejectDiversAdvertisements = (data, id) => put(`${url.UPDATE_DRIVERS_DEN_ADVERTISEMENTS_DATA}${id}`, data);
export const getAllPendingDriversDenAdvertisementsWithPagination = (pageNo, pageSize) =>
	get(`${url.GET_ALL_PENDING_DRIVERS_DEN_ADVERTISEMENTS_DATA}limit=${pageSize}&page=${pageNo}`);
export const getSearchDriversDenAdvertisements = (id) =>
	get(`${url.UPDATE_DRIVERS_DEN_ADVERTISEMENTS_DATA + id}/search`);
export const createDiversDenItemDeleteReason = (data) => post(`${url.CREATE_DIVERS_DEN_ITEM_DELETE_REASON}`, data);
export const getAllDiversDenItemDeleteReason = (pageNo, pageSize) =>
	get(`${url.GET_ALL_DIVERS_DEN_ITEM_DELETE_REASON_WITH_PAGINATION}limit=${pageSize}&page=${pageNo}`);
export const updateDiversDenItemDeleteReason = (data, id) =>
	put(`${url.UPDATE_DIVERS_DEN_ITEM_DELETE_REASON}${id}`, data);
export const deleteDiversDenItemDeleteReason = (id) => del(`${url.UPDATE_DIVERS_DEN_ITEM_DELETE_REASON + id}`);
export const getAllDiversDenItemDeleteReasonWithOutPagination = () =>
	get(url.GET_ALL_DIVERS_DEN_ITEM_DELETE_REASON_WITHOUT_PAGINATION);
export const deleteDriversDenAdvertisements = (id, data) =>
	post(`${url.UPDATE_DRIVERS_DEN_ADVERTISEMENTS_DATA + id}`, data);
export const getAllAdvanceFilteringDriversDenAdvertisementsWithPagination = (
	code,
	common_name,
	item_category,
	status,
	pageNo,
	pageSize
) =>
	get(
		`${url.ADVANCE_FILTERING_DIVERS_DEN_ADVERTISEMENT}code,${code}|parentItem.common_name,${common_name}|parentItem.itemCategory.name,${item_category}|status,${status}&limit=${pageSize}&page=${pageNo}`
	);
export const getAllAdvanceFilteringPendingDriversDenAdvertisementsWithPagination = (
	code,
	common_name,
	item_category,
	status,
	pageNo,
	pageSize
) =>
	get(
		`${url.ADVANCE_FILTERING_DIVERS_DEN_PENDING_ADVERTISEMENT}code,${code}|parentItem.common_name,${common_name}|parentItem.itemCategory.name,${item_category}|status,${status}&limit=${pageSize}&page=${pageNo}`
	);
export const deleteMediaDriversDenAdvertisementByID = (id, mediaId) =>
	del(`${url.UPDATE_DRIVERS_DEN_ADVERTISEMENTS_DATA + id}/media/${mediaId}`);
