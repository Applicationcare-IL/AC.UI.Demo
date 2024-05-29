<template>
  <div class="wm-inputsearch flex flex-column relative">
    <label
      v-if="label != ''"
      class="wm-form-label"
      :class="[{ highlighted: props.highlighted }]"
    >
      {{ label }}
    </label>
    <AutoComplete
      v-model="value"
      :suggestions="filteredOptions"
      :option-label="optionLabel"
      :placeholder="placeholder"
      :multiple="props.multiple"
      :disabled="props.disabled"
      :class="[{ 'wm-input-error': !!errorMessage }]"
      complete-on-focus
      :focused="true"
      @complete="search"
      @item-unselect="onRemove"
      @input="$emit('update:value', $event.target.value)"
      @item-select="onItemSelected"
      @change="emit('update:modelValue', value)"
    >
      <template v-if="props.relatedSidebar" #empty>
        <div
          class="flex flex-column m-2"
          :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
        >
          <span class="vertical-align-middle"> {{ $t("no-results") }} </span>
          <a class="vertical-align-middle orange-link" @click="openRelatedSidebar()">
            {{ $t("buttons.create-new-one") + " + " }}
          </a>
        </div>
      </template>
    </AutoComplete>
    <div>
      <slot name="message"></slot>
    </div>
    <span v-if="errorMessage" class="wm-validation-message">
      {{
        typeof errorMessage === "string"
          ? $t(errorMessage)
          : $t(errorMessage.key, errorMessage.values)
      }}
    </span>
    <div
      v-if="props.multiple && type == 'tags'"
      class="selected-options flex flex-row gap-2"
    >
      <Chip
        v-for="item in value"
        :key="item.id"
        :label="item.name"
        :class="chipThemeClass"
      >
        <span v-if="optionSet">
          <WMOptionSetValue :option-set="item" />
        </span>
        <span v-else>{{ item.name }}</span>
        <i class="pi pi-times cursor-pointer" @click="onRemove(item)"></i>
      </Chip>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";

import { useLayout } from "@/layout/composables/layout";

const { layoutConfig } = useLayout();
const { openSidebar } = useSidebar();

const filteredOptions = ref();
const { optionLabelWithLang } = useLanguages();

const props = defineProps({
  highlighted: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
  disabled: {
    type: Boolean,
    required: false,
  },
  valid: {
    type: Boolean,
    default: true,
    required: false,
  },
  validationMessage: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
  },
  options: {
    type: Object,
  },
  width: {
    type: String,
    default: "120",
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: String,
    default: "",
  },
  searchBy: {
    type: String,
    default: "name",
  },
  searchFunction: {
    type: Function,
    default: null,
  },
  relatedSidebar: {
    type: String,
    default: null,
  },
  type: {
    type: String,
    default: "tags",
  },
  optionLabel: {
    type: String,
    default: "value",
  },
  optionSet: {
    type: String,
    default: false,
  },
});

const value = ref(props.modelValue);
watch(
  () => props.modelValue,
  (newValue) => {
    value.value = newValue;
  }
);

const emit = defineEmits(["update:modelValue", "update:value", "change", "remove"]);

const openRelatedSidebar = () => {
  openSidebar(props.relatedSidebar);
};

const optionLabel = computed(() => {
  if (props.optionSet) {
    return optionLabelWithLang.value;
  }
  return "name";
});

const search = (event) => {
  setTimeout(() => {
    //In case we have a search function, we will use it to filter the options
    if (props.searchFunction) {
      props.searchFunction(event.query.toLowerCase()).then((result) => {
        return (filteredOptions.value = result.data.filter((option) => {
          return option.name;
        }));
      });
      //Otherwise we will filter the static list
    } else {
      if (!event.query?.trim().length) {
        filteredOptions.value = [...props.options];
      } else {
        filteredOptions.value = props.options.filter((option) => {
          return option.value.toLowerCase().startsWith(event.query.toLowerCase());
        });
      }
    }
    //Remove the selected options from the available options
    if (props.multiple && value.value?.length > 0)
      filteredOptions.value = filteredOptions.value.filter((option) => {
        if (value.value.length == 0) return true;
        const returnValue = !value.value.find((selectedOption) => {
          return selectedOption.id == option.id;
        });

        if (returnValue) return option.value;
      });
  }, 250);
};

const onRemove = (item) => {
  value.value.splice(value.value.indexOf(item), 1);
  emit("remove", item);
};

const onItemSelected = (item) => {
  emit("change", item);
};

const width = computed(() => {
  return props.width + "px";
});
</script>

<style scoped lang="scss">
:deep(.p-autocomplete > input) {
  width: v-bind(width);
}

:deep(.p-autocomplete) {
  width: v-bind(width);
}

:deep(.p-autocomplete > ul) {
  width: v-bind(width);
}

:deep(.p-autocomplete-token) {
  display: none;
}

.selected-options {
  top: 54px;
}
</style>
