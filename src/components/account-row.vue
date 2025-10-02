<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { NInput, NSelect, NButton } from 'naive-ui';
import { Trash2 } from 'lucide-vue-next';
import type { Account, AccountType } from '../interface/account.interface';
import { useAccountsStore } from '../store/account.store';

const props = defineProps<{ model: Account }>();
const store = useAccountsStore();

const rawLabelsLocal = ref('');
const typeLocal = ref<AccountType>('Локальная');
const loginLocal = ref('');
const passwordLocal = ref('');
const isLDAP = computed(() => typeLocal.value === 'LDAP');

watch(
	() => [props.model.rawLabels, props.model.type, props.model.login, props.model.password] as const,
	([raw, type, login, pass]) => {
		rawLabelsLocal.value = raw;
		typeLocal.value = type as AccountType;
		loginLocal.value = login ?? '';
		passwordLocal.value = pass ?? '';
	},
	{ immediate: true }
);

function commitField<K extends 'rawLabels' | 'login' | 'password'>(key: K, value: string) {
	const next = value.trim();
	const prev = ((props.model[key] ?? '') as string).trim();
	if (next === prev) return;
	store.validateAndSave({ id: props.model.id, [key]: next } as Pick<Account, K> & { id: string });
}
function commitType(val: AccountType) {
	if (val === props.model.type) return;
	store.validateAndSave({ id: props.model.id, type: val });
}

const remove = () => store.remove(props.model.id);

const ACCOUNT_TYPE_OPTIONS = [
	{ label: 'Локальная', value: 'Локальная' as AccountType },
	{ label: 'LDAP', value: 'LDAP' as AccountType },
];
</script>

<template>
	<div class="row-grid" data-test="account-row">
		<div class="cell">
			<NInput
				v-model:value="rawLabelsLocal"
				:maxlength="50"
				:status="props.model.valid.rawLabels ? undefined : 'error'"
				clearable
				style="width: 100%"
				placeholder="например: dev; qa; prod"
				data-test="labels-input"
				@blur="commitField('rawLabels', rawLabelsLocal)"
				@keyup.enter="commitField('rawLabels', rawLabelsLocal)"
			/>
		</div>

		<div class="cell type-cell">
			<NSelect
				v-model:value="typeLocal"
				:options="ACCOUNT_TYPE_OPTIONS"
				style="width: 100%"
				data-test="type-select"
				@update:value="val => commitType(val as AccountType)"
			/>
		</div>

		<div class="cell login-cell" :class="{ expand: isLDAP }">
			<NInput
				v-model:value="loginLocal"
				:maxlength="100"
				:status="props.model.valid.login ? undefined : 'error'"
				clearable
				style="width: 100%"
				placeholder="например: ivan.petrov"
				autocomplete="username"
				autocapitalize="off"
				spellcheck="false"
				inputmode="text"
				data-test="login-input"
				@blur="commitField('login', loginLocal)"
				@keyup.enter="commitField('login', loginLocal)"
			/>
		</div>

		<div v-if="!isLDAP" class="cell">
			<NInput
				v-model:value="passwordLocal"
				type="password"
				show-password-on="click"
				:maxlength="100"
				:status="props.model.valid.password ? undefined : 'error'"
				clearable
				style="width: 100%"
				placeholder="введите пароль"
				autocomplete="new-password"
				data-test="password-input"
				@blur="commitField('password', passwordLocal)"
				@keyup.enter="commitField('password', passwordLocal)"
			/>
		</div>

		<div class="actions">
			<NButton
				type="error"
				secondary
				class="icon-btn"
				aria-label="Удалить запись"
				title="Удалить"
				data-test="delete-button"
				@click="remove"
			>
				<Trash2 />
			</NButton>
		</div>

		<div v-if="isLDAP" class="ldap-hint" data-test="ldap-hint">
			Пароль скрыт (LDAP), в сторе = <code>null</code>
		</div>
	</div>
</template>

<style scoped>
.row-grid {
	width: 100%;
	display: grid;
	grid-template-columns: var(--cols, 1.3fr 1fr 1.3fr 1.3fr 40px);
	grid-auto-rows: auto;
	gap: 12px;
	align-items: center;
	padding: 6px 0;
	border-bottom: 1px solid #eee;
}

.cell {
	min-width: 0;
}

.actions {
	grid-column: 5;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}

.login-cell.expand {
	grid-column: 3 / span 2;
}

.ldap-hint {
	grid-column: 1 / 5;
	font-size: 12px;
	color: #6b7280;
	margin-top: -2px;
}

.icon-btn {
	padding: 0;
	width: 36px;
	height: 36px;
	border-radius: 8px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
}
.icon-btn :deep(svg) {
	transition: color 0.12s ease;
}

@media (max-width: 920px) {
	.row-grid {
		grid-template-columns: 1fr;
		gap: 8px;
		align-items: stretch;
	}
	.actions {
		grid-column: auto;
		justify-content: flex-start;
	}
	.login-cell.expand {
		grid-column: auto;
	}
	.ldap-hint {
		grid-column: 1;
	}
}
</style>
