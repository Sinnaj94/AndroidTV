var currentIndexLeftRight;
var currentIndexUpDown;
var easingSpeed;
var timer = null;
var fullLength = 0;
var hintIsOpen = false;
var timeOutForRecordHint = null;
var timeOutForShareHint = null;
var last = 0;
var recordKey = 13;
var startRecordingTime = undefined;
var endRecordingTime = undefined;
var recorded = false;
var timerForRecordedEvents;
var shareScreenOpen = false;

var holdToRecordPressed = false;
$(function () {


    var $img = $("#recordPanel").find("img").first();
    var h = $img.height();
    var sh = h * 1.1;
    var shouldScale = false;

    function startScale() {

        $img.addClass("animated tada infinite")
    }

    function stopScale() {
        $img.removeClass("animated tada infinite")

    }

    $(document).keydown(function (event) {
        if (!holdToRecordPressed) {
            if (event.keyCode == recordKey) {
                console.log("record down ");
                if (currentIndexLeftRight == 1 && currentIndexUpDown == -1) {
                    startToRecord();
                    startScale();
                    holdToRecordPressed = true;
                }

            }

        }

    });

    $(document).keyup(function (event) {
        if (event.keyCode == recordKey && currentIndexLeftRight == 1 && currentIndexUpDown == -1) {
            console.log("record up");
            endRecording();
            stopScale();
            holdToRecordPressed = false;

        }


    });
});

$(document).ready(function () {


    $(".video-overlay-hint-share").hide()
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

function repeatRecorded() {
    if (document.getElementById("video").currentTime >= endRecordingTime) {
        document.getElementById("video").currentTime = startRecordingTime;
    }
}

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


function startToRecord() {

    recorded = false;
    startRecordingTime = document.getElementById("video").currentTime;

    console.log("Started Recording at " + getFormat(startRecordingTime));
    play();
    hideBarForRecordMode();


}


function endRecording() {
    timerForRecordedEvents = setInterval(repeatVideo, 100);

    endRecordingTime = document.getElementById("video").currentTime;

    console.log("Stopped Recording at " + getFormat(endRecordingTime));
    if (endRecordingTime - startRecordingTime >= 1) {
        recorded = true;
    } else {
        startRecordingTime = undefined;
        endRecordingTime = undefined;
    }
    showBarForRecordMode();
    setTimeout(function () {
        goDown();
    }, 800)


}

function testing(a) {
    if (shareScreenOpen && a == 13) {
        $(".share-overlay").animate({
            opacity: 0
        });
        easeVideo(1, 500);
        shareScreenOpen = false;
        return;
    } else if (shareScreenOpen) {
        return;
    }
    if (!holdToRecordPressed || a == recordKey) {
        easeVideo(1);

    }
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

function showHintRecordDelayed(force) {

    function showHint() {
        timeOutForRecordHint = null;
        $(".video-overlay-hint").animate({
            top: "+=10%"

        }, {
            duration: easingSpeed
            , queue: false

        }, function () {
            hintIsOpen = true;
        });
    }
    if (!!force) {
        clearTimeout(timeOutForRecordHint);
        showHint();

    } else if (timeOutForRecordHint == null) {
        timeOutForRecordHint = window.setTimeout(function () {
            showHint();
        }, 2000)
    }
}

function hideHintRecord() {

    clearTimeout(timeOutForRecordHint);
    timeOutForRecordHint = null;
    $(".video-overlay-hint").animate({
        top: "70%"

    }, {
        duration: easingSpeed
        , queue: false

    });


}


function showHintShareDelayed() {

    if (timeOutForShareHint == null) {
        timeOutForShareHint = window.setTimeout(function () {
            timeOutForShareHint = null;
            $(".video-overlay-hint-share").show();
            $(".video-overlay-hint-share").css({
                top: "75%"
            });
            $(".video-overlay-hint-share").animate({
                top: "+=5%"

            }, {
                duration: easingSpeed
                , queue: false

            });
        }, 2000)

    }
}

function hideHintShare() {

    clearTimeout(timeOutForShareHint);
    timeOutForShareHint = null;
    $(".video-overlay-hint-share").animate({
        top: "70%"

    }, {
        duration: easingSpeed
        , queue: false
        , complete: function () {
            $(".video-overlay-hint-share").hide()
        }

    });



}

function showQRCode() {
    shareScreenOpen = true;

    $(".share-overlay").animate({
        opacity: 1

    }, {
        duration: 300
        , queue: false

    });

    easeVideo(0, 500);
}

function hideTimeline() {
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
            top: "60%"
            , height: "20%"

        }, {
            duration: 300
            , queue: false

        });


}

function decideExpansion() {
    if (currentIndexUpDown == -2) {
        //Share panel

        //$("#previewPanel").fadeIn();





        $("#passedandlengthtext")
            .animate({
                opacity: "0"

            }, {
                duration: 300
                , queue: false
            });
        $("#replayPanel")
            .animate({
                //opacity: "0"

            }, {
                duration: 300
                , queue: false
            });
        $("#forwardPanel")
            .animate({
                //opacity: "0"

            }, {
                duration: 300
                , queue: false
            });
        if (recorded) {
            $("#forwardIcon").text("delete");
            $("#backIcon").text("visibility");
        }

    } else if (currentIndexUpDown == -1) {
        if (last == -2) {

            $("#previewPanel").fadeOut();

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
            $("#forwardIcon").text("forward_5");


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
    if (currentIndexLeftRight > 0 && currentIndexUpDown >= -2) {

        $("#Kreis")
            .animate({
                left: "-=16%"

            }, {
                duration: easingSpeed
                , easing: 'swing'
            });
        currentIndexLeftRight--;
        console.log(currentIndexLeftRight);
        if(currentIndexLeftRight == 0 && currentIndexUpDown == -2){
            
            $(".video-overlay")
            .animate({
                opacity: 0

            }, {
                duration: easingSpeed
                , easing: 'swing'
            });
        }
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


        if (currentIndexUpDown == -1) {
            showHintRecordDelayed();
        } else {
            hideHintRecord();
        }

        if (currentIndexUpDown == -2) {
            showHintShareDelayed();
        } else {
            $("#backIcon").text("replay_5");
            hideHintShare();
        }


        animateBackgroundColors();
        decideExpansion();
    }
}


function goDown() {
    if (currentIndexLeftRight == 1 && currentIndexUpDown > -1) {
        performDown();
    } else if (currentIndexUpDown == -1 && currentIndexLeftRight == 1 && recorded == true) {
        performDown();
    }
}

function performDown() {

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

    if (currentIndexUpDown == -1) {
        showHintRecordDelayed();
    } else {
        hideHintRecord();
    }

    if (currentIndexUpDown == -2) {
        showHintShareDelayed();
    } else {
        hideHintShare();
    }


    animateBackgroundColors();
    decideExpansion();

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
            backgroundColor: "#5C6BC0"
        })
    }
}


function onEnter() {
    if (currentIndexLeftRight == 0) {
        animateControls("replay_5");
        skip(-5);
    } else if (currentIndexLeftRight == 1 && currentIndexUpDown == 0) {
        playPause();
    } else if (currentIndexLeftRight == 2) {
        if (currentIndexUpDown == -2) {
            recorded = false;
            startRecordingTime = undefined;
            endRecordingTime = undefined;
            animateControls("delete");
            goLeft();
            goUP();
            

        } else {
            animateControls("forward_5");
            skip(5);

        }
    } else if (currentIndexUpDown == -2) {
        //on Share click
        showQRCode();
    }

}

function playPause() {
    var video = document.getElementById("video");
    clearInterval(timerForRecordedEvents);
    if ($("#playPanel").find("i").first().text() == "play_arrow") {
        play();
        easeVideo(0, 300);
    } else {
        pause();
    }


}

function play() {

    $("#playPanel").find("i").first().text("pause");
    var video = document.getElementById("video");
    video.play();
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

function hideBarForRecordMode() {
    showHintRecordDelayed(true)
    $(".video-overlay")
        .animate({
            backgroundColor: "rgba(0, 0, 0, 0.0)"
        }, {
            duration: 500
            , easing: 'swing'
        });

    $(".video-overlay-banner").animate({
        backgroundColor: "rgb(242, 67, 54,0.4);"
    }, {
        duration: 500
        , easing: 'swing'
    });
    $(".video-overlay-hint").animate({
        backgroundColor: "rgb(242, 67, 54,0.4);"
    }, {
        duration: 500
        , easing: 'swing'
    })

    $("#playPanel").animate({
        opacity: 0
    }, {
        duration: 500
        , easing: 'swing'
    })
    $("#forwardPanel").animate({
        opacity: 0
    }, {
        duration: 500
        , easing: 'swing'
    })
    $("#previewPanel").animate({
        opacity: 0
    }, {
        duration: 500
        , easing: 'swing'
    })
    $("#replayPanel").animate({
        opacity: 0
    }, {
        duration: 500
        , easing: 'swing'
    })
    $("#sharePanel").animate({
        opacity: 0
    }, {
        duration: 500
        , easing: 'swing'
    })


}

function showBarForRecordMode() {

    $(".video-overlay")
        .animate({
            backgroundColor: "rgba(0, 0, 0, 0.5)"
        }, {
            duration: 500
            , easing: 'swing'
        });

    $(".video-overlay-banner").animate({
        backgroundColor: "rgb(242, 67, 54,1);"
    }, {
        duration: 500
        , easing: 'swing'
    });
    $(".video-overlay-hint").animate({
        backgroundColor: "rgb(242, 67, 54,1);"
    }, {
        duration: 500
        , easing: 'swing'
    })

    $("#playPanel").animate({
        opacity: 1
    }, {
        duration: 500
        , easing: 'swing'
    })
    $("#forwardPanel").animate({
        opacity: 1
    }, {
        duration: 500
        , easing: 'swing'
    })
    $("#replayPanel").animate({
        opacity: 1
    }, {
        duration: 500
        , easing: 'swing'
    })
    $("#sharePanel").animate({
        opacity: 1
    }, {
        duration: 500
        , easing: 'swing'
    })


}
window.test = hideBarForRecordMode;

function pause() {
    setPlayArrow()
    var video = document.getElementById("video");
    video.pause();

}

function setPlayArrow() {
    $("#playPanel").find("i").first().text("play_arrow");
}

function skip(value) {
    var video = document.getElementById("video");
    video.currentTime += value;
}

function repeatVideo() {


    if (recorded) {
        repeatRecorded();
    }
}