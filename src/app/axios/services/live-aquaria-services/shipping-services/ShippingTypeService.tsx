// @ts-nocheck
import { del, get, post, put } from '../../../http/LiveAquariaServiceMethods';
import * as url from '../../mega-city-services/url_helper';

export const fetchAllShippingTypesData = (pageNo: string | number, pageSize: string | number) => post(`${url.GET_ALL_WEB_ARTICLES}?page=${pageNo}&size=${pageSize}`);

export const fetchAllVehicleData = (pageNo: string | number, pageSize: string | number) => get(`${url.FETCH_ALL_VEHICLES}page=${pageNo}&size=${pageSize}`);

export const updateShippingTypeStatus = (id: string | number, action: any) => put(`${url.UPDATE_SHIPPING_TYPE_STATUS}${id}`, action);

export const deleteShippingType = (id: string | number) => del(`${url.DELETE_CATEGORY_TYPE}${id}`);

