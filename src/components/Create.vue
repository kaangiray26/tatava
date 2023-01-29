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
                        <div class="overflow-scroll">
                            <span class="fw-bold">Players</span>
                            <ul class="list-group list-group-numbered">
                                <li class="list-group-item me-1" v-for="peer in store.peer_list">
                                    <span class="text-bg-dark rounded fw-bold p-1">
                                        {{ peer.name }}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between">
                        <button type="button" class="btn btn-dark" data-bs-toggle="collapse"
                            data-bs-target="#collapsedPeerList">
                            Joined: <span class="badge text-bg-light">{{ store.peer_list.length }}</span>
                        </button>
                        <button class="btn btn-dark" @click="start_game">Start</button>
                    </div>
                    <div v-if="show_alert" class="alert alert-danger appear m-0 mt-2" role="alert">
                        You need at least 1 player to start the game.
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
import { store } from "/js/store.js";

const router = useRouter();

const modal = ref(null);
const join_link = ref(null);
const peer_loaded = ref(false);
const show_alert = ref(false);

async function start_game() {
    show_alert.value = false;
    await nextTick();

    if (store.peer_list.length < 1) {
        show_alert.value = true;
        return;
    }
    _hide();
    router.push("/game");
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