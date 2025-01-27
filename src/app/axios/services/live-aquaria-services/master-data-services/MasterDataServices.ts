import { del, get, post, put } from '../../../http/LiveAquariaServiceMethods';
import * as url from '../url_helper';

export const getAllProductList = (pageNo, pageSize) =>
	get(`${url.GET_ALL_PRODUCT_LIST}limit=${pageSize}&page=${pageNo}`);
export const getAllAttributeList = () => get(url.GET_ALL_ATTRIBUTE_LIST);
export const getAllAttributeListWithPagination = (pageNo, pageSize) =>
	get(`${url.GET_ALL_ATTRIBUTE_LIST_PAGINATION}limit=${pageSize}&page=${pageNo}`);
export const updateProductAttribute = (productId, data) => put(url.UPDATE_PRODUCT_ATTRIBUTE + productId, data);
export const updateProductVariety = (productId, data) => put(url.UPDATE_PRODUCT_ATTRIBUTE + productId, data);
export const getProduct = (productId) => get(url.UPDATE_PRODUCT_ATTRIBUTE + productId);

export const createAttribute = (data) => post(url.CREATE_ATTRIBUTE, data);
export const updateAttribute = (data, attributeId) => put(url.UPDATE_ATTRIBUTE + attributeId, data);

export const getAllBoxCharge = (pageNo, pageSize) => get(`${url.GET_ALL_BOX_CHARGE}limit=${pageSize}&page=${pageNo}`);
export const getAllCancelOrderReasons = (pageNo, pageSize) =>
	get(`${url.GET_ALL_CANCEL_ORDER_REASON}limit=${pageSize}&page=${pageNo}`);

export const updateOrderReason = (data, reasonId) => put(url.UPDATE_CANCEL_ORDER_REASON + reasonId, data);

export const createOrderReason = (data) => post(url.CREATE_CANCEL_ORDER_REASON, data);

export const deleteOrderReason = (reasonId) => del(url.UPDATE_CANCEL_ORDER_REASON + reasonId);
export const getAllUnitPriceCharge = (pageNo, pageSize) =>
	get(`${url.GET_ALL_UNIT_PRICE_CHARGE}limit=${pageSize}&page=${pageNo}`);
export const createUnitPriceCharge = (data) => post(url.CREATE_UNIT_PRICE_CHARGE, data);
export const updateUnitPriceCharge = (data, reasonId) => put(url.UPDATE_UNIT_PRICE_CHARGE + reasonId, data);
export const deleteUnitPriceCharge = (reasonId) => del(url.UPDATE_UNIT_PRICE_CHARGE + reasonId);
export const getAllStorePickupOptions = (pageNo, pageSize) =>
	get(`${url.GET_ALL_PICKUP_OPTION}limit=${pageSize}&page=${pageNo}`);
export const updateStorePickupOptions = (data, reasonId) => put(url.UPDATE_PICKUP_OPTION + reasonId, data);
export const createStorePickupOptions = (data) => post(url.CREATE_PICKUP_OPTION, data);
export const deleteStorePickupOptions = (reasonId) => del(url.UPDATE_PICKUP_OPTION + reasonId);
export const getAllOrderStatusMaster = (pageNo, pageSize) =>
	get(`${url.GET_ALL_ORDER_STATUS_MASTER}limit=${pageSize}&page=${pageNo}`);
export const updateOrderStatusMaster = (data, reasonId) => put(url.UPDATE_ORDER_STATUS_MASTER + reasonId, data);
export const createOrderStatusMaster = (data) => post(url.CREATE_ORDER_STATUS_MASTER, data);
export const deleteOrderStatusMaster = (reasonId) => del(url.UPDATE_ORDER_STATUS_MASTER + reasonId);
export const getAllCategoryManagementWithPagination = (pageNo, pageSize) =>
	get(`${url.GET_ALL_CATEGORY_MANAGEMENT_LIST_PAGINATION}limit=${pageSize}&page=${pageNo}`);
export const getAllCategoryManagementWithOutPagination = () => get(url.GET_ALL_CATEGORY_MANAGEMENT_WITHOUT_PAGINATION);
export const createCategoryManagement = (data) => post(url.CREATE_CATEGORY_MANAGEMENT, data);
export const updateCategoryManagement = (data, id) => put(url.UPDATE_CATEGORY_MANAGEMENT + id, data);
export const deleteCategoryManagement = (id) => del(url.UPDATE_CATEGORY_MANAGEMENT + id);
export const getAllUnitOfMeasureWithOutPagination = () => get(url.GET_ALL_UNIT_OF_MEASURE);
export const createBoxCharge = (data) => post(url.CREATE_BOX_CHARGE, data);
export const getAllEtfItemMasterData = (pageNo, pageSize) =>
	get(`${url.ETF_ITEM_MASTER_DATA}limit=${pageSize}&page=${pageNo}`);
export const updateEtfMasterData = (data, id) => put(url.UPDATE_ETF_ITEM_MASTER_DATA + id, data);
export const updateBoxCharge = (data, id) => put(url.UPDATE_BOX_CHARGE + id, data);
export const deleteBoxCharge = (id) => del(url.UPDATE_BOX_CHARGE + id);
export const createProductMaster = (data) => post(url.CREATE_PRODUCT_MASTER, data);
export const createGuaranteeOptions = (data) => post(url.CREATE_GUARANTEE_OPTIONS, data);
export const getAllGuaranteeOptionsWithPagination = (pageNo, pageSize) =>
	get(`${url.GET_ALL_GUARANTEE_OPTIONS}limit=${pageSize}&page=${pageNo}`);
export const updateGuaranteeOptions = (data, id) => put(url.UPDATE_GUARANTEE_OPTIONS + id, data);
export const deleteGuaranteeOptions = (id) => del(url.UPDATE_GUARANTEE_OPTIONS + id);
export const getAllEtfItemMasterDataWithOutPagination = () => get(url.ETF_ITEM_MASTER_DATA_WITHOUT_PAGINATION);
export const getAllItemsWithPagination = (pageNo, pageSize) =>
	get(`${url.ETF_ITEM_MASTER_DATA_WITH_PAGINATION}limit=${pageSize}&page=${pageNo}`);
export const updateItems = (data, id) => put(url.ETF_ITEM_UPDATE + id, data);
export const updateItemsSelections = (data, id, selectionId) =>
	put(`${url.ETF_ITEM_UPDATE}${id}/selections/${selectionId}`, data);
export const createItemsSelections = (data, id) => post(`${url.ETF_ITEM_UPDATE}${id}/selections`, data);
export const deleteItemsSelections = (id, selectionId, rowId) =>
	del(`${url.ETF_ITEM_UPDATE}${id}/item-selections/${selectionId}/item-selection-types/${rowId}`);
export const searchCisCode = (id) => get(`${url.UPDATE_ETF_ITEM_MASTER_DATA}${id}/dd-search`);
export const getAllDriversDenMasterDataWithPagination = (pageNo, pageSize) =>
	get(`${url.DRIVERS_MASTER_DATA_WITH_PAGINATION}limit=${pageSize}&page=${pageNo}`);
export const createDriversDenMasterData = (data) => post(url.CREATE_DRIVERS_MASTER_DATA, data);
export const getDriversDenMasterData = (id) => get(url.GET_DRIVERS_MASTER_DATA + id);
export const updateDriversDenMasterData = (data, id) => put(url.GET_DRIVERS_MASTER_DATA + id, data);
export const getAllGuaranteeOptionsWithOutPagination = () => get(url.GET_ALL_GUARANTEE_OPTIONS_WITHOUT_PAGINATION);

export const getAllProductItemReviews = (pageNo, pageSize) =>
	get(`${url.PRODUCT_ITEM_REVIEWS}limit=${pageSize}&page=${pageNo}`);
export const updateProductItemReviews = (data, id) => put(url.UPDATE_PRODUCT_ITEM_REVIEWS + id, data);

export const getItemWiseReviews = (pageNo, pageSize) => get(`${url.ITEM_WISE_REVIEWS}limit=${pageSize}&page=${pageNo}`);
export const updateItemWiseReviews = (data, id) => put(url.UPDATE_PRODUCT_ITEM_REVIEWS + id, data);

export const showItemWiseReviews = (id) => get(url.SHOW_ITEM_WISE_REVIEWS + id);
export const getAllAdvanceFilteringEtfMasterDataWithPagination = (
	cis_code,
	country,
	vendor_code,
	common_name,
	scientific_name,
	master_code,
	is_assign,
	pageNo,
	pageSize
) =>
	get(
		`${url.ADVANCE_FILTERING_ETF_MASTER_DATA}cis_code,${cis_code}|country,${country}|vendor_code,${vendor_code}|common_name,${common_name}|scientific_name,${scientific_name}|master_code,${master_code}&is_assign=${is_assign}&limit=${pageSize}&page=${pageNo}`
	);
export const getAllAdvanceFilteringItemCategoriesDataWithPagination = (name, pageNo, pageSize) =>
	get(`${url.ADVANCE_FILTERING_ITEM_CATEGORIES_DATA}name,${name}&limit=${pageSize}&page=${pageNo}`);
export const getAllAdvanceFilteringProductMasterDataWithPagination = (
	code,
	common_name,
	item_category,
	item_selections,
	pageNo,
	pageSize
) =>
	get(
		`${url.ADVANCE_FILTERING_PRODUCT_MASTER_DATA}code,${code}|common_name,${common_name}|itemCategory.name,${item_category}|itemSelections.selectionTypes.masterData.cis_code,${item_selections}&limit=${pageSize}&page=${pageNo}`
	);
export const getAllAdvanceFilteringDiversDenMasterDataWithPagination = (
	code,
	common_name,
	item_category,
	scientific_name,
	cis_code,
	pageNo,
	pageSize
) =>
	get(
		`${url.ADVANCE_FILTERING_DIVERS_DEN_MASTER_DATA}code,${code}|common_name,${common_name}|itemCategory.name,${item_category}|scientific_name,${scientific_name}|itemSelections.selectionTypes.masterData.cis_code,${cis_code}&limit=${pageSize}&page=${pageNo}`
	);
export const deleteItemsProductSelections = (id, selectionId) =>
	del(`${url.ETF_ITEM_UPDATE}${id}/selections/${selectionId}`);
export const getAllAdvanceFilteringItemAttributesDataWithPagination = (name, pageNo, pageSize) =>
	get(`${url.ADVANCE_FILTERING_ATTRIBUTE_ADVERTISEMENT}name,${name}&limit=${pageSize}&page=${pageNo}`);
export const getAllAttributeListWithOutPagination = () => get(url.GET_ALL_ATTRIBUTE_LIST_WITHOUT_PAGINATION);
export const deleteAttribute = (attributeId) => del(url.UPDATE_ATTRIBUTE + attributeId);
