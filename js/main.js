
var key = "<KEY>";
var data;

var name = "Chiyome";
var realm = "Ravencrest";

var icon;
var itemName;

var currentBuyout;

var totalGold = 0;

var cheaperAuctions = [];

var checkMark = false;


var seenAuctions = [];




$( document ).ready(function(){
checkMarket();



console.log(localStorage.getItem("Test"));

time=setInterval(function(){
  $("#auctions").html("");
checkMarket();

},1800000);

});



//http://auction-api-eu.worldofwarcraft.com/auction-data/ecee6e0f05b6c1c05d9e1c1822a5c11b/auctions.json

// Currently loading from file because of changes to API 
function checkMarket(){

   $.ajax({url: "js/auctions.json",dataType:'json', success: function(linkResult){

        data = linkResult.auctions;
        checkAuctions(name);
        console.log(data);
      }});
}



//function checkMarket(){
  //$.ajax({url: "https://eu.api.battle.net/wow/auction/data/"+realm+"?locale=en_GB&apikey="+key, success: function(result){
//  $.ajax({url: "https://auction-api-eu.worldofwarcraft.com/auction-data/ecee6e0f05b6c1c05d9e1c1822a5c11b/auctions.json", success: function(result){
    //var url =  result.files["0"].url.replace(/^http:\/\//i, 'https://');
 //   console.log(result);
  //    $.ajax({url: url, success: function(linkResult){

   //     data = linkResult.auctions;
   //     checkAuctions(name);
   //     console.log(data);
   //   }});
 // },
 // error: function (xhr, ajaxOptions, thrownError) {
 //     alert(xhr.status);
 //     alert(thrownError);
 //   }
//});
//}







function checkUnderCut(itemID){
  var sameitem = [];
  for (var i = 0; i < data.length; i++) {
    if(data[i].item === itemID){
      sameitem.push(data[i]);
    }
  }

  for (var i = 0; i < sameitem.length; i++) {
    if(sameitem[i].buyout < currentBuyout){
        //alert("UNDERCUT");
       
        $("#auctions").append(" <i class='fas fa-times fa-3x' style='color:red;'></i>")
        break;
    }else{
      if(i == sameitem.length - 1){
        $("#auctions").append(" <i class='fas fa-check fa-2x' style='color:green;'></i>")
        
       // sendMail();
      }
    }
  }
}


function lookupItem(itemID, i){
	
	https://eu.api.blizzard.com/wow/item/18803?locale=en_GB
  $.ajax({url: "https://eu.api.blizzard.com/wow/item/"+itemID+"?locale=en_GB&access_token="+key+", success: function(itemRes){
      icon = itemRes.icon;
       
      $("#n"+i).html(itemRes.name);
      $("#"+i).attr("src","https://wow.zamimg.com/images/wow/icons/large/"+icon+".jpg")
      $("#auctions").append("<a href='https://www.wowhead.com/item="+itemID+"/fiery-chain-girdle'</a>");

  }});
}



function checkAuctions(name){
for (var i = 0; i < data.length; i++) {
  if(data[i].owner == name){
    lookupItem(data[i].item,i);
    currentBuyout = data[i].buyout;
    checkUnderCut(data[i].item);
    totalGold += data[i].buyout;
    $("#gold").html("Total gold: " + totalGold / 10000 +"g");
    seenAuctions.push(data[i].item);
   


   var icon = $("<img>")
      .attr("alt","")
      .attr("id",i);
      
  var aImg = $("<a>")
      .attr("href","https://www.wowuction.com/eu/ravencrest/alliance/Items/Stats/" + data[i].item)
      .attr("target","_blank");
  
  $(aImg).append(icon);

    console.log("Found one auction!");

    $("#auctions").append(aImg);
    $("#auctions").append("   x"+ data[i].quantity + " " + "<a id='n"+i+"'></a>"  + "  "+ data[i].buyout / 10000 + "g" + "<br>");
  }

}
var checkLastAuctions = JSON.parse(localStorage.getItem("SeenItems"));
var length = checkLastAuctions.length
if(checkLastAuctions.length > seenAuctions.length){
  var seen = false;
  for (var i = 0; i < length; i++) {
    for (var j = 0; j < seenAuctions.length; j++) {
     if(checkLastAuctions[i] == seenAuctions[j]){
       seen = true;
       checkLastAuctions.splice(i,1);
     }
    }
  }
  

  
}
console.log(checkLastAuctions);




//for (var i = 0; i < checkLastAuctions.length; i++) {
  //$("body").append("<br> Item: " + checkLastAuctions[i] + " is missing" + "<br>")
//}

localStorage.setItem("SeenItems",JSON.stringify(seenAuctions))
}


function sendMail() {
    $.get("php/mail.php");
    return false;
}


function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}


