import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'sampleComponent', en);
i18next.addResourceBundle('si', '', si);
i18next.addResourceBundle('ta', '', ta);

const SampleComponent = lazy(() => import('./GeneralAdvertisementBreadCrumb'));

const GeneralAdvertisementConfig = {
	settings: {
		layout: {}
	},
	permission: 'GENERAL_ADVERTISEMENT',
	routes: [
		{
			path: 'general-advertisement/general-advertisement-view',
			element: <SampleComponent />
		}
	]
};

export default GeneralAdvertisementConfig;
