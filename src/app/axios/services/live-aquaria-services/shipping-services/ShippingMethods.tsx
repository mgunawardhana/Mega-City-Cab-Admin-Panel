import { get, del, post, put } from '../../../http/LiveAquariaServiceMethods';
import * as url from '../url_helper';

export const fetchAllShippingMethodsRelatedDetails = (pageNo: string | number, pageSize: string | number) =>
	get(`${url.GET_ALL_SHIPPING_METHODS}limit=${pageSize}&page=${pageNo}`);

export const fetchAllShippingTypeDetails = () => get(url.FETCH_ALL_SHIPPING_TYPES);

export const fetchAllShippingScheduleNames = () => get(url.GET_SHIPPING_SCHEDULE_NAMES);

export const deleteShippingMethod = (id: string | number) => del(`${url.DELETE_SHIPPING_METHOD}${id}`);

export const createShippingMethod = (data: any) => post(url.CREATE_SHIPPING_METHOD, data);

export const updateShippingMethodStatus = (id: string | number, action: any) =>
	put(`${url.UPDATE_SHIPPING_METHOD_STATUS}${id}`, action);
