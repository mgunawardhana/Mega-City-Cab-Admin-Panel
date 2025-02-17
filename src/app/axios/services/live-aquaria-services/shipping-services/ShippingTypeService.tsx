// @ts-nocheck
import { del, get, post, put } from '../../../http/LiveAquariaServiceMethods';
import * as url from '../../mega-city-services/url_helper';
import { DELETE_GUIDELINE } from '../../mega-city-services/url_helper';

export const fetchAllShippingTypesData = (pageNo: string | number, pageSize: string | number) => post(`${url.GET_ALL_WEB_ARTICLES}?page=0&size=4`);
export const fetchAllBookings = (pageNo: string | number, pageSize: string | number) => get(`${url.FETCH_ALL_BOOKINGS}?page=${pageNo}&size=${pageSize}`);



export const updateShippingTypeStatus = (id: string | number, action: any) => put(`${url.UPDATE_SHIPPING_TYPE_STATUS}${id}`, action);


export const exportAsExcel = (pageNo: string | number, pageSize: string | number) => get(`${url.EXPORT_AS_EXCEL}`);