<template>
    <div class="wm-inputsearch flex flex-column relative">
        <label v-if="label != ''" class="wm-form-label" :class="[{ highlighted: props.highlighted }]">
            {{ label }} <span v-if="required" class="text-red-500"> *</span>
        </label>
        <AutoComplete :suggestions="filteredOptions" optionLabel="name" :placeholder="placeholder"
                      :multiple="props.multiple" :disabled="props.disabled" :class="[{ 'wm-input-error': !!errorMessage }]"
                      forceSelection @complete="search" completeOnFocus v-model="value">
        </AutoComplete>
        <span v-if="errorMessage" class="wm-validation-message">
            {{ typeof errorMessage === 'string' ? $t(errorMessage) : $t(errorMessage.key, errorMessage.values) }}
        </span>
        <div class="selected-options flex flex-row gap-2 absolute">
            <Chip v-if="props.multiple" v-for="item in value" :label="item.name" removable />
        </div>
    </div>
</template>

<script setup>
import { defineProps, ref, toRef, computed, watch, onMounted } from 'vue';
import { useField } from 'vee-validate';

const filteredOptions = ref();
// const selectedOptions = ref();



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
        default: 'text',
    },
    placeholder: {
        type: String,
    },
    options: {
        type: Object,
    },
    width: {
        type: String,
        default: '120',
    },
    multiple: {
        type: Boolean,
        default: false,
    },
    modelValue: {
        type: String,
        default: '',
    },
    searchBy: {
        type: String,
        default: 'name',
    },
    selectedOptions: {
        type: Array,
        default: null,
    },
    selectedOption: {
        type: Object,
        default: null,
    },
});


onMounted(() => {
    if (props.multiple)
        value.value = props.selectedOptions
    else
        value.value = props.selectedOption
});

const search = (event) => {
    setTimeout(() => {
        if (!event.query?.trim().length) {
            filteredOptions.value = [...props.options];
        } else {
            filteredOptions.value = props.options.filter((option) => {
                // console.log(props.searchBy);
                return option.name.toLowerCase().startsWith(event.query.toLowerCase());
            });
        }
    }, 250);
}

const width = computed(() => {
    return props.width + 'px';
});

const name = toRef(props, 'name');

const { value, errorMessage } = useField(name, validateField, { initialValue: [] });


function validateField(value) {
    console.log('value', value);
    if (this.value === []) {
        return 'Value is required2.';
    }

    return true;
}



</script>

<style scoped lang="scss">
:deep(.p-autocomplete > input) {
    width: v-bind(width)
}

:deep(.p-autocomplete) {
    width: v-bind(width)
}

:deep(.p-autocomplete > ul) {
    width: v-bind(width)
}

:deep(.p-autocomplete-token) {
    display: none;
}

.selected-options {
    top: 54px;
}
</style>