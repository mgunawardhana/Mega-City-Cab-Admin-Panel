import {del, get, post, put} from '../../../http/LiveAquariaServiceMethods'
import * as url from '../../mega-city-services/url_helper';


export const fetchAllGuideLines = (pageNo: string | number, pageSize: string | number) =>
	get(`${url.FETCH_ALL_CATEGORIES}?page=${pageNo}&size=${pageSize}`);


export const handleUpdateGuidelineAPI = (data: any) =>
	put(url.UPDATE_GUIDELINE, data);

export const deleteGuideline = (id: string | number) =>
	del(`${url.DELETE_GUIDELINE}${id}`);
