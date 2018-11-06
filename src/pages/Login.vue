<template>
    <div id="login">
        <h1>Timex Login</h1>
        <div class="form-group">
            <label>Email address</label>
            <input type="email" class="form-control" v-model="input.username" placeholder="Email">
        </div>
        <div class="form-group">
            <label>Password</label>
            <input type="password" class="form-control" v-model="input.password" placeholder="Password">
        </div>
        <span v-text="error_message" class="text-danger"></span><br v-if="error_message.length"/>
        <button type="submit" class="btn btn-default" @click="login()">Login</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            input: {
                username: "",
                password: ""
            },
            error_message: '',
        }
    },
    methods: {
        login() {
            if(this.input.username != "" && this.input.password != "") {
                /*axios.get('time-entries')
                    .then((response) => {
                      let data = response.data;
                      if(data.status) {
                        this.timeEntries = data.timeEntries;
                      }
                    },(error) => {
                      this.timeEntries = [];
                      this.$notify({
                        message: 'Oops! There was something wrong in fetching the time entries.',
                        type: 'danger'
                      })
                    });*/
                if(this.input.username == this.$parent.mockAccount.username && this.input.password == this.$parent.mockAccount.password) {
                    this.$emit("authenticated", true);
                    this.$router.replace({ name: "secure" });
                } else {
                    this.error_message = "The username/password is incorrect";
                }
            } else {
                this.error_message = "A username and password must be present";
            }
        }
    }
}
</script>

<style scoped>
#login {
    width: 500px;
    border: 1px solid #CCCCCC;
    background-color: #FFFFFF;
    margin: auto;
    margin-top: 200px;
    padding: 20px;
}
</style>
