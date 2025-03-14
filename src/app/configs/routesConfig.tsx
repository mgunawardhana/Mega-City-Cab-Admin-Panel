import FuseUtils from '@fuse/utils';
import FuseLoading from '@fuse/core/FuseLoading';
import { Navigate } from 'react-router-dom';
import settingsConfig from 'app/configs/settingsConfig';
import { FuseRouteConfigsType, FuseRoutesType } from '@fuse/utils/FuseUtils';
import SignInConfig from '../main/sign-in/SignInConfig';
import SignOutConfig from '../main/sign-out/SignOutConfig';
import Error404Page from '../main/404/Error404Page';
import PagesConfigs from '../main/pages/pagesConfigs';
import DashboardsConfigs from '../main/dashboards/dashboardsConfigs';
import UserInterfaceConfigs from '../main/user-interface/UserInterfaceConfigs';
import DocumentationConfig from '../main/documentation/DocumentationConfig';
import authRoleExamplesConfigs from '../main/auth/authRoleExamplesConfigs';
import customerManagementConfigs from '../main/customerManagement/CustomerManagementConfigs';
import userManagementConfigs from '../main/live-aquaria/user-management/userManagementConfigs';
import ClassicForgotPasswordPage from '../main/pages/authentication/forgot-password/ClassicForgotPasswordPage';
import WebSiteRoot from '../main/live-aquaria/sample-component/website-management/WebSiteRoot';
import VehicleManagementRoot from '../main/live-aquaria/sample-component/vehicle-management/VehicleManagementRoot';
import GuidelineManagementRoot
	from '../main/live-aquaria/sample-component/guideline-management/GuidelineManagementRoot';
import BookingRoot from '../main/live-aquaria/sample-component/booking-management/BookingRoot';

const routeConfigs: FuseRouteConfigsType = [SignOutConfig, SignInConfig, // SignUpConfig,
	DocumentationConfig, ...PagesConfigs, ...UserInterfaceConfigs, ...DashboardsConfigs, ...GuidelineManagementRoot, // ...AppsConfigs,
	...authRoleExamplesConfigs, ...userManagementConfigs, // ...ticketManagementConfigs,
	...customerManagementConfigs, ...WebSiteRoot, ...VehicleManagementRoot, ...BookingRoot];

/**
 * The routes of the application.
 */
const routes: FuseRoutesType = [...FuseUtils.generateRoutesFromConfigs(routeConfigs, settingsConfig.defaultAuth), {
	path: '/', element: <Navigate to="/dashboards/project" />, auth: settingsConfig.defaultAuth
}, {
	path: 'loading', element: <FuseLoading />
}, {
	path: 'forgot-password/:token', element: <ClassicForgotPasswordPage />
}, {
	path: '404', element: <Error404Page />
}, {
	path: '*', element: <Navigate to="404" />
}];

export default routes;
