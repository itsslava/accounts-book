export type AccountType = 'LDAP' | 'Локальная';

export interface LabelObj {
	text: string;
}

export interface Account {
	id: string;

	rawLabels: string;
	labels: LabelObj[];
	type: AccountType;
	login: string | null;
	password: string | null;

	valid: {
		rawLabels: boolean;
		type: boolean;
		login: boolean;
		password: boolean;
	};
}

export type UpdatableAccount = Partial<Omit<Account, 'labels' | 'valid'>> & { id: string };
