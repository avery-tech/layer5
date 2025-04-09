<template>
  <div class="custom-node" @mouseenter="enableEditing">
    <!-- Точка подключения для входящих связей (слева) -->
    <Handle type="target" :position="Position.Left" />
    <!-- Точка подключения для исходящих связей (справа) -->
    <Handle type="source" :position="Position.Right" />

    <!-- Режим редактирования: когда editing === true отображается Tiptap-редактор -->
    <EditorContent
        v-if="editing"
        :editor="editor"
        class="editor-content"
        @keydown.tab.prevent="handleTabPress"
        @keydown.enter.prevent="finishEditing"
        @blur="finishEditing"
    />

    <!-- Режим просмотра: если не редактируем, показываем обычный текст -->
    <div v-else class="label" @click.stop="enableEditing">
      {{ data.label }}
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, nextTick, watch } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

// Принимаем id и данные ноды (data.label — текст, data.autoEdit – флаг авторедактирования)
const props = defineProps({
  id: String,
  data: {
    type: Object,
    default: () => ({ label: '', autoEdit: false })
  }
})
// Эмитим события: update-label (обновление текста), create-child (создание дочерней ноды), lock-drag (блокировка перетаскивания)
const emit = defineEmits(['update-label', 'create-child', 'lock-drag'])

// Флаг редактирования и локальное состояние редактора
const editing = ref(false)
const editor = new Editor({
  extensions: [StarterKit],
  content: props.data.label
})

/**
 * Включение режима редактирования:
 * - Вызывается при наведении или клике на ноду.
 * - Блокирует перетаскивание (через emit('lock-drag', true))
 * - Фокусируется в редакторе (устанавливает курсор в конец)
 */
function enableEditing() {
  if (!editing.value) {
    emit('lock-drag', true)  // блокируем перетаскивание, пока редактируем
    editing.value = true
    nextTick(() => {
      editor.commands.focus('end')
    })
  }
}

/**
 * Завершение редактирования:
 * - Выключает режим редактирования и разблокирует перетаскивание.
 * - Эмитит событие update-label с новым содержимым.
 */
function finishEditing() {
  if (editing.value) {
    editing.value = false
    emit('lock-drag', false) // снимаем блокировку
    const newContent = editor.getHTML()
    emit('update-label', { id: props.id, label: newContent })
  }
}

/**
 * Обработчик нажатия клавиши TAB:
 * - Сохраняет текущий текст (через finishEditing())
 * - Эмитирует событие создания дочерней ноды с флагом autoEdit = true,
 *   чтобы родительский компонент мог создать новую ноду и установить в ней автофокус.
 */
function handleTabPress() {
  finishEditing()
  emit('create-child', { id: props.id, mode: 'child', autoEdit: true })
}

// Если значение props.data.label изменяется извне, синхронизируем содержимое редактора
watch(() => props.data.label, (newVal) => {
  if (!editing.value && newVal !== editor.getHTML()) {
    editor.commands.setContent(newVal)
  }
})

// Если флаг autoEdit (для новой ноды) устанавливается извне, сразу включаем редактирование
watch(() => props.data.autoEdit, (newVal) => {
  if (newVal) {
    nextTick(() => {
      editing.value = true
      emit('lock-drag', true)
      nextTick(() => {
        // Используем setTimeout для гарантии, что элемент полностью отрендерен
        setTimeout(() => {
          editor.commands.focus('end')
        }, 0)
      })
    })
  }
},{
  immediate: true,
    }



)

onBeforeUnmount(() => {
  editor.destroy()
})
</script>

<style scoped>
.custom-node {
  padding: 12px;                     /* Внутренний отступ */
  background: white;                 /* Белый фон */
  border: 1px solid #ccc;            /* Светло-серая рамка */
  border-radius: 6px;                /* Скругленные углы */
  min-width: 100px;                  /* Минимальная ширина */
  height: auto;                      /* Фиксированная высота */
  min-height: 5px;                  /* Минимальная высота */
  text-align: center;                /* Центрирование по горизонтали */
  font-size: 14px;                   /* Размер шрифта */
  font-family: sans-serif;           /* Шрифт */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* Легкая тень */
  overflow: hidden;                  /* Скрываем переполнение, чтобы высота не менялась */
  transform: none !important;
  transition: none !important;
}

.label {
  font-size: 14px;
  font-family: sans-serif;
  margin: 0;
  cursor: text;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

/* Стили для редактора */
.editor-content {
  outline: none;
  font-size: 14px;
  font-family: sans-serif;
  text-align: center;
  padding: 0;
  margin: 0;
  cursor: text;
  width: 100%;
  height: auto;                     /* Фиксированная высота */
  min-height: 24px;                 /* Минимальная высота */
  box-sizing: border-box;
  overflow: hidden;
}

/* Пробиваем scoped-стили для ProseMirror */
:deep(.ProseMirror:focus) {
  outline: none !important;
  box-shadow: none !important;
}
:deep(.ProseMirror) {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
  background: transparent !important;
  padding: 0 !important;
  margin: 0 !important;
}
</style>