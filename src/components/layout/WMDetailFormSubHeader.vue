<template>
  <div class="wm-subheader shadow-1 flex-none">
    <div class="flex flex-column gap-5">
      <div class="flex flex-row justify-content-between flex-wrap row-gap-4">
        <div class="flex flex-row flex-wrap gap-2 align-items-center">
          <WMButton
            @click="saveForm"
            name="save"
            icon="save"
            type="specialSave"
            iconPosition="left"
            :disabled="!getFormMeta(formKey)?.dirty"
          >
            {{ $t("save") }}
          </WMButton>
          <Divider layout="vertical" />
          <WMAssignOwnerButton :entity="utilsStore.entity" />

          <WMSendMessageButton
            :selectedElements="selectedElements"
            :multiple="false"
          />

          <WMButton
            class="m-1 col-6"
            name="phone-white"
            icon="phone"
            :disabled="selectedElements == 0"
          >
            שיחה
          </WMButton>

          <WMSendEmailButton
            :selectedElements="selectedElements"
            :multiple="false"
          />

          <WMCompleteTasksButton
            v-if="utilsStore.entity == 'task'"
            :entity="utilsStore.entity"
          ></WMCompleteTasksButton>
        </div>
        <div>
          <WMButton
            v-if="isActiveTask"
            class="m-1 col-6"
            name="cancel"
            icon="cancel"
            @click="dialog.cancelService(route.params.id)"
            >Cancel
          </WMButton>

          <WMButton
            v-if="showUpdateEntityStateButton"
            class="m-1 col-6"
            name="basic-secondary"
            @click="
              $emit(
                'updateEntityState',
                route.params.id,
                isEntityActive ? 'not_active' : 'active'
              )
            "
          >
            {{
              isEntityActive ? $t("buttons.deactivate") : $t("buttons.activate")
            }}
          </WMButton>
        </div>
      </div>
    </div>
  </div>
  <WMCancelServiceDialog />
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useFormUtilsStore } from "@/stores/formUtils";
import { useUtilsStore } from "@/stores/utils";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";

const route = useRoute();
const dialog = useDialog();
const formUtilsStore = useFormUtilsStore();
const utilsStore = useUtilsStore();

const emit = defineEmits(["saveForm", "updateEntityState"]);

const { getFormMeta } = storeToRefs(formUtilsStore);

const showUpdateEntityStateButton = computed(() => {
  return ["customer", "contact"].includes(utilsStore.entity);
});

const props = defineProps({
  activeButtons: Boolean,
  defaultOption: Object,
  formKey: String,
});

const selectedElements = ref(0);
const isEntityActive = ref(false);

const saveForm = () => {
  emit("saveForm");
};

watch(
  () => utilsStore.selectedElements[utilsStore.entity],
  (value) => {
    selectedElements.value = value?.length;
    isEntityActive.value =
      utilsStore.selectedElements[utilsStore.entity][0].state === "active";
  }
);
</script>
