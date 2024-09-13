<template>
  <WMInput
    :value="selectedOption"
    name="relationship"
    type="input-select"
    :highlighted="true"
    :options="relationshipTypesList"
    :size="size"
    required
    @update:selected-item="modelValue = $event.id"
  />
</template>

<script setup>
// IMPORTS
import { onMounted, ref } from "vue";

// DEPENDENCIES
const { getProductRelationshipTypes } = useProducts();

// INJECT

// PROPS, EMITS
const modelValue = defineModel();

defineProps({
  size: {
    type: String,
    default: "sm",
  },
  selectedRelationshipType: {
    type: Object,
    default: null,
  },
});

// REFS
const relationshipTypesList = ref([]);
const selectedOption = ref(null);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const loadProductRelationshipTypes = async () => {
  let response = await getProductRelationshipTypes({
    per_page: 999999999,
  });

  relationshipTypesList.value = response.data.map((employee) => {
    return {
      id: employee.id,
      label: employee.name,
    };
  });
};

const setSelectedOption = async () => {
  selectedOption.value = relationshipTypesList.value.find(
    (option) => option.id === modelValue.value.id
  );
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  await loadProductRelationshipTypes();
  if (modelValue.value) {
    await setSelectedOption();
  }
});
</script>

<style scoped></style>
