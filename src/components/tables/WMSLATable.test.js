import { createTestingPinia } from "@pinia/testing";
import { mount } from "@vue/test-utils";
import { describe, it } from "vitest";

import WMSLATable from "./WMSLATable.vue";

describe("WMSLATable", () => {
  const mockedServicesData = [
    {
      area_id: 1779,
      area_value: "service area 1",
      total: 32,
      breached: 15,
      near_breach: 0,
      no_breach: 17,
    },
    {
      area_id: 1966,
      area_value: "service area 2",
      total: 13,
      breached: 6,
      near_breach: 1,
      no_breach: 6,
    },
  ];

  const mockedTasksData = [
    {
      area_id: 1779,
      family: "task family 1",
      total: 32,
      breached: 15,
      near_breach: 0,
      no_breach: 17,
    },
    {
      area_id: 1966,
      family: "task family 2",
      total: 13,
      breached: 6,
      near_breach: 1,
      no_breach: 6,
    },
  ];

  const defaultProps = {
    data: mockedServicesData,
    entity: "services_sla",
  };

  const defaultPlugins = [createTestingPinia()];

  it("renders the table", () => {
    const wrapper = mount(WMSLATable, {
      props: {
        ...defaultProps,
      },
      plugins: defaultPlugins,
    });

    expect(wrapper.find("table").exists()).toBe(true);
  });

  it("renders the table with the correct mocked data", () => {
    const wrapper = mount(WMSLATable, {
      props: {
        ...defaultProps,
      },
      plugins: defaultPlugins,
    });

    const rows = wrapper.findAll("tr");
    expect(rows.length).toBe(mockedServicesData.length + 1);
  });

  it("renders the area_value column when props.entity is services_sla", () => {
    const wrapper = mount(WMSLATable, {
      props: {
        data: mockedServicesData,
        entity: "services_sla",
      },
      plugins: defaultPlugins,
    });

    expect(wrapper.text()).toContain(mockedServicesData[0].area_value);
  });

  it("renders the family column when props.entity is tasks_sla", () => {
    const wrapper = mount(WMSLATable, {
      props: {
        data: mockedTasksData,
        entity: "tasks_sla",
      },
      plugins: defaultPlugins,
    });

    expect(wrapper.text()).toContain(mockedTasksData[0].family);
  });
});
