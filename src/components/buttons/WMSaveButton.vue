<template>
  <WMButton :text="text" :type="type" :is-disabled="isDisabled" class="overflow-hidden">
    <template #customIcon>
      <div v-if="!isSaved" class="flex" v-html="SaveIcon" />
      <div v-else class="flex" v-html="DoneIcon" />
    </template>
  </WMButton>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

import DoneIcon from "/icons/done.svg?raw";
import SaveIcon from "/icons/save_default.svg?raw";

const { t } = useI18n();

const props = defineProps({
  isDisabled: Boolean,
  isSaved: Boolean,
});

const text = computed(() => {
  return props.isSaved ? t("buttons.saved") : t("buttons.save");
});

const type = computed(() => {
  return props.isSaved ? "saved" : "save";
});
</script>
