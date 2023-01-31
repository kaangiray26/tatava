<template>
    <div id="finish" class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title funky-text">Game Finished</h5>
                </div>
                <div class="modal-body">
                    <div class="d-flex rounded bg-dark text-white p-2">
                        <p class="m-0">Oyunun sonuna geldik, umarım eğlenmişsinizdir!</p>
                    </div>
                    <hr />
                    <div class="d-flex justify-content-center pe-none position-relative mb-2">
                        <iframe :src="gif_source" width="640" height="480" frameBorder="0"
                            class="giphy-embed rounded" />
                        <div
                            class="d-flex flex-column align-items-center position-absolute top-50 bg-dark text-white rounded border p-2">
                            <h1 class="fw-bold">🥳 {{ store.winner }} 🥳</h1>
                        </div>
                    </div>
                    <div class="d-flex flex-column">
                        <button class="btn btn-dark" @click="end">Start a new game</button>
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

const modal = ref(null);
const gif_source = ref(null);

let sources = [
    'y2igpgZw2CRLeppK8l',
    'NlIa1aW3oikdNkfE07',
    'klvtjx5HeW4FDPrh5m',
    'oJgLvK9CsxY3xv9c4Z',
    'gaaZiIvJveq3Ha1zh4',
    'qvZUVWs2KHOFgskMnc',
    'gqcLVUZoImWBsMmtLP',
    '64xj5tJgl41jNl97EZ',
    'Tw44Y1ZKJ7zOJDn2Z6',
    'Mcsw0eQCS1GvNmZkhk',
    'K6XpyVeUUFD4mMipzb',
    'rTJJfR5O2ESPi2Ip3r',
    'OVqaStbNdtH1QVCo9g',
    'XCPcoJYFXPppqUefmh',
    'YC8aSugDK9Z2erHg5Z',
    'IXj4HoPSnEtKig4g1G',
]

async function end() {
    _hide();
    window.open('https://tatava.buzl.uk/', '_self');
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
    modal.value = new Modal(document.querySelector('#finish'), {
        backdrop: 'static',
        keyboard: false
    });
    gif_source.value = 'https://giphy.com/embed/' + sources[Math.floor(Math.random() * sources.length)];
})
</script>