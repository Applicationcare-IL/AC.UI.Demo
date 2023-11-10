<template>
  <div class="wm-subheader shadow-1 flex-none">
    <div class="flex flex-column gap-5">
      <div class="flex flex-row justify-content-between flex-wrap row-gap-4">
        <div class="flex flex-row flex-wrap gap-2 align-items-center">
          <WMButton
            @click="formStore.save"
            name="save"
            icon="save"
            type="specialSave"
            iconPosition="left"
            :disabled="!formStore.formMeta.dirty || !formStore.formMeta.valid"
          >
            {{ $t("save") }}</WMButton
          >
          <Divider layout="vertical" />
          <WMAssignButton :entity="utilsStore.entity" />
          <WMButtonMenu
            class="m-1"
            mode="light"
            :menuItems="menuItems"
            :disabled="selectedElements == 0"
            >הודעה
          </WMButtonMenu>
          <WMButton
            class="m-1 col-6"
            name="phone-white"
            icon="phone"
            :disabled="selectedElements == 0"
            >הקצה
          </WMButton>
          <WMButton
            class="m-1 col-6"
            name="mail-white"
            icon="mail"
            :disabled="selectedElements == 0"
            >הקצה</WMButton
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useFormUtilsStore } from "@/stores/formUtils";
import { useUtilsStore } from "@/stores/utils";

const formStore = useFormUtilsStore();
const utilsStore = useUtilsStore();

const menuItems = [
  { label: "Whatsapp", value: "option1" },
  { label: "SMS", value: "option2" },
];
const selectedElements = ref(0);
watch(
  () => utilsStore.selectedElements[utilsStore.entity],
  (value) => {
    selectedElements.value = value.length;
  }
);

const props = defineProps({
  activeButtons: Boolean,
  filterLabels: Array,
  defaultOption: Object,
});
</script>
