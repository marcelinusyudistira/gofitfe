import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/',
    name: 'loginMember',
    component: () => import('../views/LoginMember.vue'),
  },

  {
    path: '/pegawaiAdmin',
    name: 'pegawaiAdmin',
    component: () => import('../views/Layout/Navbar.vue'),
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        title: 'Go Fit | Dashboard',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/Admin/Perizinan.vue')
      },
      {
        path: '/perizinan',
        name: 'perizinan',
        title: 'Go Fit | Perizinan',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/Admin/Perizinan.vue')
      },
      {
        path: '/jadwal',
        name: 'jadwal',
        title: 'Go Fit | Jadwal',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/Admin/Jadwal.vue')
      },
      {
        path: '/booking',
        name: 'booking',
        title: 'Go Fit | Booking',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/Admin/Booking.vue')
      },
      {
        path: '/member',
        name: 'member',
        title: 'Go Fit | Member',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/Admin/Member.vue')
      },
      {
        path: '/instruktur',
        name: 'instruktur',
        title: 'Go Fit | Instruktur',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/Admin/Instruktur.vue')
      }
    ]
  },

  {
    path: '/instrukturAdmin',
    name: 'instrukturAdmin',
    component: () => import('../views/Layout/NavbarInstruktur.vue'),
    children: [
      {
        path: '/dashboardInstruktur',
        name: 'dashboardInstruktur',
        title: 'Go Fit | Dashboard',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/Admin/Dashboard.vue')
      },
      {
        path: '/perizinanInstruktur',
        name: 'perizinanInstruktur',
        title: 'Go Fit | Perizinan',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/Admin/PerizinanInstruktur.vue')
      },
      {
        path: '/jadwalInstruktur',
        name: 'jadwalInstruktur',
        title: 'Go Fit | Jadwal',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/Admin/JadwalInstruktur.vue')
      },
      {
        path: '/memberInstruktur',
        name: 'memberInstruktur',
        title: 'Go Fit | Member',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/Admin/MemberInstruktur.vue')
      },
    ]
  },
  {
    path: '/memberAdmin',
    name: 'memberAdmin',
    component: () => import('../views/Layout/NavbarMember.vue'),
    children: [
      {
        path: '/dashboardMember',
        name: 'dashboardMember',
        title: 'Go Fit | Dashboard',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/Admin/Dashboard.vue')
      },
      {
        path: '/jadwalMember',
        name: 'jadwalMember',
        title: 'Go Fit | Jadwal',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/Admin/JadwalMember.vue')
      },
      {
        path: '/bookingMember',
        name: 'bookingMember',
        title: 'Go Fit | Booking',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/Admin/BookingMember.vue')
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
