import { defineStore } from 'pinia';
import { i18n } from '@/i18n';
import axiosConfig from '@/service/axiosConfig';

// const i18n = useI18n();

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
            { value: 'active', translationKey: 'statuses.active' },
            { value: 'not_active', translationKey: 'statuses.not_active' },
        ],
        type: [
            { value: 'private', translationKey: 'customer-type.private' },
            { value: 'business', translationKey: 'customer-type.business' },
        ],
        rating: [
            { value: 'vip', translationKey: 'customer-rating.vip' },
            { value: 'regular', translationKey: 'customer-rating.regular' },
        ],
        area: [
            { value: 'water_service', translationKey: 'area.water_service' },
            { value: 'funeral_service', translationKey: 'area.funeral_service' },
            { value: 'municipality', translationKey: 'area.municipality' },
        ],
        classification1: [
            { value: 'urban-architect', translationKey: 'classification1.urban-architect' },
            { value: 'sharp-internet-jokes', translationKey: 'classification1.sharp-internet-jokes' },
            { value: 'people-named-robert', translationKey: 'classification1.people-named-robert' },
        ],
        classification4: [
            { value: 'urban-architect', translationKey: 'classification1.urban-architect' },
            { value: 'sharp-internet-jokes', translationKey: 'classification1.sharp-internet-jokes' },
            { value: 'people-named-robert', translationKey: 'classification1.people-named-robert' },
        ],
        classification5: [
            { value: 'urban-architect', translationKey: 'classification1.urban-architect' },
            { value: 'sharp-internet-jokes', translationKey: 'classification1.sharp-internet-jokes' },
            { value: 'people-named-robert', translationKey: 'classification1.people-named-robert' },
        ],
        yesNo: [
            { value: true, translationKey: 'yes' },
            { value: false, translationKey: 'no' },
        ]
    }),
    getters: {

    },
    actions: {
        getOptionSetValues(optionSet) {
            return this[optionSet].map((option) => ({
                value: option.value,
                name: i18n.t(option.translationKey),
                label: i18n.t(option.translationKey),
            }));
        },
        getOptionSetValuesFromApi(optionSet) {
            return axiosConfig.get('/options-set', { params: { name: optionSet } })
            .then((response) => {
                    const optionSetValues = response.data.data.map((option) => ({
                        value: option.value,
                        id: option.id,
                        name: i18n.t("option-set." + optionSet  + '.' + option.value),
                        label: i18n.t("option-set." + optionSet  + '.' + option.value),
                    }));
                    return optionSetValues;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        getOptionSetValuesFromApiRaw(optionSet) {
            return axiosConfig.get('/options-set', { params: { name: optionSet } })
            .then((response) => {
                    const optionSetValues = response.data.data.map((option) => ({
                        value: option.value,
                        id: option.id,
                        name: option.value,
                        label: option.value,
                    }));
                    return optionSetValues;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
    
    }
});