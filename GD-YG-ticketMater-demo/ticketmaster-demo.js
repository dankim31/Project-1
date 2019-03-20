// $(document).ready(function () {

// ticket master api call setup
const ticketmasterKey = "61OGUmlj7VACAPXGP45VdTLRzFc9XNrx";
const ticketmasterSecret = "esQ3Y2ZKbui9qBeW";

// added card function so event section has a card generated //
// used same function in other feature branches so card generates the same //
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

// utility function for Ticket Master API call, returns full query url
function retTicketMasterUrl(params) {
    const baseUrl = "https://app.ticketmaster.com/discovery/v2/events.json?";
    return baseUrl + Object.keys(params).map(key => key + '=' + params[key]).join('&');
}

// function for pulling ajax request from user input //
$("#button").on("click", function () {
    const searchTerm = $('#userText').val();

    const params = {
        keyword: searchTerm,
        size: 10,
        api_key: ticketmasterKey
    };

    const queryUrl = retTicketMasterUrl(params);
    console.log(queryUrl);

    const response =
        $.ajax({
            type: "GET",
            url: "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + searchTerm + "&size=10&apikey=61OGUmlj7VACAPXGP45VdTLRzFc9XNrx",
            async: true,
            dataType: "json",
            success: function (json) {
                console.log(json);
                const events = json._embedded.events;
                const event = events[0];
                console.log(event);

                const rowTix = setupCard('tm-card', "What's happening");
                rowTix.appendTo($("#results"));
                
                // // one card per event
                // const eventCard = $("<div>")
                //     .addClass("card")
                //     .attr("id", "event-card");

                $('<p><a href="' + event.url + '" target="_blank">' + event.name + '</a></p>')
                    .appendTo($("#tm-card .card-body"));
                // console.log(events[0].outlets[0].url);
                // console.log(events[0].url);

                $("<img>")
                    .addClass("ticketmaster-img")
                    .attr("src", event.images[1].url) // note image size selection here
                    .appendTo("#tm-card .card-body");

                const genre = event.classifications[0].genre.name + ' - ' +
                    event.classifications[0].segment.name + ' - ' +
                    event.classifications[0].subGenre.name;
                $("<p>")
                    .text("What: " + genre)
                    .appendTo($("#tm-card .card-body"));

                const date_time = event.dates.start.localDate + ' ' +
                    event.dates.start.localTime;
                $("<p>")
                    .text("When: " + date_time)
                    .appendTo($("#tm-card .card-body"));
            },
            error: function (xhr, status, err) { }
        });

    // $.getJSON(url,function(json){
    //     console.log(json);
    //     const events = json._embedded.events;
    //     console.log(events[0]);

    //     let temp = $("<div>");
    //     temp.text(events[0].name);
    //     $("body").append(temp);
    // });


    // $.ajax({
    //     type:"GET",
    //     url:"https://app.ticketmaster.com/discovery/v2/events/k7vGFKzleBdwS/images.json?keyword=" + searchTerm + "&size=1&apikey=61OGUmlj7VACAPXGP45VdTLRzFc9XNrx",
    //     async:true,
    //     dataType: "json",
    //     success: function(json) {
    //                 console.log(json);
    //                 // Parse the response.
    //                 // Do other things.
    //              },
    //     error: function(xhr, status, err) {
    //                 // This time, we do not end up here!
    //              }
    //   });

});
// });

// const data=response.responseJSON;
// console.log(data._embedded.events);
// console.log(response.responseJSON.page);

/* API Documentation Links
https://developer.ticketmaster.com/products-and-docs/apis/getting-started/
https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/#anchor_find
https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/#search-events-v2
*/