// Javascript file
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
			page = page  + 1;
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
});


function makeContent(data, id, tweetid){
	//$("#page"+id).append("<div class='tweetList' data-role='content'>"+JSON.stringify(data)+"</div>");
	var tweetid = tweetid - 1;
	var text = data.text;
	var date = data.created_at;

	$("#page"+id+" > .tweetList > ul").append("<li><a id='tweetLink"+tweetid+"' href='#tweet"+tweetid+"' data-rel='dialog'>"+text+"  |  "+date+"</a></li>");
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
					userDesc = "<div>"+readData[id].user.description+"</div>"
				}
			var userFollowers = "";
			if(readData[id].user.followers_count != undefined){
					userFollowers = "<div>Followers: "+readData[id].user.followers_count+"</div>"
				}
			var userFriends = "";
			if(readData[id].user.friends_count != undefined){
					userFriends = "<div>Friends: "+readData[id].user.friends_count+"</div>"
				}
			var userListed = "";
			if(readData[id].user.listed_count != undefined){
					userListed = "<div>Listed: "+readData[id].user.listed_count+"</div>"
				}
			$("#tweet"+id+" .tweetDetails .userInfo").append("<h3>"+readData[id].user.screen_name+"</h3><div>Name:"+readData[id].user.name+userLocation+userUrl+"</div>"+userDesc+userFollowers+userFriends+userListed);
		}
		$.mobile.changePage(href,  'pop', false, true);
	});
//Stuff we need
/*
	data=> "created_at"
	data=> "text"
	data=> "user" for user display
	data=> "entities" => "urls" => "expanded_url"			urls
	data=> "entities" => "media" =>"expanded_url"  		photos
*/
}

function startPage( id){
	$("body").append("<div data-role='page' id='page"+id+"'> <div data-role='header'><h1>"+id+"</h1></div></div>");
	$("#page"+id).append("<div class='tweetList' data-role='content'><ul data-role='listview' data-inset='false' data-filter='true'></ul></div>");
}

function endPage( id){
	$("#page"+id).append("<div class='pageFooter' data-role='footer'><h4>Page Footer</h4></div>");
	for(var i = 1; i <= maxPage; i++){
		$("#page"+id+" > .pageFooter").append("<a href='#page"+i+"'>"+i+"</a>");
	}
}

