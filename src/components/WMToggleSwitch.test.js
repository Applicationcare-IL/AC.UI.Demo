import { mount } from "@vue/test-utils";
import { describe, it } from "vitest";

import WMToggleSwitch from "./WMToggleSwitch.vue";

describe("WMToggleSwitch", () => {
  it("renders a toggle switch", () => {
    const wrapper = mount(WMToggleSwitch);
    expect(wrapper.find("input[type='checkbox']").exists()).toBe(true);
  });

  it("renders correctly with default values", () => {
    const wrapper = mount(WMToggleSwitch);
    expect(wrapper.classes()).toContain("toggle-switch");
    expect(wrapper.classes()).toContain("toggle-switch--blue");
    expect(wrapper.text()).toBe("");
  });

  it("renders correctly with passed props", () => {
    const wrapper = mount(WMToggleSwitch, {
      props: {
        label: "Test Label",
        modelValue: true,
        theme: "red",
      },
    });
    expect(wrapper.classes()).toContain("toggle-switch");
    expect(wrapper.classes()).toContain("toggle-switch--red");
    expect(wrapper.classes()).toContain("is-active");
    expect(wrapper.text()).toBe("Test Label");
  });

  it("emits update:modelValue event on input switch", async () => {
    const wrapper = mount(WMToggleSwitch, {
      props: {
        modelValue: false,
      },
    });

    await wrapper.find("input").trigger("click");

    expect(wrapper.emitted()).toHaveProperty("update:modelValue");
    expect(wrapper.emitted()["update:modelValue"][0]).toEqual([true]);
  });

  it("renders correctly the text passed in the default slots when we modelValue is true", () => {
    const wrapper = mount(WMToggleSwitch, {
      props: {
        modelValue: true,
      },
      slots: {
        default: "Test Label",
      },
    });

    expect(wrapper.text()).toBe("Test Label");
  });
});
