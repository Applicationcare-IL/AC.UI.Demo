<template>
  <div class="wm-detail-form-container flex flex-auto flex-column overflow-auto mt-5">
    <div class="flex flex-column gap-2">
      <label class="wm-form-label" for="entity">Select an entity:</label>
      <Dropdown
        name="entity"
        v-model="selectedEntity"
        :options="entities"
        optionLabel="name"
        placeholder="Select an entity"
        class="w-full md:w-14rem"
        @change="onEntityChange($event.value)"
      />
    </div>

    <pre>    {{ schemaFields }}</pre>
  </div>
</template>

<script setup>
// IMPORTS
import { computed, onMounted, ref, watch, watchEffect } from "vue";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { getEasymazeEntitiesList } = useAdminSystem();
const { getSchema } = useSchema();

// INJECT

// PROPS, EMITS

// REFS
const entities = ref([]);
const selectedEntity = ref();
const schemaFields = ref();

// COMPUTED

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Schema",
});

const fetchEntities = () => {
  getEasymazeEntitiesList().then((result) => {
    entities.value = result.data;
  });
};

fetchEntities();

const onEntityChange = (entity) => {
  getSchema(entity.name).then((result) => {
    schemaFields.value = result.data;
  });
};

const onOrderDirChange = (orderDir) => {
  orderDir.value = orderDir;
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped lang="scss"></style>
