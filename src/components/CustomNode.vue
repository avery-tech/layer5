<!-- src/components/CustomNode.vue -->
<template>
  <div class="custom-node" @mouseenter="enableEditing">
    <!-- Точка подключения для входящих соединений (слева) -->
    <Handle type="target" :position="Position.Left" />
    <!-- Точка подключения для исходящих соединений (справа) -->
    <Handle type="source" :position="Position.Right" />

    <!-- Если редактирование активно, отображаем Tiptap-редактор -->
    <EditorContent
        v-if="editing"
        :editor="editor"
        class="editor-content"
        @blur="finishEditing"
        @keydown.enter.prevent="finishEditing"
    />
    <!-- Если режим редактирования не активен, отображаем обычный текст -->
    <div v-else class="label">{{ data.label }}</div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, watch } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

// Получаем свойства: id и данные ноды (где data.label – текст)
const props = defineProps({
  id: String,
  data: {
    type: Object,
    default: () => ({ label: '' })
  }
})

// Режим редактирования: активируется при наведении
const editing = ref(false)

// Инициализируем Tiptap редактор с базовыми расширениями
const editor = new Editor({
  extensions: [StarterKit],
  content: props.data.label,
  onUpdate({ editor }) {
    // Обновляем локальное содержимое редактора, если потребуется
  }
})

// При наведении включается режим редактирования и редактор получает фокус
const emit = defineEmits(['create-child', 'update-label', 'lock-drag'])

function enableEditing() {
  if (!editing.value) {
    emit('lock-drag', true)   // ⛔ отключаем перетаскивание
    editing.value = true
    setTimeout(() => {
      editor.commands.focus()
    }, 0)
  }
}

function finishEditing() {
  if (editing.value) {
    editing.value = false
    emit('lock-drag', false)  // ✅ включаем обратно
    const newContent = editor.getHTML()
    emit('update-label', { id: props.id, label: newContent })
  }
}

// Если внешний label изменяется, обновляем содержимое редактора
watch(() => props.data.label, (newVal) => {
  if (!editing.value && newVal !== editor.getHTML()) {
    editor.commands.setContent(newVal)
  }
})

onBeforeUnmount(() => {
  editor.destroy()
})
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
  /* Убираем дополнительное выделение */
  outline: none;
}

.label {
  font-size: 14px;
  font-family: sans-serif;
  margin: 0;
  cursor: text;
}

/* Стили для Tiptap редактора внутри ноды */
.editor-content {
  outline: none;
  font-size: 14px;
  font-family: sans-serif;
  text-align: center;
  padding: 0;
  margin: 0;
  cursor: text;
}
</style>