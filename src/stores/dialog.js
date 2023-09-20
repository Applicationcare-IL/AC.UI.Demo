import { useConfirm } from 'primevue/useconfirm';
import { useFormUtilsStore } from '@/stores/formUtils';
import { useI18n } from 'vue-i18n'

export function useDialog() {
    const confirm = useConfirm();
    const formUtilsStore = useFormUtilsStore();
    const i18n = useI18n();

    const confirmNewCustomer = (id) => {
        confirm.require({
            message: i18n.t('customer.notification.created.message'),
            header: i18n.t('customer.notification.created.header'),
            acceptLabel: i18n.t('customer.notification.created.detail'),
            rejectLabel: i18n.t('customer.notification.created.list'),
            accept: () => {
                formUtilsStore.goToDetail(id);
            },
            reject: () => {
                formUtilsStore.closeForm();
            },
        });
    }; 

    const discardNewCustomer = () => {
        confirm.require({
            message: i18n.t('customer.notification.discard.message'),
            header: i18n.t('customer.notification.discard.header'),
            acceptLabel: i18n.t('customer.notification.discard.accept'),
            rejectLabel: i18n.t('customer.notification.discard.cancel'),
            accept: () => {
                formUtilsStore.closeForm();
            },
            reject: () => {
            },
        });
    }

    return { confirmNewCustomer, discardNewCustomer }

}