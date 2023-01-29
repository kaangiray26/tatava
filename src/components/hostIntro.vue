<template>
    <div id="hostIntroModal" class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title funky-text">Intro</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>Kendine bir isim seç ve oyuna katıl.</p>
                    <div class="input-group mb-2">
                        <span class="input-group-text bi bi-person-circle" id="basic-addon1"></span>
                        <input ref="username" type="text" class="form-control" placeholder="Username"
                            aria-label="Username" aria-describedby="basic-addon1">
                    </div>
                    <div class="d-flex flex-column">
                        <button class="btn btn-dark" @click="connect">Connect</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Modal } from 'bootstrap';


const modal = ref(null);
const username = ref(null);
const emit = defineEmits(['connect_as_host']);

async function connect() {
    if (!username.value.value.length) {
        return;
    }
    emit('connect_as_host', username.value.value);
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
    modal.value = new Modal(document.querySelector('#hostIntroModal'), {
        backdrop: 'static',
        keyboard: false
    });
})
</script>