<template>
  <!-- menampilkan data table berisi array dari prop yaitu izins -->
  <v-data-table
    :headers="headers"
    :items="izins"
    sort-by="calories"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title><strong>Data Perizinan</strong> </v-toolbar-title>
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
              <span class="text-h5"> Tambah Data</span>
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
                      v-model="editedItem.jadwalID"
                      label="Jadwal ID"
                    ></v-text-field>
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
                    <v-text-field
                      v-model="editedItem.instruktur"
                      label="Instruktur"
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
                        :return-value.sync="editedItem.tanggal_izin"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                            v-model="editedItem.tanggal_izin"
                            label="Tanggal"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                        ></v-text-field>
                        </template>
                        <v-date-picker
                        v-model="editedItem.tanggal_izin"
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
                            @click="$refs.menu.save(editedItem.tanggal_izin)"
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

        <v-snackbar
          v-model="snackbar"
        >
          {{ error_message }}
        </v-snackbar>
      </v-toolbar>
    </template>
    
    <template v-slot:[`item.actions`]="{ item }">
      <!-- dialog untuk menampilkan form verifikasi data -->
      
        <!-- terdapat kondisi jika izin bernilai 1 atau diperbolehkan maka muncul kalimat Sudah Terkonfirmasi -->
      <!-- <div v-if=item.is_accepted>  
        <v-btn small color="primary" class="mr-2"  disabled elevation="2" @click="">Sudah Terkonfirmasi</v-btn>
      </div>
      <div v-else>  
        <v-btn small color="primary" class="mr-2" dark @click="dialog=true">Verif</v-btn>
      </div> -->
      
      
    </template>
  </v-data-table>
</template>

<script>
  export default {
    //define seluruh prop data yang akan digunakan sebagai penampung dari response konsum API ataupun 
    //yang akan digunakan didalam template
    data: () => ({
      dialog: false,
      dialogDelete: false,
      error_message: '',
      snackbar: false,
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      menu: false,
      value: null,
      headers: [
        { text: 'ID Jadwal', value: 'jadwalID', align: 'start',  sortable: false,},
        { text: 'Nama Instrukur', value: 'instruktur' },
        { text: 'Status', value: 'is_accepted' },
        { text: 'Sesi', value: 'sesi' },
        { text: 'Tanggal Izin', value: 'tanggal_izin' },
        //{ text: 'Actions', value: 'actions', sortable: false },
      ],
      izins: [],
      editedIndex: -1,
      editedItem: {
        jadwalID: '',
        instruktur: '',
        is_accepted: 0,
        sesi: '',
        tanggal_izin: null,
      },
      defaultItem: {
        jadwalID: '',
        instruktur: '',
        is_accepted: 0,
        sesi: '',
        tanggal_izin: '',
      },
    }),

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    //loop agar data terus dibaca dan ditarik dari database melalui konsum API
    created () {
      this.readData();
    },

    methods: {
      //membaca data lewat konsum API dan menampungnya dalam array izins
      readData() {
        var url = this.$api + '/izin';
        this.$http.get(url, {
            headers: {
                'Authorization' : 'Bearer ' + localStorage.getItem('token')
            }
        }).then(response => {
  
            this.izins = response.data.data;
        })
      },

      save() {
        var url = this.$api + '/izin';
        
        this.load = true;
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
  
        this.close()
      },

      //menampung data yang dipilih dalam tabel pada variabel editedItem. Menampung indeks data pada variabel editedIndex
      //memunculkan form verifikasi
      editItem (item) {
        this.editedIndex = this.izins.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      //menutup semua form dan membuat nilai editedIndex atau editedItem menjadi kosong kembali
      //agar dapat digunakan pada data yang akan dipilih selanjutnya
      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
    },
  }
</script>