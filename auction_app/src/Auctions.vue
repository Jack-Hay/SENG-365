<template>
  <div>
    <div v-if="errorFlag" style="color: red;">
      {{ error }}
    </div>

    <div v-if="$route.params.auctionId">
      <div class="wrapper">

        <nav class="sidebar">
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
      <div v-if="this.currentId !== $route.params.auctionId">
        {{ getSingleAuction($route.params.auctionId) }}
      </div>
      <div id="auction"  style="text-align: center" >
        <br /><br />
              <h1>{{ this.auction.title }}</h1>

        <div v-if="token === '' || token === null">
          <h5>Seller: {{this.auction.seller['username'] }}</h5>
        </div>

          <router-link class="routerLink" v-else :to="{ name: 'user', params: { userId: this.auction.seller['id'] }}">

          <h5>Seller: {{this.auction.seller['username'] }}</h5>
        </router-link>


        <div style="display: table; margin: 0 auto"> <img style="display: block;" :src="getPhoto($route.params.auctionId)" width="150" /></div>
        <button v-if="validUser === true && auction.startDateTime > Date.now()" type="button" class="btn btn-primary" v-on:click="deletePhoto($route.params.auctionId)">
          Remove Photo
        </button>
        <label hidden id="removePhoto">Can't Delete Photo</label>
        <p>{{ this.auction.description }}</p>

        <h3>Start Time: {{ new Date(this.auction.startDateTime).toString() }}</h3>
            <h3>End Time: {{ new Date(this.auction.endDateTime).toString() }}</h3>
        <h5>Starting Price: ${{ (this.auction.startingBid/100).toFixed(2) }}</h5>
          <h5>Current Bid: ${{ (this.auction.currentBid/100).toFixed(2) }}</h5>
        <h5> Bid History: </h5>

        <table style="display: table; margin: 0 auto">
          <tr style="padding:15px">
            <td style="padding:15px">Amount</td>
            <td style="padding:15px">Time</td>
            <td style="padding:15px">User</td>
          </tr>
        <tr v-for="bid in this.bids">
          <td style="padding: 5px 15px 5px 15px">${{ (bid.amount/100).toFixed(2) }}</td>
          <td>{{ new Date(bid.datetime).toString() }}</td>
          <div v-if="token === '' || token === null">
          <td>
            {{ bid.buyerUsername }}
          </td>
          </div>
          <td v-else>
            <router-link class="routerLink" :to="{ name: 'user', params: { userId: bid.buyerId }}">
              {{ bid.buyerUsername }}
            </router-link>
          </td>


        </tr>
      </table>

        {{ isValidUser(this.auction.seller['id'])}}
        <div v-if="validUser === true && this.auction.currentBid === 0">
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#editAuctionModal"
                v-on:click="setPatchAuctionFields()">
          Edit Auction</button>
        </div>

        <div class="modal" id="editAuctionModal" tabindex="-1" role="dialog" aria-labelledby="editAuctionModalLabel"
             aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="editAuctionModalLabel">Make Changes</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <div id="editAuctionForm">
                  <div id="editAuctionError" class="alert alert-danger" role="alert" style="display: none" ></div>
                  <form ref="form" enctype="multipart/form-data">
                    Title:<br>
                    <input type="text" name="auctionTitle" v-model="auctionTitle"><br>
                    Start date:<br>
                    <input type="datetime-local" name="auctionStartDate"  v-model="auctionStartDate"><br>
                    End date:<br>
                    <input type="datetime-local" name="auctionEndDate" v-model="auctionEndDate">
                    <br>
                    Description:<br>
                    <input type="text" name="auctionDescription" v-model="auctionDescription"><br>
                    Category ID:<br>
                    <select id="categoryFilterEdit" v-model="auctionCategoryId">
                      <option v-for="category in categories" :value="category.categoryId">{{ category.categoryTitle}}</option>
                    </select><br>
                    Reserve price:<br>
                    <input type="text" name="auctionReservePrice" v-model="auctionReservePrice"><br>
                    Starting price:<br>
                    <input type="text" name="auctionStartingBid" v-model="auctionStartingBid"><br>
                    Photo:
                    <input type="file" @change="photoChange" accept="image/jpeg, image/png"/>
                  </form>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">
                  Close
                </button>

                <button type="button" class="btn btn-primary" v-on:click="editAuction($route.params.auctionId)">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="this.token !== '' && this.token !== null && auction.startDateTime < Date.now()
          && auction.endDateTime > Date.now()">
          <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#placeBidModal">
            Bid</button>
        </div>

        <div class="modal" id="placeBidModal" tabindex="-1" role="dialog" aria-labelledby="placeBidModalLabel"
             aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="placeBidModalLabel">Place a bid</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <div id="bidForm">
                  <div id="bidError" class="alert alert-danger" role="alert" style="display: none" ></div>
                  <form ref="form">
                    Enter bid amount:<br>
                    <input type="text" name="bidAmount" v-model="bidAmount"><br>
                  </form>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">
                  Close
                </button>

                <button type="button" class="btn btn-primary" v-on:click="placeBid($route.params.auctionId)">
                  Make bid
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else>

      <div class="wrapper">

        <nav class="sidebar">
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

        </li>
        <li>
          <router-link v-if="this.token !== '' && this.token !== null" :to="{ name: 'user', params: { userId: this.userId }}">
            <a>View My Profile</a>
          </router-link>
        </li>
        <li>
          <router-link v-if="this.token !== '' && this.token !== null" :to="{ name: 'auctions'}">
            <a data-toggle="modal" data-target="#createAuctionModal">
              Create Auction</a>
          </router-link>
        </li>
        <router-link v-if="this.token !== '' && this.token !== null" :to="{ name: 'auctions'}">

        <li><a v-on:click="getAuctions()">View All Auctions</a></li>
        </router-link>


        <li><!-- Link with dropdown items -->
          <a href="#homeSubmenu" data-toggle="collapse" aria-expanded="false">Filtering Options</a>
          <ul class="collapse list-unstyled" id="homeSubmenu">
            <li><a v-if="this.token !== '' && this.token !== null" v-on:click="getAuctionsBidOnActive()">View Currently Bidding On</a></li>
            <li><a v-if="this.token !== '' && this.token !== null" v-on:click="getCurrentAuctions()">View My Currently Selling</a></li>
            <li><a v-if="this.token !== '' && this.token !== null" v-on:click="getItemsSold()">View My Sold Items</a></li>
            <li><a v-if="this.token !== '' && this.token !== null" v-on:click="getAuctionsCompleted()">View My Expired Auctions</a></li>
            <li><a v-if="this.token !== '' && this.token !== null" v-on:click="getAuctionsIHaveWon()">View My Won Auctions</a></li>
          </ul>
        </li>
      </ul>
      </nav>

    </div>
        <div id="filtering" v-if="showStuff === true">
          <label>Filter by category: </label>
          <select id="categoryFilter" v-model="categoryFilter" @change="getAuctions">
            <option value="">All</option>
            <option v-for="category in categories" :value="category.categoryId">{{ category.categoryTitle}}</option>
          </select>
          <label>Filter by status: </label>
          <select id="auctionFilter" v-model="auctionFilter" v-on:change="getAuctions()">
            <option v-for="type in auctionTypes" :value="type">{{ type }}</option>
          </select>
          <label>Search: </label>
            <input type="text" v-model="search" placeholder="Auction Title" @change="getAuctions">
      </div>
      <div id="nothingToShow" v-if="this.shouldShow">
        <label class="noAuctionFound">No auctions to show</label>
      </div>
      <div id="auctions">
        <div class="modal" id="createAuctionModal" tabindex="-1" role="dialog" aria-labelledby="createAuctionModalLabel"
             aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="createAuctionModalLabel">Create Auction</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <div id="createAuctionForm">
                  <div id="createAuctionError" class="alert alert-danger" role="alert" style="display: none" ></div>
                  <form ref="form" enctype="multipart/form-data">
                    Title:<br>
                    <input type="text" name="auctionTitle" v-model="auctionTitle"><br>
                    Start date:<br>
                    <input type="dateTime-local" name="auctionStartDate" v-model="auctionStartDate"><br>
                    End date:<br>
                    <input type="datetime-local" name="auctionEndDate" v-model="auctionEndDate">
                    <br>
                    Description:<br>
                    <input type="text" name="auctionDescription" v-model="auctionDescription"><br>
                    Category ID:<br>
                    <select id="categoryFilterCreate" v-model="categoryFilterCreate">
                      <option v-for="category in categories" :value="category.categoryId">{{ category.categoryTitle}}</option>
                    </select><br>
                    Reserve price:<br>
                    <input type="text" name="auctionReservePrice" v-model="auctionReservePrice"><br>
                    Starting price:<br>
                    <input type="text" name="auctionStartingBid" v-model="auctionStartingBid"><br>
                    Photo: <br>
                    <input type="file" @change="photoChangeCreate" accept="image/jpeg, image/png"/>
                  </form>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">
                  Close
                </button>

                <button type="button" class="btn btn-primary" v-on:click="submitAuction($route.params.auctionId)">
                  Submit Auction
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style="display: table; margin: 0 auto">
        <table class="u-full-width">
            <tr v-for="auction in auctions">
                  <td style="padding: 15px;"> <img :src="getPhoto(auction.id)" width="150" /></td>
                  <td style="padding: 15px;"><router-link class="routerLink" :to="{ name: 'auction', params: { auctionId: auction.id }}">
                  {{ auction.title }}</router-link></td>
            </tr>
        </table>
          <div style="align: center">
          <button v-if="this.pageCount > 1" type="button" class="btn btn-primary" v-on:click="goPrevious()">
            Previous
          </button>
          <button type="button" class="btn btn-primary" v-on:click="goNext()" v-if="!this.shouldShow">
            Next
          </button>
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
        auctions: [],
        auction: "",
        currentId: -1,
        userId: -1,
        search: "",
        categories: [],
        categoryFilter: "",
        auctionTypes: ["all", "active", "expired", "won", "upcoming"],
        auctionFilter: "all",
        token: "",
        bidAmount: "",
        auctionTitle: "",
        auctionStartDate: "",
        auctionEndDate: "",
        auctionDescription: "",
        auctionCategoryId: "",
        auctionPhoto: null,
        auctionReservePrice: 1,
        auctionStartingBid: 1,
        auctionEndDateTime: "",
        auctionStartDateTime: "",
        validUser: false,
        editPhoto: null,
        categoryFilterEdit: null,
        categoryFilterCreate: null,
        startIndex: 0,
        pageCount: 1,
        bids: [],
        auctionStatus: "",
        auctionPerson: "",
        showStuff: true,
        shouldShow: false,
      }
    },

    mounted: function () {
      this.getAuctions();
      this.getCategories();
      this.getToken();
      this.getUserId();
    },

    methods: {
      getAuctions: function () {
        this.startIndex = 0;
        this.pageCount = 1;
        this.auctionPerson = "";
        this.auctionStatus = "";
        this.showStuff = true;

        this.$http.get(address + "/api/v1/auctions?status=" + this.auctionFilter + "&startIndex="
          + this.startIndex + "&count=5&q=" + this.search + "&category-id=" + this.categoryFilter)
        .then(function (response) {
          this.auctions = response.data;
          if (this.auctions.length === 0) {
            this.shouldShow = true;
          } else {
            this.shouldShow = false;
          }
          this.currentId = -1;
        }, function (error) {
          this.error = error;
          this.errorFlag = true;
        });
      },
      getSingleAuction: function (id) {
        this.auctionPerson = "";
        this.$http.get(address + "/api/v1/auctions/" + id)
        .then(function (response) {
          this.auction = response.data;
          this.currentId = id;
          this.bids = this.auction.bids.reverse();
        }, function (error) {
          this.error = error;
          this.errorFlag = true;
        });
      },
      goNext: function () {
        this.startIndex += 5;
        if (this.auctionPerson === "bidder") {
          this.$http.get(address + "/api/v1/auctions?status=" + this.auctionStatus + "&startIndex="
            + this.startIndex + "&count=5&q=" + this.search + "&category-id=" + this.categoryFilter
            +
            "&bidder=" + this.userId)
          .then(function (response) {
            if (response.data.length > 0) {
              this.auctions = response.data;
              this.pageCount += 1;
            } else {
              this.startIndex -= 5;

            }
            this.currentId = -1;

          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
        } else if (this.auctionPerson === "seller") {
            this.$http.get(address + "/api/v1/auctions?status=" + this.auctionStatus + "&startIndex="
              + this.startIndex + "&count=5&q=" + this.search + "&category-id=" + this.categoryFilter
              + "&bidder=" + this.userId)
            .then(function (response) {
              if (response.data.length > 0) {
                this.auctions = response.data;
                this.pageCount += 1;
              } else {
                this.startIndex -= 5;

              }
              this.currentId = -1;

            }, function (error) {
              this.error = error;
              this.errorFlag = true;
            });
        } else if (this.auctionPerson === "won") {
          this.startIndex = 0;
          this.pageCount = 0;
          this.auctionPerson = "won";
          this.$http.get(address + "/api/v1/my_won_auctions",  {
            headers: {
              "X-Authorization": this.$cookie.get('token'),
            }
          })
          .then(function (response) {
            if (response.data.length > 0) {
              this.auctions = response.data;
              this.pageCount += 1;
            } else {
              this.startIndex -= 5;

            }
            this.currentId = -1;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
        } else {
        this.$http.get(address + "/api/v1/auctions?status=" + this.auctionFilter + "&startIndex="
          + this.startIndex + "&count=5&q=" + this.search + "&category-id=" + this.categoryFilter)
        .then(function (response) {
          if (response.data.length > 0) {
            this.auctions = response.data;
            this.pageCount += 1;
          } else {
            this.startIndex -= 5;

          }
          this.currentId = -1;

        }, function (error) {
          this.error = error;
          this.errorFlag = true;
        });
      }
      },
      goPrevious: function () {
        this.startIndex -= 5;

        if (this.auctionPerson === "bidder") {
          this.$http.get(address + "/api/v1/auctions?status=" + this.auctionStatus + "&startIndex="
            + this.startIndex + "&count=5&q=" + this.search + "&category-id=" + this.categoryFilter
            +
            "&bidder=" + this.userId)
          .then(function (response) {
            if (response.data.length > 0) {
              this.auctions = response.data;
              this.currentId = -1;
              this.pageCount -= 1;
            }
            this.currentId = -1;

          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
        } else if (this.auctionPerson === "seller") {
          this.$http.get(address + "/api/v1/auctions?status=" + this.auctionStatus + "&startIndex="
            + this.startIndex + "&count=5&q=" + this.search + "&category-id=" + this.categoryFilter
            + "&bidder=" + this.userId)
          .then(function (response) {
            if (response.data.length > 0) {
              this.auctions = response.data;
              this.currentId = -1;
              this.pageCount -= 1;
            }
            this.currentId = -1;

          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
        } else if (this.auctionPerson === "won") {
            this.startIndex = 0;
            this.pageCount = 0;
            this.auctionPerson = "won";
            this.$http.get(address + "/api/v1/my_won_auctions",  {
              headers: {
                "X-Authorization": this.$cookie.get('token'),
              }
            })
            .then(function (response) {
              this.auctions = response.data;
              this.currentId = -1;
              this.pageCount -= 1;
            }, function (error) {
              this.error = error;
              this.errorFlag = true;
            });
          }
         else {
            this.$http.get(address + "/api/v1/auctions?status=" + this.auctionFilter + "&startIndex="
              + this.startIndex + "&count=5&q=" + this.search + "&category-id=" + this.categoryFilter)
            .then(function (response) {
              this.auctions = response.data;
              this.currentId = -1;
              this.pageCount -= 1;

            }, function (error) {
              this.error = error;
              this.errorFlag = true;
            });
          }
      },
      getPhoto: function (id) {
        return address + "/api/v1/auctions/" + id + "/photos";
      },
      deletePhoto: function(id) {
        this.$http.delete(address + "/api/v1/auctions/" + id + "/photos",
          {
            headers: {
              "X-Authorization": this.$cookie.get('token')
           }
          }).then(function (response) {
            location.reload();
        }, function (error) {
          document.getElementById('removePhoto').style.display = "inline";

        });
      },
      getCategories: function () {
        this.$http.get(address + "/api/v1/categories")
        .then(function (response) {
          this.categories = response.data;
        }, function (error) {
          this.error = error;
          this.errorFlag = true;
        });
      },
      placeBid: function (id) {
        if (parseInt(this.bidAmount) < 999999999) {
          this.$http.post(address + "/api/v1/auctions/" + id + "/bids?amount=" + this.bidAmount*100, {},
            {
              headers: {
                "X-Authorization": this.token
              }
            }).then(function (response) {
            $('#placeBidModal').modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            document.getElementById('bidError').style.display = "none";
            this.getSingleAuction(id);
          }, function (error) {
            document.getElementById('bidError').innerHTML = "Please enter a valid bid.";
            document.getElementById('bidError').style.display = "inline-block";
          });

        } else {
          document.getElementById('bidError').innerHTML = "To much $$$.";
          document.getElementById('bidError').style.display = "inline-block";
        }
      },
      getToken: function () {
        this.token = this.$cookie.get('token');
      },

      submitAuction: function () {
        if (this.categoryFilterCreate === null || this.auctionTitle === "" || this.auctionDescription
          === ""
          || this.auctionStartDate === "" || this.auctionEndDate === "") {
          document.getElementById('createAuctionError').innerHTML = "Please enter valid details.";
          document.getElementById('createAuctionError').style.display = "inline-block";
        } else {
          this.$http.post(address + "/api/v1/auctions", JSON.stringify({
            "categoryId": parseInt(this.categoryFilterCreate),
            "title": this.auctionTitle,
            "description": this.auctionDescription,
            "startDateTime": new Date(this.auctionStartDate).getTime(),
            "endDateTime": new Date(this.auctionEndDate).getTime(),
            "reservePrice": parseInt(this.auctionReservePrice*100),
            "startingBid": parseInt(this.auctionStartingBid*100),
          }), {
            headers: {
              "X-Authorization": this.token,
            }
          }).then(function (response) {
            if (this.auctionPhoto !== null) {
              this.$http.post(
                'http://localhost:4941/api/v1/auctions/' + response.data.id + '/photos',
                this.auctionPhoto,
                {
                  headers: {
                    "X-Authorization": this.token,
                    "Content-Type": "image/jpeg"
                  }
                }).then(response => {
                // get body data
                console.log("success");
                $('#createAuctionModal').modal('hide');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
              }, response => {
                // error callback
                console.log("error");
                document.getElementById('createAuctionError').style.display = "none";

              });
              this.getAuctions();

            } else {
              $('#createAuctionModal').modal('hide');
              $('body').removeClass('modal-open');
              $('.modal-backdrop').remove();
              document.getElementById('createAuctionError').style.display = "none";
              this.getAuctions();
            }
          }, function (error) {
            document.getElementById('createAuctionError').innerHTML = "Please enter valid details.";
            document.getElementById('createAuctionError').style.display = "inline-block";
          });
        }
      },
      photoChange: function(event) {
          //this.auctionPhoto = reader.readAsDataURL(event.target.files[0]);
        console.log("Saving photo to this.auctionPhoto");
        this.editPhoto = event.target.files[0];
        },
      photoChangeCreate: function(event) {
        //this.auctionPhoto = reader.readAsDataURL(event.target.files[0]);
        console.log("Saving photo to this.auctionPhoto");
        this.auctionPhoto = event.target.files[0];
      },
        isValidUser: function(id) {
          this.$http.get(address + "/api/v1/users/" + id, {headers: {
            "X-Authorization": this.token
          }}).then(function(result){
            if(result.data.email === undefined){
              this.validUser = false;
            } else {
              this.validUser = true;
            }
          }, function(error){
            this.validUser = false;
          });
        },
      editAuction: function(id) {
        if (this.categoryFilterEdit === "" || this.auctionTitle === "" || this.auctionDescription
          === ""
          || this.auctionStartDate === "" || this.auctionEndDate === "") {
          document.getElementById('editAuctionError').innerHTML = "Please enter valid details.";
          document.getElementById('editAuctionError').style.display = "inline-block";
        } else {
          this.$http.patch(address + "/api/v1/auctions/" + id, {
            "categoryId": parseInt(this.auctionCategoryId),
            "title": this.auctionTitle,
            "description": this.auctionDescription,
            "startDateTime": new Date(this.auctionStartDate).getTime(),
            "endDateTime": new Date(this.auctionEndDate).getTime(),
            "reservePrice": parseInt(this.auctionReservePrice*100),
            "startingBid": parseInt(this.auctionStartingBid*100),
          }, {
            headers: {
              "X-Authorization": this.token,
            }
          }).then(function (response) {

              if (this.editPhoto !== null) {
                this.$http.post(
                  'http://localhost:4941/api/v1/auctions/' + id + '/photos',
                  this.editPhoto,
                  {
                    headers: {
                      "X-Authorization": this.token,
                      "Content-Type": "image/jpeg"
                    }
                  }).then(response => {
                  // get body data
                  $('#editAuctionModal').modal('hide');
                  $('body').removeClass('modal-open');
                  $('.modal-backdrop').remove();
                  document.getElementById('editAuctionError').style.display = "none";
                }, response => {
                  // error callback
                  document.getElementById('createAuctionError').style.display = "none";
                  document.getElementById(
                    'editAuctionError').innerHTML = "Please enter valid details.";
                  document.getElementById('editAuctionError').style.display = "inline-block";
                });
              }
              location.reload();
            }, function (error) {
            document.getElementById('editAuctionError').innerHTML = "Please enter valid details.";
            document.getElementById('editAuctionError').style.display = "inline-block";
          });
        }
      },
      setPatchAuctionFields: function() {
        this.auctionDescription = this.auction.description;
        this.auctionTitle = this.auction.title;
        this.auctionStartingBid = this.auction.startingBid/100;
        this.auctionReservePrice = this.auction.reservePrice/100;
        this.auctionCategoryId = this.auction.categoryId;
        this.auctionStartDate = (new Date(this.auction.startDateTime).getFullYear()) + '-'
          + String("0" + (new Date(this.auction.startDateTime).getMonth() + 1)).slice(-2) + '-'
          + String("0" +(new Date(this.auction.startDateTime).getDate())).slice(-2) + 'T'
          + String("0" +(new Date(this.auction.startDateTime).getHours())).slice(-2) + ':'
          + String("0" +(new Date(this.auction.startDateTime).getMinutes())).slice(-2);
        this.auctionEndDate = (new Date(this.auction.endDateTime).getFullYear()) + '-'
          + String("0" + (new Date(this.auction.startDateTime).getMonth() + 1)).slice(-2) + '-'
          + String("0" +(new Date(this.auction.startDateTime).getDate())).slice(-2) + 'T'
          + String("0" +(new Date(this.auction.startDateTime).getHours())).slice(-2) + ':'
          + String("0" +(new Date(this.auction.startDateTime).getMinutes())).slice(-2);
      },
      getAuctionsBidOnActive: function() {
        this.showStuff = false;

        this.startIndex = 0;
        this.pageCount = 0;
        this.auctionStatus = "active";
        this.auctionPerson = "bidder";
        this.$http.get(address + "/api/v1/auctions?bidder=" + this.userId + "&status=active")
        .then(function (response) {
          this.auctions = response.data;
          if (this.auctions.length === 0) {
            this.shouldShow = true;
          } else {
            this.shouldShow = false;
          }
        }, function (error) {
          this.error = error;
          this.errorFlag = true;
        });
      },
      getCurrentAuctions: function() {
        this.showStuff = false;

        this.startIndex = 0;
        this.pageCount = 0;
        this.auctionStatus = "active";
        this.auctionPerson = "seller";
        this.$http.get(address + "/api/v1/auctions?seller=" + this.userId + "&status=active")
        .then(function (response) {
          this.auctions = response.data;
          if (this.auctions.length === 0) {
            this.shouldShow = true;
          } else {
            this.shouldShow = false;
          }
        }, function (error) {
          this.error = error;
          this.errorFlag = true;
        });
      },
      getItemsSold: function() {
        this.showStuff = false;

        this.startIndex = 0;
        this.pageCount = 0;
        this.auctionStatus = "won";
        this.auctionPerson = "seller";
        this.$http.get(address + "/api/v1/auctions?seller=" + this.userId + "&status=won")
        .then(function (response) {
          this.auctions = response.data;
          if (this.auctions.length === 0) {
            this.shouldShow = true;
          } else {
            this.shouldShow = false;
          }
        }, function (error) {
          this.error = error;
          this.errorFlag = true;
        });
      },

      getAuctionsCompleted: function() {
        this.showStuff = false;

        this.startIndex = 0;
        this.pageCount = 0;
        this.auctionStatus = "expired";
        this.auctionPerson = "seller";
        this.$http.get(address + "/api/v1/auctions?seller=" + this.userId + "&status=expired")
        .then(function (response) {
          this.auctions = response.data;
          if (this.auctions.length === 0) {
            this.shouldShow = true;
          } else {
            this.shouldShow = false;
          }
        }, function (error) {
          this.error = error;
          this.errorFlag = true;
        });
      },
      getUserId: function() {
        this.userId = this.$cookie.get('userId');
      },
      getAuctionsIHaveWon: function() {
        this.showStuff = false;

        this.startIndex = 0;
        this.pageCount = 0;
        this.auctionPerson = "won";
        this.$http.get(address + "/api/v1/my_won_auctions",  {
        headers: {
          "X-Authorization": this.$cookie.get('token'),
        }
        })
        .then(function (response) {
          this.auctions = response.data;
          if (this.auctions.length === 0) {
            this.shouldShow = true;
          } else {
            this.shouldShow = false;
          }
        }, function (error) {
          this.error = error;
          this.errorFlag = true;
        });
      }
      }
  }
</script>

<style scoped>
  .routerLink {
    color: #005cbf;
    text-decoration: none;
    transition: all 0.3s;
    padding: 10px;
  }

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

  .sidebar {
    min-width: 250px;
    max-width: 250px;
    min-height: 100vh;    background: #7386D5;
    color: #fff;
    transition: all 0.3s;
  }

  .sidebar .sidebar-header {
    padding: 20px;
    background: #6d7fcc;
  }

  .sidebar ul.components {
    padding: 20px 0;
    border-bottom: 1px solid #47748b;
    display: block;

  }

  .sidebar ul p {
    color: #fff;
    padding: 10px;
    display: block;

  }

  .sidebar ul li a {
    padding: 10px;
    font-size: 1.1em;
    display: block;
  }

  .sidebar ul li a:hover {
    color: #7386D5;
    background: #fff;
  }

  .sidebar ul li.active > a, a[aria-expanded="true"] {
    color: #fff;
    background: #6d7fcc;

  }
  ul ul a {
    font-size: 0.9em !important;
    padding-left: 30px !important;
    background: #6d7fcc;
  }

  .noAuctionFound{
    font-size: 70px;
    /*-webkit-box-sizing: content-box;*/
    /*-moz-box-sizing: content-box;*/
    /*box-sizing: content-box;*/
    /*cursor: pointer;*/
    /*border: none;*/
    /*color: rgba(0, 0, 0, 0);*/
    /*text-align: center;*/
    /*-o-text-overflow: clip;*/
    /*text-overflow: clip;*/
    /*text-shadow: 3px 0 0 rgb(217,31,38) , 6px 0 0 rgb(226,91,14) , 9px 0 0 rgb(245,221,8) , 12px 0 0 rgb(5,148,68) , 15px 0 0 rgb(2,135,206) , 18px 0 0 rgb(4,77,145) , 21px 0 0 rgb(42,21,113) ;*/
    /*-webkit-transition: all 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55);*/
    /*-moz-transition: all 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55);*/
    /*-o-transition: all 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55);*/
    /*transition: all 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55);*/
    -webkit-animation-name: test;
    -webkit-animation-duration: 1.5s;
    -webkit-animation-iteration-count: infinite;
    margin-left: 10%;
    margin-top: 20%;

  }

  #nothingToShow {
    width: 100%;
  }

  @keyframes test {
    from {-webkit-transform: rotateZ(0deg)}
    to { -webkit-transform: rotateZ(360deg)}
    0%   {color: red;}
    25%  {color: yellow;}
    50%  {color: blue;}
    100% {color: green;}
  }


</style>
