<template>
  <v-card
    class="mx-auto"
    max-width="344"
    style="margin-top: 210px;"
  >
    <v-card-text>
      <div>Selamat Datang</div>
      <p class="text-h4 text--primary">
        LOGIN Member <br><strong>Go-Fit</strong>
      </p>
        <v-form v-model="valid">
            <v-container>
                <v-col
                cols="12"
                sm="12"
                >
                <v-text-field
                    label="Username"
                    v-model="username"
                
                    filled
                    :rules="nameRules"
                    required
                ></v-text-field>
                </v-col>

                <v-col
                cols="12"
                sm="12"
                style="margin-top: -30px; margin-bottom: -30px;"
                >
                <v-text-field
                    label="Password"
                    v-model="password"
               
                    filled
                    :rules="passwordRules"
                    required
                ></v-text-field>
                </v-col>
        
            </v-container>
        </v-form>
    </v-card-text>
    <v-card-actions>
      <p class="text--primary ml-2">
        Login <a href="/login">pegawai</a>
      </p>
      <v-btn
        color="deep-purple accent-4"
        dark
        style="margin-left: 150px; margin-bottom: 10px;"
        @click="submit"
      >
        Login
      </v-btn>
    </v-card-actions>
    <v-snackbar
      v-model="snackbar"
    >
      {{ error_message }}
    </v-snackbar>
  </v-card>
  
</template>

<script>
  export default {
    data: () => ({
      valid: false,
      snackbar: false,
      username: '',
      error_message : '',
      nameRules: [
        v => !!v || 'Username tidak boleh kosong',
      ],
      password: '',
      passwordRules: [
        v => !!v || 'Password tidak boleh kosong',
      ],
    }),

    methods: {
      validate() {
        this.$refs.form.validate()
      },
      reset() {
        this.$refs.form.reset()
      },
      resetValidation() {
        this.$refs.form.resetValidation()
      },

      submit() {
              //cek validasi data yang terkirim
              this.load = true;
              this.$http.post(this.$api + '/login', {
                  username: this.username,
                  password: this.password
              }).then(response => {
                  //simpan data id user yang diinput
                  localStorage.setItem('memberID', response.data.user.memberID);
                  //localStorage.setItem('email', response.data.user.email);
                  //localStorage.setItem('role', response.data.user.jabatan);
                  localStorage.setItem('token', response.data.access_token);
                  this.error_message = response.message;
                  this.error_message = "Berhasil Login";
                  this.cek = localStorage.getItem('roleID');
                  this.color = "green";
                  this.snackbar = true;

                  this.$router.push({path: '/memberAdmin',});

              }).catch(error => {
                  console.log(error.response)
                  this.error_message = 'Kata Sandi atau Username salah';
                  this.color = "red";
                  this.snackbar = true;
                  localStorage.removeItem('token');
                  this.load = false;
              })
          
      },
    },
  }
</script>