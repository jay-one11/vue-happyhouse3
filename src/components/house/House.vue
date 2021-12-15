<template>
  <div>
    <header class="userhead">
      <div class="container px-4 px-lg-5 h-100">
        <div class="row gx-4 gx-lg-5 h-100 align-items-center justify-content-center text-center">
        </div>
      </div>
    </header>
    <section class="page-section" id="contact">
      <div class="container">
          <h3 class="mt-0">
            House Service
          <hr class="divider"/>
          </h3>
          <div class="row">   
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
          <div class="row">
            <div class="col">
              <div class="text-center" v-if="houses.length">
                <table class="table" id="houseTable">
                    <thead>
                        <tr>
                        <th scope="col">부동산 정보</th>
                        </tr>
                    </thead>
                    <tbody>
                <!-- <div v-if="houses && houses.length != 0" class="bv-example-row mt-3"> -->
                <house-list-row
                    v-for="(house, index) in houses"
                    :key="index"
                    :house="house"
                />
          </tbody>
      </table>
  </div>
  <!-- </div> -->
  <div v-else class="bv-example-row mt-3">
    <tr>
      <td class="mt-3 text-center">주택 목록이 없습니다.</td>
    </tr>
  </div>
            </div>
             <div class="col">
               <house-detail />
             </div>
        </div>
        <!-- <corona-list/> -->
      </div>
    </section>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
// import HouseList from "@/components/house/HouseList.vue";
import HouseDetail from "@/components/house/HouseDetail.vue";
//import CoronaList from "@/components/house/CoronaList.vue";
import HouseListRow from "@/components/house/HouseListRow.vue";

const houseStore = "houseStore";

export default {
  name: "House",
  components: {
    HouseList,
    HouseDetail,
    //CoronaList,
  },
  data() {
      return {
          sidoCode: null,
          gugunCode: null,
      };
  },
  computed: {
    ...mapState(houseStore, ["houses"]),
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
<style scoped>
.underline-orange {
  display: inline-block;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 70%,
    rgba(231, 149, 27, 0.3) 30%
  );
}
</style>
