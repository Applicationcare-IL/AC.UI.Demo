import { useMagicKeys, whenever } from "@vueuse/core";
import { defineStore } from "pinia";
import * as yup from "yup";

import { useAdminUsersStore } from "@/stores/adminUsersStore";
import { useContactsStore } from "@/stores/contactsStore";
import { useCustomersStore } from "@/stores/customersStore";

const { ctrl_s } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.ctrlKey && e.key === "s" && e.type === "keydown") {
      e.preventDefault();
    }
  },
});

whenever(ctrl_s, () => {
  useFormUtilsStore().save();
});

const israeliPhoneRegex = /^0(5[^7]|[2-4]|[8-9]|7[0-9])[0-9]{7}$/;
const israeliLandlineRegex = /^0(?:[234689]|5[0-689]|7[246789])(?![01])(\d{7})$/;

export const useFormUtilsStore = defineStore("formUtils", {
  state: () => ({
    formEntity: "",
    save: "",
    cancel: "",
    israeliPhoneRegex: israeliPhoneRegex,
    israeliLandlineRegex: israeliLandlineRegex,
    isSidebar: false,
    isSidebarExpanded: false,
    expandSidebar: "",
    formMeta: {},
    cancelService: "",
    completeService: "",
    completeProject: "",
    completeProjectReasons: {},
    cancelServiceReasons: {},
    completeServiceReasons: {},
    formMetas: [],
    isFormSaved: false,
  }),
  getters: {
    yesNoOptions: () => {
      return [
        { value: true, name: "yes" },
        { value: false, name: "no" },
      ];
    },
    getAlphabet: () => {
      const alphabet = "אבגדהוזחטיכךלמםנןסעפףצץקרשת".split("");
      return alphabet.map((letter) => ({
        label: letter,
        value: letter,
      }));
    },
    getLoginFormValidationSchema: () => {
      return yup.object({
        email: yup.string().email().required(),
        password: yup.string().required(),
      });
    },
    getServiceFormValidationSchema: () => {
      return yup.object({
        description: yup.string().required().default(null).nullable(),
        contact: yup
          .object()
          .required({
            key: "validation.required-select",
            values: { label: "contact" },
          })
          .typeError({
            key: "validation.required-select",
            values: { label: "contact" },
          }),
        customer: yup
          .object()
          .required({
            key: "validation.required-select",
            values: { label: "customer" },
          })
          .typeError({
            key: "validation.required-select",
            values: { label: "customer" },
          }),
        area: yup.object().required(),
        type: yup.object().required(),
        request1: yup.object().required(),
        city: yup
          .object()
          .required({
            key: "validation.required-select",
            values: { label: "address.city" },
          })
          .typeError({
            key: "validation.required-select",
            values: { label: "address.city" },
          }),
        street: yup
          .object()
          .required({
            key: "validation.required-select",
            values: { label: "address.street" },
          })
          .typeError({
            key: "validation.required-select",
            values: { label: "address.street" },
          }),
        "house-number": yup.number().required(),
        // 'classification-1': yup.object().required({ key: 'validation.required-select', values: { label: 'classification-1' } })
        //     .typeError({ key: 'validation.required-select', values: { label: 'classification-1' } }),
        // 'classification-2': yup.object().required({ key: 'validation.required-select', values: { label: 'classification-2' } })
        //     .typeError({ key: 'validation.required-select', values: { label: 'classification-2' } }),
        // 'classification-3': yup.object().required({ key: 'validation.required-select', values: { label: 'classification-3' } })
        //     .typeError({ key: 'validation.required-select', values: { label: 'classification-3' } }),
        // 'city': yup.object().required({ key: 'validation.required-select', values: { label: 'address.city' } })
        //     .typeError({ key: 'validation.required-select', values: { label: 'address.city' } }),
        // 'street': yup.object().required({ key: 'validation.required-select', values: { label: 'address.street' } })
        //     .typeError({ key: 'validation.required-select', values: { label: 'address.street' } }),
        // 'site-name': yup.string().required({ key: 'validation.missing-field', values: { label: 'site.name' } }),
        // 'site-contact': yup.object().required({ key: 'validation.required-select', values: { label: 'site.contact' } })
        //     .typeError({ key: 'validation.required-select', values: { label: 'site.contact' } }),
      });
    },
    getMobileServiceFormValidationSchema: () => {
      return yup.object({
        "short-classification": yup.object().required(),
        description: yup.string().required().default(null).nullable(),
        "site-name": yup.object().required(),
        "site-type": yup.object().required(),
        "site-contact": yup.object().required(),
        "site-contact-role": yup.object().required(),
      });
    },
    getTaskFormValidationSchema: () => {
      return yup.object({
        description: yup.string().required(),
        contact: yup
          .object()
          .required({
            key: "validation.required-select",
            values: { label: "contact" },
          })
          .typeError({
            key: "validation.required-select",
            values: { label: "contact" },
          }),
        customer: yup
          .object()
          .required({
            key: "validation.required-select",
            values: { label: "customer" },
          })
          .typeError({
            key: "validation.required-select",
            values: { label: "customer" },
          }),
        "task-type": yup
          .object()
          .required({
            key: "validation.required-select",
            values: { label: "task.type" },
          })
          .typeError({
            key: "validation.required-select",
            values: { label: "task.type" },
          }),
        "task-family": yup
          .object()
          .required({
            key: "validation.required-select",
            values: { label: "task.family" },
          })
          .typeError({
            key: "validation.required-select",
            values: { label: "task.family" },
          }),
      });
    },
    getMobileTaskFormValidationSchema: () => {
      return yup.object({
        notes: yup.string().required(),
      });
    },
    getPaymentRequestTaskFormValidationSchema: () => {
      return yup.object({
        amount: yup.number().required(),
      });
    },
    getCustomerNewFormValidationSchema: (state) => {
      const customersStore = useCustomersStore();

      return yup.object({
        name: yup.string().required(),
        number: yup
          .string()
          .required()
          .test("unique", "validation.customer-already-exists", async (value) => {
            if (!value) return true;
            const exists = await customersStore.checkIfCustomerExists(value);
            return !exists;
          }),
        rating: yup
          .object()
          .required({
            key: "validation.required-select",
            values: { label: "customer.rating" },
          })
          .typeError({
            key: "validation.required-select",
            values: { label: "customer.rating" },
          }),
        service_area: yup
          .array()
          .required()
          .min(1, {
            key: "validation.required-select",
            values: { label: "customer.field" },
          }),
        email: yup.string().email().required(),
        phone: yup.string().trim().matches(state.israeliPhoneRegex, "validation.phone").required(),
        landline: yup.string().test("landline", "validation.landline", (value) => {
          if (!value) return true;
          return value.match(state.israeliLandlineRegex);
        }),
        fax: yup.string().test("fax", "validation.fax", (value) => {
          if (!value) return true;
          return value.match(/^\d{9}$/);
        }),
        type: yup
          .object()
          .required({
            key: "validation.required-select",
            values: { label: "customer.rating" },
          })
          .typeError({
            key: "validation.required-select",
            values: { label: "customer.rating" },
          }),
        // city: yup
        //   .object()
        //   .required({
        //     key: "validation.required-select",
        //     values: { label: "address.city" },
        //   })
        //   .typeError({
        //     key: "validation.required-select",
        //     values: { label: "address.city" },
        //   }),
        // street: yup
        //   .object()
        //   .required({
        //     key: "validation.required-select",
        //     values: { label: "address.street" },
        //   })
        //   .typeError({
        //     key: "validation.required-select",
        //     values: { label: "address.street" },
        //   }),
      });
    },
    getCustomerDetailFormValidationSchema: (state) => {
      return yup.object({
        name: yup.string().required(),
        number: yup.string().required(),
        service_area: yup.array().min(1, {
          key: "validation.required-select",
          values: { label: "customer.field" },
        }),
        email: yup.string().email().required(),
        phone: yup.string().trim().matches(state.israeliPhoneRegex, "validation.phone").required(),
      });
    },

    getContactNewFormValidationSchema: (state) => {
      const contactsStore = useContactsStore();

      return yup.object({
        "contact-number": yup
          .string()
          .test("min-digits", "validation.contactid", async (value) => {
            if (!value) return true;

            if (value.length < 9) return false;

            return true;
          })
          .test("unique", "validation.contact-already-exists", async (value) => {
            if (!value) return true;

            const exists = await contactsStore.checkIfContactExists(value);
            return !exists;
          }),
        "first-name": yup.string().required(),
        "last-name": yup.string().required(),
        "mobile-phone": yup
          .string()
          .trim()
          .matches(state.israeliPhoneRegex, "validation.phone")
          .required(),
        landline: yup.string().test("landline", "validation.landline", (value) => {
          if (!value) return true;
          return value.match(state.israeliLandlineRegex);
        }),
        fax: yup.string().test("fax", "validation.fax", (value) => {
          if (!value) return true;
          return value.match(/^\d{9}$/);
        }),
        email: yup.string().email().required(),
      });
    },
    getContactDetailFormValidationSchema: (state) => {
      // const contactsStore = useContactsStore();

      return yup.object({
        // "contact-number": yup
        //   .string()
        //   .min(9, "validation.contactid")
        //   .required()
        //   .test(
        //     "unique",
        //     "validation.contact-already-exists",
        //     async (value) => {
        //       if (!value) return true;
        //       const exists = await contactsStore.checkIfContactExists(value);
        //       return !exists;
        //     }
        //   ),
        "first-name": yup.string().required(),
        "last-name": yup.string().required(),
        "mobile-phone": yup
          .string()
          .trim()
          .matches(state.israeliPhoneRegex, "validation.phone")
          .required(),
        landline: yup
          .string()
          .test("landline", "validation.landline", (value) => {
            if (!value) return true;
            return value.match(state.israeliLandlineRegex);
          })
          .nullable(),
        fax: yup
          .string()
          .test("fax", "validation.fax", (value) => {
            if (!value) return true;
            return value.match(/^\d{9}$/);
          })
          .nullable(),
        email: yup.string().email().required(),
      });
    },

    getNewBudgetItemFormValidationSchema: () => {
      return yup.object({
        "budget-item-name": yup.string().required(),
        // description: yup.string().required(),
        // planned_contract: yup.number().required(),
        // unexpected: yup.number().required(),
        // management_fee: yup.number().required(),
        // estimate: yup.number().required(),
        // approved_council: yup.number().required(),
        // approved_ministry: yup.number().required(),
      });
    },
    getNewMilestoneFormValidationSchema: () => {
      return yup.object({
        "milestone-name": yup.string().required(),
      });
    },
    getSignTaskFormValidationSchema: () => {
      return yup.object({
        notes: yup.string().required(),
        signature_status: yup
          .object()
          .required({
            key: "validation.required-select",
            values: { label: "signature-status" },
          })
          .typeError({
            key: "validation.required-select",
            values: { label: "signature-status" },
          }),
      });
    },
    getForgotPasswordFormValidationSchema: () => {
      return yup.object({
        email: yup.string().email().required(),
      });
    },
    // the password and password-confirm fields are required and must be the same
    getResetPasswordFormValidationSchema: () => {
      return yup.object({
        password: yup.string().required(),
        "password-confirm": yup
          .string()
          .required()
          .oneOf([yup.ref("password")], "Passwords do not match"),
      });
    },
    getFormMeta: (state) => {
      return (key) => {
        return state.formMetas.find((meta) => meta.key === key);
      };
    },
    getNewProjectFormValidationSchema: () => {
      return yup.object({
        "project-name": yup.string().required(),
        "project-description": yup.string().required(),
        project_type: yup
          .object()
          .required({
            key: "validation.required-select",
            values: { label: "project_type" },
          })
          .typeError({
            key: "validation.required-select",
            values: { label: "project_type" },
          }),
        showAddressOptions: yup.boolean(),
        city: yup.object().when("showAddressOptions", {
          is: true,
          then: () =>
            yup
              .object()
              .required({
                key: "validation.required-select",
                values: { label: "address.city" },
              })
              .typeError({
                key: "validation.required-select",
                values: { label: "address.city" },
              }),
          otherwise: () => yup.object().optional(),
        }),
        street: yup.object().when("showAddressOptions", {
          is: true,
          then: () =>
            yup
              .object()
              .required({
                key: "validation.required-select",
                values: { label: "address.street" },
              })
              .typeError({
                key: "validation.required-select",
                values: { label: "address.street" },
              }),
          otherwise: () => yup.object().optional(),
        }),
        "house-number": yup.number().when("showAddressOptions", {
          is: true,
          then: () => yup.number().required(),
          otherwise: () => yup.number().optional(),
        }),
        showCityDataOptions: yup.boolean(),
        parcel: yup.string().when("showCityDataOptions", {
          is: true,
          then: () => yup.string().required(),
          otherwise: () => yup.string().optional(),
        }),
        block: yup.string().when("showCityDataOptions", {
          is: true,
          then: () => yup.string().required(),
          otherwise: () => yup.string().optional(),
        }),
      });
    },
    getUserNewFormValidationSchema: (state) => {
      // const adminUsersStore = useAdminUsersStore();

      return yup.object({
        name: yup.string().required(),
        surname: yup.string().required(),
        // email: yup
        //   .string()
        //   .required()
        //   .test("unique", "validation.user-already-exists", async (value) => {
        //     if (!value) return true;
        //     const exists = await adminUsersStore.checkIfUserExists(value);
        //     return !exists;
        //   }),
        phone: yup
          .string()
          .trim()
          .matches(state.israeliLandlineRegex, "validation.phone")
          .required(),
        manager: yup
          .object()
          .required({
            key: "validation.required-select",
            values: { label: "manager" },
          })
          .typeError({
            key: "validation.required-select",
            values: { label: "manager" },
          }),
      });
    },
    getTeamNewFormValidationSchema: (state) => {
      return yup.object({
        "team-name": yup.string().required(),
      });
    },
    getRoleNewFormValidationSchema: (state) => {
      return yup.object({
        "role-name": yup.string().required(),
      });
    },
    getQuickCodeNewFormValidationSchema: (state) => {
      return yup.object({
        "quickCode-name": yup.string().required(),
        "team-name": yup.string().required(),
      });
    },
    getMessageNewFormValidationSchema: (state) => {
      return yup.object({
        "message-header": yup.string().required(),
      });
    },
  },
  actions: {
    closeForm() {
      if (this.isSidebar) this.expandSidebar = "";
      else this.router.push("/" + this.formEntity + "s");
    },
    goToDetail(id, entity) {
      const entityPath = entity || this.formEntity;
      this.router.push("/" + entityPath + "/" + id);
    },
    goToAdminDetail(id, entity) {
      this.router.push("/admin/" + entity + "/" + id);
    },
    setFormMetas(meta, key) {
      const index = this.formMetas.findIndex((meta) => meta.key === key);

      if (index > -1) {
        this.formMetas[index] = { ...meta, key };
        return;
      }

      this.formMetas.push({ ...meta, key });
    },
  },
});
