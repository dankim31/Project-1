let flickrKey="75984158462bb7bd30c44a252e48dc5c"
let flickrSecret="0439aa99b145fd15"
console.log(flickrKey);

var selected_size = 240;

/*
'flickr.photos.getSizes'
*/
var params={
    method:'flickr.photos.getRecent',
    api_key:flickrKey,
    per_page:'10',
    format:'json',
    nojsoncallback:'1'
};
var baseURL='https://api.flickr.com/services/rest/?';
var queryURL=baseURL+Object.keys(params).map(key=>key+'='+params[key]).join('&');

var searchParams={
    method:'flickr.photos.search',
    api_key:flickrKey,
    lat:40.7127,
    lon:-74.0059,
    per_page:'10',
    format:'json',
    nojsoncallback:'1'
};
var queryURL=baseURL+Object.keys(searchParams).map(key=>key+'='+searchParams[key]).join('&');

// "https://api.flickr.com/services/rest/?
// method=flickr.photos.getSizes
// &api_key=ca370d51a054836007519a00ff4ce59e
// &photo_id=" + myresult.id + "
// &format=json
// &nojsoncallback=1";

$(document).ready(function () {
    $('#button').click(function () {
        $.getJSON(queryURL, function (json) {
            $.each(json.photos.photo, function (i, result) {
                let params={
                    method:'flickr.photos.getSizes',
                    api_key:flickrKey,
                    photo_id:result.id,
                    format:'json',
                    nojsoncallback:'1'
                };
                const queryURL_size=baseURL+Object.keys(params).map(key=>key+'='+params[key]).join('&');
                $.getJSON(queryURL_size, function (size){
                    console.log(size);

                    $.each(size.sizes.size, function (i, myresult_size) {
                        if (myresult_size.width == selected_size) {
                            const tmp=
                            $("#results").append('<p><a href="' + myresult_size.url + '" target="_blank"><img src="' + myresult_size.source + '"/></a></p>');
                        }
                    })
                })
            });
        });
    });
});

'https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=ca370d51a054836007519a00ff4ce59e&photo_id="+myresult.id+"&format=json&nojsoncallback=1'