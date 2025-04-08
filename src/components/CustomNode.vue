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

:deep(.vue-flow__node.selected) {
  transform: none !important;
  transition: none !important;
  box-shadow: none !important;
  border: 1px solid #ccc !important;
  outline: none !important;
  scale: 1 !important;
}

.custom-node {
  padding: 10px;                /* Отступ вокруг содержимого ноды */
  background: white;            /* Белый фон ноды */
  border: 1px solid #ccc;       /* Рамка ноды: 1px, сплошная, светло-серая (#ccc) */
  border-radius: 6px;           /* Скругление углов на 6px */
  /* width: 180px; */           /* Фиксированная ширина отключена, чтобы ширина зависела от содержимого */
  height: 15px;                 /* Фиксированная высота ноды — 25px */
  text-align: center;           /* Текст выравнивается по центру */
  font-size: 14px;              /* Размер шрифта 14px */
  font-family: sans-serif;      /* Базовый шрифт sans-serif */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Легкая тень вокруг ноды */
  /* overflow: hidden;              Скрываем всё, что выходит за пределы ноды */
  transform: none !important;   /* Отключаем любые трансформации */
  transition: none !important;  /* Отключаем анимации и переходы */
}

.label {
  font-size: 12px;              /* Размер шрифта 14px */
  /* font-family: sans-serif;   Шрифт sans-serif */
  margin: 0;                    /* Нет внешних отступов */
  cursor: text;                 /* Курсор в виде текстового, указывающий, что элемент редактируемый */
  line-height: 15px;            /* Высота строки 20px для вертикального центрирования текста внутри ноды */
}

/* Стили для редактора внутри ноды */
.editor-content {
  outline: none;                /* Убираем обводку */
  font-size: 12px;              /* Размер шрифта 14px */
  /* font-family: sans-serif;       Шрифт sans-serif */
  text-align: center;           /* Текст выравнивается по центру */
  padding: 0;                   /* Отступы внутри отсутствуют */
  margin: 0;                    /* Нет внешних отступов */
  cursor: text;                 /* Курсор в виде текстового */
  width: 100%;                  /* Редактор занимает 100% ширины контейнера */
  height: 100%;                 /* Редактор занимает 100% высоты контейнера */
  box-sizing: border-box;       /* Габариты включают padding и border */
  overflow: hidden;             /* Обрезаем лишнее содержимое */
}



:deep(.ProseMirror) {
  outline: none !important;      /* Убираем обводку */
  box-shadow: none !important;    /* Убираем тень */
  border: none !important;        /* Убираем рамку */
  background: transparent !important; /* Делаем фон прозрачным */
  padding: 0 !important;          /* Убираем внутренние отступы */
  margin: 0 !important;           /* Убираем внешние отступы */
}
</style>