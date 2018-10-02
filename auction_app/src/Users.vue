<template>
  <div>
    <div v-if="$route.params.userId">
          <div class="wrapper">
            <nav id="sidebar">
              <!-- Sidebar Header -->
              <div class="sidebar-header">
                <h3>Auctionator 3000</h3>
              </div>

              <!-- Sidebar Links -->
              <ul class="list-unstyled components">
                <li>
                  <router-link :to="{ name: 'home'}">
                    <a>View Login/Logout Screen</a>
                  </router-link>

                  <router-link :to="{ name: 'auctions'}">
                    <a>View Auctions</a>
                  </router-link>
                </li>
              </ul>
            </nav>

          </div>

          <h3 style="text-align: center">Username: {{ this.user.username }}</h3>
          <h4 style="text-align: center">Given Name: {{ this.user.givenName }}</h4>
          <h4 style="text-align: center">Family Name: {{ this.user.familyName }}</h4>
          <h4 style="text-align: center" v-if="this.validUser">Email: {{ this.user.email }}</h4>
          <h4 style="text-align: center" v-if="this.validUser">Account Balance: {{ this.user.accountBalance }}</h4>
        <div>
          <button style="margin:auto; display:block;" v-if="this.validUser" type="button" class="btn btn-primary" data-toggle="modal" data-target="#editUserModal"
                  v-on:click="setPatchUserFields()">
           Edit Account</button>
          </div>

          <div class="modal" id="editUserModal" tabindex="-1" role="dialog" aria-labelledby="editUserModalLabel"
               aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="editUserModalLabel">Make Changes</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <div id="editUserForm">
                    <div id="editUserError" class="alert alert-danger" role="alert" style="display: none" ></div>
                    <form ref="form" enctype="multipart/form-data">
                      Given Name:<br>
                      <input type="text" name="givenName" v-model="givenName"><br>
                      Family Name:<br>
                      <input type="text" name="familyName" v-model="familyName"><br>
                    </form>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">
                    Close
                  </button>

                  <button type="button" class="btn btn-primary" v-on:click="editUser()">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
    </div>
  </div>

</template>

<script>
  const address = "http://localhost:4941";

  export default {

    data() {
      return {
        error: "",
        errorFlag: false,
        currentId: this.$route.params.userId,
        userId: -1,
        token: "",
        validUser: false,
        user: [],
        familyName: "",
        givenName: "",
      }
    },

    mounted: function () {
      this.getUserId();
      this.setPatchUserFields();
      this.getUser(this.currentId);
      this.isValidUser(this.currentId);
    },

    methods: {
      isValidUser: function() {

      },
      getUserId: function() {
        this.userId = this.$cookie.get('userId');
      },
      getUser: function(id) {
        this.$http.get(address + "/api/v1/users/" + id, {headers: {
            "X-Authorization": this.$cookie.get('token')
          }}).then(function(result){
          this.user = result.data;
          if (this.currentId == this.userId) {
            this.validUser = true;
          } else {
            this.validUser = false;
          }
        }, function(error){
          this.validUser = false;
        });
      },
      editUser: function() {
        this.$http.patch(address + "/api/v1/users/" + this.$cookie.get('userId'), {
          "givenName": this.givenName,
          "familyName": this.familyName,
        }, {headers: {
            "X-Authorization": this.$cookie.get('token')
          }}).then(function(result){
          this.getUser(this.currentId);

          $('#editUserModal').modal('hide');
          $('.modal-backdrop').remove();

        }, function(error){
        });
      },
      setPatchUserFields: function() {
        this.familyName = this.user.familyName;
        this.givenName = this.user.givenName;
      },
    }
  }
</script>

<style scoped>

  body {
    font-family: 'Poppins', sans-serif;
    background: #fafafa;
  }

  p {
    font-family: 'Poppins', sans-serif;
    font-size: 1.1em;
    font-weight: 300;
    line-height: 1.7em;
    color: #999;

  }

  a, a:hover, a:focus {
    color: inherit;
    text-decoration: none;
    transition: all 0.3s;
    padding: 10px;

  }

  .wrapper {
    display: flex;
    align-items: stretch;
    float: left;
  }

  #sidebar {
    min-width: 250px;
    max-width: 250px;
    min-height: 100vh;    background: #7386D5;
    color: #fff;
    transition: all 0.3s;
  }

  #sidebar .sidebar-header {
    padding: 20px;
    background: #6d7fcc;
  }

  #sidebar ul.components {
    padding: 20px 0;
    border-bottom: 1px solid #47748b;
    display: block;

  }

  #sidebar ul p {
    color: #fff;
    padding: 10px;
    display: block;

  }

  #sidebar ul li a {
    padding: 10px;
    font-size: 1.1em;
    display: block;
  }

  #sidebar ul li a:hover {
    color: #7386D5;
    background: #fff;
  }

  #sidebar ul li.active > a, a[aria-expanded="true"] {
    color: #fff;
    background: #6d7fcc;

  }
  ul ul a {
    font-size: 0.9em !important;
    padding-left: 30px !important;
    background: #6d7fcc;
  }

</style>
