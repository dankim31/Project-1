// ---- flickr setup start ----
const flickrKey = "75984158462bb7bd30c44a252e48dc5c";
const flickrSecret = "0439aa99b145fd15";
const flickrImgSize = 240;
// ---- flickr setup end ----

// ---- zomato setup start ----
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

// ---- zomato setup end ----


// utility function for flickr API call, returns full query url
function retUrl(params) {
    const baseUrl = 'https://api.flickr.com/services/rest/?';
    return baseUrl + Object.keys(params).map(key => key + '=' + params[key]).join('&');
}

function setupCard(cardID, hdrTxt) {
    let rowDiv = $("<div>");
    rowDiv.addClass("row");
    rowDiv.attr("id", "row-" + cardID);

    let colDiv = $("<div>");
    colDiv.addClass("col-lg-12");
    colDiv.appendTo(rowDiv);

    let cardDiv = $("<div>");
    cardDiv.addClass("card card-default");
    cardDiv.attr("id", cardID);
    cardDiv.appendTo(colDiv);

    let cardHdr = $("<div>");
    cardHdr.addClass("card-header");
    cardHdr.text(hdrTxt);
    cardHdr.appendTo(cardDiv);

    let cardBody = $("<div>");
    cardBody.addClass("card-body");
    cardBody.attr({
        display: "flex",
        'flex-direction': "row",
        'flex-wrap': "wrap",
        'justify-content': 'space-evenly',
        'align-items': 'center'
    });
    cardBody.appendTo(cardDiv);
    return rowDiv;
}

function genCardFlickr(location) {
    // setup html section for flickr output, cardID and headerText
    $("#row-flickr-card").remove(); // clear whole row of flickr if it exists.
    let imgCard = setupCard("flickr-card", "Glimpse");
    imgCard.appendTo($(".container"));

    // API call to flickr to search images
    const params = {
        method: 'flickr.photos.search',
        api_key: flickrKey,
        media: "photos",
        sort: "interestingness-desc",
        tags: location,
        advanced: 1,
        styles: "blackandwhite",
        in_gallery: true,
        extras: "tags",
        per_page: '100',
        format: 'json',
        nojsoncallback: '1'
    };
    const queryURL = retUrl(params);
    console.log(queryURL);
    $.getJSON(queryURL, function (json) {
        // console.log(json);
        let photoArr = json.photos.photo;
        // console.log(photoArr); // array of object, length 100

        const lst = [0, 5, 10, 15];
        const idx = lst.map(function (itm) { return Math.floor(Math.random() * 5) + itm });
        idx.forEach(function (ind) {
            itm = photoArr[ind];
            const sizeParams = {
                method: 'flickr.photos.getSizes',
                api_key: flickrKey,
                photo_id: itm.id,
                per_page: '20',
                format: 'json',
                nojsoncallback: '1'
            };
            // sizeParams.photo_id = itm.id;
            const queryURL_size = retUrl(sizeParams);
            // const selected_size = 240;
            $.getJSON(queryURL_size, function (results) {
                // this line selects the image size
                const url = results.sizes.size[1].source;
                let img = $("<img>");
                img.addClass("flickr-img");
                img.attr("src", url);
                img.appendTo("#flickr-card .card-body");
            });
        });
    });
}

function genCardZomato(location) {
    $("#row-zomato-card").remove(); // clear whole row of flickr if it exists.
    let imgCard = setupCard("zomato-card", "Eatery");
    imgCard.appendTo($(".container"));

    const zomato = new ZOMATO();
    const ui = new UI();

    const city = location.toLowerCase();
    const categoryID = 9; // lunch

    $("#zomato-card .card-body").text(location);
    
}

$("#submit-query").on("click", function (event) {
    // init setup, get user input
    event.preventDefault();
    const location = $("#location").val().trim();
    const budget = $("#budget").val().trim();
    console.log('submit clicked', location, budget);

    genCardFlickr(location);
    genCardZomato(location);

});



/* code dump - flickr
photoArr.slice(1, 5).map(function (itm) {
console.log(itm)
const sizeParams = {
method: 'flickr.photos.getSizes',
api_key: flickrKey,
photo_id: itm.id,
per_page: '20',
format: 'json',
nojsoncallback: '1'
};
// sizeParams.photo_id = itm.id;
const queryURL_size = retUrl(sizeParams);
// const selected_size = 240;
$.getJSON(queryURL_size, function (results) {
// console.log(results);
// console.log(results.sizes.size[1].source);
const url = results.sizes.size[1].source; // this line selects the image size

// let div = $("<div>");
// div.addClass("img-holder");

// div.attr("id","img-holder");
let img = $("<img>");
img.addClass("flickr-img");
img.attr("src", url);
img.appendTo("#flickr-card .card-body");

// div.append(img);
// img.appendTo($("#img-holder"));
// div.appendTo($("#flickr-card .card-body"));
// $("#img-card-body").append('<p><a href="' + url + '" target="_blank"><img src="' + url + '"/></a></p>');
});
*/