import { defineStore } from 'pinia';
import { useI18n } from 'vue-i18n';

export const useFormUtilsStore = defineStore('formUtils', {
    state: () => ({
        genders: [
            { value: 'male', translationKey: 'genders.male' },
            { value: 'female', translationKey: 'genders.female' },
            { value: 'other', translationKey: 'genders.other' },
        ],
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
        getIsraeliPhoneRegex: () => {
            return  /^0(5[^7]|[2-4]|[8-9]|7[0-9])[0-9]{7}$/;
        },
        getIsraeliLandlineRegex: () => {
            return /^0(?:[234689]|5[0-689]|7[246789])(?![01])(\d{7})$/;
        }
    },
});