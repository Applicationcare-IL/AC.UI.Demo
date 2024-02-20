import { useMagicKeys, whenever } from "@vueuse/core";
import { defineStore } from "pinia";
import * as yup from "yup";

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
const israeliLandlineRegex =
  /^0(?:[234689]|5[0-689]|7[246789])(?![01])(\d{7})$/;

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
    getCustomerNewFormValidationSchema: (state) => {
      return yup.object({
        name: yup.string().required(),
        number: yup.string().required(),
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
        phone: yup
          .string()
          .trim()
          .matches(state.israeliPhoneRegex, "validation.phone")
          .required(),
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
        phone: yup
          .string()
          .trim()
          .matches(state.israeliPhoneRegex, "validation.phone")
          .required(),
      });
    },

    getContactNewFormValidationSchema: (state) => {
      return yup.object({
        // "contact-number": yup
        //   .string()
        //   .min(9, "validation.contactid")
        //   .required(),
        "first-name": yup.string().required(),
        "last-name": yup.string().required(),
        "mobile-phone": yup
          .string()
          .trim()
          .matches(state.israeliPhoneRegex, "validation.phone")
          .required(),
        email: yup.string().required(),
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
    getContactDetailFormValidationSchema: () => {
      return yup.object({
        "first-name": yup.string().required(),
        "last-name": yup.string().required(),
        // "contact-number": yup
        //   .string()
        //   .min(9, "validation.contactid")
        //   .required(),
      });
    },

    getNewBudgetItemFormValidationSchema: () => {
      return yup.object({
        "budget-item-name": yup.string().required(),
        description: yup.string().required(),
        planned_non_contract: yup.number().required(),
        planned_contract: yup.number().required(),
        unexpected: yup.number().required(),
        management_fee: yup.number().required(),
        estimate: yup.number().required(),
        approved_council: yup.number().required(),
        approved_ministry: yup.number().required(),
      });
    },
    // getContactDetailFormValidationSchema: (state) => {
    //   return yup.object({
    //     "first-name": yup.string().required(),
    //     "last-name": yup.string().required(),
    //   });
    // },
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
