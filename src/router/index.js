import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import Game from '../components/Game.vue';

const routes = [
    {
        path: "/",
        component: Home,

    },
    {
        path: "/game",
        component: Game,
    },
    {
        path: "/join/:id",
        component: Game,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router