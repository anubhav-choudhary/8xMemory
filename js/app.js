ExMemory = (function(){
    //Properties
    var time=0;
    var timerflag;
    var flips=0;
    var matched;
    var matrix;
    
    //variables
    var selcount=0;
    var selX=-1;
    var selY=-1;
    
    
    var startTimer=function() {
        time++;
        if(timerflag) setTimeout(startTimer,1000);
        document.getElementById('time').innerHTML=formatTime(time);
    }
    
    var initMatrix=function() {
        matrix =[[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
        var data="AABBCCDDEEFFGGHHIIJJKKLLMMNNOOPPQQRRSSTTUUVVWWXXYYZZ001122334455";
        for(var i=0;i<8;i++)
        {
            for(var j=0;j<8;j++)
            {
                var random=Math.floor(Math.random()*data.length);
                matrix[i][j]=data[random];
                data=data.substring(0,random)+data.substring(random+1,data.length); 
            }
        }

        for(var i=0;i<8;i++)
        {
            for(var j=0;j<8;j++)
            {
                document.getElementById("B"+i+j).innerHTML="?";
                $("#B"+i+j).css("background-color",'#F6F6F6');
                $("#B"+i+j).css("color",'#333');
            }
        }
    }
    
    var formatTime=function(tm){
        var hours = Math.floor(tm / 3600),
                minutes = Math.floor((tm / 60) % 60),
                seconds = tm % 60;
        return hours+":"+minutes+":"+seconds;
    }
    
    var updateHallOfFame=function() {
        var ps = window.localStorage;
        var mf=ps.getItem('flips');
        var tt=ps.getItem('time');
        if(mf!=-1)
        {
            document.getElementById('minflip').innerHTML=mf;
            document.getElementById('timetaken').innerHTML=formatTime(tt);
        }
        else {
            document.getElementById('minflip').innerHTML="N/A";
            document.getElementById('timetaken').innerHTML="N/A";
        }
    }
    
    var resetScore=function() {
        flips=0;
        time=0;
        matched=0;
        updateScore();
    }
    //Functions
    var startgame=function() {
        initMatrix();
        resetScore();
        timerflag=true;
        startTimer();
    }
    
    var restartGame=function() {
        timerflag=false;
        setTimeout(startgame,1001);
    }
    
    var stopGame=function() {
        timerflag=false;
    }
    
    var updateScore=function() {
        document.getElementById("flips").innerHTML=flips;
        document.getElementById("match").innerHTML=matched;
    }
    
    var clickButton=function(i,j) {
        if(i==selX && j==selY) return;
        flips++;
        if(selcount==0) {
            selX=i;
            selY=j;
            document.getElementById("B"+i+j).innerHTML=matrix[i][j];
            selcount++;
        } else {
            document.getElementById("B"+i+j).innerHTML=matrix[i][j];
            document.getElementById("B"+selX+selY).innerHTML=matrix[selX][selY];
            
            if(matrix[i][j]!==matrix[selX][selY]) {
                var cpyX=selX;
                var cpyY=selY;
                $("#B"+i+j).css("background-color",'red');
                $("#B"+selX+selY).css("background-color",'red');
                $("#B"+i+j).css("color",'white');
                $("#B"+selX+selY).css("color",'white');
                setTimeout(function(){
                    document.getElementById("B"+i+j).innerHTML="?";
                    document.getElementById("B"+cpyX+cpyY).innerHTML="?";
                    $("#B"+i+j).css("background-color",'gray');
                    $("#B"+cpyX+cpyY).css("background-color",'gray');
                    $("#B"+i+j).css("color",'black');
                    $("#B"+cpyX+cpyY).css("color",'black');},500);
            }
            else {
                matched++;
                $("#B"+i+j).css("background-color",'green');
                $("#B"+selX+selY).css("background-color",'green');
                $("#B"+i+j).css("color",'white');
                $("#B"+selX+selY).css("color",'white');
            }
            
            if(matched==32)
            {
                timerflag=false;
                document.getElementById('currflip').innerHTML=flips;
                document.getElementById('currtimetaken').innerHTML=formatTime(time);
                var ps = window.localStorage;
                if(ps.getItem('flips')<flips || ps.getItem('flips')==-1)
                {
                    ps.setItem('flips',flips);
                    ps.setItem('time',time);
                }
                $.mobile.changePage( $("#completed"), "flip", true, true);
            }
            
            selcount=0;
            selX=-1;
            selY=-1;
        }
        updateScore();
    }
    return {
        startGame:startgame,
        clickButton:clickButton,
        restartGame:restartGame,
        stopGame:stopGame,
        updateHallOfFame:updateHallOfFame
    }
})();

var ps = window.localStorage;
if(ps.getItem("flips")==null)
    ps.setItem("flips",-1);
if(ps.getItem("time")==null)
    ps.setItem("time",-1);

