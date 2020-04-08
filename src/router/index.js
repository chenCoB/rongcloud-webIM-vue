import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        component: () => import( '@/views/layout/layout.vue'),
        children: [{
            path: '',
            name: 'home',
            component: () => import( '@/views/home/home.vue'),
        },{
                path: 'contact',
                name: 'contact',
                component: () => import( '@/views/contact/contact.vue'),
            },
            {
                path: 'chat',
                name: 'chat',
                component: () => import( '@/views/im-chat/index.vue'),
                children: [
                    {
                        path: '',
                        component: () => import( '@/views/im-chat/im-chat.vue'),
                    },
                    {
                        path: 'group/details',
                        name: 'group-details',
                        component: () => import( '@/views/im-chat/group-details.vue'),
                    },
                    {
                        path: 'more/members',
                        name: 'more-members',
                        component: () => import( '@/views/im-chat/more-members.vue'),
                    },
                    {
                        path: 'notice/details',
                        name: 'notice-details',
                        component: () => import( '@/views/im-chat/notice-details.vue'),
                    }
                ]
            },
            {
                path: 'single',
                name: 'single',
                component: () => import( '@/views/single/single.vue'),
            },
            {
                path: 'user',
                name: 'user',
                component: () => import( '@/views/user/user.vue'),
            },
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import( '@/views/login/login.vue')
    },
    {
        path: '/register',
        name: 'register',
        component: () => import( '@/views/register/register.vue')
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router
