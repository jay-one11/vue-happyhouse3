<template>
  <tr
    @click="selectHouse"
    @mouseover="colorChange(true)"
    @mouseout="colorChange(false)"
    :class="{ 'mouse-over-bgcolor': isColor }"
  >
    <td>
      [{{ house.일련번호 }}] {{ house.아파트 }}
    </td>
    <td>
      <img id="favorite" src="@/assets/img/heart-empty.png" alt="" @click="like"/>
    </td>
  </tr>
</template>

<script>

import { mapActions } from "vuex";

const houseStore = "houseStore";

export default {
  name: "HouseListRow",
  data() {
    return {
      isColor: false,
    };
  },
  props: {
    house: Object,
  },
  methods: {
    ...mapActions(houseStore, ["detailHouse"]),
    selectHouse() {
      // console.log("listRow : ", this.house);
      // this.$store.dispatch("getHouse", this.house);
      this.detailHouse(this.house);
    },
    colorChange(flag) {
      this.isColor = flag;
    },
    like() {
      alert("조아요");
    }
  },
};
</script>

<style scoped>
.apt {
  width: 50px;
}
.mouse-over-bgcolor {
  background-color: rgb(202, 238, 238);
}

#favorite {
  width: 25px;
  height: 25px;
}
</style>
