import type { AccountType, LabelObj } from '../interface/account.interface';

export const MAX_LABELS_INPUT = 50;
export const MAX_LOGIN = 100;
export const MAX_PASSWORD = 100;

export function validateLabelsInput(labelsRaw: string): boolean {
	return labelsRaw.length <= MAX_LABELS_INPUT;
}

export function splitLabels(labelsRaw: string): LabelObj[] {
	const tokens = labelsRaw
		.split(';')
		.map((token) => token.trim())
		.filter((token) => token.length > 0);

	return tokens.map((token) => ({ text: token }));
}

export function validateLogin(loginInput: string): boolean {
	const normalized = loginInput.trim();
	return normalized.length > 0 && normalized.length <= MAX_LOGIN;
}

export function validatePassword(passwordInput: string, accountType: AccountType): boolean {
	if (accountType === 'LDAP') return true;
	const normalized = passwordInput.trim();
	return normalized.length > 0 && normalized.length <= MAX_PASSWORD;
}
