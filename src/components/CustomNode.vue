<!-- src/components/CustomNode.vue -->
<template>
  <div class="custom-node">
    <!-- Точка подключения для входящих связей, расположенная слева -->
    <Handle type="target" position="right" />
    <div class="label">{{ data.label }}</div>
  </div>
</template>

<script setup>
import { Handle } from '@vue-flow/core'
defineProps({ data: Object })
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
  /* Дополнительные стили для отладки */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>