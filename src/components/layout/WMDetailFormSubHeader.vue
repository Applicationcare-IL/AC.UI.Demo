<template>
  <div class="wm-subheader shadow-1 flex-none">
    <div class="flex flex-column gap-5">
      <div class="flex flex-row justify-content-between flex-wrap row-gap-4">
        <div class="flex flex-row flex-wrap gap-2 align-items-center">
          <WMButton
            v-if="can(utilsStore.pluralEntity + '.update')"
            name="save"
            icon="save"
            type="specialSave"
            icon-position="left"
            :disabled="!getFormMeta(formKey)?.dirty"
            @click="saveForm"
          >
            {{ $t("save") }}
          </WMButton>

          <Divider layout="vertical" />

          <WMAssignOwnerButton
            v-if="can(utilsStore.pluralEntity + '.assign')"
            :entity="utilsStore.entity"
          />

          <WMSendMessageButton
            :selected-elements="selectedElements"
            :multiple="false"
          />

          <!-- <WMButton
            class="m-1 col-6"
            name="phone-white"
            icon="phone"
            :disabled="selectedElements == 0"
          >
            שיחה
          </WMButton> -->

          <WMSendEmailButton
            v-if="can('global.mail')"
            :selected-elements="selectedElements"
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
          >
            Cancel
          </WMButton>

          <WMButton
            v-if="
              showUpdateEntityStateButton &&
              !isEntityActive &&
              can(utilsStore.pluralEntity + '.activate')
            "
            class="m-1 col-6"
            name="basic-secondary"
            @click="activateEntity()"
          >
            {{ $t("buttons.activate") }}
          </WMButton>

          <WMButton
            v-if="
              showUpdateEntityStateButton &&
              isEntityActive &&
              can(utilsStore.pluralEntity + '.deactivate')
            "
            class="m-1 col-6"
            name="basic-secondary"
            @click="deactivateEntity()"
          >
            {{ $t("buttons.deactivate") }}
          </WMButton>
        </div>
      </div>
    </div>
  </div>
  <WMCancelServiceDialog />
</template>

<script setup>
// IMPORTS
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

import { useFormUtilsStore } from "@/stores/formUtils";
import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const route = useRoute();
const dialog = useDialog();
const formUtilsStore = useFormUtilsStore();
const utilsStore = useUtilsStore();
const { can } = usePermissions();

// PROPS, EMITS
defineProps({
  activeButtons: Boolean,
  defaultOption: Object,
  formKey: String,
});

const emit = defineEmits(["saveForm", "deactivateEntity", "activateEntity"]);

// REFS
const { getFormMeta } = storeToRefs(formUtilsStore);
const selectedElements = ref(0);
const isEntityActive = ref(false);

// COMPUTED
const showUpdateEntityStateButton = computed(() => {
  return ["customer", "contact"].includes(utilsStore.entity);
});

// COMPONENT METHODS
const saveForm = () => {
  emit("saveForm");
};

const activateEntity = () => {
  emit("activateEntity", utilsStore.selectedElements[utilsStore.entity][0].id);
};

const deactivateEntity = () => {
  emit(
    "deactivateEntity",
    utilsStore.selectedElements[utilsStore.entity][0].id
  );
};

// WATCHERS
watch(
  () => utilsStore.selectedElements[utilsStore.entity],
  (value) => {
    selectedElements.value = value?.length;

    console.log(
      "utilsStore.selectedElements[utilsStore.entity][0].state",
      utilsStore.selectedElements[utilsStore.entity][0].state
    );

    isEntityActive.value =
      utilsStore.selectedElements[utilsStore.entity][0].state === "active";
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
