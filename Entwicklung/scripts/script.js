var currentIndexLeftRight;
var currentIndexUpDown;
var easingSpeed;
var timer = null;
var fullLength = 0;
var hintIsOpen  = false;
var timeOutForRecordHint  = null;
var timeOutForShareHint  = null;
var last = 0;
$(document).ready(function () {

    $("#play_pause_key").text("play_arrow");

    currentIndexLeftRight = 1;
    currentIndexUpDown = 0;

    easingSpeed = 250;
    $("#video")
        .on(
            "timeupdate"
            , function (event) {
                onTrackedVideoFrame(this.currentTime, this.duration);
            }
        );

    $("#video")
        .on(
            "loadedmetadata"
            , function (event) {
                $("#passedtimetext").text(getFormat(this.currentTime));
                $("#fulllengthtext").text(getFormat(this.duration));


            }
        );
    $("#video")
        .on(
            "progress"
            , function (event) {
                if (this.buffered.length > 0) {
                    onBufferedVideoFrame(this.buffered.end(0), this.duration);

                }

            }
        );

});

function onBufferedVideoFrame(bufferedTime, length) {

    var percent = 100 * bufferedTime / length + "%";

    $("#bufferedtime")
        .animate({
            width: percent

        }, {
            duration: 100
            , easing: 'swing'
        });
}

function onTrackedVideoFrame(currentTime, length) {

    $("#passedtimetext").text(getFormat(currentTime));
    var percent = 100 * currentTime / length + "%";
    $("#passedtime")
        .animate({
            width: percent

        }, {
            duration: 100
            , easing: 'swing'
        });
}

function getFormat(time) {
    var seconds = 0;
    var minutes = 0;
    var hours = 0;
    var stringR = "";
    while (time >= 3600) {
        hours++;
        time -= 3600;
    }
    while (time >= 60) {
        minutes++;
        time -= 60;
    }
    while (time >= 1) {
        seconds++;
        time -= 1;
    }
    if (time >= .5) {
        seconds++;
    }
    if (hours > 0) {
        stringR += hours + ":"
    }
    stringR += minutes + ":";
    if (seconds >= 10) {
        stringR += seconds;
    } else {
        stringR += "0" + seconds;
    }
    return stringR;
}


$(function () {
    $(document).keydown(function (event) {
        testing(event.keyCode);
    });
});

function testing(a) {
    easeVideo(1);
    if (a == 37) {
        goLeft();

    } else if (a == 39) {
        goRight();

    } else if (a == 38) {
        goUP();

    } else if (a == 40) {
        goDown();

    } else if (a == 13) {
        onEnter();
    } else if (a == 32) {
        playPause();

    }
    //timedOut();
}

function showHintRecordDelayed() {

    if(timeOutForRecordHint == null){
        timeOutForRecordHint = window.setTimeout(function(){
            timeOutForRecordHint = null;
            $(".video-overlay-hint") .animate({
                top: "+=10%"

            }, {
                duration: easingSpeed
                , queue: false

            }).then(function(){
                hintIsOpen = true;
            });
        },2000)
    }
}
function hideHintRecord(){

    clearTimeout(timeOutForRecordHint);
    timeOutForRecordHint = null;
    $(".video-overlay-hint") .animate({
        top: "70%"

    }, {
        duration: easingSpeed
        , queue: false

    });


}


function showHintShareDelayed() {

    if(timeOutForShareHint == null){
        timeOutForShareHint = window.setTimeout(function(){
            timeOutForShareHint = null;
            $(".video-overlay-hint-share").show();
            $(".video-overlay-hint-share") .animate({
                top: "+=10%"

            }, {
                duration: easingSpeed
                , queue: false

            }).then(function(){
                hintIsOpen = true;
            });
        },2000)
    }
}
function hideHintShare(){

    clearTimeout(timeOutForShareHint);
    timeOutForShareHint = null;
    $(".video-overlay-hint-share") .animate({
        top: "70%"

    }, {
        duration: easingSpeed
        , queue: false

    }).then(function(){
        $(".video-overlay-hint-share").hide()
    });


}


function decideExpansion() {
    if (currentIndexUpDown == -2) {


        // increase the 500 to larger values to lengthen the duration of the fadeout 
        // and/or fadein
        $('#Kreis').fadeOut(100, function () {
            $('#Kreis').attr("src", "./img/KreisFull.png");
            $('#Kreis').fadeIn(400);
        });



        $("#Kreis")
            .animate({
                top: "6%"

            }, {
                duration: 300
                , queue: false

            });


        $("#timeline")
            .animate({
                opacity: "0"

            }, {
                duration: 300
                , queue: false
            });
        $(".video-overlay-banner")
            .animate({
                top: "55%"
                , height: "50%"

            }, {
                duration: 300
                , queue: false

            });
        $("#passedandlengthtext")
            .animate({
                opacity: "0"

            }, {
                duration: 300
                , queue: false
            });
        $("#replayPanel")
            .animate({
                opacity: "0"

            }, {
                duration: 300
                , queue: false
            });
        $("#forwardPanel")
            .animate({
                opacity: "0"

            }, {
                duration: 300
                , queue: false
            });

    } else if (currentIndexUpDown == -1) {
        if (last == -2) {
            $('#Kreis').fadeOut(100, function () {
                $('#Kreis').attr("src", "./img/Kreis.png");
                $('#Kreis').fadeIn(400);
            });
            $("#Kreis")
                .animate({
                    top: "0%"

                }, {
                    duration: 300
                    , queue: false

                });


            $("#timeline")
                .animate({
                    opacity: "1"

                }, {
                    duration: 300



                });
            $(".video-overlay-banner")
                .animate({
                    top: "60%"
                    , height: "20%"

                }, {
                    duration: 300
                    , queue: false

                });
            $("#passedandlengthtext")
                .animate({
                    opacity: "1"

                }, {
                    duration: 300
                    , queue: false
                });
            $("#replayPanel")
                .animate({
                    opacity: "1"

                }, {
                    duration: 300
                    , queue: false
                });
            $("#forwardPanel")
                .animate({
                    opacity: "1"

                }, {
                    duration: 300
                    , queue: false
                });

        }

    }
    last = currentIndexUpDown;
}

function animateControls(text) {
    $("#command-overlay").text(text)
    $("#command-overlay").clearQueue();
    $("#command-overlay").stop();
    $("#command-overlay").opacity = 0;
    $("#command-overlay")
        .animate({
            opacity: "1"

        }, {
            duration: 300

        })

    .animate({
        opacity: "0"
    }, {
        duration: 500
    });

}

function timedOut() {
    if (timer) {
        clearTimeout(timer); //cancel the previous timer.
        timer = null;
    }

    timer = setTimeout(function () {
        easeVideo(0)
    }, 4000);


}

function easeIn() {
    $(".video-overlay")
        .animate({
            opacity: 1
        })
}

function goLeft() {
    if (currentIndexLeftRight > 0) {

        $("#Kreis")
            .animate({
                left: "-=16%"

            }, {
                duration: easingSpeed
                , easing: 'swing'
            });
        currentIndexLeftRight--;
    }

}

function goRight() {

    if (currentIndexLeftRight < 2) {
        $("#Kreis")
            .animate({
                left: "+=16%"

            }, {
                duration: easingSpeed
                , easing: 'swing'
            });
        currentIndexLeftRight++;
    }



}

var percentDown = 25;

function hideTitle() {
    $("#thetitle").animate({
        opacity: "0"
    }, {
        duration: easingSpeed
        , easing: 'swing'
    })
}

function showTitle() {
    $("#thetitle").animate({
        opacity: "1"
    }, {
        duration: easingSpeed
        , easing: 'swing'
    })
}

function goUP() {

    if (currentIndexLeftRight == 1 && currentIndexUpDown < 0) {
        $("#playPanel").animate({
            top: "+=" + percentDown + "%"
        }, {
            duration: easingSpeed
            , easing: 'swing'
        })
        $("#recordPanel").animate({
            top: "+=" + percentDown + "%"
        }, {
            duration: easingSpeed
            , easing: 'swing'
        })
        $("#sharePanel").animate({
            top: "+=" + percentDown + "%"
        }, {
            duration: easingSpeed
            , easing: 'swing'
        })

        currentIndexUpDown++;
        if (currentIndexUpDown == 0) {
            showTitle();
        }


        if(currentIndexUpDown == -1 ){
            showHintRecordDelayed();
        }else {
            hideHintRecord();
        }

        if(currentIndexUpDown == -2 ){
            showHintShareDelayed();
        }else {
            hideHintShare();
        }


        animateBackgroundColors();
        decideExpansion();
    }
}


function goDown() {
    if (currentIndexLeftRight == 1 && currentIndexUpDown > -2) {
        $("#playPanel").animate({
            top: "-=" + percentDown + "%"
        }, {
            duration: easingSpeed
            , easing: 'swing'
        })
        $("#recordPanel").animate({
            top: "-=" + percentDown + "%"
        }, {
            duration: easingSpeed
            , easing: 'swing'
        })
        $("#sharePanel").animate({
            top: "-=" + percentDown + "%"
        }, {
            duration: easingSpeed
            , easing: 'swing'
        })

        currentIndexUpDown--;
        if (currentIndexUpDown < 0) {
            hideTitle();
        }

        if(currentIndexUpDown == -1 ){
            showHintRecordDelayed();
        }else {
            hideHintRecord();
        }

        if(currentIndexUpDown == -2 ){
            showHintShareDelayed();
        }else {
            hideHintShare();
        }


        animateBackgroundColors();
        decideExpansion();

    }
}

function animateBackgroundColors() {
    if (currentIndexUpDown == 0) {
        $(".video-overlay-banner").animate({
            backgroundColor: "#00695C"
        })
    } else if (currentIndexUpDown == -1) {
        $(".video-overlay-banner").animate({
            backgroundColor: "#f24336"
        })
    } else if (currentIndexUpDown == -2) {
        $(".video-overlay-banner").animate({
            backgroundColor: "#3341FF"
        })
    }
}

function easeCircle(percent) {

}

function onEnter() {
    if (currentIndexLeftRight == 0) {
        animateControls("replay_10");
        skip(-10);
    } else if (currentIndexLeftRight == 1) {
        playPause();
    } else if (currentIndexLeftRight == 2) {
        animateControls("forward_10");
        skip(10);
    }

}

function playPause() {
    var video = document.getElementById("video");
    if (video.paused) {
        play();
    } else {
        pause();
    }
}

function play() {
    $("#playPanel").find("i").first().text("pause");
    var video = document.getElementById("video");
    video.play();
    easeVideo(0, 300);
}

function easeVideo(newopacity, neweasingspeed) {
    if (neweasingspeed == undefined) {
        neweasingspeed = 500;
    }

    if ($(".video-overlay").css('opacity') != newopacity) {
        $(".video-overlay")
            .animate({
                opacity: newopacity
            }, {
                duration: neweasingspeed
                , easing: 'swing'
            });
    }

}

function pause() {
    $("#playPanel").find("i").first().text("play_arrow");
    var video = document.getElementById("video");
    video.pause();

}

function skip(value) {
    var video = document.getElementById("video");
    video.currentTime += value;
}