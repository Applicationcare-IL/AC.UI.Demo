<template>
  <div class="flex flex-column gap-3 mb-3">
    <div class="flex flex-row justify-content-end">
      <div class="flex flex-row">
        <Button link @click="clear">{{ $t("buttons.clear") }}</Button>
        <WMSearchBox v-model="searchText" :entity="entity" />
      </div>
    </div>
    <div class="flex flex-row justify-content-end">
      <div class="flex">
        <SelectButton
          v-model="owner"
          :options="ownerOptions"
          option-label="label"
          option-value="value"
          class="flex flex-nowrap"
        />
      </div>
    </div>
    <DataTable
      v-model:selection="selectedRow"
      :value="data"
      paginator
      :rows="5"
      selection-mode="single"
      data-key="area_id"
      class="sla-table"
      :meta-key-selection="false"
    >
      <Column
        field="breached"
        :header="$t('sla.breached')"
        class="sla-big-text"
      >
        <template #body="slotProps">
          <div class="sla-table__breached">
            {{ slotProps.data.breached }}
          </div>
        </template>
      </Column>
      <Column
        field="near_breach"
        :header="$t('sla.near_breach')"
        class="sla-big-text"
      >
        <template #body="slotProps">
          <div class="sla-table__near-breach">
            {{ slotProps.data.near_breach }}
          </div>
        </template>
      </Column>
      <Column
        field="no_breach"
        :header="$t('sla.no_breach')"
        class="sla-big-text"
      >
        <template #body="slotProps">
          <div class="sla-table__no-breach">
            {{ slotProps.data.no_breach }}
          </div>
        </template>
      </Column>
      <Column
        v-if="entity === 'tasks_sla'"
        field="family"
        :header="$t('task.family')"
      />
      <Column
        v-if="entity === 'services_sla'"
        field="area_value"
        header="area_value"
      />
    </DataTable>
  </div>
</template>

<script setup>
// IMPORTS
import { watchDebounced } from "@vueuse/core";
import { ref } from "vue";

// DEPENDENCIES

// INJECT

// PROPS, EMITS
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  entity: {
    type: String,
    required: true,
    validator: (value) => {
      return ["tasks_sla", "services_sla"].includes(value);
    },
  },
});

const emit = defineEmits([
  "update:searchText",
  "update:selectedRow",
  "update:owner",
]);

// REFS
const searchText = ref("");
const selectedRow = ref(null);
const defaultOwnerValue = "team";
const owner = ref(defaultOwnerValue);

const ownerOptions = ref([
  { label: "Team", value: "team" },
  {
    label: props.entity === "tasks_sla" ? "My tasks" : "My services",
    value: "me",
  },
]);

// COMPUTED

// COMPONENT METHODS
const clear = () => {
  searchText.value = "";
  selectedRow.value = null;
  owner.value = defaultOwnerValue;
};

// PROVIDE, EXPOSE

// WATCHERS
watchDebounced(
  searchText,
  (value) => {
    emit("update:searchText", value);
  },
  { debounce: 300 }
);

watchDebounced(
  () => selectedRow.value,
  (value) => {
    emit("update:selectedRow", value);
  },
  { debounce: 300 }
);

watchDebounced(
  owner,
  (value) => {
    emit("update:owner", value);
  },
  { debounce: 300 }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped lang="scss">
.sla-table {
  :deep(.sla-table__breached) {
    background: var(--red-100);
  }

  :deep(.sla-table__near-breach) {
    background: var(--yellow-100);
  }

  :deep(.sla-table__no-breach) {
    background: var(--green-100);
  }

  :deep(.p-highlight .sla-table__breached) {
    background: var(--red-300);
  }

  :deep(.p-highlight .sla-table__near-breach) {
    background: var(--yellow-300);
  }

  :deep(.p-highlight .sla-table__no-breach) {
    background: var(--green-300);
  }
}
</style>
