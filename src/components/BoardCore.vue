<!-- src/components/BoardCore.vue -->
<template>
  <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      :default-zoom="1.5"
      :min-zoom="0.2"
      :max-zoom="4"
      class="vue-flow-basic-example"
  >
    <Background pattern-color="#aaa" :gap="8" />
    <MiniMap />
    <Controls />

    <template #node-custom="nodeProps">
      <CustomNode v-bind="nodeProps" @create-child="handleCreateChild" />
    </template>

    <template #edge-custom="edgeProps">
      <CustomEdge v-bind="edgeProps" />
    </template>
  </VueFlow>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { MiniMap } from '@vue-flow/minimap'
import { Controls } from '@vue-flow/controls'

import CustomNode from './CustomNode.vue'
import CustomEdge from './CustomEdge.vue'
import { useLayout } from '../composables/useLayout'

// Начальная нода «Мой проект» — слева (x=50), примерно по вертикали (y=около центра)
const nodes = ref([
  {
    id: '1',
    type: 'custom',
    data: { label: 'Мой проект' },
    position: { x: 50, y: window.innerHeight / 2 - 40 }
  }
])
const edges = ref([])

const { layout } = useLayout()
const { fitView } = useVueFlow()

// При двойном клике на ноду создаём новую
function handleCreateChild({ id: parentId }) {
  const newId = String(Date.now())
  // Добавляем новую ноду
  nodes.value.push({
    id: newId,
    type: 'custom',
    data: { label: 'Новая задача' },
    position: { x: 0, y: 0 }
  })
  // Добавляем ребро
  edges.value.push({
    id: `e${parentId}-${newId}`,
    source: parentId,
    target: newId,
    type: 'custom'
  })

  // Перестраиваем всё дерево
  const updatedNodes = layout(nodes.value, edges.value, 'LR')
  nodes.value = updatedNodes

  // Масштабируем и показываем всё дерево
  nextTick(() => {
    fitView()
  })
}
</script>

<style scoped>
.vue-flow-basic-example {
  width: 100%;
  height: 100vh;
}
</style>