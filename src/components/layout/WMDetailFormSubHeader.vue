<template>
  <div v-if="entityObject" class="wm-subheader shadow-1 flex-none">
    <div class="flex flex-column">
      <div class="flex flex-row justify-content-between align-items-center">
        <div class="flex flex-row align-items-center gap-4">
          <h1 class="h1 mb-0">
            {{ $t(entityType + "." + entityType) }}: {{ entityObject.title }}
          </h1>

          <div class="flex align-items-center gap-1">
            <span class="font-bold">State: </span>
            <div
              :class="statusClass(entityObject.state)"
              class="status-label white-space-nowrap"
            >
              {{ $t("state." + entityObject.state) }}
            </div>
          </div>

          <div
            v-if="entityObject.status"
            class="flex align-items-center gap-1 font-bold"
          >
            <span>Status:</span>
            <div
              :class="highlightStatusClass(entityObject.status.value)"
              class="status-label white-space-nowrap"
            >
              <WMOptionSetValue :option-set="entityObject.status" />
            </div>
          </div>
        </div>
        <div>
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
        </div>
      </div>
      <Divider />
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
            v-if="
              can(utilsStore.pluralEntity + '.assign') &&
              utilsStore.entity !== 'budget-item' &&
              utilsStore.entity !== 'project-budget' &&
              utilsStore.entity !== 'milestone'
            "
            :entity="utilsStore.entity"
            @owner-assigned="$emit('refreshTable')"
          />

          <WMSendMessageButton
            v-if="showMessageButton"
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
            v-if="can('global.mail') && showEmailButton"
            :selected-elements="selectedElements"
            :multiple="false"
          />

          <WMCompleteTasksButton
            v-if="utilsStore.entity == 'task'"
            :entity="utilsStore.entity"
            @task-completed="$emit('taskCompleted')"
          />
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
          <WMAnnouncementsButton
            v-if="['customer', 'service'].includes(entityType)"
            :id="route.params.id"
            :entity="entityType"
          />
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
const entityObject = ref(null);
const formUtilsStore = useFormUtilsStore();
const utilsStore = useUtilsStore();
const entityType = ref("");
const { can } = usePermissions();
const { getStatusConditionalStyle, highlightStatusClass } = useListUtils();

// PROPS, EMITS
defineProps({
  formKey: {
    type: String,
    required: true,
  },
  showMessageButton: {
    type: Boolean,
    default: true,
  },
  showEmailButton: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits([
  "saveForm",
  "deactivateEntity",
  "activateEntity",
  "taskCompleted",
  "refreshTable",
]);

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

const statusClass = (data) => {
  return getStatusConditionalStyle(data);
};

// WATCHERS
watch(
  () => utilsStore.selectedElements[utilsStore.entity],
  (value) => {
    selectedElements.value = value?.length;

    isEntityActive.value =
      utilsStore.selectedElements[utilsStore.entity][0].state === "active";

    entityObject.value = utilsStore.selectedElements[utilsStore.entity][0];
    entityType.value = utilsStore.entity;
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
