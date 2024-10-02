<template>
  <Card class="w-full">
    <template #title>
      <div class="w-full flex align-items-center justify-content-between">
        <div class="flex gap-3">
          {{ $t("sale.mandatory-requirements") }}
          <WMNewButtonIconOnly v-if="editMandatoryRequirements" @click="addNewMandatoryField" />
        </div>
        <WMEditButtonIconOnly
          v-if="!editMandatoryRequirements"
          @click="editMandatoryRequirements = true"
        />
        <WMSaveButtonIconOnly
          v-else
          @click="
            emit('save');
            editMandatoryRequirements = false;
          "
        />
      </div>
    </template>
    <template #content>
      <WMEditMandatoryFields v-model="mandatoryRequirementsList" />
    </template>
  </Card>
</template>

<script setup>
// IMPORTS
import { ref } from "vue";

// DEPENDENCIES

// INJECT

// PROPS, EMITS
const emit = defineEmits(["save"]);

// REFS

// COMPUTED

// COMPONENT METHODS AND LOGIC
const editMandatoryRequirements = ref(false);

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
