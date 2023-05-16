<template>
  <!-- menampilkan data table berisi array dari prop yaitu members -->
  <v-data-table
    :headers="headers"
    :items="members"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title><strong>Data Member</strong></v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <!-- dialog yang memunculkan form untuk penambahan data member -->
        

        <v-dialog
          v-model="dialogGanti"
          max-width="500px"
        >
          <v-card>
            <v-card-title>
              <span class="text-h5">Ganti Password</span>
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
                      v-model="editedItem.password"
                      label="Password"
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
                @click="savePassword"
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
      <v-btn small color="primary" class="mr-2 mt-1" dark @click="editItemStatus(item)">Ganti Status</v-btn>
      <v-btn small color="primary" class="mr-2 mt-1" dark @click="editItemPassword(item)">Ganti Password</v-btn>
      <v-btn small color="primary" class="mr-2 mt-1" dark @click="editItemReset(item)">Reset Password</v-btn>
      <v-btn small color="primary" class="mr-2 mt-1 mb-1" dark @click="deleteItem(item)">Hapus</v-btn>
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
      dialogGanti: false,
      snackbar: false,
      error_message: '',
      value: '',
      headers: [
        { text: 'ID Member', value: 'memberID', align: 'start',
          sortable: false },
        { text: 'Nama', value: 'nama' },
        { text: 'Alamat', value: 'alamat' },
        //{ text: 'Username', value: 'username' },
        { text: 'Telpon', value: 'telp' },
        { text: 'Tanggal Lahir', value: 'tanggalLahir' },
        { text: 'Status', value: 'statusMember' },
        { text: 'Deposit', value: 'deposit' },
        { text: 'Deposit Kelas', value: 'depositKelas' },
        //{ text: 'Actions', value: 'actions', width: '10%', sortable: false },
      ],
      members: [],
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      menu: false,
      editedIndex: -1,
      editedItem: {
        nama: '',
        alamat: '',
        telp: '',
        tanggalLahir: '',
        expired: '',
        deposit: '',
        depositKelas: ''
      },
      defaultItem: {
        nama: '',
        alamat: '',
        telp: '',
        tanggalLahir: '',
        expired: '',
        deposit: '',
        depositKelas: ''
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
      //membaca semua data member dengan konsum API 
      readData() {
        var url = this.$api + '/member';
        this.$http.get(url, {
            headers: {
                'Authorization' : 'Bearer ' + localStorage.getItem('token')
            }
        }).then(response => {
            this.members = response.data.data;
        })
      },
      
      editItemStatus (item) {
        this.editedIndex = item.memberID
        this.editedItem = Object.assign({}, item)

        var url = this.$api + '/changeStatus/' + this.editedIndex;
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
      },

      editItemReset (item) {
        this.editedIndex = item.memberID
        this.editedItem = Object.assign({}, item)

        var url = this.$api + '/resetPassword/' + this.editedIndex;
            this.load = true;
            
            this.$http.put(url, this.editedItem, {
            headers: {
                'Authorization' : 'Bearer ' + localStorage.getItem('token')
            }
            }).then(response => {
                this.error_message = 'Berhasil mereset data';
                this.color = "green";
                this.snackbar = true;
                this.readData();
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red";
            });
        this.close()
      },

      editItemPassword (item) {
        this.editedIndex = item.memberID
        this.editedItem = Object.assign({}, item)
        this.editedItem.password = ''
        this.dialogGanti = true
      },

      //menghapus data sesuai ID dan kondisi bahwa cancel booking hanya bisa dilakukan H-1,H-2,dst dengan konsum API
      deleteItem (item) {
        this.editedIndex = item.memberID
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      //menampilkan dialog untuk menanyakan delete akan dilakukan atau tidak
      deleteItemConfirm () {
          var url = this.$api + '/member/' + this.editedIndex;
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
        this.dialogGanti = false
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

      savePassword (){
            var url = this.$api + '/changePassword/' + this.editedIndex;
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

      save(){}
    },
  }
</script>