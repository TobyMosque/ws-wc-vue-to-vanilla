<script setup lang="ts">
import { useQuery } from '@pinia/colada';
import { storeToRefs } from 'pinia';
import type { QTable } from 'quasar';
import { useAppStore } from 'stores/app';
import { ref } from 'vue';

interface ApiResponse<T> {
  content: T,
  pageable: {
    totalElements: number,
    totalPages: number,
  },
  image: string
}

interface Digimon {
  id: number,
  name: string,
  image: string
}

const appStore = useAppStore()
const { apiUrl } = storeToRefs(appStore)

const pagination = ref({
  sortBy: 'id',
  descending: false,
  page: 1,
  rowsPerPage: 12,
  rowsNumber: 0
})

const columns = [
  { name: 'id', label: 'Id', field: 'id' },
  { name: 'name', label: 'Name', field: 'name' },
  { name: 'image', label: 'Image', field: 'image' }
]

const { data: digimons, isPending } = useQuery({
  key: () => ['digimons', apiUrl.value, pagination.value.page, pagination.value.rowsPerPage],
  query: async () => {
    const qs = new URLSearchParams({
      page: '' + pagination.value.page,
      pageSize: '' + pagination.value.rowsPerPage
    })
    const req = await fetch(apiUrl.value + 'digimon?' + qs.toString())
    const data: ApiResponse<Digimon[]> = await req.json()
    pagination.value.rowsNumber = data.pageable.totalElements
    return data.content
  },
  initialData() {
    return [] as Digimon[]
  }
})

function onRequest (props: { pagination: QTable['pagination'] }) {
  if (props.pagination) {
    const { page, rowsPerPage } = props.pagination
    pagination.value.page = page ?? 1
    pagination.value.rowsPerPage = rowsPerPage ?? 12
  }
}
</script>

<template>
  <div style="max-width: 1280px;">
    <q-card class="q-ma-sm">
      <q-table
        flat bordered
        grid
        title="Digimons"
        :rows="digimons"
        :columns="columns"
        :loading="isPending"
        row-key="id"
        v-model:pagination="pagination"
        hide-header
        @request="onRequest"
      >
      <template v-slot:item="props">
        <div
          class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
          :style="props.selected ? 'transform: scale(0.95);' : ''"
        >
          <q-card bordered flat>
            <img :src="props.row.image">
            <q-card-section class="text-center">
              {{ props.row.name }}
            </q-card-section>
            <q-separator />
            <q-card-actions align="right">
              <q-btn flat round color="primary" icon="edit" />
            </q-card-actions>
          </q-card>
        </div>
      </template>
      </q-table>
    </q-card>
  </div>
</template>
