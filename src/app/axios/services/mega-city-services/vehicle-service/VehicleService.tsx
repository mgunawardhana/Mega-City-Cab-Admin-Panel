// @ts-nocheck
import { get, post, put, del } from '../../../http/LiveAquariaServiceMethods';
import * as url from '../../mega-city-services/url_helper';

export const fetchAllVehicleData = (pageNo: string | number, pageSize: string | number) => get(`${url.FETCH_ALL_VEHICLES}page=${pageNo}&size=${pageSize}`);

export const handleUpdateVehicleAPI = (data: any) => put(url.UPDATE_VEHICLE, data);

export const handleSaveVehicleAPI = (data: any) => post(url.CREATE_VEHICLE, data);

export const handleDeleteAction = (id: string | number) => del(`${url.DELETE_VEHICLE}${id}`);

