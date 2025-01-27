import { lazy } from 'react';

const UsersApp = lazy(() => import('./UsersApp'));

/**
 * The finance dashboard app config.
 */
const UsersConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'user-management/users',
			element: <UsersApp />
		}
	]
};

export default UsersConfig;
