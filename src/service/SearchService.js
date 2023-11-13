import axiosConfig from "@/service/axiosConfig";

export const SearchService = {
  globalSearch(params) {
    return axiosConfig
      .get("/global/search", { params })
      .then((response) => {
        console.log(response);
        const results = response.data.data;
        return results;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
