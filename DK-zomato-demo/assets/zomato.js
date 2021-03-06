class ZOMATO {
    constructor() {
        this.api = "8752afbbc3a9e1f17b88f62184d399b0";
        this.header = {
            method: 'GET',
            headers: {
                'user-key': this.api,
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        };
    }
    async searchAPI(city, categoryID) {
        //category url
        const categoryURL = 'https://developers.zomato.com/api/v2.1/categories';
        // city url
        const cityURL = `https://developers.zomato.com/api/v2.1/cities?q=${city}`
        //category data
        const categoryInfo = await fetch(categoryURL, this.header);
        const categoryJSON = await categoryInfo.json();
        const categories = await categoryJSON.categories;

        //search city

        const cityInfo = await fetch(cityURL, this.header);
        // console.log(cityInfo);
        const cityJSON = await cityInfo.json();
        // console.log(cityJSON);
        const cityLocation = await cityJSON.location_suggestions;
        // console.log(cityLocation);

        let cityID = 0;

        if (cityLocation.length > 0) {
            cityID = await cityLocation[0].id
        }
        // console.log(cityID);

        // search restaurant 
        const restaurantURL = `https://developers.zomato.com/api/v2.1/search?entity_id=${cityID}&entity_type=city&category=${categoryID}&sort=rating`;
        const restaurantInfo = await fetch(restaurantURL, this.header)
        const restaurantJSON = await restaurantInfo.json();
        const restaurants = await restaurantJSON.restaurants;
        // console.log(restaurants);

        return {
            categories,
            cityID,
            restaurants
        };
    }
}

class UI {
    constructor() {
        this.restaurantList = document.getElementById('restaurant-list');
    }
    addSelectOptions(categories) {
        const search = document.getElementById('searchCategory');
        let output = `<option value='0' selected>select category</option>`;
        categories.forEach(category => {
            output += `<option value="${category.categories.id}">${category.categories.name}
        </option>`
        })
        search.innerHTML = output;
        console.log(output);
    }
    showFeedback(text) {
        const feedback = document.querySelector('.feedback');
        feedback.classList.add('showItem');
        feedback.innerHTML = `<p>$(text)</p>`;
        setTimeout(() => {
            feedback.classList.remove('showItem');
        }, 3000);
    }
    getRestaurants(restaurants) {
        if (restaurants.length === 0) {
            this.showFeedback(`no such categories exist in the selected city`)
        }
        else {
            this.restaurantList.innerHTML = '';
            restaurants.forEach((restaurant) => {
                const { thumb: img, name, location: { address }, user_rating: { aggregate_rating }, cuisines, average_cost_for_two: cost, menu_url, url } =
                    restaurant.restaurant;
                if (img !== '') {
                    this.showRestaurant(img, name, address, aggregate_rating, cuisines, cost, menu_url, url)
                }
            })
        }
    }
    showRestaurant(img, name, address, aggregate_rating, cuisines, cost, menu_url, url) {
        const div = document.createElement('div');
        div.classList.add('col-11', 'mx-auto', 'my-3', 'col-md-4');

        div.innerHTML = `<div class="card">
        <div class="card">
         <div class="row p-3">
          <div class="col-5">
          <img src="${img}" class="img-fluid img-thumbnail" alt="">  
          </div>
          <div class="col-5 text-capitalize">
           <h6 class="text-uppercase pt-2 redText">${name}</h6>
           <p>${address}</p>
          </div>
          <div class="col-1">
           <div class="badge badge-success">
            ${aggregate_rating}
           </div>
          </div>
         </div>
         <hr>
         <div class="row py-3 ml-1">
          <div class="col-5 text-uppercase ">
           <p>cousines :</p>
           <p>cost for two :</p>
          </div>
          <div class="col-7 text-uppercase">
           <p>${cuisines}</p>
           <p>${cost}</p>
          </div>
         </div>
         <hr>
         <div class="row text-center no-gutters pb-3">
          <div class="col-6">
           <a href="${menu_url}" target="_blank" class="btn redBtn  text-uppercase"><i class="fas fa-book"></i> menu</a>
          </div>
          <div class="col-6">
           <a href="${url}" target="_blank" class="btn redBtn  text-uppercase"><i class="fas fa-book"></i> website</a>
          </div>
         </div>
        </div>`;
        this.restaurantList.appendChild(div);
    }
    showSnapshot(restaurants) {
        // do the aggregation in this function, adapt the html template from the function above.
        console.log("showSnapshot called");
        console.log(restaurants);
        const costArr = restaurants.map(item => {
            const costItm = item.restaurant.average_cost_for_two;
            // console.log(costItm);
            return costItm;
        });
        console.log(costArr);
        let costAvg = costArr.reduce((total, itm) => { return total + itm }, 0);
        costAvg /= costArr.length;
        console.log(costAvg);

        let cuisineArr = restaurants.map(item => {
            return item.restaurant.cuisines;
        });
        console.log(cuisineArr);

        const div = document.createElement('div');
        div.classList.add('col-11', 'mx-auto', 'my-3', 'col-md-4');

        div.innerHTML = `<div class="card">
        <div class="card">
         <div class="row p-3">
          <div class="col-10 text-capitalize">
           <h6 class="text-uppercase pt-2 redText">Average $$ of a two-people meal</h6>
           <p>${costAvg}</p>
          </div>
         </div>
         <div class="row text-center no-gutters pb-3">
          <div class="col-10">
           <a href="${costArr}" target="_blank" class="btn redBtn  text-uppercase"><i class="fas fa-book"></i> show more results </a>
          </div>
         </div>
        </div>`;
        this.restaurantList.appendChild(div);
    }
}
(function () {
    // console.log('zomato.js running') // check if loaded correctly
    const searchForm = document.getElementById('searchForm');
    const searchCity = document.getElementById('searchCity');
    // const searchCategory = document.getElementById('searchCategory');

    const zomato = new ZOMATO();
    const ui = new UI();

    //sumbit form
    searchForm.addEventListener('submit', event => {
        event.preventDefault();

        const city = searchCity.value.toLowerCase();
        // const categoryID = parseInt(searchCategory.value);
        const categoryID = 9; // lunch

        if (city === '' || categoryID === 0) {
            ui.showFeedback('please enter a city and select category');
        } else {
            //logic goes here
            zomato.searchAPI(city).then(cityData => {
                if (cityData.cityID === 0) {
                    ui.showFeedback('please enter a valid city!')
                }
                else {
                    zomato.searchAPI(city, categoryID).then(data => {
                        // ui.showSnapshot(data.restaurants);
                        // console.log(data.restaurants.splice(0,3));
                        ui.getRestaurants(data.restaurants.splice(0, 3));
                    });
                }
            });
        };
    });
})();