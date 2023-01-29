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
                        <canvas id="canvas" hidden></canvas>
                        <button v-show="!cameraTurnedOn" class="btn btn-dark mt-2" @click="openCamera">Kameranı
                            Aç</button>
                    </div>
                    <div v-if="codeLoaded">
                        <div class="input-group mt-2">
                            <span class="input-group-text bi bi-broadcast" id="basic-addon1"></span>
                            <input type="text" class="form-control" aria-describedby="basic-addon1" :value="codeData"
                                readonly>
                        </div>
                        <div class="d-flex flex-column">
                            <button class="btn btn-dark mt-1" @click="join_game">Oyuna Katıl</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { Modal } from 'bootstrap';
import jsQR from "jsqr";

const router = useRouter();

let video = null;
let canvas = null;
let canvasElement = null;

const modal = ref(null);
const codeData = ref(null);
const codeLoaded = ref(false);

const peer_loaded = ref(false);
const cameraTurnedOn = ref(false);

async function join_game() {
    if (codeData.value.startsWith('https://tatava.buzl.uk/join/')) {
        let id = codeData.value.split('/').pop();
        video.pause();
        _hide();
        router.push("/join/" + id);
    }
}

async function openCamera() {
    cameraTurnedOn.value = true;
    navigator.mediaDevices
        .getUserMedia({
            video: {
                facingMode: "environment"
            }, audio: false
        })
        .then((stream) => {
            video.srcObject = stream;
            video.setAttribute("playsinline", true);
            video.play();
            requestAnimationFrame(tick);
        })
        .catch((err) => {
            console.error(`An error occurred: ${err}`);
        });
}

function drawLine(begin, end, color) {
    canvas.beginPath();
    canvas.moveTo(begin.x, begin.y);
    canvas.lineTo(end.x, end.y);
    canvas.lineWidth = 4;
    canvas.strokeStyle = color;
    canvas.stroke();
}

function tick() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvasElement.hidden = false;

        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

        let imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        let code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
        });

        if (code) {
            drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
            drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
            drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
            drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");

            codeData.value = code.data;
            codeLoaded.value = true;
        }
    }
    requestAnimationFrame(tick);
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
        await nextTick()

        video = document.createElement("video");
        canvasElement = document.querySelector("#canvas");
        canvas = canvasElement.getContext("2d");
    });
})
</script>