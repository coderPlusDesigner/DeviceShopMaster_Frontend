import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useProductsStore = defineStore('products', () => {
  const products = ref<{}[]>([])
  const productCount = ref(0)

  const loading = ref(false)

  async function getAllProducts() {
    loading.value = await true
    await axios.get('/products/all/').then((res) => {
      products.value = res.data
      productCount.value = res.data.length
    })
    loading.value = await false
  }

  return { products, productCount, getAllProducts, loading }
})
