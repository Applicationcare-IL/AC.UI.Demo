<template>
  <WMTempButton
    :text="$t('buttons.assign')"
    type="type-5"
    :is-active="isActive"
    :is-disabled="selectedElements == 0"
    :disabled="selectedElements == 0"
    @click="toggle"
  >
    <template #customIcon>
      <div class="d-flex" v-html="AsignIcon" />
    </template>
  </WMTempButton>
  <OverlayPanel
    ref="isOpen"
    :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
  >
    <div class="flex flex-column gap-2">
      <span> {{ $t("selected-contacts") }}: </span>
      <div class="flex flex-row gap-2">
        <Chip
          v-for="(item, index) in utilsStore.selectedElements[
            props.entity
          ]?.slice(0, 3)"
          :key="index"
        >
          {{ item.name }}
        </Chip>
        <div v-if="utilsStore.selectedElements[props.entity]?.length > 3">
          And {{ utilsStore.selectedElements[props.entity]?.length - 3 }} more
        </div>
      </div>
      <span>{{ $t("buttons.assign") }}</span>
      <div class="flex flex-row gap-2">
        <WMButton
          class="m-1 col-6"
          :class="{ selected: assignTo == 'employee' }"
          name="basic-secondary"
          @click="onAssignTo('employee')"
        >
          {{ $t("user") }}
        </WMButton>
        <WMButton
          class="m-1 col-6"
          :class="{ selected: assignTo == 'team' }"
          name="basic-secondary"
          @click="onAssignTo('team')"
        >
          {{ $t("team") }}
        </WMButton>
      </div>

      <WMInputSearch
        name="employeeOrTeam"
        :placeholder="$t('select', ['employee'])"
        type="input-search"
        :multiple="false"
        width="248"
        :options="owners"
        :search-function="searchOwner"
        :model-value="selectedOwner"
        :selected-option="selectedOwner"
        @change="ownerChanged"
      />

      <WMButton class="m-1 col-6" name="basic-secondary" @click="assignOwner">
        {{ $t("buttons.assign") }}
      </WMButton>
    </div>
  </OverlayPanel>
</template>

<script setup>
import { ref, watch } from "vue";

import AsignIcon from "/icons/assign.svg?raw";
import { useLayout } from "@/layout/composables/layout";
import { OwnersService } from "@/service/OwnersService";
import { useUtilsStore } from "@/stores/utils";

const props = defineProps({
  entity: {
    type: String,
    default: "",
  },
});

const ownerChanged = (event) => {
  selectedOwner.value = event.value;
};

const utilsStore = useUtilsStore();
const { layoutConfig } = useLayout();

const isOpen = ref();
const toggle = (event) => {
  isOpen.value.toggle(event);
};

const assignTo = ref("employee");

const onAssignTo = (type) => {
  assignTo.value = type;
};

const toast = useToast();

const emit = defineEmits(["ownerAssigned"]);

const owners = ref([{}]);
const selectedOwner = ref();

const selectedElements = ref(0);

watch(
  () => utilsStore.selectedElements[props.entity],
  (value) => {
    if (!value) return;

    selectedElements.value = value.length;
  },
  { immediate: true }
);

const searchOwner = (query) => {
  return OwnersService.getOwnersFromApi({ search: query }, assignTo.value);
};

const assignOwner = () => {
  OwnersService.assignTo(
    utilsStore.selectedElements[props.entity],
    props.entity,
    selectedOwner.value.id,
    assignTo.value
  ).then(() => {
    emit("ownerAssigned");
    isOpen.value.hide();
    toast.successAction("owner", "assigned");
  });
};
</script>

<style scoped>
.selected {
  background-color: #007ad9;
  color: white;
}
</style>
