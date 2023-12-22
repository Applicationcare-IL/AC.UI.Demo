import { useI18n } from "vue-i18n";
import { computed } from "vue";

export function useLanguages() {
  const { locale } = useI18n();

  const optionLabelWithLang = computed(() => {
    return `value_${locale.value}`;
  });

  const getLocalizedValue = (optionSet) => {
    if (!optionSet) return "";
    if (locale.value === "en") {
      return optionSet.value_en;
    } else {
      return optionSet.value_he;
    }
  };

  return {
    optionLabelWithLang,
    getLocalizedValue,
  };
}
