var inEventCreator = false;

var TESTID = 1415175;
var LIMIT = 10;
var DEFAULTCLAN = "P G O D"

var memberListV2 = null;

var eventList = [
    {time:"6 o'clock", numberNeeded:"2", game:"First", creator:"Veldrovive"},
    {time:"4 o'clock", numberNeeded:"5", game:"Second", creator:"Veldrovive"},
    {time:"8 o'clock", numberNeeded:"1", game:"Third", creator:"Veldrovive"}
    ];

eventList.reverse();


function search(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].user.displayName === nameKey) {
            return myArray[i].user.membershipId;
        }
    }
}

function findHighestLight(playerJSON){
    try{
        var playerAccount = playerJSON.Response.destinyAccounts["0"];
        var lightTest = playerAccount.characters[0].powerLevel;
    }
    catch(err){
        return "Light not found"
    }
    var light = 0;
    for (i=0; i < playerAccount.characters.length; i++){
        try{
            characterLight = playerAccount.characters[i].powerLevel;
        }
        catch(err){
            return "Account not found";
        }
        if (characterLight > light){
            light = characterLight;
        }
    }
    return light;
};

function populateMission(clanJSON){
    //console.log(clanJSON);
    var about = clanJSON.Response.detail.about;
    //console.log(about);
    $('#testP').html(about);
}

function getMembers(id, callback){
    $.ajax({
        method: "GET",
        url: "https://destiny-clan-extender.herokuapp.com/clan/clanId/"+id,
    }).done(function(json){
        var data = JSON.parse(json);
        //console.log(data);
        memberListV2 = data;
        callback();
        return data;
    });
}

function clanIdByName(name, callback, getMembersCallback){
    $.ajax({
        method: "GET",
        url: "https://destiny-clan-extender.herokuapp.com/clan/clanName/"+name,
    }).done(function(json){
        var data = JSON.parse(json);
        //console.log(data);
        populateMission(data);
        var clanId = data.Response.detail.groupId;
        callback(clanId, getMembersCallback);
    });
}

function switchContent(toOpen){
    $(".content").hide();
    var address = "#" + toOpen + "Content";
    $(address).show();
};

function printEvents(event){
    //console.log(event);
    var html = '';
    html += '<table id="eventTable">';
    html += "<th class='eventHeader'>Time</th><th class='eventHeader'>Need</th><th class='eventHeader'>Activity</th><th class='eventHeader'>Creator</th>"
    $.each(eventList, function(index, event){
        if(index > LIMIT) return false;
        html += "<tr class='eventRow' id='Event "+index+"'>"
        html += "<td class='time'>"+event.time+"</td>"
        html += "<td class='needed'>"+event.numberNeeded+"</td>"
        html += "<td class='game'>"+event.game+"</td>"
        html += "<td class='gamertag'>"+event.creator+"</td>"
        html += "</tr>"
    });
    html += '<tr id="eventCreator">'
    html += '<td><input type="text" id="eventTime" value=Time></td>'
    html += '<td><input type="number" id="eventNeedCount" value=3></td>'
    html += '<td><input type="text" id="eventActivity" value=Activity></td>'
    html += '<td><input type="text" id="eventCreatorName" value=Gamertag></td>'
    html += '</table>'
    $("#eventTableContainer").html(html);
    $('#eventCreator').hide();
};

function addEvent(time, needed, game, creator){
    var event = {time: time, numberNeeded: needed, game: game, creator: creator}
    eventList.unshift(event);
}

function createEvent(){
    $('#eventCreator').show();
    $('#eventCreateButton').hide();
    $('#eventCreateButtonDone').show();
    $('#eventCreateButtonDone').unbind().click(function(){
        var time = $('#eventTime').val();
        var needed = $('#eventNeedCount').val();
        var activity = $('#eventActivity').val();
        var creator = $('#eventCreatorName').val();
        addEvent(time, needed, activity, creator);
        printEvents(eventList);
        inEventCreator = false;
        $('#eventCreateButton').show();
        $('#eventCreateButtonDone').hide();
        return;
    });
};

function findName(memberJSON){
    var bungieDisplayName = '';
    var onXbox = false;
    var onPs = false;
    var xboxName = '';
    var psName = '';
    try {
        xboxName = memberJSON.user.xboxDisplayName;
        if(xboxName){
            onXbox = true;
        }
    }
    catch(err){
        onXbox = false;
    }
    
    try {
        psName = memberJSON.user.psnDisplayName;
        if(psName){
            onPs = true;
        }
    }
    catch(err){
        onPs = false;
    }
    bungieDisplayName = memberJSON.user.displayName
    var names = {xboxName:xboxName, onXbox: onXbox, psnName: psName, onPsn: onPs, displayName: bungieDisplayName}
    //console.log(names);
    return names
};

function printMembers(clickedMemberName, playerJSON){
    var members = memberListV2.Response.results;
    //console.log(members)
    var html = '';
    html += '<table id="memberTable">';
    html += "<th class='nameHeader'>Name</th><th class='onlineHeader'>Followers</th><th class='activityHeader'>Current Game</th>"
    $.each(members, function(index, member){
        var nameInfo = findName(member);
        var xboxImageTag = '';
        var psnImageTag = '';
        if(nameInfo.onPsn){
            psnImageTag = '<img src="static/PsnSymbol.png" alt="Xbox" height="24" width="24">'
        }
        if(nameInfo.onXbox){
            xboxImageTag = '<img src="static/XboxSymbol.png" alt="Xbox" height="24" width="24">'
        }
        html += "<tr id='Member "+index+"'>"
        html += "<td class='name'><p>"+nameInfo.displayName+"</p>"+xboxImageTag+""+psnImageTag+"</td>"
        html += "<td class='online'>"+member.user.userTitleDisplay+"</td>"
        html += "<td class='activity'>"+index+"</td>"
        html += "</tr>"
        if (nameInfo.displayName == clickedMemberName){
            var lightLevel = findHighestLight(playerJSON);
            //console.log(playerJSON)
            html += "<tr id=memberInfo>"
            html += "<td class='messager' id='"+nameInfo.displayName+"'>Click to view profile</td>"
            html += "<td>"+lightLevel+"</td>"
            html += "</tr>"
        };
    });
    html += '</table>'
    $("#membersTableContainer").html(html);
};

$(document).ready(function(){
    switchContent("mission")
    clanIdByName(DEFAULTCLAN, getMembers, printMembers);
    printEvents(eventList);
    $('#eventCreateButtonDone').hide();
        
    $(document).on('click', ".name", function(e){
        var memberName = $(this).text()
        var id = search(memberName, memberListV2.Response.results);
        console.log(memberName + " was clicked Id: "+id);
        //window.open("https://account.xbox.com/en-US/Messages?gamerTag="+$(this).text());
        //var members = memberListV2.Response.results;
        //var bungieName = search(memberName, members);
        //console.log(bungieName);
        $.ajax({
            method: "GET",
            //url: "https://destiny-clan-extender.herokuapp.com/clan/playerName/"+memberName,
            url: "https://destiny-clan-extender.herokuapp.com/clan/playerId/"+id,
        }).done(function(json){
            //console.log(json)
            printMembers(memberName, json);
        })
    });
    
    $(document).on('click', ".messager", function(e){
        var name = $(this).attr('id');
        //console.log("Messaging "+name)
        var id = search(name, memberListV2.Response.results)
        //window.open("https://account.xbox.com/en-US/Messages?gamerTag="+name);
        window.open("/destinyClanTest/profile/profile?name="+id);
    });
    
    $("#eventCreateButton").click(function(){
        if(inEventCreator == false){
             inEventCreator = true;
             createEvent();
             //console.log("Event Button Clicked")
        }
    });

    $("#clanNameSubmit").click(function(){
        var clanName = $("#clanNameInput").val();
        //var membersHere = getMembers(TESTID, printMembers);
        clanIdByName(clanName, getMembers, printMembers);
    });


    $(".navButton").click(function(){
        switchContent(this.id);
    });
});