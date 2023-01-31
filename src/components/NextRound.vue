<template>
    <div id="nextRound" class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title funky-text">Next round</h5>
                </div>
                <div class="modal-body">
                    <p>Bir sonraki tura geçmeye hazır mısın?</p>
                    <div class="d-flex flex-column">
                        <button class="btn btn-dark" @click="start_next_round">Başlat</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Modal } from 'bootstrap';

const emit = defineEmits(['start_next_round']);

const modal = ref(null);

async function start_next_round() {
    emit('start_next_round');
    _hide();
}

function _show() {
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
    modal.value = new Modal(document.querySelector('#nextRound'), {
        backdrop: 'static',
        keyboard: false
    });
})
</script>