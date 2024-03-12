<template>
  <Button
    :label="label"
    icon="pi pi-chevron-down"
    aria-haspopup="true"
    aria-controls="overlay_menu"
    class="m-1 p-button-default col-6"
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
</template>

<script setup>
// IMPORTS
import { ref } from "vue";
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

const toggleDropdownMenu = (event) => {
  dropdownMenu.value.toggle(event);
};

const getIdsOfSelectedElements = () => {
  return props.selectedElements.map((element) => element.id);
};

const handleOverlayMenuClick = (action) => {
  const params = {
    url_action_builder: action.id,
    entity_ids: getIdsOfSelectedElements(),
    entity_type: currentEntity.value,
  };

  switch (action.action) {
    case "get":
      handleGetAction(params);
      break;

    case "post":
      handlePostAction(params);
      break;

    case "redirect":
      handleRedirectAction(params);
      break;

    default:
      break;
  }
};

const handleGetAction = (params) => {
  executeAction(params)
    .then((response) => {
      console.log("RESPONSE", response);
    })
    .catch((error) => {
      console.log("ERROR", error);
    });
};

const handlePostAction = (params) => {
  executeAction(params)
    .then(() => {
      toast.success(t("toast.action-completed-successfully"));
      emit("postActionExecuted");
    })
    .catch((error) => {
      console.log("ERROR", error);
    });
};

const handleRedirectAction = (params) => {
  console.log("redirect action", params);
  executeAction(params);
};

// COMPUTED

// COMPONENT METHODS

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
