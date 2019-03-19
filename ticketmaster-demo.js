$(document).ready(function() {
    
    // added card function so event section has a card generated //
    // used same function in other feature branches so card generates the same //
    function setupCard(cardID, hdrTxt) {
        let rowDiv = $("<div>");
        rowDiv.addClass("row");
        rowDiv.attr("id","row-"+cardID);
    
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

    // function for pulling ajax request from user input //

    $("#button").on("click", function() {
        const searchTerm = $('#userText').val();
        
        const response =  
                $.ajax({
                type:"GET",
                url:"https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + searchTerm +"&size=1&apikey=61OGUmlj7VACAPXGP45VdTLRzFc9XNrx",
                async:true,
                dataType: "json",
                success: function(json) {
                            console.log(json);
                            console.log(json._embedded.events[0].name);
                            
                            let temp = $("<div>");
                            temp.text(json._embedded.events[0].name);
                            $("body").append(temp);

                          
                        },
                error: function(xhr, status, err) {
                            
                        }
        }); 

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
});


// const data=response.responseJSON;
// console.log(data._embedded.events);
// console.log(response.responseJSON.page);

                            
/* Other Variables
const ticketmasterKey = "61OGUmlj7VACAPXGP45VdTLRzFc9XNrx";
const ticketmasterSecret = "esQ3Y2ZKbui9qBeW";
*/

/* API Documentation Links
https://developer.ticketmaster.com/products-and-docs/apis/getting-started/
https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/#anchor_find
https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/#search-events-v2
*/