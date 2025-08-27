export interface UserWithPassword {
	email: string;
	password: string;
}

export type User = Omit<UserWithPassword, 'password'> & {
	_id: string;
};
