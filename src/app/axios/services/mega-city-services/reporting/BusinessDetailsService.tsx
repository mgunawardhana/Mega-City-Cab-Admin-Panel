// @ts-nocheck
import { del, get, post, put } from '../../../http/LiveAquariaServiceMethods';
import * as url from '../../mega-city-services/url_helper';

export const businessSummery = () => get(`${url.FETCH_BUSINESS_DETAILS}`);
