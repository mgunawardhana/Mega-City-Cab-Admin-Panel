// import _ from '@lodash';
import { PartialDeep } from 'type-fest';
import { User } from 'src/app/auth/user';

/**
 * Creates a new user object with the specified data.
 */
function UserModel(data: PartialDeep<User>): User {
	data = data || {};

	// return _.defaults(data, {
	// 	uid: '',
	// 	role: 'admin', // guest
	// 	data: {
	// 		displayName: 'admin',
	// 		photoURL: '',
	// 		email: '',
	// 		shortcuts: [],
	// 		settings: {}
	// 	}
	// });

	return {} as User;
}

export default UserModel;
