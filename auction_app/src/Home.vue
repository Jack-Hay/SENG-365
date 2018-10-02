<template>
  <div id="auctions">
    <body id="page-top">
    <title>Auctionator 3000</title>
    <!-- Bootstrap Core CSS -->
    <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">

    <!-- Custom Fonts -->
    <link href="vendor/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,700,300italic,400italic,700italic" rel="stylesheet" type="text/css">
    <link href="vendor/simple-line-icons/css/simple-line-icons.css" rel="stylesheet">

    <!-- Custom CSS -->
    <link href="css/stylish-portfolio.min.css" rel="stylesheet">
    <header class="masthead">
      <div class="container text-center my-auto">
        <h1 class="mb-1">Auctionator 3000!</h1>
        <h3 class="mb-5">
          <em>Login/logout or go to the auctions page via the buttons below</em>
        </h3>
        <router-link :to="{ name: 'auctions'}">
          <button type="button" class="btn btn-primary">
            View Auctions</button>
        </router-link>
          <button v-if="this.token === '' || this.token === null" type="button" class="btn btn-primary" data-toggle="modal" data-target="#createUserModal">
            Create Account </button>
        <div class="modal " id="createUserModal" tabindex="-1" role="dialog" aria-labelledby="createUserModalLabel"
             aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="createUserModalLabel">Create User</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <div id="accountForm">
                  <div id="error" class="alert alert-danger" role="alert" style="display: none" ></div>
                  <form ref="form">
                    Given Name:<br>
                    <input type="text" name="givenName" v-model="givenName"><br>
                    Family Name:<br>
                    <input type="text" name="familyName" v-model="familyName"><br>
                    Email:<br>
                    <input type="text" name="email" v-model="email"><br>
                    Username:<br>
                    <input type="text" name="username" v-model="username"><br>
                    Password:<br>
                    <input type="password" name="password" v-model="password"><br>
                  </form>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">
                  Close
                </button>

                <button type="button" class="btn btn-primary" v-on:click="addUser()">
                  Create User
                </button>
              </div>
            </div>
          </div>
        </div>

          <button v-if="this.token === '' || this.token === null" type="button" class="btn btn-primary" data-toggle="modal" data-target="#loginModal">
            Login</button>

        <div class="modal" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="loginModalLabel"
             aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="loginModalLabel">Login</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <div id="loginForm">
                  <div id="loginError" class="alert alert-danger" role="alert" style="display: none" ></div>
                  <form ref="form">
                    Username or Email:<br>
                    <input type="text" name="username" v-model="loginUsername"><br>
                    Password:<br>
                    <input type="password" name="password" v-model="loginPassword"><br>
                  </form>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">
                  Close
                </button>
                <button type="button" class="btn btn-primary" v-on:click="loginUser()">
                  Login
                </button>

              </div>
            </div>
          </div>
        </div>
          <button v-if="this.token !== '' && this.token !== null"type="button" class="btn btn-primary" data-toggle="modal" data-target="#logoutModal">
            Logout</button>
        </div>

        <div class="modal" id="logoutModal" tabindex="-1" role="dialog" aria-labelledby="logoutModalLabel"
             aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="logoutModalLabel">Are you sure you want to logout?</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">
                  Close
                </button>

                <button type="button" class="btn btn-primary" v-on:click="logoutUser()">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      <div class="overlay"></div>
    </header>
    </body>
  </div>


</template>


<script>
  const address = "http://localhost:4941";

  export default {
    data() {
      return {
        givenName: "",
        familyName: "",
        email: "",
        username: "",
        password: "",
        userId: "",
        loginUsername: "",
        loginPassword: "",
        token: "",
      }
    },

    mounted: function() {
      this.getToken()
    },

    methods: {
      addUser: function() {
        if (this.username === "" || this.givenName === "" || this.email === "" || this.familyName === "" || this.password === "") {
          document.getElementById('error').innerHTML="Please enter all fields.";
          document.getElementById('error').style.display = "inline-block"
        } else if (!/(.+)@(.+){2,}\.(.+){2,}/.test(this.email)) {
          document.getElementById('error').innerHTML="Please enter a valid email.";
          document.getElementById('error').style.display = "inline-block"
          } else {
            this.$http.post(address + "/api/v1/users/", {
              "username": this.username,
              "givenName": this.givenName,
              "familyName": this.familyName,
              "email": this.email,
              "password": this.password,
            }).then(function(response){
              $('#createUserModal').modal('hide');
              $('body').removeClass('modal-open');
              $('.modal-backdrop').remove();
              this.userId = response.data['id'];
              this.$http.post(address + "/api/v1/users/login", {
                "username": this.username,
                "password": this.password
              }).then(function(response){
                this.$cookie.set('token', response.data['token'], {expires: 1, domain: 'localhost'});
                this.token = this.$cookie.get('token');
                this.$cookie.set('userId', response.data['id'], {expires: 1, domain: 'localhost'});
                window.location.href = "http://localhost:8080/auctions";

              }, function(error){

              });
            }, function(error){
              if (error) {
                document.getElementById('error').innerHTML = "Email or Username is not unique";
                document.getElementById('error').style.display = "inline-block";
              }
            });
          }
      },
      loginUser: function() {
        if (this.loginUsername === "" || this.loginPassword === "") {
          document.getElementById('loginError').innerHTML="Please enter all fields.";
          document.getElementById('loginError').style.display = "inline-block";
        } else {

          if (/(.+)@(.+){2,}\.(.+){2,}/.test(this.loginUsername)) {
            this.$http.post(address + "/api/v1/users/login", {
              "email": this.loginUsername,
              "password": this.loginPassword
            }).then(function(response){
              this.$cookie.set('token', response.data['token'], {expires: 1, domain: 'localhost'});
              this.token = this.$cookie.get('token');
              this.$cookie.set('userId', response.data['id'], {expires: 1, domain: 'localhost'});
              $('#loginModal').modal('hide');
              $('body').removeClass('modal-open');
              $('.modal-backdrop').remove();
              window.location.href = "http://localhost:8080/auctions";
            }, function(error){
              if (error) {
                document.getElementById('loginError').innerHTML = "Invalid login";
                document.getElementById('loginError').style.display = "inline-block";
              }
            });
          } else {

          this.$http.post(address + "/api/v1/users/login", {
            "username": this.loginUsername,
            "password": this.loginPassword
          }).then(function(response){
            this.$cookie.set('token', response.data['token'], {expires: 1, domain: 'localhost'});
            this.token = this.$cookie.get('token');
            this.$cookie.set('userId', response.data['id'], {expires: 1, domain: 'localhost'});
            $('#loginModal').modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            window.location.href = "http://localhost:8080/auctions";
            }, function(error){
            if (error) {
              document.getElementById('loginError').innerHTML = "Invalid login";
              document.getElementById('loginError').style.display = "inline-block";
            }
          });
        }
        }
      },
      logoutUser: function () {
        this.$http.post(address + "/api/v1/users/logout", {}, {

          headers: {
            "X-Authorization": this.$cookie.get('token')
          }
        }).then(function(response) {
          this.$cookie.delete('token', {domain: 'localhost'});
          this.token = "";
          $('#logoutModal').modal('hide');
          $('body').removeClass('modal-open');
          $('.modal-backdrop').remove();
        }, function(error){
          if(error === 401){

          }
        });
      },
      getToken: function () {
        this.token = this.$cookie.get('token');
      },
    },
  }
</script>

<style scoped>

  body,
  html {
    width: 100%;
    height: 100%;
  }

  body {
    font-family: 'Source Sans Pro';
  }

  .btn-xl {
    padding: 1.25rem 2.5rem;
  }

  .content-section-heading h2 {
    font-size: 3rem;
  }

  .content-section-heading h3 {
    font-size: 1rem;
    text-transform: uppercase;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 700;
  }

  .map iframe {
    pointer-events: none;
  }

  .scroll-to-top i {
    font-weight: 800;
  }

  .masthead {
    min-height: 30rem;
    position: relative;
    display: table;
    width: 100%;
    height: auto;
    padding-top: 8rem;
    padding-bottom: 8rem;
    background-image: url("img/bg-masthead.jpg");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .masthead h1 {
    font-size: 4rem;
    margin: 0;
    padding: 0;
  }

  @media (min-width: 992px) {
    .masthead {
      height: 100vh;
    }

    .masthead h1 {
      font-size: 5.5rem;
    }
  }


  .btn {
    box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.1);
    font-weight: 700;
  }



</style>
