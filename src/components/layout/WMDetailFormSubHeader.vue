<template>
  <div v-if="entityObject" class="wm-subheader shadow-1 flex-none">
    <div class="flex flex-column">
      <div class="flex flex-row justify-content-between align-items-center">
        <div class="flex flex-row align-items-center gap-4">
          <h1 class="h1 mb-0">{{ $t(entityType + "." + entityType) }}: {{ entityObject.title }}</h1>

          <div v-if="entityObject.state" class="flex align-items-center gap-1">
            <span class="font-bold">{{ $t("state.state") }}: </span>
            <div
              :class="statusClass(entityObject.state.value)"
              class="status-label white-space-nowrap"
            >
              <WMOptionSetValue :option-set="entityObject.state" />
            </div>
          </div>

          <div v-if="entityObject.status" class="flex align-items-center gap-1 font-bold">
            <span>{{ $t("status") }}:</span>
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
            :text="$t('buttons.deactivate')"
            type="secondary"
            @click="deactivateEntity()"
          />

          <WMButton
            v-if="
              showUpdateEntityStateButton &&
              !isEntityActive &&
              can(utilsStore.pluralEntity + '.activate')
            "
            :text="$t('buttons.activate')"
            type="secondary"
            @click="activateEntity()"
          />
        </div>
      </div>
      <template v-if="showSubBar">
        <Divider />
        <div class="flex flex-row justify-content-between flex-wrap row-gap-4">
          <div class="flex flex-row flex-wrap gap-3 align-items-center">
            <WMSaveButton
              v-if="can(utilsStore.pluralEntity + '.update')"
              :is-disabled="!isFormDirty"
              :is-saved="isFormSaved && !isFormDirty"
              @click="saveForm"
            />

            <Divider v-if="can(utilsStore.pluralEntity + '.update')" layout="vertical" />

            <WMAssignOwnerButton
              v-if="
                can(utilsStore.pluralEntity + '.assign') &&
                utilsStore.entity !== 'budget-item' &&
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

            <WMSendEmailButton
              v-if="can('global.mail') && showEmailButton"
              :selected-elements="selectedElements"
              :multiple="true"
            />

            <WMCompleteTasksButton
              v-if="utilsStore.entity == 'task'"
              :entity="utilsStore.entity"
              @task-completed="$emit('taskCompleted')"
            />

            <Divider v-if="scopes && scopes.length" layout="vertical" />

            <WMActionBuilderDropdowns
              v-if="scopes && scopes.length && hasActionBuilder"
              :scopes="scopes"
              :selected-elements="[selectedElement]"
              @post-action-executed="$emit('refreshTable')"
            />

            <slot name="custom-buttons" />
          </div>
          <div class="flex gap-3 align-items-center">
            <WMCancelButton
              v-if="isActiveTask"
              size="small"
              @click="dialog.cancelService(route.params.id)"
            />

            <WMAnnouncementsButton
              v-if="['customer', 'service', 'project'].includes(entityType)"
              :id="route.params.id"
              :entity="entityType"
            />
            <slot name="custom-secondary-buttons" />
          </div>
        </div>
      </template>
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
const { getScopes } = useActionBuilder();

// PROPS, EMITS
const props = defineProps({
  entity: {
    type: String,
    required: true,
  },
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
  hasActionBuilder: {
    type: Boolean,
    default: true,
  },
  showSubBar: {
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
const { getFormMeta, isFormSaved } = storeToRefs(formUtilsStore);
const selectedElement = ref();
const selectedElements = ref(0);
const isEntityActive = ref(false);
const scopes = ref();

// COMPUTED
const showUpdateEntityStateButton = computed(() => {
  return ["customer", "contact"].includes(utilsStore.entity);
});

const isFormDirty = computed(() => {
  return getFormMeta.value(props.formKey)?.dirty;
});

// COMPONENT METHODS AND LOGIC
const saveForm = () => {
  if (!isFormDirty.value) {
    return;
  }

  isFormSaved.value = true;
  emit("saveForm");
};

const activateEntity = () => {
  emit("activateEntity", utilsStore.selectedElements[utilsStore.entity][0].id);
};

const deactivateEntity = () => {
  emit("deactivateEntity", utilsStore.selectedElements[utilsStore.entity][0].id);
};

const statusClass = (data) => {
  return getStatusConditionalStyle(data);
};

if (props.hasActionBuilder) {
  getScopes(props.entity, "list").then((data) => {
    scopes.value = data;
  });
}

// WATCHERS
watch(
  () => utilsStore.selectedElements[utilsStore.entity],
  (value) => {
    selectedElements.value = value?.length;
    selectedElement.value = value[0];

    isEntityActive.value =
      utilsStore.selectedElements[utilsStore.entity][0].state?.value === "active";

    entityObject.value = utilsStore.selectedElements[utilsStore.entity][0];
    entityType.value = utilsStore.entity;
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
