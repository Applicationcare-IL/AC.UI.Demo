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
        <div>
          <WMButton
            v-if="
              utilsStore.entity == 'service' &&
              utilsStore.selectedElements['service'][0]['state'] == 'active'
            "
            class="m-1 col-6"
            name="cancel"
            icon="cancel"
            @click="dialog.cancelService(route.params.id)"
            >Cancel
          </WMButton>
        </div>
      </div>
    </div>
  </div>
  <WMCancelServiceDialog />
</template>

<script setup>
import { ref, watch } from "vue";
import { useFormUtilsStore } from "@/stores/formUtils";
import { useUtilsStore } from "@/stores/utils";
import { useDialog } from "@/stores/dialog";
import { useRoute } from "vue-router";

const route = useRoute();
const dialog = useDialog();
const formStore = useFormUtilsStore();
const utilsStore = useUtilsStore();

const menuItems = [
  { label: "Whatsapp", value: "option1" },
  { label: "SMS", value: "option2" },
];

const props = defineProps({
  activeButtons: Boolean,
  filterLabels: Array,
  defaultOption: Object,
});

const selectedElements = ref(0);

watch(
  () => utilsStore.selectedElements[utilsStore.entity],
  (value) => {
    selectedElements.value = value?.length;
  }
);
</script>
