<template>
  <div class="text-center" v-if="houses.length">
      <table class="table" id="houseTable">
          <thead>
              <tr>
              <th scope="col">부동산 정보</th>
              <th scope="col"></th>
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
</template>

<script>
import HouseListRow from "@/components/house/HouseListRow.vue";
import { mapState } from "vuex";

const houseStore = "houseStore";

export default {
  name: "HouseList",
  components: {
    HouseListRow,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(houseStore, ["houses"]),
    // houses() {
    //   return this.$store.state.houses;
    // },
  },
};
</script>

<style>
thead {
  background-color: #91c4cf;
}

#houseTable {
  margin-top: 65px;
}
</style>
