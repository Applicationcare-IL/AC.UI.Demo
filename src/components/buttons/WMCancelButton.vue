<template>
  <WMButton :text="text" type="cancel" :size="size" :is-disabled="isDisabled">
    <template #customIcon>
      <div class="flex" v-html="CancelIcon" />
    </template>
  </WMButton>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";

import CancelIcon from "/icons/cancel_default.svg?raw";

const { t } = useI18n();

const text = ref(t("buttons.cancel"));

defineProps({
  isDisabled: Boolean,
  size: String,
});
</script>
