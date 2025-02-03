import {del, get, post, put} from '../../../http/LiveAquariaServiceMethods'
import * as url from '../../mega-city-services/url_helper';


export const fetchAllGuideLines = (pageNo: string | number, pageSize: string | number) =>
	get(`${url.FETCH_ALL_CATEGORIES}`);
