<template>
  <div class="wm-inputsearch flex flex-column relative">
    <label
      v-if="label != ''"
      class="wm-form-label"
      :class="[{ highlighted: props.highlighted }]"
    >
      {{ label }} <span v-if="required && label" class="text-red-500"> *</span>
    </label>
    <AutoComplete
      :suggestions="filteredOptions"
      :optionLabel="optionLabelWithLang"
      :placeholder="placeholder"
      :multiple="props.multiple"
      :disabled="props.disabled"
      :class="[{ 'wm-input-error': !!errorMessage }]"
      @complete="search"
      completeOnFocus
      v-model="value"
      @item-unselect="onRemove"
      @input="$emit('update:value', $event.target.value)"
      @item-select="onItemSelected"
      @change="emit('update:modelValue', value)"
      :focused="true"
      @blur="emit('blur')"
    >
      <template #empty v-if="props.relatedSidebar">
        <div
          class="flex flex-column m-2"
          :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
        >
          <span class="vertical-align-middle"> לא נמצאו תוצאות </span>
          <a
            class="vertical-align-middle orange-link"
            @click="openRelatedSidebar()"
          >
            + צור חדש
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
      <Chip v-for="item in value" :label="item.name" :class="chipThemeClass">
        <span>{{ item.name }}</span>
        <i class="pi pi-times cursor-pointer" @click="onRemove(item)"></i>
      </Chip>
    </div>
  </div>
</template>

<script setup>
import { ref, toRef, computed, onMounted, watch } from "vue";
import { useField } from "vee-validate";
import { useLayout } from "@/layout/composables/layout";

const { layoutConfig } = useLayout();
const { openSidebar } = useSidebar();
const { optionLabelWithLang } = useLanguages();

const filteredOptions = ref();

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
  theme: {
    type: String,
    default: "default",
  },
});

const chipThemeClass = computed(() => {
  return props.theme == "default"
    ? "p-chip--default"
    : `p-chip--${props.theme}`;
});

const emit = defineEmits(["customChange", "update:modelValue"]);

const openRelatedSidebar = () => {
  openSidebar(props.relatedSidebar);
};

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
          return option.name
            .toLowerCase()
            .startsWith(event.query.toLowerCase());
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

        if (returnValue) return option.name;
      });
  }, 250);
};

const onRemove = (item) => {
  value.value.splice(value.value.indexOf(item), 1);
};

const onItemSelected = (item) => {
  emit("change", item);
};

const onItemUnselect = (item) => {
  emit("onItemUnselect", item);
};

const width = computed(() => {
  return props.width + "px";
});

const name = toRef(props, "name");

const { value, errorMessage, resetField } = useField(name, undefined, {
  validateOnValueUpdate: true,
  validateOnMount: false,
  validateOnBlur: true,
  validateOnChange: true,
  value: props.modelValue,
});

onMounted(() => {
  if (props.modelValue) {
    value.value = props.modelValue;
  }
});

watch(
  () => props.modelValue,
  (newValue) => {
    value.value = newValue;
  }
);

function clear() {
  resetField();
}

defineExpose({ clear });
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
  flex-wrap: wrap;
}
</style>
