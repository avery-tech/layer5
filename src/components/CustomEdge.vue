<!-- src/components/CustomEdge.vue -->
<template>
  <!-- Отображаем стандартное ребро, используя рассчитанный путь -->
  <BaseEdge :path="path[0]" :style="style" :marker-end="markerEnd" />
</template>

<script setup>
import { computed } from 'vue'
import { BaseEdge, getBezierPath } from '@vue-flow/core'

const props = defineProps({
  id: String,
  sourceX: Number,
  sourceY: Number,
  targetX: Number,
  targetY: Number,
  sourcePosition: String,
  targetPosition: String,
  data: Object,
  markerEnd: String,
  style: Object,
})

const path = computed(() => getBezierPath(props))
</script>

<script>
export default {
  inheritAttrs: false
}
</script>

<style scoped>
/* Если нужно добавить дополнительные стили для ребра, можно их добавить здесь */
</style>