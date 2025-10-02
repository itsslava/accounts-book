<script setup lang="ts">
import { NButton, NAlert } from 'naive-ui';
import { Plus, HelpCircle } from 'lucide-vue-next';
</script>

<template>
	<div class="page">
		<header class="head">
			<h1>Учетные записи</h1>
			<NButton type="primary" strong secondary>
				<span class="icon-left"><Plus /></span>
				Добавить
			</NButton>
		</header>

		<NAlert class="hint" :show-icon="false">
			<div class="hint-content">
				<span class="hint-icon"><HelpCircle /></span>
				Для указания нескольких меток для одной пары логин/пароль используйте разделитель ";"
			</div>
		</NAlert>
	</div>
</template>

<style scoped>
.page {
	max-width: 1040px;
	margin: 24px auto;
	padding: 0 16px;
}
.head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 8px;
}
.icon-left {
	margin-right: 8px;
	display: inline-flex;
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
.demo {
	color: #4b5563;
}
</style>
