<template>
    <div class="row g-0 h-100 justify-content-center">
        <div class="col col-lg-6">
            <div class="card home-card">
                <div class="card-body d-flex justify-content-center align-items-center">
                    <div class="d-flex flex-column w-100">
                        <div class="bg-dark text-white d-flex flex-column shadow-lg rounded-5 py-4">
                            <div class="d-flex justify-content-center">
                                <figure id="icon" class="d-flex justify-content-center">
                                    <img src="/images/favicon.png" alt="bi-megaphone-fill"
                                        class="home-icon img-fluid p-2">
                                </figure>
                            </div>
                            <div class="d-flex justify-content-center">
                                <img id="tatava" src="/images/tatava.png" alt="Tatava!" class="img-fluid px-4" />
                            </div>
                            <div class="d-flex justify-content-center text-center">
                                <p id="quote" class="fs-4 funky-text text-dark m-4">Geyik muhabbetin dibine vurmaya
                                    hazır
                                    mısın?</p>
                            </div>
                        </div>
                        <hr />
                        <div class="d-flex flex-column">
                            <button type="button" class="btn btn-dark fw-bold btn-lg funky-text mb-1"
                                @click="create_game">CREATE A
                                NEW GAME</button>
                            <button type="button" class="btn btn-dark fw-bold btn-lg funky-text mt-1"
                                @click="join_game">JOIN</button>
                        </div>
                    </div>
                </div>
                <div class="d-flex flex-column p-2">
                    <div>
                        <button class="btn btn-sm btn-dark fw-bold bi bi-github m-1" @click="openGitHub">
                            <span class="ms-1">GitHub</span>
                        </button>
                    </div>
                    <div>
                        <button class="btn btn-sm btn-dark fw-bold m-1" @click="openProfile">
                            <span>Created by kaangiray26</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Create ref="createModal" />
    <Join ref="joinModal" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Create from './Create.vue';
import Join from './Join.vue';
import { annotate, annotationGroup } from 'rough-notation';

const createModal = ref(null);
const joinModal = ref(null);

async function openProfile() {
    window.open("https://www.buzl.uk/", "_blank");
}

async function openGitHub() {
    window.open("https://github.com/kaangiray26/tatava", "_blank");
}

async function create_game() {
    createModal.value.show();
}

async function join_game() {
    joinModal.value.show();
}

onMounted(() => {
    document.onreadystatechange = () => {
        let a1 = annotate(document.querySelector('#icon'), { type: 'circle' });
        let a2 = annotate(document.querySelector('#quote'), { type: 'highlight', color: 'white' });
        annotationGroup([a1, a2]).show();
    }
})
</script>