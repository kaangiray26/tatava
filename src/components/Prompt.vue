<template>
    <div id="prompt" class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div v-if="loaded" class="modal-content">
                <div v-if="prompt.type == 'text'" class="modal-body">
                    <p>{{ prompt.content }}</p>
                    <div class="input-group mb-2">
                        <textarea ref="textAnswer" class="form-control" aria-label="With textarea"
                            placeholder="Answer"></textarea>
                    </div>
                    <div class="d-flex flex-column">
                        <button class="btn btn-dark" @click="send_text_answer">Gönder</button>
                    </div>
                </div>
                <div v-if="prompt.type == 'image'" class="modal-body">
                    <p>{{ prompt.content }}</p>
                    <div class="input-group mb-2">
                        <input type="file" class="form-control" id="inputGroupFile02">
                    </div>
                    <div class="d-flex flex-column">
                        <button class="btn btn-dark" @click="send_image_answer">Gönder</button>
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

const modal = ref(null);
const loaded = ref(false);

const prompt = ref(null);
const textAnswer = ref(null);

async function send_text_answer() {
    if (!textAnswer.value.value.length) {
        return;
    }
    emit('send_answer', textAnswer.value.value);
    _hide();
}

function _show(_prompt) {
    prompt.value = _prompt;
    loaded.value = true;
    modal.value.show();
}

function _hide() {
    modal.value.hide();
}

defineExpose({
    show: _show,
    hide: _hide
})

onMounted(() => {
    modal.value = new Modal(document.querySelector('#prompt'), {
        backdrop: 'static',
        keyboard: false
    });
})
</script>