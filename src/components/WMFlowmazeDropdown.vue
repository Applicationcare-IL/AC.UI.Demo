<template>
  <WMButton
    :text="label"
    type="type-5"
    icon="pi-chevron-down"
    :is-disabled="isDisabled"
    @click="toggleDropdownMenu"
  />

  <Menu id="overlay_menu" ref="dropdownMenu" :model="actions" :popup="true">
    <template #item="slotProps">
      <button
        class="p-link flex align-items-center p-2 pl-3 text-color hover:surface-200 border-noround gap-2 w-full"
        @click="handleAction(slotProps.item.id)"
      >
        <div class="flex flex-column align">{{ $t(slotProps.item.name) }}</div>
      </button>
    </template>
  </Menu>
</template>

<script setup>
// IMPORTS
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

// DEPENDENCIES
const { executeIssue } = useFlowmaze();
const toast = useToast();
const { t } = useI18n();

// INJECT

// PROPS, EMITS
let props = defineProps({
  label: String,
  actions: Array,
  selectedElements: {
    type: Array,
    default: () => [],
  },
  entity: String,
  entityId: String,
});

// REFS
const dropdownMenu = ref();

// COMPUTED
const isDisabled = computed(() => {
  return props.selectedElements === 0 || props.selectedElements.length <= 0;
});

// COMPONENT METHODS AND LOGIC
const toggleDropdownMenu = (event) => {
  if (isDisabled.value) return;

  dropdownMenu.value.toggle(event);
};

const handleAction = (scriptId) => {
  const promises = props.selectedElements.map((element) => {
    let params = {
      entity_type: props.entity,
      entity_id: element.id,
      script_id: scriptId,
    };

    return executeIssue(params);
  });

  Promise.all(promises)
    .then(() => {
      toast.success(t("scripts.toast-issues-success"));
    })
    .catch(() => {
      toast.error(t("scripts.toast-issues-error"));
    });
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
