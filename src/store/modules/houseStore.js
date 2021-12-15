import {
  sidoList,
  gugunList,
  houseList,
  findStarbucks,
  coronaList,
} from "@/api/house.js";

const houseStore = {
  namespaced: true,
  state: {
    sidos: [{ value: null, text: "선택하세요" }],
    guguns: [{ value: null, text: "선택하세요" }],
    houses: [],
    house: null,
    starbuckses: [],
    coronas: [],
    corona: null,
  },

  getters: {},

  mutations: {
    SET_SIDO_LIST: (state, sidos) => {
      sidos.forEach((sido) => {
        state.sidos.push({ value: sido.sidoCode, text: sido.sidoName });
      });
    },
    SET_GUGUN_LIST: (state, guguns) => {
      guguns.forEach((gugun) => {
        state.guguns.push({ value: gugun.gugunCode, text: gugun.gugunName });
      });
      // console.log(guguns);
    },
    CLEAR_SIDO_LIST: (state) => {
      state.sidos = [{ value: null, text: "선택하세요" }];
    },
    CLEAR_GUGUN_LIST: (state) => {
      state.guguns = [{ value: null, text: "선택하세요" }];
    },
    SET_HOUSE_LIST: (state, houses) => {
      //   console.log(houses);
      state.houses = houses;
      // console.log(houses);
    },
    SET_DETAIL_HOUSE: (state, house) => {
      state.house = house;
    },
    SET_StarBucks_LIST: (state, starbucks) => {
      // console.log(starbucks);
      state.starbuckses = starbucks;
    },
    SET_CORONA_LIST: (state, coronas) => {
      // console.log(starbucks);
      state.coronas = coronas;
    },
  },

  actions: {
    getSido: ({ commit }) => {
      sidoList(
        ({ data }) => {
          console.log(data);
          commit("SET_SIDO_LIST", data);
        },
        (error) => {
          console.log(error);
        }
      );
    },
    getGugun: ({ commit }, sidoCode) => {
      const params = {
        sido: sidoCode,
      };
      gugunList(
        params,
        ({ data }) => {
          // console.log(commit, response);
          commit("SET_GUGUN_LIST", data);
        },
        (error) => {
          console.log(error);
        }
      );
    },
    getHouseList: ({ commit }, gugunCode) => {
      // vue cli enviroment variables 검색
      //.env.local file 생성.
      // 반드시 VUE_APP으로 시작해야 한다.
      // const SERVICE_KEY = process.env.VUE_APP_APT_DEAL_API_KEY;
      const SERVICE_KEY =
        "4E4nrJ+H/omaBiHVsdbx7OtbAWGONBPD84Af53tjBa/Hoe/QWcqZ19TTt8BN+dic8qksrVJRoCHpAVREMcj4Kg==";
      const params = {
        LAWD_CD: gugunCode,
        DEAL_YMD: "202110",
        serviceKey: decodeURIComponent(SERVICE_KEY),
        numOfRows: encodeURIComponent("15"),
      };
      houseList(
        params,
        (response) => {
          console.log(response.data.response.body.items.item);
          commit("SET_HOUSE_LIST", response.data.response.body.items.item);
        },
        (error) => {
          console.log(error);
        }
      );
    },
    detailHouse: ({ commit }, house) => {
      commit("SET_DETAIL_HOUSE", house);
    },
    getStarbucks: ({ commit }, dongcode) => {
      console.log(dongcode);
      const params = {
        dong: dongcode,
      };
      findStarbucks(
        params,
        ({ data }) => {
          console.log(data);
          commit("SET_StarBucks_LIST", data);
        },
        (error) => {
          console.log(error);
        }
      );
    },
    getCoronaList: ({ commit }, gugunCode) => {
      console.log(gugunCode);
      const params = {
        gugun: gugunCode,
      };
      coronaList(
        params,
        ({ data }) => {
          console.log(data);
          commit("SET_CORONA_LIST", data);
        },
        (error) => {
          console.log(error);
        }
      );
    },
    setMarker: ({ commit }) => {
      commit("SET_MARKER");
      return 0;
    },
  },
};

export default houseStore;
