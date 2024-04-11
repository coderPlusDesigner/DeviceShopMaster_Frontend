<template>
  <div id="products-page">
    <h2>Продукты ({{ ProductsStore.productCount }})</h2>
    <div v-if="ProductsStore.loading" class="loading">
      <ProgressSpinner
        style="width: 50px; height: 50px"
        strokeWidth="8"
        fill="var(--surface-ground)"
        animationDuration=".5s"
        aria-label="Custom ProgressSpinner"
      />
    </div>

    <div class="card">
      <Toolbar class="mb-4">
        <template #start>
          <div style="display: flex; column-gap: 6px">
            <Button label="Создавать новое" severity="primary" class="mr-2" @click="openNew" />
            <Button
              label="Удалить"
              severity="danger"
              style="background-color: var(--red)"
              @click="confirmDeleteSelected"
              :disabled="!selectedProducts || !selectedProducts.length"
            />
          </div>
        </template>

        <template #end>
          <Button label="Экспорт" severity="help" @click="exportCSV($event)" />
        </template>
      </Toolbar>

      <DataTable
        ref="dt"
        :value="ProductsStore.products"
        v-model:selection="selectedProducts"
        dataKey="id"
        :paginator="true"
        :rows="10"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Показаны продукты с {first} по {last} из {totalRecords}"
      >
        <template #header>
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              flex-wrap: wrap;
              row-gap: 10px;
            "
          >
            <h4 class="m-0">Управление продуктами:</h4>
            <Dropdown
              v-model="selectedCategory"
              :options="categories"
              optionLabel="name"
              placeholder="Выберите категорию"
              class="md:w-14rem"
            />
            <div style="display: flex; column-gap: 6px">
              <InputText
                @blur="searchProduct"
                @keyup.enter="searchProduct"
                v-model="searchFilter"
                placeholder="Поиск продуктов ..."
              />
              <Button severity="primary" @click="searchProduct">
                <img
                  src="/src/assets/icons/search.svg"
                  alt="search"
                  height="20px"
                  style="filter: invert(100%)"
                />
              </Button>
            </div>
            <Button label="Очистить" severity="help" @click="clearFilters" />
          </div>
        </template>

        <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
        <Column header="Изображение">
          <template #body="slotProps">
            <div class="image">
              <Image
                v-if="slotProps.data.thumbnail"
                :src="
                  slotProps.data.thumbnail.includes('http')
                    ? slotProps.data.thumbnail
                    : generalData.baseURL + slotProps.data.thumbnail
                "
                :alt="slotProps.data.device_model"
                preview
              />
              <img v-else src="/src/assets/no photo.jpg" alt="no photo" />
            </div>
          </template>
        </Column>
        <Column field="device_model" header="Модель устройства" style="min-width: 16rem"></Column>
        <Column field="release_date" header="Дата релиза" style="min-width: 8rem">
          <template #body="slotProps">
            {{ new Date(slotProps.data.release_date).getDate() }}.{{
              new Date(slotProps.data.release_date).getMonth() + 1
            }}.{{ new Date(slotProps.data.release_date).getFullYear() }}
          </template>
        </Column>
        <Column field="category" header="Категория" style="min-width: 16rem">
          <template #body="slotProps">
            {{ categoryName(slotProps.data.category) }}
          </template>
        </Column>
        <Column field="rrp_price" header="Рекомендуемая розничная цена" style="min-width: 8rem">
          <template #body="slotProps"> $ {{ slotProps.data.rrp_price }} </template>
        </Column>
        <Column field="published_date" header="Дата добавления товара" style="min-width: 8rem">
          <template #body="slotProps">
            {{ new Date(slotProps.data.published_date).getDate() }}.{{
              new Date(slotProps.data.published_date).getMonth() + 1
            }}.{{ new Date(slotProps.data.published_date).getFullYear() }}
          </template>
        </Column>
        <Column field="product_visibility" header="Видимость товара" style="min-width: 8rem">
          <template #body="slotProps">
            <Tag
              :value="slotProps.data.product_visibility ? 'ВИДНО' : 'НЕВИДНО'"
              :severity="
                slotProps.data.product_visibility
                  ? getStatusLabel('ВИДНО')
                  : getStatusLabel('НЕВИДНО')
              "
            />
          </template>
        </Column>
        <Column :exportable="false" style="min-width: 8rem">
          <template #body="slotProps">
            <div style="display: flex; column-gap: 6px">
              <Button rounded class="mr-2" @click="editProduct(slotProps.data)">
                <img
                  src="/src/assets/icons/edit.svg"
                  alt="edit"
                  style="filter: invert(100%)"
                  height="20px"
                />
              </Button>
              <Button
                rounded
                severity="danger"
                style="background-color: var(--red)"
                @click="confirmDeleteProduct(slotProps.data)"
              >
                <img
                  src="/src/assets/icons/trash.svg"
                  alt="delete"
                  height="20px"
                  style="filter: invert(100%)"
                />
              </Button>
            </div>
          </template>
        </Column>
      </DataTable>

      <Dialog
        v-model:visible="productDialog"
        :style="{ width: '450px' }"
        header="Информация о продукте"
        :modal="true"
        class="p-fluid"
      >
        <div v-if="product.thumbnail" class="image" style="height: auto">
          <img
            :src="
              product.thumbnail.includes('http')
                ? product.thumbnail
                : generalData.baseURL + product.thumbnail
            "
            :alt="product.device_model"
            class="block m-auto pb-3"
            width="100%"
          />
        </div>
        <img v-else src="/src/assets/no photo.jpg" alt="no photo" width="100%" />
        <div class="field">
          <label for="name">Модель устройства</label>
          <InputText
            id="name"
            v-model.trim="product.device_model"
            required="true"
            autofocus
            :invalid="submitted && !product.device_model"
          />
          <small class="p-error" v-if="submitted && !product.device_model">Требуется имя.</small>
        </div>
        <div class="field">
          <label for="description">Описание</label>
          <Editor v-model="product.description" editorStyle="height: 100px">
            <template v-slot:toolbar>
              <span class="ql-formats">
                <button v-tooltip.bottom="'Bold'" class="ql-bold"></button>
                <button v-tooltip.bottom="'Italic'" class="ql-italic"></button>
                <button v-tooltip.bottom="'Underline'" class="ql-underline"></button>
              </span>
            </template>
          </Editor>
        </div>

        <div class="field">
          <label for="category" class="mb-3">Категория</label>
          <Dropdown
            id="category"
            v-model="product.category"
            :options="categories"
            optionLabel="name"
            placeholder="Выберите категорию"
          >
            <template #value="slotProps">
              <div v-if="slotProps.value && slotProps.value.name">
                <span>{{ slotProps.value.name }}</span>
              </div>
              <span v-else>
                {{ slotProps.placeholder }}
              </span>
            </template>
          </Dropdown>
        </div>

        <div class="formgrid grid">
          <div class="field col">
            <label for="price">Рекомендуемая розничная цена</label>
            <InputNumber
              id="price"
              v-model="product.rrp_price"
              mode="currency"
              currency="USD"
              locale="en-US"
            />
          </div>
          <div class="field col">
            <label for="release-date">Дата релиза</label>
            <Calendar id="release-date" v-model="product.release_date" dateFormat="dd/mm/yy" />
          </div>
        </div>

        <div class="formgrid grid">
          <div class="field col">
            <label for="product-visibility">Видимость товара для пользователей</label>
            <InputSwitch id="product-visibility" v-model="product.product_visibility" />
          </div>
          <div class="field col">
            <label for="f-image">Изображение</label>
            <div>
              <label for="file2" class="upload-button">
                <input
                  type="file"
                  id="file2"
                  ref="fileInput2"
                  @change="handleFileUpload"
                  accept="image/*"
                  style="visibility: hidden; position: absolute; z-index: -100"
                />
                <img src="/src/assets/icons/upload.svg" alt="upload" style="filter: invert(100%)" />
                {{ createImageUploadName ? createImageUploadName : 'Выбирать' }}
              </label>
            </div>
          </div>
        </div>
        <template #footer>
          <Button label="Отменить" text @click="hideDialog" />
          <Button
            type="button"
            label="Изменить"
            :loading="ProductsStore.loading"
            @click="saveProduct"
          />
        </template>
      </Dialog>

      <Dialog
        v-model:visible="newProductDialog"
        :style="{ width: '450px' }"
        header="Информация о продукте"
        :modal="true"
        class="p-fluid"
      >
        <div class="field">
          <label for="name">Модель устройства</label>
          <InputText
            id="name"
            v-model.trim="product.device_model"
            required="true"
            autofocus
            :invalid="submitted && !product.device_model"
          />
          <small class="p-error" v-if="submitted && !product.device_model">Требуется имя.</small>
        </div>
        <div class="field">
          <label for="description">Описание</label>
          <Editor v-model="product.description" editorStyle="height: 100px" required="true">
            <template v-slot:toolbar>
              <span class="ql-formats">
                <button v-tooltip.bottom="'Bold'" class="ql-bold"></button>
                <button v-tooltip.bottom="'Italic'" class="ql-italic"></button>
                <button v-tooltip.bottom="'Underline'" class="ql-underline"></button>
              </span>
            </template>
          </Editor>
        </div>

        <div class="field">
          <label for="category" class="mb-3">Категория</label>
          <Dropdown
            id="category"
            v-model="product.category"
            :options="categories"
            optionLabel="name"
            placeholder="Выберите категорию"
          >
            <template #value="slotProps">
              <div v-if="slotProps.value && slotProps.value.name">
                <span>{{ slotProps.value.name }}</span>
              </div>
              <span v-else>
                {{ slotProps.placeholder }}
              </span>
            </template>
          </Dropdown>
        </div>

        <div class="formgrid grid">
          <div class="field col">
            <label for="price">Рекомендуемая розничная цена</label>
            <InputNumber
              id="price"
              v-model="product.rrp_price"
              mode="currency"
              currency="USD"
              locale="en-US"
            />
          </div>
          <div class="field col">
            <label for="release-date">Дата релиза</label>
            <Calendar id="release-date" v-model="product.release_date" dateFormat="dd/mm/yy" />
          </div>
        </div>

        <div class="formgrid grid">
          <div class="field col">
            <p>Видимость товара для пользователей</p>
            <InputSwitch id="product-visibility" v-model="product.product_visibility" />
          </div>
          <div class="field col">
            <p>Изображение</p>
            <div>
              <label for="file" class="upload-button">
                <input
                  type="file"
                  id="file"
                  ref="fileInput"
                  @change="handleFileUpload"
                  accept="image/*"
                  style="visibility: hidden; position: absolute; z-index: -100"
                />
                <img src="/src/assets/icons/upload.svg" alt="upload" style="filter: invert(100%)" />
                {{ createImageUploadName ? createImageUploadName : 'Выбирать' }}
              </label>
            </div>
          </div>
        </div>
        <template #footer>
          <Button label="Отменить" text @click="hideDialog" />
          <Button
            type="button"
            label="Создать"
            :loading="ProductsStore.loading"
            @click="createProduct"
          />
        </template>
      </Dialog>

      <Dialog
        v-model:visible="deleteProductDialog"
        :style="{ width: '450px' }"
        header="Подтверждать"
        :modal="true"
      >
        <div class="confirmation-content">
          <span v-if="product"
            >Вы уверены, что хотите удалить <i>{{ product.device_model }}</i
            >?</span
          >
        </div>
        <template #footer>
          <Button label="Нет" text @click="deleteProductDialog = false" />
          <Button label="Да" text @click="deleteProduct" :loading="ProductsStore.loading" />
        </template>
      </Dialog>

      <Dialog
        v-model:visible="deleteProductsDialog"
        :style="{ width: '450px' }"
        header="Подтверждать"
        :modal="true"
      >
        <div class="confirmation-content">
          <span v-if="product">Вы уверены, что хотите удалить выбранные товары?</span>
        </div>
        <template #footer>
          <Button label="Нет" text @click="deleteProductsDialog = false" />
          <Button label="Да" text @click="deleteSelectedProducts" />
        </template>
      </Dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductsStore } from '@/stores/products'
const ProductsStore = useProductsStore()
import { useGeneralDataStore } from '@/stores/generalData'
const generalData = useGeneralDataStore()
import { ref, onMounted } from 'vue'
import { FilterMatchMode } from 'primevue/api'
import axios from 'axios'
import { watch } from 'vue'

onMounted(() => {
  document.title = 'Продукты | DeviceShopMaster'
  ProductsStore.getAllProducts()
})

const dt = ref()
const productDialog = ref(false)
const newProductDialog = ref(false)
const deleteProductDialog = ref(false)
const deleteProductsDialog = ref(false)
const product = ref({})
const selectedProducts = ref()
const errors = ref([])
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})
const submitted = ref(false)

const categoryName = (name: string) => {
  switch (name) {
    case 'phones':
      return 'Телефоны'
    case 'laptops':
      return 'Ноутбуки'
    case 'drones':
      return 'Дроны'
    case 'cameras':
      return 'Камеры'
    case 'camera_stands':
      return 'Стойки для фотоаппаратов'
    case 'lenses':
      return 'Линзы'
    case 'microphone':
      return 'Микрофоны'
    default:
      return 'Другие'
  }
}

const selectedCategory = ref()
const categories = ref([
  { name: 'Телефоны', code: 'phones' },
  { name: 'Ноутбуки', code: 'laptops' },
  { name: 'Дроны', code: 'drones' },
  { name: 'Камеры', code: 'cameras' },
  { name: 'Стойки для фотоаппаратов', code: 'camera_stands' },
  { name: 'Линзы', code: 'lenses' },
  { name: 'Микрофоны', code: 'microphone' },
  { name: 'Другие', code: 'other' }
])

const openNew = () => {
  product.value = {}
  submitted.value = false
  newProductDialog.value = true
  formData.value = null
  createImageUploadName.value = null
}
const hideDialog = () => {
  productDialog.value = false
  newProductDialog.value = false
  submitted.value = false
}

const editProduct = (prod) => {
  product.value = { ...prod }
  productDialog.value = true
  formData.value = null
  createImageUploadName.value = null
}

const confirmDeleteProduct = (prod) => {
  product.value = prod
  deleteProductDialog.value = true
}

const deleteProduct = async () => {
  ProductsStore.loading = await true
  axios.defaults.headers.common['Authorization'] = generalData.AUTH_TOKEN
  await axios
    .delete(`/products/${product.value.id}/`)
    .then((res) => {
      ProductsStore.products = ProductsStore.products.filter((item) => {
        if (item.id !== product.value.id) {
          return true
        } else {
          return false
        }
      })
      generalData.alertMessage = {
        severity: 'success',
        summary: 'Успех',
        detail: 'Товар успешно удален',
        life: 3000
      }
      product.value = {}
    })
    .catch((err) => {
      generalData.alertMessage = {
        severity: 'error',
        summary: 'Ошибка',
        detail: err.message,
        life: 3000
      }
    })
  ProductsStore.loading = await false
  deleteProductDialog.value = false
  product.value = {}
}

const confirmDeleteSelected = () => {
  deleteProductsDialog.value = true
}

const deleteSelectedProducts = async () => {
  ProductsStore.loading = await true
  axios.defaults.headers.common['Authorization'] = generalData.AUTH_TOKEN

  for (let i = 0; i < selectedProducts.value.length; i++) {
    await axios
      .delete(`/products/${selectedProducts.value[i].id}/`)
      .then((res) => {
        ProductsStore.products = ProductsStore.products.filter((item) => {
          if (item.id !== selectedProducts.value[i].id) {
            return true
          } else {
            return false
          }
        })
        generalData.alertMessage = {
          severity: 'success',
          summary: 'Успех',
          detail: `Товар "${selectedProducts.value[i].device_model}" успешно удален`,
          life: 3000
        }
        product.value = {}
      })
      .catch((err) => {
        generalData.alertMessage = {
          severity: 'error',
          summary: 'Ошибка',
          detail: `Произошла ошибка при удалении продукта ${selectedProducts.value[i].device_model}`,
          life: 3000
        }
      })
  }

  ProductsStore.loading = await false
  selectedProducts.value = {}
  deleteProductsDialog.value = false
}

const exportCSV = () => {
  dt.value.exportCSV()
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'ВИДНО':
      return 'success'

    case 'НЕВИДНО':
      return 'secondary'
  }
}

const saveProduct = async () => {
  submitted.value = true
  ProductsStore.loading = await true
  axios.defaults.headers.common['Authorization'] = generalData.AUTH_TOKEN

  errors.value = []
  if (!product.value.device_model || !product.value.device_model.length) {
    errors.value.push('Поле модели продукта обязательно для заполнения!')
  }
  if (!product.value.description || !product.value.description.length) {
    errors.value.push('Поле описания товара обязательно для заполнения!')
  }
  if (!product.value.category) {
    errors.value.push('Необходимо выбрать одну из категорий!')
  }
  if (!product.value.rrp_price) {
    errors.value.push('Поле цены товара обязательно для заполнения!')
  }
  if (!product.value.release_date) {
    errors.value.push('Поле даты выпуска продукта обязательно для заполнения!')
  }

  if (!errors.value.length) {
    await axios
      .patch(`/products/${product.value.id}/`, {
        device_model: product.value.device_model,
        category: product.value.category.code,
        description: product.value.description,
        rrp_price: product.value.rrp_price,
        release_date: `${new Date(product.value.release_date).getFullYear()}-${
          new Date(product.value.release_date).getMonth() + 1
        }-${new Date(product.value.release_date).getDate()}`,
        product_visibility: product.value.product_visibility
      })
      .then((res) => {
        console.log(res.data)
        for (let i = 0; i < ProductsStore.products.length; i++) {
          if (ProductsStore.products[i].id === res.data.id) {
            ProductsStore.products[i] = res.data
          }
        }
        generalData.alertMessage = {
          severity: 'success',
          summary: 'Успех',
          detail: 'Обновление продукта успешно!',
          life: 3000
        }
        if (formData.value) {
          axios
            .patch(`/products/${res.data.id}/`, formData.value, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
            .then((response) => {
              for (let i = 0; i < ProductsStore.products.length; i++) {
                if (ProductsStore.products[i].id === response.data.id) {
                  ProductsStore.products[i] = response.data
                }
              }
            })
            .catch((err) => {
              generalData.alertMessage = {
                severity: 'error',
                summary: 'Ошибка',
                detail: 'Ошибка при загрузке файла изображения: ' + err.message,
                life: 3000
              }
            })
        }
      })
      .catch((err) => {
        generalData.alertMessage = {
          severity: 'error',
          summary: 'Ошибка сервера',
          detail: 'В обновлении продукта произошла ошибка: ' + err.message,
          life: 3000
        }
      })
  } else {
    for (let i = 0; i < errors.value.length; i++) {
      generalData.alertMessage = await {
        severity: 'error',
        summary: 'Ошибка',
        detail: errors.value[i],
        life: 8000
      }
    }
  }

  productDialog.value = false
  ProductsStore.loading = await false
  product.value = {}
}

const formData = ref()
const createImageUploadName = ref()
async function handleFileUpload(event) {
  formData.value = null
  createImageUploadName.value = null
  if (event.target.files[0]) {
    createImageUploadName.value = event.target.files[0].name
    formData.value = new FormData()
    const file = event.target.files[0]
    formData.value.append('image', file)
  } else {
    formData.value = null
  }
}

async function createProduct() {
  ProductsStore.loading = await true
  axios.defaults.headers.common['Authorization'] = generalData.AUTH_TOKEN

  errors.value = []
  if (!product.value.device_model || !product.value.device_model.length) {
    errors.value.push('Поле модели продукта обязательно для заполнения!')
  }
  if (!product.value.description || !product.value.description.length) {
    errors.value.push('Поле описания товара обязательно для заполнения!')
  }
  if (!product.value.category) {
    errors.value.push('Необходимо выбрать одну из категорий!')
  }
  if (!product.value.rrp_price) {
    errors.value.push('Поле цены товара обязательно для заполнения!')
  }
  if (!product.value.release_date) {
    errors.value.push('Поле даты выпуска продукта обязательно для заполнения!')
  }

  if (!errors.value.length) {
    await axios
      .post('/products/create/', {
        device_model: product.value.device_model,
        category: product.value.category.code,
        description: product.value.description,
        rrp_price: product.value.rrp_price,
        image: null,
        release_date: `${product.value.release_date.getFullYear()}-${
          product.value.release_date.getMonth() + 1
        }-${product.value.release_date.getDate()}`,
        product_visibility: product.value.product_visibility
      })
      .then((res) => {
        ProductsStore.products.unshift(res.data)
        generalData.alertMessage = {
          severity: 'success',
          summary: 'Успех',
          detail: 'Новый продукт создан!',
          life: 3000
        }
        if (formData.value) {
          axios
            .patch(`/products/${res.data.id}/`, formData.value, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
            .then((response) => {
              ProductsStore.products[0] = response.data
            })
            .catch((err) => {
              generalData.alertMessage = {
                severity: 'error',
                summary: 'Ошибка',
                detail: 'Ошибка при загрузке файла изображения: ' + err.message,
                life: 3000
              }
            })
        }
      })
      .catch((err) => {
        generalData.alertMessage = {
          severity: 'error',
          summary: 'Ошибка сервера',
          detail: 'Новый продукт не был создан из-за проблемы с сервером: ' + err.message,
          life: 3000
        }
      })
  } else {
    for (let i = 0; i < errors.value.length; i++) {
      generalData.alertMessage = await {
        severity: 'error',
        summary: 'Ошибка',
        detail: errors.value[i],
        life: 8000
      }
    }
  }

  ProductsStore.loading = await false
  newProductDialog.value = await false
  product.value = {}
}

const searchFilter = ref('')

async function searchProduct() {
  if (searchFilter.value.length > 3) {
    selectedCategory.value = {}
    ProductsStore.loading = await true
    axios
      .get(`/products/filter/?query=${encodeURIComponent(searchFilter.value)}`)
      .then((res) => {
        ProductsStore.products = res.data
        if (!res.data.length) {
          generalData.alertMessage = {
            severity: 'warn',
            summary: 'Предупреждение',
            detail: 'Не удалось найти товары с этой фразой!',
            life: 3000
          }
        }
      })
      .catch((err) => {
        generalData.alertMessage = {
          severity: 'error',
          summary: 'Ошибка сервера',
          detail: 'Не удалось найти товары. ' + err.message,
          life: 3000
        }
      })
    ProductsStore.loading = await false
  } else {
    generalData.alertMessage = {
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Для поиска товаров необходимо ввести минимум 4 символа',
      life: 3000
    }
  }
}

async function categoryFilter() {
  ProductsStore.loading = await true
  axios
    .get(`/products/filter/?category=${encodeURIComponent(selectedCategory.value.code)}`)
    .then((res) => {
      ProductsStore.products = res.data
      if (!res.data.length) {
        generalData.alertMessage = {
          severity: 'warn',
          summary: 'Предупреждение',
          detail: 'Не удалось найти товары в этой категории!',
          life: 3000
        }
      }
    })
    .catch((err) => {
      generalData.alertMessage = {
        severity: 'error',
        summary: 'Ошибка сервера',
        detail: 'Не удалось найти товары. ' + err.message,
        life: 3000
      }
    })
  ProductsStore.loading = await false
}

watch(selectedCategory, (newSelectedCategory) => {
  if (newSelectedCategory && Object.keys(newSelectedCategory).length !== 0) {
    searchFilter.value = ''
    categoryFilter()
  }
})

function clearFilters() {
  selectedCategory.value = {}
  searchFilter.value = ''
  ProductsStore.getAllProducts()
}
</script>

<style lang="scss" scoped>
#products-page {
  padding: 24px 0;
  position: relative;
  #products {
    display: flex;
    flex-direction: column;
    row-gap: 12px;
    .product {
      display: flex;
      column-gap: 24px;
      justify-content: space-between;
      align-items: center;
      padding: 6px 16px;
      border-radius: 8px;
      box-shadow: 0 10px 10px rgba(0, 0, 0, 0.2);
      background-color: var(--bg-color-2);
    }
  }
}
.loading {
  position: absolute;
  left: 0;
  top: 0;
  min-height: 400px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 90;
}
.image {
  padding: 4px;
  border-radius: 4px;
  background-color: white;
  height: 64px;
  display: flex;
  justify-content: center;
  span {
    height: 100%;
  }
}
</style>
