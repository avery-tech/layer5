<template>
  <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      :default-zoom="0"
      :min-zoom="0"
      :max-zoom="0.8"
      :zoomOnScroll="false"
      :zoomable="false"
      :nodes-draggable="isDraggingEnabled"
      :pan-on-drag="isDraggingEnabled"
      :pan-on-scroll="isDraggingEnabled"
      class="vue-flow-basic-example"
  >
    <Background pattern-color="#aaa" :gap="8" />
    <MiniMap />
    <Controls />

    <!-- Кастомный узел. При двойном клике эмитирует create-child -->
    <template #node-custom="nodeProps">
      <CustomNode
        v-bind="nodeProps"
        @create-child="handleCreateChild"
        @update-label="handleUpdateLabel"
        @lock-drag="toggleDragging"
      />
    </template>

    <!-- Кастомное ребро. Без кнопки удаления -->
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

const { setCenter } = useVueFlow() // метод управления камерой
const isDraggingEnabled = ref(true)

// Начальная нода "Мой проект" — ставим слева
const nodes = ref([
  {
    id: '1',
    type: 'custom',
    data: { label: 'Мой проект' },
    // Примерно по центру экрана по высоте, x=50
    position: { x: 50, y: window.innerHeight / 2 - 40 }
  }
])
const edges = ref([])

// Подключаем функцию layout из useLayout (dagre)
const { layout } = useLayout()

/**
 * Функция создания дочерней ноды, вызывается при двойном клике
 * на родительской ноде (CustomNode.vue -> emit('create-child'))
 */
function handleCreateChild({ id: parentId }) {
  const newId = String(Date.now())
  const parentNode = nodes.value.find(n => n.id === parentId)
  if (!parentNode) return

  // 1. Создаем новую ноду (она пока имеет условные координаты)
  nodes.value.push({
    id: newId,
    type: 'custom',
    data: { label: 'Новая задача' },
    position: { x: parentNode.position.x + 150, y: parentNode.position.y + 80 }
  })

  // 2. Добавляем ребро
  edges.value.push({
    id: `e${parentId}-${newId}`,
    source: parentId,
    target: newId,
    type: 'custom'
  })

  // 3. Запускаем dagre-раскладку: все узлы переупорядочиваются, включая родителя
  const updatedNodes = layout(nodes.value, edges.value, 'LR')
  nodes.value = updatedNodes

  // 4. Когда Vue обновит DOM, ищем позицию ДЕЙСТВИТЕЛЬНОЙ новой ноды после dagre
  nextTick(() => {
    const newNode = nodes.value.find(n => n.id === newId)
    if (!newNode) return

    // 5. Переводим фокус камеры на новую ноду, НЕ изменяя зум
    // (по умолчанию setCenter(..., ..., zoom) — если третий аргумент не передать,
    // VueFlow берёт текущий зум)
    setCenter(newNode.position.x, newNode.position.y)
  })
}

function toggleDragging(state) {
  isDraggingEnabled.value = !state
}

</script>

<style scoped>
.vue-flow-basic-example {
  width: 100%;
  height: 100vh;
}
/*
:deep(.vue-flow__node.selected) {
  transform: none !important;
  box-shadow: none !important;
  border: none !important;
  outline: none !important;
  transition: none !important;
} */
</style>