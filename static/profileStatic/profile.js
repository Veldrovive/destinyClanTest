var memberJSON = '';
var currentPlatform = '';

function openProfile(id){
    $.ajax({
        method: "GET",
        url: "https://destiny-clan-extender.herokuapp.com/clan/playerId/"+id,
    }).done(function(json){
        //console.log(json);
        memberJSON = json.Response
        var platform = findPlatform(memberJSON.bungieNetUser);
        var psnImageTag = '';
        var xboxImageTag = '';
        var emblemURL = "https://www.bungie.net"+memberJSON.destinyAccounts["0"].characters["0"].backgroundPath;
        //console.log(emblemURL);
        if(platform.onPsn){
            psnImageTag = '<img class="platformImg" id="psn" src="static/PsnSymbol.png" alt="Xbox">'
        }
        if(platform.onXbox){
            xboxImageTag = '<img class="platformImg" id="xbox" src="static/XboxSymbol.png" alt="Xbox">'
        }
        $("#playerName").text(memberJSON.bungieNetUser.displayName)
        $("#platformId").html(psnImageTag+xboxImageTag);
        $("#profileHeader").css("background-image", "url('"+emblemURL+"')");
    });
};

function getAccount(platform, playerJSONResponse){
    var platformCode = null;
    var accountNumber = playerJSONResponse.destinyAccounts.length;
    
    if(platform == "psn"){
        platformCode = 2;
    } else if(platform == "xbox"){
        platformCode = 4;
    } else{
        return "Invalid platform";
    }
    
    for(i = 0; i < accountNumber; i++){
        var account = playerJSONResponse.destinyAccounts[i];
        if(account.accountState == platformCode){
            //console.log(account);
            return account;
        }
    }
    console.log("account not found");
    return "Account not found"
};

function findPlatform(bungieNetUserObject){
    var onXbox = false;
    var onPsn = false;
    
    if(bungieNetUserObject.xboxDisplayName){
        onXbox = true;
    }
    if(bungieNetUserObject.psnDisplayName){
        onPsn = true;
    }
    var data = {onXbox: onXbox, onPsn: onPsn}
    //console.log(data);
    return data;
}

$(document).ready(function(){
    $("#profileHeader").on("click", ".platformImg", function(){
        var name = $(this).attr("id");
        //console.log(name);
        currentPlatform = name;
        getAccount(name, memberJSON);
        var d = new Date()
    });
});