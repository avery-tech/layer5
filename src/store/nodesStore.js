// src/store/nodesStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

// Определяем вертикальное положение с учетом высоты экрана
const initialY = typeof window !== 'undefined' ? window.innerHeight / 2 - 40 : 300

export const useNodesStore = defineStore('nodes', () => {
    const nodes = ref([
        {
            id: '1',
            type: 'custom',           // Тип "custom" для нашей ноды
            data: { label: 'Мой проект' },
            // x небольшое значение (например, 20), y вычислено для вертикального центрирования
            position: { x: 20, y: initialY }
        }
    ])
    const edges = ref([])

    return { nodes, edges }
})