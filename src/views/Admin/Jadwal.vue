<template>
  <v-data-table
    :headers="headers"
    :items="jadwals"
    sort-by="calories"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>My CRUD</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              New Item
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-select
                      :items="tipeFit"
                      label="Pilih Tipe"
                      outlined
                      item-text="name"
                      item-value="name"
                      v-model="value"
                    ></v-select>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.sesi"
                      label="Sesi"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <!-- <v-text-field
                      v-model="editedItem.tanggal"
                      label="Tanggal"
                    ></v-text-field> -->
                    <v-menu
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        :return-value.sync="editedItem.tanggal"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                            v-model="editedItem.tanggal"
                            label="Tanggal"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                        ></v-text-field>
                        </template>
                        <v-date-picker
                        v-model="editedItem.tanggal"
                        no-title
                        scrollable
                        >
                        <v-spacer></v-spacer>
                        <v-btn
                            text
                            color="primary"
                            @click="menu = false"
                        >
                            Cancel
                        </v-btn>
                        <v-btn
                            text
                            color="primary"
                            @click="$refs.menu.save(editedItem.tanggal)"
                        >
                            OK
                        </v-btn>
                        </v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                  <div v-if = "value == 'kelas'">
                    <v-text-field
                      v-model="editedItem.instruktur"
                      label="Instruktur"
                    ></v-text-field>
                  </div>
                    <div v-if = "value == 'gym'">
                    <v-text-field
                      v-model="editedItem.instruktur"
                      label="Instruktur"
                      disabled
                    ></v-text-field>
                  </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn
        color="primary"
        @click="initialize"
      >
        Reset
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
  export default {
    data: () => ({
      dialog: false,
      dialogDelete: false,
      value: '',
      headers: [
        { text: 'JadwalID', value: 'jadwalID', align: 'start',
          sortable: false },
        { text: 'Tipe', value: 'tipe' },
        { text: 'Sesi', value: 'sesi' },
        { text: 'Tanggal', value: 'tanggal' },
        { text: 'Instruktur', value: 'instruktur' },
        { text: 'Kapasitas', value: 'kapasitas' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      jadwals: [],
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      menu: false,
      editedIndex: -1,
      editedItem: {
        tipe: '',
        sesi: '',
        tanggal: null,
      },
      defaultItem: {
        tipe: '',
        sesi: '',
        tanggal: null,
      },
      tipeFit: [{id:1, name:'kelas'},{id:2, name:'gym'}]
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    created () {
      this.initialize();
      this.readData();
    },

    methods: {
      initialize () {
        // this.jadwals = [
        //   {
        //     jadwalID: 1,
        //     pegawaiID: 1,
        //     tipe: 'Asolole',
        //     sesi: '2',
        //     tanggal: '2023-08-05',
        //     instruktur: 'Yogi',
        //     kapasitas: 9,
        //   },
        //   {
        //     jadwalID: 2,
        //     pegawaiID: 1,
        //     tipe: 'Asolole',
        //     sesi: '2',
        //     tanggal: '2023-08-05',
        //     instruktur: 'Yogi',
        //     kapasitas: 9,
        //   },
        //   {
        //     jadwalID: 3,
        //     pegawaiID: 1,
        //     tipe: 'Asolole',
        //     sesi: '2',
        //     tanggal: '2023-08-05',
        //     instruktur: 'Yogi',
        //     kapasitas: 9,
        //   },
        //   {
        //     jadwalID: 4,
        //     pegawaiID: 1,
        //     tipe: 'Asolole',
        //     sesi: '2',
        //     tanggal: '2023-08-05',
        //     instruktur: 'Yogi',
        //     kapasitas: 9,
        //   },
        // ]
      },

      readData() {
        var url = this.$api + '/jadwal';
        this.$http.get(url, {
            headers: {
                'Authorization' : 'Bearer ' + localStorage.getItem('token')
            }
        }).then(response => {
            this.jadwals = response.data.data;
        })
      },

      editItem (item) {
        this.editedIndex = this.jadwals.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.jadwals.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        this.jadwals.splice(this.editedIndex, 1)
        this.closeDelete()
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.jadwals[this.editedIndex], this.editedItem)
        } else {
          var indeks = this.editedIndex + 1;
            var url = this.$api + '/jadwal';
            this.load = true;
            this.editedItem.tipe = this.value
            this.$http.post(url, this.editedItem, {
            headers: {
                'Authorization' : 'Bearer ' + localStorage.getItem('token')
            }
            }).then(response => {
                this.error_message = response.data.message;
                this.color = "green";
                this.snackbar = true;
                this.readData();
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red";
            });
            this.close();
        }
        this.close()
      },
    },
  }
</script>