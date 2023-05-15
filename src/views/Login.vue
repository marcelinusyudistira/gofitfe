<template>
  <v-card
    class="mx-auto"
    max-width="344"
    style="margin-top: 210px;"
  >
    <v-card-text>
      <div>Selamat Datang</div>
      <p class="text-h4 text--primary">
        LOGIN <strong>Go-Fit</strong>
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
                    single-line
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
                    single-line
                    filled
                    :rules="passwordRules"
                    required
                ></v-text-field>
                </v-col>
        
            </v-container>
        </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn
        color="deep-purple accent-4"
        dark
        style="margin-left: 255px; margin-bottom: 10px;"
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
      username: '23.05.001',
      error_message : '',
      nameRules: [
        v => !!v || 'Username tidak boleh kosong',
      ],
      password: '2022-02-02',
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
                  this.color = "green";
                  this.snackbar = true;
                  this.load = false;

                  this.$router.push({path: '/admin',});
                //   this.clear();
                //   this.cekJabatan = localStorage.getItem('role');
                //   if(this.cekJabatan == 0){
                //       this.$router.push({
                //       name: 'Home',
                //    });
                //   }else if(this.cekJabatan == 1){
                //       this.$router.push({
                //        path: '/manager',
                //    });
                //   }else if(this.cekJabatan == 2){
                //       this.$router.push({
                //        path: '/admin',
                //    });
                //   }else if(this.cekJabatan == 3){
                //       this.$router.push({
                //        path: '/customerService',
                //    });
                //   }else{
                //     this.$router.push({
                //        path: '/admin',
                //   });
                // }
                // this.reset()

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