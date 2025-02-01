import { AxiosRequestConfig } from 'axios';
import { get, post, del, put } from '../../../http/LiveAquariaServiceMethods';
import * as url from '../url_helper';

export const fetchAllShippingDelays = (pageNo: string | number, pageSize: string | number) =>
	get(`${url.SHIPPING_DELAYS}?limit=${pageSize}&page=${pageNo}`);

export const fetchAllShippingTypesForDropDown = () => get(url.GET_ALL_WEB_ARTICLES);
export const createNewShippingHold = (data: AxiosRequestConfig) => post(url.SHIPPING_DELAYS, data);
export const loadAllAmericanStates = () => get(url.FETCH_AMERICAN_STATES);
export const deleteShippingDelay = (id: string | number) => del(`${url.SHIPPING_DELAYS}/${id}`);

export const updateShippingHold = (id: string | number, data: AxiosRequestConfig) =>
	put(`${url.SHIPPING_DELAYS}/${id}`, data);
