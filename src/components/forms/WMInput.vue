<template>
  <div
    class="wm-input flex"
    :class="{
      'flex-row align-items-center gap-2': inline,
      'flex-column': !inline,
      'w-full': size === 'full',
    }"
  >
    <label
      v-if="label != ''"
      class="wm-form-label"
      :class="[
        {
          highlighted: props.highlighted,
          'h2 mb-3': props.labelSize === 'large',
        },
      ]"
    >
      {{ label }} <span v-if="required" class="text-red-500"> *</span>
    </label>
    <InputText
      v-if="type == 'input-text'"
      v-model="inputValue"
      :name="name"
      :disabled="props.disabled"
      :placeholder="placeholder"
      :value="inputValue"
      :class="classes"
      @input="
        $emit('update:modelValue', $event.target.value);
        handleChange($event.target.value);
      "
      @blur="handleBlur"
    />
    <InputNumber
      v-if="type == 'input-number'"
      v-model="inputValue"
      :name="name"
      :disabled="props.disabled"
      :placeholder="placeholder"
      :value="inputValue"
      :class="classes"
      @input="
        $emit('update:modelValue', $event.value);
        handleChange($event.value);
      "
      @blur="handleBlur"
    />
    <Password
      v-if="type == 'input-password'"
      v-model="inputValue"
      :name="name"
      :disabled="props.disabled"
      :placeholder="placeholder"
      :feedback="false"
      :class="classes"
      @input="
        $emit('update:modelValue', $event.target.value);
        handleChange($event.target.value);
      "
      @blur="handleBlur"
    >
    </Password>
    <Dropdown
      v-if="type == 'input-select'"
      v-model="inputValue"
      :name="name"
      :disabled="props.disabled"
      :options="refOptions"
      :option-label="optionLabel"
      :placeholder="placeholder"
      :class="classes"
      @change="
        $emit('update:selectedItem', $event.value);
        handleChange($event.value);
      "
      @blur="handleBlur"
    >
    </Dropdown>
    <Textarea
      v-if="type == 'text-area'"
      :name="name"
      :disabled="props.disabled"
      :placeholder="placeholder"
      :value="value"
      :class="classes"
      :style="{ width: styleWidth }"
      auto-resize
      :rows="rows"
      cols="100"
      @input="
        $emit('update:value', $event.target.value);
        handleChange($event.target.value);
      "
      @blur="handleBlur"
    >
    </Textarea>

    <SelectButton
      v-if="type == 'input-select-button'"
      v-model="inputValue"
      :name="name"
      :options="refOptions"
      :option-label="optionLabel"
      class="form-select-button flex-nowrap flex"
      :disabled="props.disabled"
      :allow-empty="false"
      @change="
        $emit('update:selectedItem', $event.value);
        handleChange($event.value);
        setTouched(true);
      "
    />

    <span v-if="type == 'info'" :class="classes" class="text-overflow-ellipsis overflow-hidden">
      <template v-if="optionSet">
        <WMOptionSetValue :option-set="refValue" />
      </template>
      <template v-else>
        {{ refValue }}
      </template>
    </span>
    <span
      v-if="type == 'info-link'"
      :class="classes"
      class="text-overflow-ellipsis overflow-hidden"
    >
      <router-link v-if="value" :to="props.to">{{ value }}</router-link>
    </span>
    <span v-if="errorMessage" class="wm-validation-message">
      {{
        typeof errorMessage === "string"
          ? $t(errorMessage)
          : $t(errorMessage.key, errorMessage.values)
      }}
    </span>
    <Calendar
      v-if="type === 'date'"
      v-model="inputValue"
      show-icon
      :disabled="props.disabled"
      date-format="dd/mm/yy"
      :class="classes"
      :min-date="minDate"
      @date-select="handleDateChange($event)"
    />
    <slot></slot>
  </div>
</template>

<script setup>
// IMPORTS
import { useField } from "vee-validate";
import { computed, onMounted, toRef, watch } from "vue";

// DEPENDENCIES
const { optionLabelWithLang } = useLanguages();

// PROPS, EMITS

const props = defineProps({
  value: {
    type: String,
    default: "",
  },
  to: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  highlighted: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    required: false,
    default: "",
  },
  labelSize: {
    type: String,
    default: "small",
  },
  name: {
    type: String,
    required: false,
    default: "",
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
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  options: {
    type: Array,
    default: () => [],
  },
  inline: {
    type: Boolean,
    default: false,
  },
  class: {
    type: String,
    default: "",
  },
  optionSet: {
    type: Boolean,
    default: false,
  },
  customOptionLabel: {
    type: String,
  },
  rows: {
    type: Number,
    default: 6,
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
  minDate: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:value", "update:selectedItem", "update:modelValue"]);

// REFS
const styles = toRef(props, "class");
const name = toRef(props, "name");
const refValue = toRef(props, "value");
const refOptions = toRef(props, "options");

// COMPUTED
const optionLabel = computed(() => {
  if (props.optionSet) {
    return optionLabelWithLang.value;
  }

  if (props.customOptionLabel) {
    return props.customOptionLabel;
  }

  if (props.type === "input-select-button") {
    return "name";
  }

  return "label";
});

const classes = computed(() => {
  let commonClasses = {
    "wm-input-error": errorMessage.value ? true : false,
  };

  let widthClass = `wm-input-${props.size}`;

  if (props.size === "full") {
    widthClass = "w-full";
  }

  if (styles.value) {
    commonClasses = {
      ...commonClasses,
      [styles.value]: true,
    };
  }

  return {
    ...commonClasses,
    [widthClass]: true,
  };
});

// COMPONENT METHODS AND LOGIC
const {
  value: inputValue,
  errorMessage,
  handleBlur,
  handleChange,
  setTouched,
} = useField(name, undefined, {
  initialValue: props.value,
});

const handleDateChange = (newDate) => {
  if (newDate) {
    inputValue.value = new Date(newDate.getTime() - newDate.getTimezoneOffset() * 60000);
    handleChange(inputValue.value);
    setTouched(true);
    emit("update:modelValue", inputValue.value);
  }
};

// WATCHERS
/**
 * Set the first option as the default value when prop value is empty
 */
watch(
  () => refOptions.value,
  (options) => {
    if (!options) return;
    if (props.value) return;

    inputValue.value = options[0];
  }
);

watch(
  () => refValue.value,
  (newValue) => {
    inputValue.value = newValue;
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  if (props.value) {
    inputValue.value = props.value;
  }
});
</script>

<style scoped lang="scss"></style>
