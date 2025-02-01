import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'shippingTypes', en);
i18next.addResourceBundle('si', 'shippingTypes', si);
i18next.addResourceBundle('ta', 'shippingTypes', ta);

const ShippingTypes = lazy(() => import('./WebType'));

const WebTypeConfig = {
	settings: {
		layout: {}
	},
	permission: 'SHIPPING_TYPES',
	routes: [
		{
			path: 'web/web-site-management',
			element: <ShippingTypes />
		}
	]
};

export default WebTypeConfig;
