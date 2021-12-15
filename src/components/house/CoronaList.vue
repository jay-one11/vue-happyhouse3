<template>
        <section class="page-section" id="contact">
            <div class="container">
                <div class="row">
                    
                  <h2 class="text-center">코로나19 선별진료소 정보</h2>
                  <hr class="divider" />
                
                </div>
                <div class="text-center" v-if="coronas.length">
                    <table class="table">
                        <thead>
                            <tr>
                            <th scope="col">번호</th>
                            <th scope="col">병원이름</th>
                            <th scope="col">주소</th>
                            <th scope="col">운영시간</th>
                            <th scope="col">전화번호</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- 하위 component인 ListRow에 데이터 전달(props) -->
                            <corona-list-row
                            v-for="(corona, index) in coronas"
                            :key="index"
                            :corona="corona"
                            :index="index"
                            />
                        </tbody>
                    </table>
                </div>
                <div v-else>글이 없습니다.</div>
            </div>
        </section>
</template>

<script>
import { mapState } from "vuex";
import CoronaListRow from "@/components/house/CoronaListRow";

const houseStore = "houseStore";

export default {
    name: "coronaList",
    components: {
    CoronaListRow,
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapState(houseStore, ["coronas"]),
    function(){
      console.log(this.coronas);
      return null;
    }
  },
  methods: {
  },
};
</script>

<style scoped>

table > thead{
background-color: #91c4cf;
}

#searchButton {
  margin-bottom: 6px;
}

#writeButton {
  float: right;
  margin-bottom: 6px;
}

#search, #searchSelect {
   height: 35px;
   margin-right: 5px;
}

#searchDiv {
  float: left;
}

ul {
  width: 300px;
  margin-left: auto;
  margin-right: auto;
}

</style>
