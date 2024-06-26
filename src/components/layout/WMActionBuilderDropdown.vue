<template>
  <!-- {{ selectedElements }} -->
  <WMButton
    :text="label"
    type="type-5"
    icon="pi-chevron-down"
    :is-disabled="selectedElements == 0"
    :disabled="selectedElements == 0"
    @click="toggleDropdownMenu"
  />

  <Menu id="overlay_menu" ref="dropdownMenu" :model="actions" :popup="true">
    <template #item="slotProps">
      <button
        class="p-link flex align-items-center p-2 pl-3 text-color hover:surface-200 border-noround gap-2 w-full"
        @click="handleOverlayMenuClick(slotProps.item)"
      >
        <div class="flex flex-column align">
          {{ $t(slotProps.item.name) }}
        </div>
      </button>
    </template>
  </Menu>

  <Dialog v-model:visible="visible" :header="$t('response')" modal :style="{ minWidth: '25rem' }">
    <div class="py-0 my-0 px-2">
      <template v-for="row in responseData" :key="row.entity">
        <div class="flex flex-column gap-2">
          <h5 class="mb-0">
            <span class="font-bold">{{ $t("entity") }}:</span> {{ row.entity }}
          </h5>
        </div>
        <!-- Print Divider when it's not the last row -->
        <Divider v-if="row !== responseData[responseData.length - 1]" class="mb-5" />
      </template>
    </div>
  </Dialog>
</template>

<script setup>
// IMPORTS
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

// DEPENDENCIES
const { currentEntity } = useUtils();
const { executeAction } = useActionBuilder();
const toast = useToast();

const { t } = useI18n();

// INJECT

// PROPS, EMITS
const props = defineProps({
  label: String,
  actions: Array,
  selectedElements: {
    type: Number,
    default: 0,
  },
  entity: String,
});

const emit = defineEmits(["postActionExecuted"]);

// REFS
const dropdownMenu = ref();
const visible = ref(false);
const responseData = ref();

// COMPUTED
const selectedElementsIds = computed(() => props.selectedElements.map((element) => element.id));

// COMPONENT METHODS AND LOGIC
const toggleDropdownMenu = (event) => {
  dropdownMenu.value.toggle(event);
};

const handleOverlayMenuClick = (action) => {
  const params = {
    url_action_builder: action.id,
    entity_ids: selectedElementsIds.value,
    entity_type: currentEntity.value,
  };

  switch (action.action) {
    case "get":
      handleGetAction(params);
      break;

    case "post":
      handlePostAction(params);
      break;

    case "redirect_to":
      handleRedirectToAction(params);
      break;

    default:
      break;
  }
};

const handleGetAction = (params) => {
  executeAction(params)
    .then((response) => {
      responseData.value = response.data;
      visible.value = true;
    })
    .catch((error) => {
      console.error("ERROR", error);
    });
};

const handlePostAction = (params) => {
  executeAction(params)
    .then(() => {
      toast.success({ message: t("toast.action-completed-successfully") });
      emit("postActionExecuted");
    })
    .catch((error) => {
      console.error("ERROR", error);
    });
};

const handleRedirectToAction = (params) => {
  executeAction(params).then((response) => {
    response.data.forEach((element) => {
      openLinkInNewTab(element.result.redirect_to);
    });
  });
};

const openLinkInNewTab = (url) => {
  const win = window.open(url, "_blank");
  win.focus();
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped>
.custom-pre {
  background-color: var(--gray-200);
  color: var(--gray-900);
  border: none;
}
</style>
