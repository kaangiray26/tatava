<template>
    <div id="scores" class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div v-if="loaded" class="modal-content">
                <div class="modal-header">
                    <div class="d-flex flex-column">
                        <h3 class="modal-title funky-text">Scoreboard</h3>
                        <h5 class="funky-text">Round {{ store.round + 1 }}</h5>
                    </div>
                    <button type="button" class="btn-close" aria-label="Close" @click="_hide"></button>
                </div>
                <div class="modal-body">
                    <ol class="list-group">
                        <li v-for="(score, index) in scores" class="list-group-item d-flex justify-content-between">
                            <div class="d-flex text-nowrap">
                                <span class="font-monospace fw-bold me-2 ">{{ index+ 1 }}.</span>
                                <div class="bg-dark text-white rounded px-1">
                                    <span class="bi bi-person-circle me-1"></span>
                                    <span>{{ score.name }}</span>
                                </div>
                            </div>
                            <div>
                                <span class="badge text-bg-danger fw-bold rounded-pill">{{ score.score }}</span>
                            </div>
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Modal } from 'bootstrap';
import { store } from '/js/store.js';

const emit = defineEmits(['closed']);

const modal = ref(null);
const scores = ref([]);
const loaded = ref(false);

function _set_scores(_scores) {
    scores.value = _scores;
    scores.value.sort((a, b) => b.score - a.score);
    store.winner = scores.value[0].name;
    loaded.value = true;
}

function _show() {
    modal.value.show();
}

function _hide() {
    modal.value.hide();
    loaded.value = false;
    emit('closed');
}

defineExpose({
    show: _show,
    hide: _hide,
    set_scores: _set_scores,
})

onMounted(() => {
    modal.value = new Modal(document.querySelector('#scores'), {
        backdrop: 'static',
        keyboard: false
    });
})
</script>