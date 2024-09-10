<template>
  <WMButton
    :text="label"
    type="type-5"
    icon="pi-chevron-down"
    :is-disabled="isDisabled"
    @click="toggleDropdownMenu"
  />

  <Menu id="overlay_menu" ref="dropdownMenu" :model="actions" :popup="true">
    <template #item="slotProps">
      <button
        class="p-link flex align-items-center p-2 pl-3 text-color hover:surface-200 border-noround gap-2 w-full"
        @click="openDialog(slotProps.item)"
      >
        <div class="flex flex-column align">{{ $t(slotProps.item.name) }}</div>
      </button>
    </template>
  </Menu>

  <Dialog
    v-model:visible="attachDocumentsDialogVisibility"
    modal
    :header="$t('scripts.attach-documents')"
    :style="{ width: '40rem' }"
  >
    <span class="block mb-5">{{ $t("scripts.do-you-want-to-attach-documents") }}</span>
    <div class="flex gap-3">
      <WMButton
        :text="$t('scripts.send-without-attachments')"
        type="primary"
        @click="handleAction(selectedItem)"
      />
      <WMButton
        :text="$t('scripts.send-with-attachments')"
        type="primary"
        @click="openDocumentSelectorDialog"
      />
    </div>
  </Dialog>

  <WMDocumentsSelectorDialog
    v-if="showDocumentsSelectorDialog"
    v-model="showDocumentsSelectorDialog"
    related-entity="project"
    :related-entity-id="projectId"
    @select-documents="handleSelectDocuments"
  />
</template>

<script setup>
// IMPORTS
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

// DEPENDENCIES
const { executeIssue } = useFlowmaze();
const toast = useToast();
const { t } = useI18n();

// INJECT

// PROPS, EMITS
let props = defineProps({
  label: String,
  actions: Array,
  selectedElements: {
    type: Array,
    default: () => [],
  },
  entity: String,
  entityId: String,
  projectId: String,
});

// REFS
const dropdownMenu = ref();
const attachDocumentsDialogVisibility = ref(false);
const selectedItem = ref(null);
const showDocumentsSelectorDialog = ref(false);
const selectedDocuments = ref([]);

// COMPUTED
const isDisabled = computed(() => {
  return props.selectedElements === 0 || props.selectedElements.length <= 0;
});

// COMPONENT METHODS AND LOGIC
const toggleDropdownMenu = (event) => {
  if (isDisabled.value) return;

  dropdownMenu.value.toggle(event);
};

const executeNewPopupIssue = (params) => {
  return new Promise((resolve, reject) => {
    executeIssue(params)
      .then((response) => {
        window.open(response.data.url, "_blank");
        resolve();
      })
      .catch(() => {
        reject();
      });
  });
};

const handleAction = (script) => {
  const promises = props.selectedElements.map((element) => {
    let params = {
      entity_type: props.entity,
      entity_id: element.id,
      script_id: script.id,
      document_ids: selectedDocuments.value ? selectedDocuments.value.map((doc) => doc.id) : [],
    };

    attachDocumentsDialogVisibility.value = false;

    if (script.open_popup === 1) {
      return executeNewPopupIssue(params);
    }

    return executeIssue(params);
  });

  Promise.all(promises)
    .then(() => {
      toast.success(t("scripts.toast-issues-success"));
    })
    .catch(() => {
      toast.error(t("scripts.toast-issues-error"));
    });
};

const openDialog = (item) => {
  attachDocumentsDialogVisibility.value = true;
  selectedItem.value = item;
};

const openDocumentSelectorDialog = () => {
  showDocumentsSelectorDialog.value = true;
};

const handleSelectDocuments = (documents) => {
  console.log("handle action with selected documents", documents);
  selectedDocuments.value = documents;
  handleAction(selectedItem.value);
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
