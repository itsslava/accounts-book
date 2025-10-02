<script setup lang="ts">
import { NButton, NAlert } from 'naive-ui';
import { Plus, HelpCircle } from 'lucide-vue-next';
import { useAccountsStore } from '../store/account.store';
import AccountRow from './account-row.vue';

const store = useAccountsStore();
const add = () => store.addEmpty();

const COLUMNS = ['Метки', 'Тип записи', 'Логин', 'Пароль', ''];
</script>

<template>
	<div class="form-wrap" data-test="accounts-form">
		<header class="head">
			<h1>Учетные записи</h1>
			<NButton
				class="add-btn"
				type="primary"
				strong
				secondary
				aria-label="Добавить учетную запись"
				title="Добавить учетную запись"
				data-test="add-button"
				@click="add"
			>
				<span class="icon-left"><Plus /></span>
				Добавить
			</NButton>
		</header>

		<NAlert :show-icon="false" class="hint">
			<div class="hint-content">
				<span class="hint-icon"><HelpCircle /></span>
				Для указания нескольких меток для одной пары логин/пароль используйте разделитель ";"
			</div>
		</NAlert>

		<div class="columns" role="row" aria-label="Заголовки колонок" data-test="columns">
			<div
				v-for="(label, i) in COLUMNS"
				:key="i"
				class="col"
				role="columnheader"
				:aria-hidden="label === ''"
			>
				{{ label }}
			</div>
		</div>

		<div v-if="!store.items.length" class="empty" data-test="empty">
			Записей пока нет. Нажмите «Добавить».
		</div>

		<AccountRow v-for="acc in store.items" :key="acc.id" :model="acc" />
	</div>
</template>

<style scoped>
.form-wrap {
	--cols: 1.3fr 1fr 1.3fr 1.3fr 40px;
}

.head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 8px;
}
.icon-left {
	display: inline-flex;
	margin-right: 8px;
}

.add-btn {
	transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.hint {
	margin-bottom: 12px;
}
.hint-content {
	display: flex;
	align-items: center;
	gap: 8px;
}
.hint-icon {
	display: inline-flex;
}

.columns {
	display: grid;
	grid-template-columns: var(--cols);
	gap: 12px;
	color: #6b7280;
	font-size: 12px;
	margin: 6px 0 4px;
}
.col {
	padding-left: 0;
}

.empty {
	color: #6b7280;
	margin: 8px 0;
}

@media (max-width: 920px) {
	.columns {
		display: none;
	}
}
</style>
