<!-- src/components/CustomEdge.vue -->
<template>
  <!-- Основная кривая -->
  <BaseEdge :path="path[0]" :style="style" :marker-end="markerEnd" />

  <!-- Кнопка на ребре -->
  <EdgeLabelRenderer>
    <div
        class="edge-button-wrapper nodrag nopan"
        :style="{
        pointerEvents: 'all',
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${path[1]}px, ${path[2]}px)`,
      }"
    >
      <button class="edgebutton" @click="removeEdges(id)">×</button>
    </div>
  </EdgeLabelRenderer>
</template>

<script setup>
import { computed } from 'vue'
import { BaseEdge, EdgeLabelRenderer, getBezierPath, useVueFlow } from '@vue-flow/core'

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

const { removeEdges } = useVueFlow()
</script>

<script>
export default {
  inheritAttrs: false
}
</script>

<style scoped>
.edge-button-wrapper {
  z-index: 10;
}

.edgebutton {
  border: none;
  background: #fff;
  font-weight: bold;
  font-size: 14px;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 0 0 1px #ccc;
}

.edgebutton:hover {
  background: #f05f75;
  color: white;
  box-shadow: 0 0 0 2px pink, 0 0 0 4px #f05f75;
}
</style>