<!-- src/components/CustomNode.vue -->
<template>
  <div class="custom-node" @dblclick="handleDblClick">
    <!-- Точка подключения слева (вход) -->
    <Handle type="target" :position="Position.Left" />
    <!-- Точка подключения справа (выход) -->
    <Handle type="source" :position="Position.Right" />

    <div class="label">{{ data.label }}</div>
  </div>
</template>

<script setup>
import { Handle, Position } from '@vue-flow/core'

const props = defineProps({
  id: String,
  data: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['create-child'])

function handleDblClick() {
  // При двойном клике эмитим событие, чтобы родитель создал дочернюю ноду
  emit('create-child', { id: props.id })
}
</script>

<style scoped>
.custom-node {
  padding: 12px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 6px;
  min-width: 140px;
  text-align: center;
  font-size: 14px;
  font-family: sans-serif;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>