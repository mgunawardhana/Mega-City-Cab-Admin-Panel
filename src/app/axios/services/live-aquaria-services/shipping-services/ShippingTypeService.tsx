// @ts-nocheck
import { del, get, put, post } from '../../../http/LiveAquariaServiceMethods';
import * as url from '../url_helper';
import { GET_ALL_WEB_ARTICLES } from '../url_helper';

export const fetchAllShippingTypesData = (pageNo: string | number, pageSize: string | number) =>
	post(`${url.GET_ALL_WEB_ARTICLES}?page=0&size=4`)

export const fetchAllVehicleData = (pageNo: string | number, pageSize: string | number) =>
	get(`${url.FETCH_ALL_VEHICLES}page=${pageNo}&size=${pageSize}`)


export const updateShippingTypeStatus = (id: string | number, action: any) =>
	put(`${url.UPDATE_SHIPPING_TYPE_STATUS}${id}`, action);

export const fetchAllCategoryTypesData = () => get(url.GET_ALL_CATEGORY_TYPES);
export const deleteShippingType = (id: string | number) => del(`${url.DELETE_CATEGORY_TYPE}${id}`);
export const updateShippingType = (id: string | number, data: any) => put(`${url.UPDATE_CATEGORY_TYPE}${id}`, data);
export const createNewShippingType = (data: any) => post(url.CREATE_CATEGORY_TYPE, data);
export const getAllHolidays = () => get(url.GET_ALL_HOLIDAYS);
export const createHoliday = (data) => post(url.CREATE_HOLIDAY, data);
export const getAllHolidayCalData = () => get(url.GET_ALL_DATA_HOLIDAY_CAL);
export const updateHoliday = (data, id) => put(`${url.UPDATE_HOLIDAY}${id}`, data);
export const deleteHoliday = (id) => del(`${url.UPDATE_HOLIDAY}${id}`);
