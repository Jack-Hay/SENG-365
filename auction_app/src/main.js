import Vue from 'vue';
import App from './App.vue';
import Home from './Home.vue';
import Auctions from './Auctions.vue';
import Users from './Users.vue';

import VueRouter from 'vue-router';
Vue.use(VueRouter);

// Require dependencies
var VueCookie = require('vue-cookie');
// Tell Vue to use the plugin
Vue.use(VueCookie);

import VueResource from 'vue-resource';
Vue.use(VueResource);
Vue.http.options.emulateJson = true;

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/auctions",
    name: "auctions",
    component: Auctions
  },
  {
    path: "/auctions/:auctionId",
    name: "auction",
    component: Auctions
  },
  {
    path: "/auctions/:auctionId/bids",
    name: "bids",
    component: Auctions
  },
  {
    path: "/auctions/:auctionId/photos",
    name: "photos",
    component: Auctions
  },

  {
    path: "/users",
    name: "users",
    component: Users
  },
  {
    path: "/users/:userId",
    name: "user",
    component: Users
  },
  {
    path: "/users/login",
    name: "login",
    component: Users
  },
  {
    path: "/users/logout",
    name: "logout",
    component: Users
  },
];

const router = new VueRouter({
  routes: routes,
  mode: 'history'
});



new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});
