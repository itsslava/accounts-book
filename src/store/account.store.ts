import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Account, UpdatableAccount } from '../interface/account.interface';
import {
	splitLabels,
	validateLabelsInput,
	validateLogin,
	validatePassword,
} from '../utils/validation';

const LS_KEY = 'accounts-book:list';

export const useAccountsStore = defineStore('accounts', () => {
	const items = ref<Account[]>([]);

	function derive(next: Account): Account {
		if (next.type === 'LDAP') next.password = null;

		next.labels = splitLabels(next.rawLabels);

		const labelsOk = validateLabelsInput(next.rawLabels);
		const loginOk = next.login !== null && validateLogin(next.login);
		const passwordOk =
			next.type === 'LDAP' ? true : validatePassword(next.password ?? '', next.type);

		next.valid = {
			rawLabels: labelsOk,
			type: true,
			login: loginOk,
			password: next.type === 'LDAP' ? true : passwordOk,
		};
		return next;
	}

	function newAccount(): Account {
		return derive({
			id: crypto.randomUUID(),
			rawLabels: '',
			labels: [],
			type: 'Локальная',
			login: '',
			password: '',
			valid: { rawLabels: true, type: true, login: false, password: false },
		});
	}

	function normalizeOnLoad(a: Account): Account {
		const copy: Account = { ...a, rawLabels: a.rawLabels ?? '' };
		return derive(copy);
	}

	function persist() {
		localStorage.setItem(LS_KEY, JSON.stringify(items.value));
	}

	try {
		const saved = localStorage.getItem(LS_KEY);
		if (saved) {
			items.value = (JSON.parse(saved) as Account[]).map(normalizeOnLoad);
		}
	} catch {
		items.value = [];
	}

	const total = computed(() => items.value.length);
	const hasItems = computed(() => items.value.length > 0);

	function addEmpty() {
		items.value.push(newAccount());
		persist();
	}

	function remove(id: string) {
		items.value = items.value.filter((a) => a.id !== id);
		persist();
	}

	function validateAndSave(patch: UpdatableAccount) {
		const idx = items.value.findIndex((i) => i.id === patch.id);
		if (idx === -1) return;

		const base = items.value[idx]!;
		const next: Account = { ...base };

		if (patch.type !== undefined) next.type = patch.type;
		if (patch.rawLabels !== undefined) next.rawLabels = patch.rawLabels;
		if (patch.login !== undefined) next.login = patch.login;
		if (patch.password !== undefined) next.password = patch.password;

		const derived = derive(next);
		items.value.splice(idx, 1, derived);
		persist();

		const requiredOk =
			derived.valid.login && (derived.type === 'LDAP' ? true : derived.valid.password);
		return requiredOk;
	}

	return { items, total, hasItems, addEmpty, remove, validateAndSave, persist };
});
