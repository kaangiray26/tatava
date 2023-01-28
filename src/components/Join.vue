<template>
    <div id="joinModal" class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title funky-text">Join</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div v-if="!peer_loaded" class="d-flex justify-content-center my-2">
                    <button class="btn btn-dark" type="button" disabled>
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Loading...
                    </button>
                </div>
                <div v-if="peer_loaded" class="modal-body">
                    <p>QR kodunu kullanıp oyuna katılmak için kameranı kullanabilirsin.</p>
                    <div class="d-flex flex-column">
                        <video ref="videoEl" v-show="cameraTurnedOn">Video stream not available.</video>
                        <button class="btn btn-dark" @click="openCamera">Kameranı Aç</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div>
        <canvas id="canvas"> </canvas>
        <div class="output">
            <img id="photo" alt="The screen capture will appear in this box." />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Modal } from 'bootstrap';
import { store } from "/js/store.js";

const modal = ref(null);
const videoEl = ref(null);

const peer_loaded = ref(false);
const cameraTurnedOn = ref(false);

async function openCamera() {
    cameraTurnedOn.value = true;
    navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
            videoEl.value.srcObject = stream;
            videoEl.value.play();
        })
        .catch((err) => {
            console.error(`An error occurred: ${err}`);
        });
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
    modal.value = new Modal(document.querySelector('#joinModal'));
    window.addEventListener('peer_opened', async function () {
        peer_loaded.value = true;
    });
})
</script>