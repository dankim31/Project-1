const flickrKey = "75984158462bb7bd30c44a252e48dc5c";
const flickrSecret = "0439aa99b145fd15";
const flickrImgSize = 240;

// utility function for flickr API call, returns full query url
function retUrl(params) {
    const baseUrl = 'https://api.flickr.com/services/rest/?';
    return baseUrl + Object.keys(params).map(key => key + '=' + params[key]).join('&');
}

$("#submit-query").on("click", function (event) {
    event.preventDefault();
    const location = $("#location").val().trim();
    const budget = $("#budget").val().trim();
    console.log('submit clicked', location, budget);

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
        console.log(json.photos.photo);

        let photoArr=json.photos.photo.slice(0,3);
        photoArr.map(function (itm) {
            console.log(itm)
            sizeParams.photo_id = itm.id;
            const queryURL_size = retUrl(sizeParams);
            // const selected_size = 240;

            $.getJSON(queryURL_size, function (results) {
                // console.log(results);
                // console.log(results.sizes.size[1].source);
                const url = results.sizes.size[1].source;
                $("#img-card-body").append('<p><a href="' + url + '" target="_blank"><img src="' + url + '"/></a></p>');
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