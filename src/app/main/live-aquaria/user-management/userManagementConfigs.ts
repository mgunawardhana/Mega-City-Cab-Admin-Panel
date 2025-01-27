import { FuseRouteConfigsType } from '@fuse/utils/FuseUtils';
import UserRolesAppConfig from './roles/UserRolesConfig';
import UserPermissionsConfig from './permissions/UserPermissionsConfig';
import UsersConfig from './users/UsersConfig';

/**
 * User Management App Config
 */
const userManagementConfigs: FuseRouteConfigsType = [UserRolesAppConfig, UserPermissionsConfig, UsersConfig];

export default userManagementConfigs;
