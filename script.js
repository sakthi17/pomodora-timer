$(document).ready(function() {

     /*************** Task Pane Events *****************/
     var MAX_TASK = 5;
     var taskcount = 0;

     var $newtask = '<div class="newtaskcontainer"><input class="titleinput" type="text"><i class="fa fa-window-close-o" aria-hidden="true"></i></div>';

     $("#addtask").click(function() {
          if (taskcount < 5) {
               taskcount++;
               if (taskcount === 1)
                    $($newtask).insertAfter("button#addtask");
               else
                    $($newtask).insertAfter("div.newtaskcontainer:last");
               $("div.newtaskcontainer:last input").attr('placeholder', 'Task #' + taskcount);
          } else {
               // alert("MAX TASK LIMIT REACHED");
          }
          $("#clearallbtn").show();
     });

     $("#clearallbtn").click(function() {
          $("div.newtaskcontainer").remove();

          $("#workingon").text("");
          $("#tname").removeClass().text("");

          resetTimer();
          $("#length").text("25:00");
          $("#interval").text("25");
          $("#command").attr("class", "signalstart").text("Challenge Me");

          taskcount = 0;
          $("#clearallbtn").hide();
     });

     $("#task-pane").on("click", "i.fa-window-close-o", function() {
          $(this).parent("div.newtaskcontainer").remove();
          taskcount--;
          if (taskcount === 0)
               $("#clearallbtn").hide();
     });

     /****************  Timer Pane Events **********************/
     var timerId;

     var updateTimer = function() {
          var time = $("#length").text().split(":");
          var min = parseInt(time[0], 10);
          var sec = parseInt(time[1], 10);
          var totalSeconds = min * 60 + sec;
          totalSeconds -= 1;

          if (totalSeconds === -1) {
               resetTimer();
          } else {
               min = Math.floor(totalSeconds / 60);
               sec = Math.floor(totalSeconds % 60);
               $("#length").text(min + ":" + ((sec <= 9) ? "0" + sec : sec));
          }
     };

     /* Called only when the timer is complete*/
     function resetTimer() {
          if (timerId) {
               clearInterval(timerId);
               timerId = null;
          }
          /* Once timer is not running hide the play/pause button */
          $("#control-bar>i").hide();
     }

     function startTimer() {
          /* reset running timer if any */
          if (timerId) {
               clearInterval(timerId);
               timerId = null;
          }
          /* Start timer */
          timerId = setInterval(updateTimer, 1000);
          $("#control-bar >i").attr("class", "fa fa-pause-circle").show();
     }

     function fetchTaskName() {
          var $input = $("input.titleinput:enabled").first();
          var name = "Changing World !!";

          if ($input.length) {
               name = $input.val() ? $input.val() : $input.attr("placeholder");
               $input.val(name);
               $input.addClass("currinput");
          }
          $("#workingon").text("Your Mission");
          $("#tname").attr("class", "styletask").text(name);
     }

     function HandleTaskEnd() {
          var $currinput = $("input.titleinput:enabled").first();

          if ($currinput.length) {
               $currinput.removeClass("currinput").addClass("completedinput").prop("disabled", true);
          }

          $("#workingon").text("Yay Its");
          $("#tname").attr("class", "stylebreak").text("Break Time");
     }

     /* Take Challenge - .signalstart
        Task Over      - .signalend */
     $("#command").click(function() {

          if (timerId) {
               clearInterval(timerId);
               timerId = null;
          }

          if ($("#command").hasClass("signalstart")) {
               $("#length").text("25:00");
               $("#interval").text("25");
               $(this).removeClass("signalstart").addClass("signalend").text("It's Done");
               $("#control-bar>i").attr("class", "fa fa-play-circle").show();
               fetchTaskName();
               $("#settings-panel").show();
          } else if ($("#command").hasClass("signalend")) {
               $("#length").text("3:00");
               $("#interval").text("3");
               $(this).removeClass("signalend").addClass("signalstart").text("Challenge Me");
               HandleTaskEnd();
               $("#control-bar>i").attr("class", "fa fa-play-circle").show();
          }
     });

     $("#control-bar").on("click", "i.fa-pause-circle", function() {
          /* Clicked Pause*/
          if (timerId) {
               clearInterval(timerId);
               timerId = null;
          }
          $("#control-bar>i").attr("class", "fa fa-play-circle");
     });

     $("#control-bar").on("click", "i.fa-play-circle", function() {
          /* Clicked Play */
          startTimer();
          $("#control-bar>i").attr("class", "fa fa-pause-circle");
     });

     $("div#settings-panel").hover(
          function() {
               $("i.fa-cogs").animate({
                    "font-size": "30px"
               }, "slow");
               $("div#settime").slideDown("slow");
          },
          function callback() {
               $("i.fa-cogs").animate({
                    "font-size": "50px"
               }, "slow");
               $("div#settime").slideUp("slow");
          });

     $("i.delta").on("click", function deltaChange() {
          if (!timerId) {
               var min = $("#interval").text();
               min = parseInt(min, 10);
               if ($(this).hasClass("fa-minus-circle")) {
                    if (min > 0) {
                         $("#interval").text(min - 1);
                         $("#length").text(min - 1 + ":00");
                    }
               } else {
                    if (min < 60) {
                         $("#interval").text(min + 1);
                         $("#length").text(min + 1 + ":00");
                    }
               }
          }
     });

     /* Auto start settings */
     $("#addtask").click();
     $("button.signalstart").click();
     /* Auto start settings */
});