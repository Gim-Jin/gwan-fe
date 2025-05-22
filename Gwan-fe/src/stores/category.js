import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios';


const REST_API_URL = 'http://localhost:8080/api/targets';

export const useTargetStore = defineStore('target', () => {

  // 리스트
  const targetList = ref([]);
    

  const getRankedTargetList = function() {
    axios({
        url: REST_API_URL,
        method: "GET",
        params: {
            sort: 'popular'
        }
    })
    .then((response) => {
        targetList.value = response.data.data;
    })
  }

  return { getRankedTargetList, targetList}
})
