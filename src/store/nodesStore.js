// src/store/nodesStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNodesStore = defineStore('nodes', () => {
    const nodes = ref([
        {
            id: '1',
            type: 'custom',
            data: { label: 'Новый проект', selected: false },
            position: { x: 100, y: 100 }
        }
    ])

    const edges = ref([])

    return { nodes, edges }
})