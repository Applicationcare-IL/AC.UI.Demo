import { defineStore } from 'pinia';
import { useI18n } from 'vue-i18n';
import * as yup from 'yup';

const israeliPhoneRegex = /^0(5[^7]|[2-4]|[8-9]|7[0-9])[0-9]{7}$/;
const israeliLandlineRegex = /^0(?:[234689]|5[0-689]|7[246789])(?![01])(\d{7})$/;

export const useFormUtilsStore = defineStore('formUtils', {
    state: () => ({
        genders: [
            { value: 'male', translationKey: 'genders.male' },
            { value: 'female', translationKey: 'genders.female' },
            { value: 'other', translationKey: 'genders.other' },
        ],
        statusOptions: [
            { value: 'open', translationKey: 'statuses.open' },
            { value: 'closed', translationKey: 'statuses.closed' },
        ],
        submit: '',
        formErrors: '',
        israeliPhoneRegex:israeliPhoneRegex,
        israeliLandlineRegex:israeliLandlineRegex,
    }),
    getters: {
        getGenders: (state) => {
            const i18n = useI18n();
            return state.genders.map((gender) => ({
                value: gender.value,
                label: i18n.t(gender.translationKey),
            }));
        },
        getAlphabetWithDash: () => {
            const alphabet = 'אבגדהוזחטיכךלמםנןסעפףצץקרשת'.split('');
            const alphabetWithDash = alphabet.map(letter => ({ label: "-" + letter, value: "-" + letter }));
            return alphabetWithDash;
        },
        getStatusOptions: (state) => {
            const i18n = useI18n();
            return state.statusOptions.map((option) => ({
                value: option.value,
                label: i18n.t(option.translationKey),
            }));
        },
        getServiceFormValidationSchema: () => {
            return yup.object({
                'contact': yup.object().required({ key: 'validation.required-select', values: { label: 'contact' } })
                    .typeError({ key: 'validation.required-select', values: { label: 'contact' } }),
                'customer': yup.object().required({ key: 'validation.required-select', values: { label: 'customer' } })
                    .typeError({ key: 'validation.required-select', values: { label: 'customer' } }),
                'classification-1': yup.object().required({ key: 'validation.required-select', values: { label: 'classification-1' } })
                    .typeError({ key: 'validation.required-select', values: { label: 'classification-1' } }),
                'classification-2': yup.object().required({ key: 'validation.required-select', values: { label: 'classification-2' } })
                    .typeError({ key: 'validation.required-select', values: { label: 'classification-2' } }),
                'classification-3': yup.object().required({ key: 'validation.required-select', values: { label: 'classification-3' } })
                    .typeError({ key: 'validation.required-select', values: { label: 'classification-3' } }),
                'city': yup.object().required({ key: 'validation.required-select', values: { label: 'address.city' } })
                    .typeError({ key: 'validation.required-select', values: { label: 'address.city' } }),
                'street': yup.object().required({ key: 'validation.required-select', values: { label: 'address.street' } })
                    .typeError({ key: 'validation.required-select', values: { label: 'address.street' } }),
                'site-name': yup.string().required({ key: 'validation.missing-field', values: { label: 'site.name' } }),
                'site-contact': yup.object().required({ key: 'validation.required-select', values: { label: 'site.contact' } })
                    .typeError({ key: 'validation.required-select', values: { label: 'site.contact' } }),

            });
        },
        getTaskFormValidationSchema: () => {
            return yup.object({
                'contact': yup.object().required({ key: 'validation.required-select', values: { label: 'contact' } })
                    .typeError({ key: 'validation.required-select', values: { label: 'contact' } }),
                'customer': yup.object().required({ key: 'validation.required-select', values: { label: 'customer' } })
                    .typeError({ key: 'validation.required-select', values: { label: 'customer' } }),
                'task-type': yup.object().required({ key: 'validation.required-select', values: { label: 'task.type' } })
                    .typeError({ key: 'validation.required-select', values: { label: 'task.type' } }),
                'task-family': yup.object().required({ key: 'validation.required-select', values: { label: 'task.family' } })
                    .typeError({ key: 'validation.required-select', values: { label: 'task.family' } }),
            });
        },

        getCustomerFormValidationSchema: () => {
            return yup.object({
                'name': yup.string().min(9).required(),
                'number': yup.string().required(),
                'field': yup.array().min(1, { key: 'validation.required-select', values: { label: 'customer.field' } })
                    .typeError({ key: 'validation.required-select', values: { label: 'customer.field' } }),
                'city': yup.object().required({ key: 'validation.required-select', values: { label: 'address.city' } })
                    .typeError({ key: 'validation.required-select', values: { label: 'address.city' } }),
                'street': yup.object().required({ key: 'validation.required-select', values: { label: 'address.street' } })
                    .typeError({ key: 'validation.required-select', values: { label: 'address.street' } }),
                'house-number': yup.string().required(),
            });
        },

        getContactFormValidationSchema: (state) => {
            return yup.object({
                'contactid': yup.string().min(9, 'validation.contactid').required(),
                'mobile-phone': yup.string().trim().matches(state.israeliPhoneRegex, 'validation.phone').required(),
                'landline': yup.string().trim().matches(state.israeliLandlineRegex, 'validation.phone').required(),
                'email': yup.string().trim().email('validation.email').required(),
            });
        },
        getContactDetailFormValidationSchema: (state) => {
            return yup.object({
                'first-name' : yup.string().required(),
                'last-name' : yup.string().required(),
            });
        }
    },
});