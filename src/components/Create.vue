<template>
    <div id="createModal" class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title funky-text">New Game</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div v-if="!peer_loaded" class="d-flex justify-content-center my-2">
                    <button class="btn btn-dark" type="button" disabled>
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Loading...
                    </button>
                </div>
                <div v-if="peer_loaded" class="modal-body">
                    <p>Alttaki QR kodu kullanarak arkadaşlarını davet edebilirsin.</p>
                    <div class="d-flex justify-content-center">
                        <div id="qrcode">
                        </div>
                    </div>
                    <hr />
                    <div>
                        <label for="basic-url" class="form-label">Ya da şu linki paylaşabilirsin.</label>
                        <div class="input-group">
                            <input :value="join_link" type="text" class="form-control disabled" id="basic-url"
                                aria-describedby="basic-addon3" readonly>
                            <button id="copyButton" class="btn btn-outline-dark bi bi-clipboard-fill"
                                @click="copyJoinLink">
                                <span class="ms-1">Copy</span>
                            </button>
                        </div>
                    </div>
                    <hr />
                    <div class="collapse my-2" id="collapsedPeerList">
                        <div class="card card-body">
                            Some placeholder content for the collapse component. This panel is hidden by default but
                            revealed when the user activates the relevant trigger.
                        </div>
                    </div>
                    <div class="d-flex justify-content-between">
                        <button type="button" class="btn btn-dark" data-bs-toggle="collapse"
                            data-bs-target="#collapsedPeerList" @click="showPeerList">
                            Joined: <span class="badge text-bg-light">{{ store.peerList.length }}</span>
                        </button>
                        <button class="btn btn-dark">Start</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { Modal } from 'bootstrap';
import { store } from "/js/store.js";

const modal = ref(null);
const join_link = ref(null);
const peer_loaded = ref(false);

async function showPeerList() {
    //
}

async function copyJoinLink() {
    navigator.clipboard.writeText(join_link.value);
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
    modal.value = new Modal(document.querySelector('#createModal'));

    window.addEventListener('peer_opened', async function () {
        join_link.value = "https://tatava.buzl.uk/join/" + store.peer_id;
        peer_loaded.value = true;
        await nextTick();
        let qr = new QRCode("qrcode", {
            text: join_link.value,
            width: '512',
            height: '512',
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
        for (let el of qr._el.childNodes) {
            el.classList.add("w-100")
        }
    })
})
</script>