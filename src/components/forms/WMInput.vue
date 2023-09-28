<template>
    <div class="wm-input flex" :class="{ 'flex-row': inline, 'flex-column': !inline }">
        <label v-if="label != ''" class="wm-form-label" :class="[{
            highlighted: props.highlighted,
        }]">
            {{ label }} <span v-if="required" class="text-red-500"> *</span>
        </label>
        <InputText v-if="type == 'input-text'" :name="name" :disabled="props.disabled" :placeholder="placeholder"
                   :value="value" @input="$emit('update:value', $event.target.value); handleChange($event.target.value)"
                   @blur="handleBlur" :class="[{
                       'wm-input-error': !!errorMessage,
                   }]" style="width:100%" />
        <Password v-if="type == 'input-password'" :name="name" :disabled="props.disabled" :placeholder="placeholder"
                  :feedback="true" style="width:100%"
                  @input="$emit('update:value', $event.target.value); handleChange($event.target.value)" @blur="handleBlur">
        </Password>
        <Dropdown v-if="type == 'input-select'" :name="name" :disabled="props.disabled" :options="options"
                  optionLabel="label" v-model="value" :placeholder="placeholder" :style="{ width: width + 'px' }"
                  @change="$emit('update:selectedItem', $event.value); handleChange($event.value)" @blur="handleBlur"
                  >
        </Dropdown>
        <SelectButton v-if="type == 'input-select-button'" :name="name" v-model="value" :options="options"
                      optionLabel="name" class="form-select-button flex-nowrap flex" />
        <span v-if="type == 'info'" :class="styles" :style="{ width: width + 'px' }">{{ value }}</span>
        <span v-if="type == 'info-link'">
            <router-link :to="props.to">{{ value }}</router-link>
        </span>
        <span v-if="errorMessage" class="wm-validation-message">
            {{ typeof errorMessage === 'string' ? $t(errorMessage) : $t(errorMessage.key, errorMessage.values) }}
        </span>
    </div>
</template>

<script setup>
import { defineProps, onMounted, watch } from 'vue';
import { toRef, ref } from 'vue';
import { useField } from 'vee-validate';

defineEmits(['update:value', 'update:selectedItem'])

const props = defineProps({
    value: {
        type: String,
        default: '',
    },
    to: {
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
        type: Array,
    },
    width: {
        type: String,
        default: '120',
    },
    inline: {
        type: Boolean,
        default: false,
    },

    class: {
        type: String,
    }
});

const styles = toRef(props, 'class');
const name = toRef(props, 'name');

watch(styles, (newValue) => {
    console.log("newValue", newValue)
})


const {
    value: value,
    errorMessage,
    handleBlur,
    handleChange,
    meta,
} = useField(name, undefined, {
    initialValue: props.value,
});

</script>

<style scoped lang="scss"></style>