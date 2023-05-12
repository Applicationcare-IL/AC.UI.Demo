<template>
    <div class="wm-inputsearch flex flex-column relative">
        <label v-if="label != ''" class="wm-form-label"
               :class="[{
                       highlighted: props.highlighted,
                   }]">
            {{ label }} <span v-if="required" class="text-red-500"> *</span>
        </label>  
        <AutoComplete :suggestions="filteredOptions" optionLabel="name" :placeholder="placeholder" :multiple="props.multiple" :disabled="props.disabled"
        forceSelection @complete="search" v-model="selectedOptions"></AutoComplete>
        <div class="selected-options flex flex-row gap-2 absolute">
            <Chip v-if="props.multiple" v-for="item in selectedOptions" :label="item.name" removable />
        </div>
    </div>
</template>

<script setup>
import { defineProps, ref, computed } from 'vue';

const filteredOptions = ref();
const selectedOptions = ref();

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
});

const search = (event) => {
    setTimeout(() => {
        if (!event.query.trim().length) {
            filteredOptions.value = [...props.options];
        } else {
            filteredOptions.value = props.options.filter((option) => {
                return option.name.toLowerCase().startsWith(event.query.toLowerCase());
            });
        }
    }, 250);
}

const width = computed(() => {
    return props.width + 'px';
});

</script>

<style scoped lang="scss">

:deep(.p-autocomplete > input) {
    width : v-bind(width)
}

:deep(.p-autocomplete > ul) {
    width : v-bind(width)
}

:deep(.p-autocomplete-token){
    display:none;
}

.selected-options{
    top: 54px;
}

</style>