import { defineStore } from 'pinia';
import { useI18n } from 'vue-i18n';

export const useOptionSetsStore = defineStore('optionSets', {
    state: () => ({
        gender: [
            { value: 'male', translationKey: 'genders.male' },
            { value: 'female', translationKey: 'genders.female' },
            { value: 'other', translationKey: 'genders.other' },
        ],
        status: [
            { value: 'open', translationKey: 'statuses.open' },
            { value: 'closed', translationKey: 'statuses.closed' },
        ],
        type: [
            { value: 'private', translationKey: 'customer-type.private' },
            { value: 'business', translationKey: 'customer-type.business' },
        ],
        rating: [
            { value: 'vip', translationKey: 'customer-rating.vip' },
            { value: 'regular', translationKey: 'customer-rating.regular' },
        ],
    }),
    getters: {

    },
    actions: {
        getOptionSetValues(optionSet) {
            const i18n = useI18n();
            return this[optionSet].map((option) => ({
                value: option.value,
                label: i18n.t(option.translationKey),
            }));
        }
    }
});