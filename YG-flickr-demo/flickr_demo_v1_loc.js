let flickrKey = "75984158462bb7bd30c44a252e48dc5c"
let flickrSecret = "0439aa99b145fd15"
console.log(flickrKey);

var selected_size = 240;

/*
'flickr.photos.getSizes'
*/
// var params = {
//     method: 'flickr.photos.search',
//     api_key: flickrKey,
//     lat: 40.7128,
//     lon: -74.0059,
//     privacy_filter:4,
//     accuracy: 11,
//     content_type:1,
//     in_gallery:true,
//     extras:"geo",
//     extras:"tags",
//     per_page: '100',
//     format: 'json',
//     nojsoncallback: '1'
// };

// API call signature deduced from web based search query
// https://www.flickr.com/search/?license=4%2C5%2C9%2C10&media=photos&sort=interestingness-desc&tags=new%20york&advanced=1&styles=blackandwhite
var params = {
    method: 'flickr.photos.search',
    api_key: flickrKey,
    media: "photos",
    sort: "interestingness-desc",
    tags: "seoul",
    advanced: 1,
    styles:"blackandwhite",
    in_gallery:true,
    extras:"tags",
    per_page: '100',
    format: 'json',
    nojsoncallback: '1'
};
var baseURL = 'https://api.flickr.com/services/rest/?';

function retUrl(params) {
    const baseUrl = 'https://api.flickr.com/services/rest/?';
    return baseUrl + Object.keys(params).map(key => key + '=' + params[key]).join('&');
}

$(document).ready(function () {
    $('#button').click(function () {
        const queryURL=retUrl(params);
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
            json.photos.photo.map(function (itm) {
                console.log(itm)
                sizeParams.photo_id = itm.id;
                const queryURL_size = retUrl(sizeParams);
                // const selected_size = 240;

                $.getJSON(queryURL_size, function (results) {
                    // console.log(results);
                    // console.log(results.sizes.size[1].source);
                    const url=results.sizes.size[1].source;
                    $("#results").append('<p><a href="' +url+ '" target="_blank"><img src="' + url + '"/></a></p>');
                });
            });
        });
    });
});
