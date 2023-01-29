<template>
    <div id="prompt" class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div v-if="loaded" class="modal-content">
                <div class="modal-body">
                    <p>{{ items[index].prompt.content }}</p>
                    <div class="input-group mb-2">
                        <textarea v-show="items[index].prompt.type == 'text'" ref="textAnswer" class="form-control"
                            aria-label="With textarea" placeholder="Answer"></textarea>
                        <input v-show="items[index].prompt.type == 'image'" ref="imageAnswer" type="file"
                            class="form-control">
                    </div>
                    <div class="d-flex flex-column">
                        <button class="btn btn-dark" @click="send_answer(index)">Gönder</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Modal } from 'bootstrap';

const emit = defineEmits(['send_answer']);

const index = ref(0);
const modal = ref(null);
const loaded = ref(false);

const items = ref([]);
const textAnswer = ref(null);
const imageAnswer = ref(null);

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

async function send_answer() {
    // Send answer
    if (items.value[index.value].prompt.type == 'text') {
        if (!textAnswer.value.value.length) {
            return;
        }
        emit('send_answer', { "answer": textAnswer.value.value, "index": items.value[index.value].index });
        textAnswer.value.value = '';
    }
    else if (items.value[index.value].prompt.type == 'image') {
        if (!imageAnswer.value.files.length) {
            return;
        }
        let file = imageAnswer.value.files[0];
        if (!file || !file.type.startsWith('image/')) {
            return;
        }
        let base64 = await toBase64(file);
        emit('send_answer', { "answer": base64, "index": items.value[index.value].index });
        imageAnswer.value.value = '';
    }

    // Hide modal if last prompt
    if (index.value == items.value.length - 1) {
        _hide();
        return
    }
    index.value++;
}

function _show() {
    index.value = 0;
    loaded.value = true;
    modal.value.show();
}

function _hide() {
    modal.value.hide();
}

function _add_prompt(_prompt, _index) {
    items.value.push({
        prompt: _prompt,
        index: _index
    })
}

defineExpose({
    show: _show,
    hide: _hide,
    add_prompt: _add_prompt
})

onMounted(() => {
    modal.value = new Modal(document.querySelector('#prompt'), {
        backdrop: 'static',
        keyboard: false
    });
})
</script>