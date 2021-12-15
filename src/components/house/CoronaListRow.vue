<template>
  <tr
    @click="consolelogg"
    >
    <td>{{ index + 1 }}</td>
    <td>{{ corona.name }}</td>
    <td>
      {{ corona.address }}</td>
    <td>{{ corona.operatingtime }}</td>
    <td>{{ corona.tel }}</td>
  </tr>
</template>

<script>

export default {
  name: "CoronaListRow",
  data() {
    return {
    };
  },
  props: {
    index : Number,
    corona: Object,
  },
  methods: {
    consolelogg(){
      console.log(this.corona);
    }
  },
};
</script>

<style scoped>
.apt {
  width: 50px;
}
.mouse-over-bgcolor {
  background-color: lightblue;
}
</style>
