<template>
    <div id="vote" class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div v-if="loaded" class="modal-content">
                <div class="modal-header">
                    <div class="d-flex flex-column">
                        <h5 class="modal-title funky-text">Voting</h5>
                    </div>
                </div>
                <div class="modal-body">
                    <p>{{ items[index].prompt.content }}</p>
                    <hr />
                    <div class="row">
                        <div class="col-6" v-for="answer in items[index].answers">
                            <div v-if="items[index].prompt.type == 'text'"
                                class="d-flex flex-column text-bg-dark text-wrap rounded clickable p-2"
                                @click="send_vote(answer)">
                                <p class="text-break m-0">{{ answer.answer }}</p>
                            </div>
                            <div v-if="items[index].prompt.type == 'image'"
                                class="d-flex flex-column text-wrap rounded clickable p-2" @click="send_vote(answer)">
                                <img class="img-fluid border-dark img-thumbnail" :src="answer.answer" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Modal } from 'bootstrap';
import { store } from '/js/store.js';

const emit = defineEmits(['send_vote']);

const index = ref(0);
const modal = ref(null);
const loaded = ref(false);

const items = ref([]);

async function send_vote(answer) {
    emit('send_vote', { "name": answer.name, "index": items.value[index.value].index });
    // Hide modal if last prompt
    if (index.value == items.value.length - 1) {
        _hide();
        return
    }
    index.value++;
}

function _show() {
    index.value = 0;
    modal.value.show();
}

function _hide() {
    modal.value.hide();
    loaded.value = false;
}

function _add_vote(_index, _prompt, _answers) {
    if (_answers.some(answer => answer.name == store.name)) {
        return;
    }
    items.value.push({
        index: _index,
        prompt: _prompt,
        answers: _answers
    })
    loaded.value = true;
}

function _reset() {
    items.value = [];
}

defineExpose({
    show: _show,
    hide: _hide,
    add_vote: _add_vote,
    reset: _reset,
})

onMounted(() => {
    modal.value = new Modal(document.querySelector('#vote'), {
        backdrop: 'static',
        keyboard: false
    });
})
</script>