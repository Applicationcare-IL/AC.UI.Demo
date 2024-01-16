<template>
  <div class="m-3">
    <div class="flex flex-row justify-content-between align-content-center">
      <h1 class="h1 mb-0">{{ entityTitle }}</h1>
      <router-link v-if="name" :to="{ name }" class="p-2">
        <img src="/icons/fullScreen.svg" alt="fullScreen" />
      </router-link>
    </div>
    <Divider />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps({
  entity: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
  titleTranslationKey: {
    type: String,
    default: null,
  },
});

const entityTitle = computed(() => {
  if (props.titleTranslationKey) {
    return t(props.titleTranslationKey);
  }

  return t("new", [`${props.entity}.${props.entity}`]);
});
</script>

<style scoped lang="scss"></style>
