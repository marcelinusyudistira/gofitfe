<template>
  <!-- menampilkan data table berisi array dari prop yaitu bookings -->
  <v-data-table
    :headers="headers"
    :items="instrukturs"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title><strong>Data Instruktur</strong></v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <!-- dialog yang memunculkan form untuk penambahan data booking -->
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
        <!-- Tambah data Booking melalui button -->
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
                    <v-text-field
                      v-model="editedItem.roleID"
                      label="ID Role"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.namaRole"
                      label="Nama Role"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.username"
                      label="Usename"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.alamat"
                      label="Alamat"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.telp"
                      label="Telpon"
                    ></v-text-field>
                  </v-col>
                  
                    <!-- Menggunakan datapicker dari vuetify untuk mengambil nilai date yang ditentukan user -->
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-menu
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        :return-value.sync="editedItem.tanggalLahir"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                            v-model="editedItem.tanggalLahir"
                            label="Tanggal Lahir"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                        ></v-text-field>
                        </template>
                        <v-date-picker
                        v-model="editedItem.tanggalLahir"
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
                            @click="$refs.menu.save(editedItem.tanggalLahir)"
                        >
                            OK
                        </v-btn>
                        </v-date-picker>
                    </v-menu>
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

        <!-- dialog untuk menampilkan form delete -->
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
      <!-- notifikasi -->
      <v-snackbar
      v-model="snackbar"
    >
      {{ error_message }}
    </v-snackbar>
    </template>
  </v-data-table>
</template>


<script>
  export default {
    data: () => ({
      dialog: false,
      dialogDelete: false,
      snackbar: false,
      error_message: '',
      value: '',
      headers: [
        { text: 'ID Instruktur', value: 'pegawaiID', align: 'start',
          sortable: false },
        { text: 'Username', value: 'username' },
        { text: 'Alamat', value: 'alamat' },
        { text: 'Telpon', value: 'telp' },
        { text: 'Tanggal Lahir', value: 'tanggalLahir' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      instrukturs: [],
      pegawais: [],
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      menu: false,
      editedIndex: -1,
      editedItem: {
        roleID: '',
        namaRole: '',
        username: '',
        alamat: '',
        telp: '',
        tanggalLahir: ''
      },
      defaultItem: {
        roleID: '',
        namaRole: '',
        username: '',
        alamat: '',
        telp: '',
        tanggalLahir: ''
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
      this.readDataInstruktur();
    },

    methods: {
      //membaca semua data bookingan dengan konsum API 
      readDataInstruktur() {
        var url = this.$api + '/showInstruktur';
        this.$http.get(url, {
            headers: {
                'Authorization' : 'Bearer ' + localStorage.getItem('token')
            }
        }).then(response => {
            this.instrukturs = response.data.data;
        })
      },

      readData() {
        var url = this.$api + '/pegawai';
        this.$http.get(url, {
            headers: {
                'Authorization' : 'Bearer ' + localStorage.getItem('token')
            }
        }).then(response => {
            this.pegawais = response.data.data;
        })
      },
      
      editItem (item) {
        this.editedIndex = item.pegawaiID
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      //menghapus data sesuai ID dan kondisi bahwa cancel booking hanya bisa dilakukan H-1,H-2,dst dengan konsum API
      deleteItem (item) {
        this.editedIndex = item.pegawaiID
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      //menampilkan dialog untuk menanyakan delete akan dilakukan atau tidak
      deleteItemConfirm () {
          var url = this.$api + '/pegawai/' + this.editedIndex;
          this.load = true;
          console.log(url)
          this.$http.delete(url, {
              headers: {
                  'Authorization' : 'Bearer ' + localStorage.getItem('token')
              }
          }).then(response => {
              this.error_message = response.data.message;
              this.color = "green";
              this.snackbar = true;
              this.readData(); // baca data
            }).catch(error => {
              this.error_message = error.response.data.message;
              this.color = "red";
              this.snackbar = true;
          });
        this.closeDelete()
      },

      //menutup form Add
      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      //menutup form Delete
      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      //menyimpan data yang sudah diinputkan pada Add Bookingan
      //Pastikan sudah create member 
      //Pastikan sudah create jadwal
      //No Struk digunakan untuk auto generate yang digunakan untuk Laporan
      save (){
            if (this.editedIndex > -1) {
                var url = this.$api + '/pegawai/' + this.editedIndex;
                this.load = true;
                
                this.$http.put(url, this.editedItem, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
                }).then(response => {
                    this.error_message = 'Data Instruktur berhasil diedit';
                    this.color = "green";
                    this.snackbar = true;
                    this.readData();
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    this.color = "red";
                });
            } else {
            //melakukan penambahan data sesuai dengan inputan user
            //pastikan sudah create role 1 untuk Instruktur
            //pastikan sudah create pegawai minimal 2 nama bebas dan mempunyai namaRole Instruktur serta roleID 1
            //akan ada dropdown untuk tipe dan cuman 2 yaitu 'kelas' dan 'gym'
                var url = this.$api + '/pegawai';
                this.load = true;
                this.$http.post(url, this.editedItem, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
                }).then(response => {
                    this.error_message = 'Data Instruktur berhasil ditambahkan';
                    this.color = "green";
                    this.snackbar = true;
                    this.readDataInstruktur()();
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    this.color = "red";
                });
            }
        this.close()
      },
    },
  }
</script>