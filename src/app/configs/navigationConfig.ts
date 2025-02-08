import i18next from 'i18next';
import { FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);

/**
 * The navigationConfig object is an array of navigation items for the Fuse application.
 */
const navigationConfig: FuseNavItemType[] = [
	{
		id: 'dashboards',
		title: 'Dashboards',
		subtitle: 'Reports generations',
		type: 'group',
		icon: 'heroicons-outline:home',
		translate: 'DASHBOARDS',
		children: [
			{
				id: 'dashboards.project',
				title: 'Dashboard',
				type: 'item',
				icon: 'heroicons-outline:presentation-chart-line',
				url: '/dashboards/project'
			},
			// {
			// 	id: 'dashboards.analytics',
			// 	title: 'Analytics',
			// 	type: 'item',
			// 	icon: 'heroicons-outline:chart-pie',
			// 	url: '/dashboards/analytics'
			// },
			{
				id: 'dashboards.finance',
				title: 'Finance',
				type: 'item',
				icon: 'heroicons-outline:cash',
				url: '/dashboards/finance'
			}
		]
	},
	{
		id: 'propertymanagement',
		title: 'Property Management',
		type: 'group',
		icon: 'heroicons-outline:home',
		translate: 'PROPERTY_MANAGEMENT',
		subtitle: 'Business Properties Management',
		children: [
			{
				id: 'propertymanagement.users',
				title: 'Users',
				type: 'item',
				icon: 'heroicons-outline:user',
				url: '/user-management/users',
				translate: 'USERS'
			}
		]
	},
	{
		id: 'guideline',
		title: 'Guideline',
		type: 'item',
		icon: 'heroicons-outline:shield-exclamation',
		url: 'guideline/guideline-management',
		end: true,
		translate: 'Guideline'
	},
	{
		id: 'vehicle',
		title: 'Vehicle',
		type: 'item',
		icon: 'heroicons-outline:truck',
		url: '/vehicle/vehicle-management',
		end: true,
		translate: 'Vehicle'
	},
	{
		id: 'booking',
		title: 'Booking',
		type: 'item',
		icon: 'heroicons-outline:bookmark',
		url: '/apps/booking',
		end: true,
		translate: 'Bookings'
	},
	{
		id: 'website',
		title: 'Website',
		type: 'item',
		icon: 'heroicons-outline:globe-alt',
		url: '/web/web-site-management',
		end: true,
		translate: 'Website'
	},

];

export default navigationConfig;
