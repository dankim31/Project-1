const flickrKey = "75984158462bb7bd30c44a252e48dc5c";
const flickrSecret = "0439aa99b145fd15";
const flickrImgSize = 240;

// utility function for flickr API call, returns full query url
function retUrl(params) {
    const baseUrl = 'https://api.flickr.com/services/rest/?';
    return baseUrl + Object.keys(params).map(key => key + '=' + params[key]).join('&');
}

function setupCard(cardID, hdrTxt) {
    let rowDiv = $("<div>");
    rowDiv.addClass("row");

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
    cardBody.appendTo(cardDiv);
    return rowDiv;
}

$("#submit-query").on("click", function (event) {
    event.preventDefault();
    const location = $("#location").val().trim();
    const budget = $("#budget").val().trim();
    console.log('submit clicked', location, budget);

    let imgCard = setupCard("flickr-card", "snapshots");
    imgCard.appendTo($(".container"));

    let params = {
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
        console.log(json);
        let sizeParams = {
            method: 'flickr.photos.getSizes',
            api_key: flickrKey,
            photo_id: '',
            per_page: '20',
            format: 'json',
            nojsoncallback: '1'
        };
        let photoArr = json.photos.photo;
        console.log(photoArr.length);

        photoArr.slice(5, 10).map(function (itm) {
            console.log(itm)
            sizeParams.photo_id = itm.id;
            const queryURL_size = retUrl(sizeParams);
            // const selected_size = 240;

            $.getJSON(queryURL_size, function (results) {
                // console.log(results);
                // console.log(results.sizes.size[1].source);
                const url = results.sizes.size[1].source; // this line selects the image size
                let div = $("<div>");
                div.addClass("img-holder");
                // div.attr("id","img-holder");
                let img = $("<img>");
                img.addClass("flickr-img");
                img.attr("src", url);
                div.append(img);
                // img.appendTo($("#img-holder"));
                div.appendTo($("#flickr-card .card-body"));
                // $("#img-card-body").append('<p><a href="' + url + '" target="_blank"><img src="' + url + '"/></a></p>');
            });
        });
    });

})

// $(document).ready(function() {
//     console.log('hello');

//     // function for user interaction in search bar //

//     // function for button when interacting with search button //

//     // function for ajax call to currency api //

//     // function for ajax call to image api //

//     // function for ajax call to yelp api //
// });