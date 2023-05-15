<template>
  <v-card
    class="mx-auto overflow-hidden fullheight"
  >
    <v-app-bar
      color="deep-purple"
      dark
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

    </v-app-bar>

    <div style="padding: 30px; margin-bottom: 62px;">
        <router-view></router-view>
    </div>

    <v-navigation-drawer
      v-model="drawer"
      class="fullheight" 
      width="256"
      app
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6 black--text">
            <strong>Go Fit</strong>
          </v-list-item-title>
          <v-list-item-subtitle class="black--text">
            For Healthy Life
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list
        
        nav
        dense
      >
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"

        >
          <v-list-item 
            v-for="item in items"
            :key="item.title"
            v-model="item.active"
            :to="item.to"
            link
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
  export default {
    data: () => ({
      drawer: true,
      group: null,
      items: [
          { title: 'Dashboard', icon: 'mdi-view-dashboard', to: 'dashboard' },
          { title: 'Perizinan', icon: 'mdi-bullhorn-outline', to: 'perizinan' },
          { title: 'Jadwal', icon: 'mdi-account-group', to: 'jadwal' },
          { title: 'Booking', icon: 'mdi-chat-plus', to: 'booking' },
          { title: 'Member', icon: 'mdi-account-group', to: 'member' },
          { title: 'Instruktur', icon: 'mdi-chat-plus', to: 'instruktur' },
        ],
    }),
  }
</script>