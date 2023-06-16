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
        classification1: [
            { value: 'urban-architect', translationKey: 'classification1.urban-architect' },
            { value: 'sharp-internet-jokes', translationKey: 'classification1.sharp-internet-jokes' },
            { value: 'people-named-robert', translationKey: 'classification1.people-named-robert' },
        ],
    }),
    getters: {

    },
    actions: {
        getOptionSetValues(optionSet) {
            const i18n = useI18n();
            return this[optionSet].map((option) => ({
                value: option.value,
                name: i18n.t(option.translationKey),
                label: i18n.t(option.translationKey),
            }));
        }
    }
});