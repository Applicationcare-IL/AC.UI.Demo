<template>
  <Card class="w-full">
    <template #title>
      <div class="w-full flex align-items-center justify-content-between">
        <div class="flex gap-3">
          {{ $t("sale.mandatory-requirements") }}
          <WMNewButtonIconOnly v-if="editMode" @click="addNewMandatoryField" />
        </div>
        <WMEditButtonIconOnly v-if="!editMode" @click="editMode = true" />
        <WMSaveButtonIconOnly
          v-else
          @click="
            emit('save');
            editMode = false;
          "
        />
      </div>
    </template>
    <template #content>
      <div v-if="!editMode" class="flex flex-column gap-3">
        <div
          v-for="(mandatoryRequirement, index) in mandatoryRequirementsList"
          :key="mandatoryRequirement.id"
          class="bg-blue-50 border-round-xl p-3 flex gap-3 align-items-center"
        >
          <span class="font-bold h4">
            {{ index + 1 }}
          </span>
          <span class="text-base">{{ mandatoryRequirement.item }}</span>
        </div>
      </div>
      <WMEditMandatoryFields v-else v-model="mandatoryRequirementsList" />
    </template>
  </Card>
</template>

<script setup>
// IMPORTS
// DEPENDENCIES
import { useField } from "vee-validate";
import { onMounted, ref, watch } from "vue";

// INJECT

// PROPS, EMITS
const props = defineProps({
  sale: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["save"]);

// REFS
const editMode = ref(false);
const mandatoryRequirementsList = ref([]);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const { handleChange: handleChangeMandatoryFields } = useField(
  "mandatory_requirements",
  undefined,
  {
    initialValue: [],
  }
);

const addNewMandatoryField = () => {
  mandatoryRequirementsList.value.push({
    id: Math.random(), // used to work with indexes in the list
    item: "",
  });
};

// PROVIDE, EXPOSE

// WATCHERS
watch(
  mandatoryRequirementsList,
  (newValue) => {
    handleChangeMandatoryFields(newValue);
  },
  {
    deep: true,
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  if (props.sale.mandatory_requirements) {
    mandatoryRequirementsList.value = props.sale.mandatory_requirements.map((item) => ({
      id: Math.random(),
      item,
    }));
  }
});
</script>

<style scoped></style>
