<template>
  <div class="wm-subheader shadow-1 flex-none">
    <div class="flex flex-column gap-5">
      <div class="flex flex-row justify-content-between flex-wrap row-gap-4">
        <div class="flex flex-row flex-wrap">
          <WMButton
            class="m-1 col-6"
            name="new"
            icon="new"
            @click="$emit('new')"
          >
            חדש
          </WMButton>

          <WMButton class="m-1 col-6" name="export-white" icon="export">
            ייצוא נתונים
          </WMButton>

          <Divider layout="vertical" />

          <WMAssignOwnerButton :entity="utilsStore.entity" />

          <WMListSubHeaderCommunications
            :selectedElements="selectedElements"
            :multiple="true"
          />

          <WMButton
            class="m-1 col-6"
            name="phone-white"
            icon="phone"
            :disabled="selectedElements != 1"
            >הקצה
          </WMButton>

          <WMButton
            class="m-1 col-6"
            name="mail-white"
            icon="mail"
            :disabled="selectedElements == 0"
            >הקצה
          </WMButton>
          <!-- <Divider layout="vertical" /> -->
          <!-- <WMButton class="m-1 col-6 " name="basic-secondary">כפתור </WMButton> -->
        </div>
        <div class="flex flex-row align-items-center gap-3">
          <SelectButton
            v-model="selectedOption"
            :options="filterLabels"
            optionLabel="name"
            class="flex flex-nowrap"
          />
        </div>
      </div>
      <div class="flex flex-row justify-content-between">
        <div class="flex flex-row gap-3">
          <WMSearchBox :entity="entity" />

          <WMButton
            name="filter"
            icon="filter"
            :open="isFilterVisible"
            :applied="isFilterApplied"
            @click="openFilterSidebar"
            >הקצה
          </WMButton>
        </div>
        <div class="flex flex-row gap-3">
          <span>רשומות בדף:</span>
          <WMInput
            @update:selectedItem="onChange"
            width="70"
            name="status"
            :highlighted="true"
            type="input-select"
            :options="listRowsPerPage"
            :value="numberOfRows"
          />
        </div>
      </div>
    </div>
  </div>
  <WMSidebar
    :visible="isFilterVisible"
    @close-sidebar="closeFilterSidebar"
    @open-sidebar="openFilterSidebar"
    name="filter"
  >
    <WMFilterForm :entity="props.entity" :filterFormName="props.entity" />
  </WMSidebar>
</template>

<script setup>
import { ref, watch } from "vue";
import { useUtilsStore } from "@/stores/utils";
const utilsStore = useUtilsStore();

const { listRowsPerPage, selectedRowsPerPage } = useListUtils();

const numberOfRows = ref(
  listRowsPerPage.find((x) => x.value === selectedRowsPerPage.value)
);

const props = defineProps({
  activeButtons: Boolean,
  filterLabels: Array,
  defaultOption: Object,
  entity: String,
});

const emits = defineEmits(["new"]);

const isFilterVisible = ref(false);
const isFilterApplied = ref(false);
const selectedOption = props.defaultOption;

const onChange = (event) => {
  selectedRowsPerPage.value = event.value;
};

const selectedElements = ref(0);
watch(
  () => utilsStore.selectedElements[props.entity],
  (value) => {
    selectedElements.value = value.length;
  }
);

function closeFilterSidebar() {
  isFilterVisible.value = false;
}

function openFilterSidebar() {
  isFilterVisible.value = true;
}

// const selectedElements = computed(() => {
//     utilsStore.selectedElements[props.entity] != undefined ? utilsStore.selectedElements[props.entity].length : 0;
//     console.log(utilsStore.selectedElements[props.entity] != undefined ? utilsStore.selectedElements[props.entity].length : 0)
// });
</script>
