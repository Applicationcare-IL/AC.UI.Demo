<template>
    <div class="wm-input flex flex-column">
        <label v-if="label != ''" class="wm-form-label"
               :class="[{
                       highlighted: props.highlighted,
                   }]">
            {{ label }} <span v-if="required" class="text-red-500"> *</span>
        </label>  
        <AutoComplete :suggestions="filteredOptions" optionLabel="name" 
        forceSelection dropdown  @complete="search" v-model="selectedOption" 
        :virtualScrollerOptions="{ itemSize: 30, lazy:true, showLoader:true, delay="250"  }"></AutoComplete>
    </div>
</template>

<script setup>
import { defineProps, ref } from 'vue';

const filteredOptions = ref();
const selectedOption = ref();
const allOptions = ref();

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

// const search = (event) => {
//     //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
//     let query = event.query;
//     let _filteredOptions = [];

//     for (let i = 0; i < props.options.length; i++) {
//         let item = props.options[i];
        
//         console.log(item)
//         if (item.name.toLowerCase().indexOf(query.toLowerCase()) === 0) {
//             _filteredOptions.push(item);
//         }
//     }

//     filteredOptions.value = _filteredOptions;
// };

</script>

<style scoped lang="scss"></style>