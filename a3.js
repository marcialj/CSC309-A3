

//Build the content on each page
function makeContent(data, id, tweetid){

var tweetid = tweetid - 1;
var text = data.text;
var date = data.created_at;

$("#page"+id+" > .tweetList > ul").append("<li><a id='tweetLink"+tweetid+"' href='#tweet"+tweetid+"' data-rel='dialog'>"+text+" | "+date+"</a></li>");
$("#tweetLink"+tweetid).click(function(event){
event.preventDefault();

var href = $(this).attr("href");
var id = href.substr(href.indexOf("et") + 2) ;
if($("#tweet"+id).length < 1){
$("body").append("<div data-role='dialog' id='tweet"+id+"'><div data-role='header'><h1>Tweet Details</h1></div>"
+"<div class='tweetDetails' data-role='content'><div class='tweetInfo'></div>"
+"<div data-role='collapsible-set' >"
+"<div data-role='collapsible'><h3>Tweet Info</h3><div class='tweetPics'></div><div class='tweetUrls'></div></div>"
+"<div data-role='collapsible'><h3>User Info</h3><div class='userPic'></div><div class='userInfo'></div></div>"
+"</div></div>");
//$("#tweet"+id+" .tweetDetails").append("<div class='tweetPic'><img src=''></div>");
//var imgUrl = readData[id].entities.media.expanded_url;
$("#tweet"+id+" .tweetDetails .tweetInfo").append(readData[id].text);
if(readData[id].entities.media != undefined){
for(var ind in readData[id].entities.media){
var curUrl = readData[id].entities.media[ind].media_url;
var dispUrl = readData[id].entities.media[ind].display_url;
$("#tweet"+id+" .tweetDetails .tweetPics").append("<a title='Click to see full sized image.' href='"+readData[id].entities.media[ind].expanded_url+"'><img height='50px' width='50px' src='"+curUrl+"' alt='"+dispUrl+"'></a>");
}
}
if(readData[id].entities.urls != undefined){
for(var ind in readData[id].entities.urls){
var curUrl = readData[id].entities.urls[ind].expanded_url;
var dispUrl = readData[id].entities.urls[ind].display_url;
$("#tweet"+id+" .tweetDetails .tweetUrls").append("<a href='"+curUrl+"'>"+dispUrl+"</a>");
}
}
$("#tweet"+id+" .tweetDetails .userPic").append("<img height='50px' width='50px' src='"+readData[id].user.profile_image_url+"'/>");
var userLocation= "";	
if(readData[id].user.location != undefined && readData[id].user.location!=""){
userLocation = "<br>Location: "+readData[id].user.location;
}	
var userUrl = "";
if(readData[id].user.url != undefined){
userUrl = "<br><a href='"+readData[id].user.url+"'>"+readData[id].user.url+"</a>";
}
var userDesc = "";
if(readData[id].user.description != undefined && readData[id].user.description != ""){
userDesc = "<div class='userDesc'>"+readData[id].user.description+"</div>"
}
var userFollowers = "";
if(readData[id].user.followers_count != undefined){
userFollowers = "<div class='userFollowers'>Followers: "+readData[id].user.followers_count+"</div>"
}
var userFriends = "";
if(readData[id].user.friends_count != undefined){
userFriends = "<div class='userFriends' >Friends: "+readData[id].user.friends_count+"</div>"
}
var userListed = "";
if(readData[id].user.listed_count != undefined){
userListed = "<div class='userListed'>Listed: "+readData[id].user.listed_count+"</div>"
}
$("#tweet"+id+" .tweetDetails .userInfo").append("<h3>"+readData[id].user.screen_name+"</h3><div class='userBio'>Name:"+readData[id].user.name+userLocation+userUrl+"</div>"+userDesc+userFollowers+userFriends+userListed);
}
$.mobile.changePage(href, 'pop', false, true);
});
}

//Build opening of each page
function startPage( id){
var prev = parseInt(id) - 1;
if(prev == 0){
prev = maxPage;
}
var next = parseInt(id) + 1;
if(next > maxPage){
next = 1;	
}
$("body").append("<div class='listPage' data-role='page' data-prev='page"+prev+"' data-next='page"+next+"' id='page"+id+"'> <div data-role='header'><h1>Tweet List: "+id+"</h1></div></div>");
$("#page"+id).append("<div class='tweetList' data-role='content'><ul data-role='listview' data-inset='false' data-filter='true'></ul></div>");
}

//Build ending of each page
function endPage( id){
$("#page"+id).append("<div class='pageFooter' data-role='footer'><h4></h4></div>");
for(var i = 1; i <= maxPage; i++){
$("#page"+id+" > .pageFooter h4").append("&nbsp;<a href='#page"+i+"'>"+i+"</a>&nbsp;");
}
}

//Fetch the json file data and calculate pages needed. Also controls the construction of all the pages using the functions below.
$.getJSON('favs.json', function(data) {
  readData = data;
console.log(data);
var count = 1;
var page = 1;
var pageCount = 1;
var limit = 2;
maxPage = Math.ceil(data.length / limit);
$.each(data, function(key, val) {	
if(pageCount > limit){
endPage(page);
page = page + 1;
pageCount = 1;
}
if(pageCount == 1){
startPage( page);
}
makeContent(val, page, count);
pageCount = pageCount + 1;
count = count + 1;
});
endPage(page);
}
);

//Add swipe event detection on list view.
$( document ).on( "pageinit", "[data-role='page'].listPage", function() {


var page = "#" + $( this ).attr( "id" ),
        // Get the filename of the next page that we stored in the data-next attribute
        next = $( this ).jqmData( "next" ),
        // Get the filename of the previous page that we stored in the data-prev attribute
        prev = $( this ).jqmData( "prev" );
    // Check if we did set the data-next attribute
    if ( next ) {
        // Prefetch the next page
        $.mobile.loadPage( "#" + next );
        // Navigate to next page on swipe left
        $( document ).on( "swipeleft", page, function() {
            $.mobile.changePage( "#" + next , { transition: "slide" });
        });
        // Navigate to next page when the "next" button is clicked
        $( ".control .next", page ).on( "click", function() {
            $.mobile.changePage( "#" + next , { transition: "slide" } );
        });
    }
    // Disable the "next" button if there is no next page
    else {
        $( ".control .next", page ).addClass( "ui-disabled" );
    }
    // The same for the previous page (we set data-dom-cache="true" so there is no need to prefetch)
    if ( prev ) {
        $( document ).on( "swiperight", page, function() {
            $.mobile.changePage( "#" + prev , { transition: "slide", reverse: true } );
        });
        $( ".control .prev", page ).on( "click", function() {
            $.mobile.changePage( "#" + prev, { transition: "slide", reverse: true } );
        });
    }
    else {
        $( ".control .prev", page ).addClass( "ui-disabled" );
    }
    
});

alert("Welcome to our Tweet Browser!");
