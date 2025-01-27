import { lazy } from 'react';

const AllCustomersApp = lazy(() => import('./AllCustomersApp'));

/**
 * The finance dashboard app config.
 */
const AllCustomersConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'customer-management/all-registered-customers',
			element: <AllCustomersApp />
		}
	]
};

export default AllCustomersConfig;
