import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'generalAdvertisementPublish', en);
i18next.addResourceBundle('si', 'generalAdvertisementPublish', si);
i18next.addResourceBundle('ta', 'generalAdvertisementPublish', ta);

const GeneralAdvertisementPublish = lazy(() => import('./GeneralAdvertisementPublishBreadCrumb'));

const GeneralAdvertisementPublishConfig = {
	settings: {
		layout: {}
	},
	permission: 'GENERAL_ADVERTISEMENT',
	routes: [
		{
			path: 'general-advertisement/general-advertisement-publish',
			element: <GeneralAdvertisementPublish />
		}
	]
};

export default GeneralAdvertisementPublishConfig;
