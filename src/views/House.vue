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
          <!-- <div class="row">   
            <house-search-bar></house-search-bar>
          </div> -->
          <house-list-2/>
          <!-- <div class="row">
            <div class="col">
              <house-list />
            </div>
             <div class="col">
               <house-detail />
             </div>
        </div> -->
        <!-- <corona-list/> -->
      </div>
    </section>
  </div>
</template>
<script>
//import HouseSearchBar from "@/components/house/HouseSearchBar.vue";
// import HouseList from "@/components/house/HouseList.vue";
// import HouseDetail from "@/components/house/HouseDetail.vue";
import HouseList2 from '../components/house/HouseList2.vue';
//import CoronaList from "@/components/house/CoronaList.vue";

export default {
  name: "House",
  components: {
    //HouseSearchBar,
    //HouseList,
    //HouseDetail,
    HouseList2,
    //CoronaList,
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
