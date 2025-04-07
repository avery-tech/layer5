<template>
  <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      :default-zoom="1.5"
      :min-zoom="0.2"
      :max-zoom="4"
      @pane-ready="onPaneReady"
      class="vue-flow-basic-example"
  >
    <Background pattern-color="#aaa" :gap="8" />
    <MiniMap />
    <Controls />

    <template #node-custom="nodeProps">
      <CustomNode v-bind="nodeProps" />
    </template>

    <template #edge-custom="edgeProps">
      <CustomEdge v-bind="edgeProps" />
    </template>
  </VueFlow>
</template>

<script setup>
import { ref } from 'vue'
import { VueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { MiniMap } from '@vue-flow/minimap'
import { Controls } from '@vue-flow/controls'
import { useLayout } from '../composables/useLayout'
import CustomNode from './CustomNode.vue'
import CustomEdge from './CustomEdge.vue'

// Ставим x=100, чтобы узел был левее центра, а y ~ центр экрана (минус 50 для учёта высоты ноды)
const nodes = ref([
  {
    id: '1',
    type: 'custom',
    data: { label: 'Мой проект' },
    position: { x: 30, y: window.innerHeight / 2 - 50 }
  }
])
const edges = ref([])

const { layout } = useLayout()

function onPaneReady() {
  // Если нужно перестраивать layout: layoutGraph('LR')
  // Если нода одна — можно вообще не вызывать layout, чтобы она осталась на месте
}
</script>

<style scoped>
.vue-flow-basic-example {
  height: 100vh;
  width: 100%;
}
</style>