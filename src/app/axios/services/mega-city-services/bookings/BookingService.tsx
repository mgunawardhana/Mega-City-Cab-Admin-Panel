// @ts-nocheck
import { del, get } from '../../../http/LiveAquariaServiceMethods';
import * as url from '../url_helper';
import { DELETE_BOOKING } from '../url_helper';

export const handleAdvancedFiltrationAPI = (
	bookingDate: any,
	createdDate: any,
	pickupLocation: any,
	dropOffLocation: any,
	carNumber: any,
	driverName: any,
	status: any
) => {
	const queryParams: Record<string, any> = {
		bookingDate,
		createdDate,
		pickupLocation,
		dropOffLocation,
		carNumber,
		driverName,
		status,
	};

	const filteredParams = Object.entries(queryParams)
		.filter(([_, value]) => value !== null && value !== undefined && value !== '')
		.map(([key, value]) => `${key}=${encodeURIComponent(value)}`) // Encode the value for the URL
		.join('&');
	return get(`${url.ADVANCED_FILTERING}?${filteredParams}`);
};

export const handleFilterForRecentCompletedBookings = (
	page: number,
	size: number,
	status: any
) => {
	const queryParams: Record<string, any> = {
		page,
		size,
		status,
	};

	const filteredParams = Object.entries(queryParams)
		.filter(([_, value]) => value !== null && value !== undefined && value !== '')
		.map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
		.join('&');
	return get(`${url.ADVANCED_FILTERING}?${filteredParams}`);
};


export const deleteBooking = (id: string | number) =>
	del(`${url.DELETE_BOOKING}${id}`);