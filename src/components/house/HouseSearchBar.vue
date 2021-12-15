<template>
<div class="row">
    <div class="col">
      <select class="form-control" v-model="sidoCode" @change="gugunList">
        <option v-for="sido in sidos" v-bind:key="sido.value" v-bind:value="sido.value">
          {{ sido.text }}
        </option>
      </select>
    </div>
    <div class="col">
      <select class="form-control" v-model="gugunCode" @change="searchApt">
        <option v-for="gugun in guguns" v-bind:key="gugun.value" v-bind:value="gugun.value">
          {{ gugun.text }}
        </option>
      </select>
    </div>
</div>
  
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";

/*
  namespaced: true를 사용했기 때문에 선언해줍니다.
  index.js 에서 modules 객체의 '키' 이름입니다.

  modules: {
    키: 값
    memberStore: memberStore,
    houseStore: houseStore
  }  
*/
const houseStore = "houseStore";

export default {
  name: "HouseSearchBar",
  data() {
    return {
      sidoCode: null,
      gugunCode: null,
    };
  },
  computed: {
    ...mapState(houseStore, ["sidos", "guguns"]),
    // sidos() {
    //   return this.$store.state.sidos;
    // },
  },
  created() {
    // this.$store.dispatch("getSido");
    // this.sidoList();
    this.CLEAR_SIDO_LIST();
    this.getSido();
  },
  methods: {
    ...mapActions(houseStore, ["getSido", "getGugun", "getHouseList", "getCoronaList"]),
    ...mapMutations(houseStore, ["CLEAR_SIDO_LIST", "CLEAR_GUGUN_LIST", ]),
    // sidoList() {
    //   this.getSido();
    // },
    gugunList() {
      // console.log(this.sidoCode);
      this.CLEAR_GUGUN_LIST();
      this.gugunCode = null;
      console.log(this.sidoCode);
      if (this.sidoCode) this.getGugun(this.sidoCode);
    },
    searchApt() {
      console.log(this.gugunCode);
      if (this.gugunCode) this.getHouseList(this.gugunCode);
      if (this.gugunCode) this.getCoronaList(this.gugunCode);
    },
  },
};
</script>

<style></style>
