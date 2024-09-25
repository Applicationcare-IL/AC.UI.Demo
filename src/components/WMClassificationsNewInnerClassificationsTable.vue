<template>
  <h3 class="h3 mb-0">Classifications within this Service Area (Service Detail)</h3>
  <div class="flex gap-2">
    <WMButton text="New" type="new" size="small" @click="handleNewOptionSetValue" />
    <WMButton text="Activate" type="type-1" size="small" />
    <WMButton text="Deactivate" type="remove" size="small" />
  </div>
  <!-- <pre>{{ newOptionSets }}</pre> -->
  <DataTable :value="newOptionSets" table-style="min-width: 50rem">
    <Column field="value" header="Interal name">
      <template #body="{ data }">
        <InputText v-model="data.value" />
      </template>
    </Column>
    <Column field="status" header="status">
      <template #body="{ data }">
        <Dropdown
          v-model="data.status"
          :options="statusOptions"
          option-label="label"
          option-value="value"
        />
      </template>
    </Column>
    <Column field="value_en" header="English display name">
      <template #body="{ data }">
        <InputText v-model="data.value_en" />
      </template>
    </Column>
    <Column field="value_he" header="Hebrew dispaly name">
      <template #body="{ data }">
        <InputText v-model="data.value_he" />
      </template>
    </Column>
    <template #empty>No classifications found</template>
  </DataTable>
</template>

<script setup>
// IMPORTS
import { ref } from "vue";

// DEPENDENCIES

// INJECT

// PROPS, EMITS

// REFS
const newOptionSets = ref([]);

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

// COMPUTED

// COMPONENT METHODS AND LOGIC
const getOptionSetValueTemplate = () => {
  return {
    value: "test",
    status: "active",
    value_en: "test",
    value_he: "test",
  };
};

const handleNewOptionSetValue = () => {
  newOptionSets.value = [getOptionSetValueTemplate(), ...newOptionSets.value];
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
