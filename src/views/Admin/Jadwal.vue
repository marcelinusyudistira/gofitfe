<template>
  <!-- menampilkan data table berisi array dari prop yaitu jadwals -->
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
        <v-toolbar-title><strong>Data Jadwal</strong></v-toolbar-title>
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
          <!-- Tambah data jadwal melalui button -->
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
                  <!-- menampilkan dropdown dengan isi nama instruktur sehingga user tinggal pilih -->
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
                  <!-- Terdapat kondisi untuk menampilkan input infrasturktur bila tipenya kelas -->
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

        <!-- dialog untuk mengubah instruktur dengan menampilkan form edit instruktur -->
        <v-dialog
          v-model="dialogInstruktur"
          max-width="500px"
        >
          <v-card>
            <v-card-title>
              <span class="text-h5">Ganti Instruktur</span>
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
                      v-model="editedItem.instruktur"
                      label="Instruktur"
                    ></v-text-field>
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
                @click="saveInstruktur"
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
      <!-- terdapat kondisi jika tipe dari data yang dipilih adalah kelas maka dapat mengganti instruktur -->
      <div v-if="item.tipe == 'gym'">
        <v-btn small color="primary" class="mr-2"  disabled @click="">Ganti Instruktur</v-btn>
      </div>
      <div v-else>  
        <v-btn small color="primary" class="mr-2" dark @click="editItemInstruktur(item)">Ganti Instruktur</v-btn>
      </div>

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
    //define seluruh prop data yang akan digunakan sebagai penampung dari response konsum API ataupun 
    //yang akan digunakan didalam template
    data: () => ({
      dialog: false,
      dialogDelete: false,
      dialogInstruktur: false,
      snackbar: false,
      error_message: '',
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
        instruktur: '',
      },
      defaultItem: {
        tipe: '',
        sesi: '',
        tanggal: null,
        instruktur: '',
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
      this.readData();
    },

    methods: {
       //membaca data lewat konsum API dan menampungnya dalam array izins
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

      //menampung data yang dipilih dalam tabel pada variabel editedItem. Menampung indeks data pada variabel editedIndex
      //memunculkan form edit data untuk melakukan editing data jadwal
      editItem (item) {
        this.editedIndex = item.jadwalID
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      //menampung data yang dipilih dalam tabel pada variabel editedItem. Menampung indeks data pada variabel editedIndex
      //memunculkan form edit instruktur untuk melakukan edit instruktur
      editItemInstruktur(item){
        this.editedIndex = item.jadwalID
        this.editedItem = Object.assign({}, item)
        this.dialogInstruktur = true
      },

      //menampung data yang dipilih dalam tabel pada variabel editedItem. Menampung indeks data pada variabel editedIndex
      //memunculkan form edit hapus untuk melakukan penghapusan data
      deleteItem (item) {
        this.editedIndex = item.jadwalID
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      //melakukan penghapusan data yang dipilih dengan konsum API
      deleteItemConfirm () {
          console.log(this.editedIndex)
          var url = this.$api + '/jadwal/' + this.editedIndex;
          this.load = true;
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

      //menutup semua form dan membuat nilai editedIndex atau editedItem menjadi kosong kembali
      //agar dapat digunakan pada data yang akan dipilih selanjutnya
      close () {
        this.dialog = false
        this.dialogInstruktur = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      //menutup form delete dan membuat nilai editedIndex atau editedItem menjadi kosong kembali
      //agar dapat digunakan pada data yang akan dipilih selanjutnya
      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      //menyimpan data instruktur sesuai dengan pilihan data yang akan diganti instrukturnya
      //cuman bisa dilakukan jika tipe adalah kelas
      saveInstruktur(){
        var url = this.$api + '/updateInstruktur/' + this.editedIndex;
            this.load = true;
            
            this.$http.put(url, this.editedItem, {
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

      save () {
        //melakukan edit data yang dipilih, jika editedIndex lebih dari satu maka ada data yang dipilih
        //pastikan jika merubah gym ke kelas tambahkan data instruktur
        if (this.editedIndex > -1) {
            this.editedItem.tipe = this.value
            var url = this.$api + '/jadwal/' + this.editedIndex;
            this.load = true;
            
            this.$http.put(url, this.editedItem, {
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
        } else {
          //melakukan penambahan data sesuai dengan inputan user
          //pastikan sudah create role 1 untuk Instruktur
          //pastikan sudah create pegawai minimal 2 nama bebas dan mempunyai namaRole Instruktur serta roleID 1
          //akan ada dropdown untuk tipe dan cuman 2 yaitu 'kelas' dan 'gym'
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
        }
        this.close()
      },
    },
  }
</script>