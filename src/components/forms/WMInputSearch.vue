<template>
  <div class="wm-inputsearch flex flex-column relative" :class="classes">
    <label v-if="label != ''" class="wm-form-label" :class="[{ highlighted: props.highlighted }]">
      {{ label }} <span v-if="required && label" class="text-red-500"> *</span>
    </label>

    <AutoComplete
      ref="inputsearch"
      v-model="value"
      :name="name"
      :suggestions="filteredOptions"
      :option-label="optionLabel"
      :placeholder="placeholder"
      :multiple="props.multiple"
      :disabled="props.disabled"
      :class="classes"
      complete-on-focus
      :focused="true"
      @complete="search"
      @item-unselect="onRemove"
      @input="$emit('update:value', $event.target.value)"
      @item-select="onItemSelected"
      @change="
        emit('update:modelValue', value);
        handleChange($event);
      "
      @blur="emit('blur')"
      @click="handleClick"
    >
      <template v-if="props.relatedSidebar" #empty>
        <div class="flex flex-column m-2" :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''">
          <span class="vertical-align-middle"> {{ $t("no-results") }} </span>
          <a class="vertical-align-middle orange-link cursor-pointer" @click="openRelatedSidebar()">
            {{ $t("buttons.create-new-one") + " + " }}
          </a>
        </div>
      </template>
    </AutoComplete>

    <slot name="message"></slot>
    <span v-if="errorMessage" class="wm-validation-message">
      {{
        typeof errorMessage === "string"
          ? $t(errorMessage)
          : $t(errorMessage.key, errorMessage.values)
      }}
    </span>
    <div v-if="props.multiple && type == 'tags'" class="selected-options flex flex-row gap-2">
      <Chip v-for="(item, index) in value" :key="index" :label="item.name" :class="chipThemeClass">
        <span v-if="optionSet">
          <WMOptionSetValue :option-set="item" />
        </span>
        <span v-else>{{ item.name }}</span>
        <i class="pi pi-times cursor-pointer" @click="onRemove(item)"></i>
      </Chip>
    </div>

    <div v-if="value && !multiple" style="position: absolute; bottom: 3px; left: 7px">
      <i class="pi pi-times cursor-pointer" @click="removeValue"></i>
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { useField } from "vee-validate";
import { computed, onMounted, ref, toRef, watch } from "vue";

import { useLayout } from "@/layout/composables/layout";

// DEPENDENCIES
const { layoutConfig } = useLayout();
const { openSidebar } = useSidebar();
const { optionLabelWithLang } = useLanguages();

// INJECT

// PROPS, EMITS
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
  required: {
    type: Boolean,
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
  theme: {
    type: String,
    default: "default",
  },
  optionSet: {
    type: Boolean,
    default: false,
  },
  customOptionLabel: {
    type: String,
    default: null,
  },
  size: {
    type: String,
    default: "sm",
    validator: (value) =>
      [
        "xs", // 60px
        "sm", // 152px
        "md", // 336px
        "lg", // 520px
        "xl", // 704px
        "full", // 100%
      ].includes(value),
  },
});

const emit = defineEmits(["change", "blur", "update:value", "customChange", "update:modelValue"]);

// REFS
const inputsearch = ref(null);
const filteredOptions = ref();
const name = toRef(props, "name");

// COMPUTED
const classes = computed(() => {
  let commonClasses = {
    "wm-input-error": errorMessage.value ? true : false,
  };

  let widthClass = `wm-input-${props.size}`;

  if (props.size === "full") {
    widthClass = "w-full";
  }

  return {
    ...commonClasses,
    [widthClass]: true,
  };
});

const chipThemeClass = computed(() => {
  return props.theme == "default" ? "p-chip--default" : `p-chip--${props.theme}`;
});

const optionLabel = computed(() => {
  if (props.optionSet) {
    return optionLabelWithLang.value;
  }

  if (props.customOptionLabel) {
    return props.customOptionLabel;
  }

  return "name";
});

// COMPONENT METHODS AND LOGIC
const { value, errorMessage, resetField } = useField(name, undefined, {
  validateOnValueUpdate: true,
  validateOnMount: false,
  validateOnBlur: true,
  validateOnChange: true,
  value: props.modelValue,
});

const openRelatedSidebar = () => {
  openSidebar(props.relatedSidebar);

  // hide all the active overlays
  document.querySelectorAll(".p-overlaypanel").forEach((overlay) => {
    overlay.style.display = "none";
  });
};

const search = (event) => {
  setTimeout(() => {
    // In case we have a search function, we will use it to filter the options
    if (props.searchFunction) {
      props.searchFunction(event.query.toLowerCase()).then((result) => {
        return (filteredOptions.value = result.data.filter((option) => {
          return option.name;
        }));
      });
      // Otherwise we will filter the static list
    } else {
      if (!event.query?.trim().length) {
        filteredOptions.value = [...props.options];
      } else {
        filteredOptions.value = props.options.filter((option) => {
          // prevent errors with options that don't have translations
          if ((!option[optionLabelWithLang.value] || option.value == "") && !option.name) {
            return false;
          }

          if (option[optionLabelWithLang.value]) {
            return option[optionLabelWithLang.value]
              .toLowerCase()
              .includes(event.query.toLowerCase());
          }

          // by default, try to search by name and without translations
          return option.name.toLowerCase().includes(event.query.toLowerCase());
        });
      }
    }

    // Remove the selected options from the available options
    if (props.multiple && value.value?.length > 0) {
      filteredOptions.value = filteredOptions.value.filter((option) => {
        if (value.value.length == 0) return true;

        const returnValue = !value.value.find((selectedOption) => {
          return selectedOption.id == option.id;
        });

        if (returnValue) {
          if (props.optionSet.value) {
            return option[optionLabelWithLang.value];
          }

          return option.name;
        }
      });
    }
  }, 250);
};

// select all the text in the input when the user clicks on it for UX purposes
const handleClick = (e) => {
  if (!e.srcElement) return;

  e.srcElement.focus();
  e.srcElement.select();
};

// we need to reset the focus to show the options when we delete the selected option
const handleChange = (event) => {
  if (event.value === "") {
    event.originalEvent.srcElement.blur();
    event.originalEvent.srcElement.focus();
  }
};

const onRemove = (event) => {
  // this condition is for the case when the user press the backspace key
  // we dont want to remove the last item in the list
  if (event.originalEvent && event.originalEvent.code == "Backspace") {
    value.value.push(event.value);
    event.originalEvent.preventDefault();
    return;
  }

  value.value.splice(value.value.indexOf(event), 1);
};

const onItemSelected = (item) => {
  emit("change", item);
};

const removeValue = () => {
  resetField();
  value.value = "";

  setTimeout(() => {
    const field = document.querySelector(`[name="${props.name}"]`);
    const inputField = field.querySelector("input");
    inputField.focus();
  }, 100);
};

const clear = () => {
  resetField();
};

// PROVIDE, EXPOSE
defineExpose({ clear });

// WATCHERS
watch(
  () => props.modelValue,
  (newValue) => {
    value.value = newValue;
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  if (props.modelValue) {
    value.value = props.modelValue;
  }
});
</script>

<style scoped lang="scss">
:deep(.p-autocomplete-token) {
  display: none;
}

.selected-options {
  top: 54px;
  flex-wrap: wrap;
}
</style>
