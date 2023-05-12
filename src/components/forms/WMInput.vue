<template>
    <div class="wm-input flex flex-column">
        <label v-if="label != ''" class="wm-form-label"
               :class="[{
                       highlighted: props.highlighted,
                   }]">
            {{ label }} <span v-if="required" class="text-red-500"> *</span>
        </label>
        <InputText v-if="type == 'input-text'" :name="name" :disabled="props.disabled" :placeholder="placeholder"
                   :value="modelValue" @input="$emit('update:modelValue', $event.target.value); handleChange($event.target.value)"
                    @blur="handleBlur"
                   :class="[{
                           'wm-input-error': !!errorMessage,
                       }]"
                   :style="{ width: width + 'px' }" />
        <Dropdown v-if="type == 'input-select'" :name="name" :disabled="props.disabled" :options="options"
                  optionLabel="label" v-model="selectedInput" :placeholder="placeholder"
                  :style="{ width: width + 'px' }">
        </Dropdown>
        <span v-if="type == 'info'">{{ value }}</span>
        <span v-if="errorMessage" class="wm-validation-message">
            {{ typeof errorMessage === 'string' ? $t(errorMessage) : $t(errorMessage.key, errorMessage.values) }}
        </span>
    </div>
</template>

<script setup>
import { defineProps, ref } from 'vue';
import { toRef } from 'vue';
import { useField } from 'vee-validate';

const selectedInput = ref(null);

defineEmits(['update:modelValue'])

const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
    type: {
        type: String,
        default: 'text',
    },
    highlighted: {
        type: Boolean,
        default: false,
    },
    label: {
        type: String,
        required: false,
    },
    value: {
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
        default: '',
    },
    placeholder: {
        type: String,
    },
    options: {
        type: String,
    },
    width: {
        type: String,
        default: '120',
    },
});


const name = toRef(props, 'name');

const {
    value: modelValue,
    errorMessage,
    handleBlur,
    handleChange,
    meta,
} = useField(name, undefined, {
    initialValue: props.modelValue,
});

</script>

<style scoped lang="scss"></style>