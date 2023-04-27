<template>
    <div class="wm-input flex flex-column">
        <label v-if="label != ''" class="wm-form-label"
               :class="[{
                       highlighted: props.highlighted,
                   }]">
            {{ label }} <span v-if="required" class="text-red-500"> *</span>
        </label>
        <InputText v-if="type == 'input-text'" :name="name" :disabled="props.disabled" :placeholder="placeholder"
                   :class="[{
                           'wm-input-error': !props.valid,
                       }]"
                       :style="{width: width +'px'}"  />
        <Dropdown v-if="type == 'input-select'" :name="name" :disabled="props.disabled" :options="options"
                  optionLabel="label" v-model="selectedInput" :placeholder="placeholder"
                  :style="{width: width +'px'}" >

        </Dropdown>
        <span v-if="type == 'info'">{{ value }}</span>
        <span v-if="!valid" class="wm-validation-message">{{ validationMessage }}</span>
    </div>
</template>

<script setup>
import { defineProps, ref } from 'vue';

const selectedInput = ref(null);

const props = defineProps({
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
        default: 'text',
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



</script>

<style scoped lang="scss"></style>