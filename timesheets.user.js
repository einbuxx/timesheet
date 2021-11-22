// ==UserScript==
// @name         TimesheetHelper
// @namespace    https://github.com/einbuxx/
// @version      0.3
// @description  Add some useful functions to the time sheet site!
// @updateURL    https://github.com/einbuxx/timesheet/raw/main/timesheets.user.js
// @downloadURL  https://github.com/einbuxx/timesheet/raw/main/timesheets.user.js
// @author       Ralph Buchs
// @match        https://msweb.jpf.ch/activite*
// @icon         https://www.google.com/s2/favicons?domain=jpf.ch
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      http://code.jquery.com/ui/1.13.0/jquery-ui.js
// @grant        GM_addStyle
// ==/UserScript==
var $ = window.jQuery;

GM_addStyle('.hand {cursor:pointer; !important;}');



$(document).ready(function()
                  {

    //Config
    var btnHooverInputColor = "#C9E3E5";

    //Neuer Menueintrag für Horaire
    $("#navbarSupportedContent ul.navbar-right ").append('<li id="buttonHoraire" class="nav-item nav-link hand">Horaire</li>');

    //Dialogbox für horaire
    $("body").append('<div id="dialog_horaire" title="Horaire de la periode">'+
                     '<table border="0"> <tbody> '+
                     '<tr> '+
                     '<td>Periode 1</td> '+
                     '<td><input name="horaire_AM_deb" value="00:00" id="horaire_AM_deb" type="text" class="hours auto-sel" pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]" step="1500" onblur="ChkHourFormat(this,15);"></td> '+
                     '<td><input name="horaire_AM_fin" value="00:00" id="horaire_AM_fin" type="text" class="hours auto-sel" pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]" step="1500" onblur="ChkHourFormat(this,15);"></td> '+
                     '</tr> '+
                     '<tr> '+
                     '<td>Periode 2</td> <td><input name="horaire_PM_deb" value="00:00" id="horaire_PM_deb" type="text" class="hours auto-sel" pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]" step="1500" onblur="ChkHourFormat(this,15);"></td>'+
                     '<td><input name="horaire_PM_fin" value="00:00" id="horaire_PM_fin" type="text" class="hours auto-sel" pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]" step="1500" onblur="ChkHourFormat(this,15);"></td> '+
                     '</tr> '+
                     '<tr> '+
                     '<td>Periode 3</td> <td><input name="horaire_AA_deb" value="00:00" id="horaire_PM_deb" type="text" class="hours auto-sel" pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]" step="1500" onblur="ChkHourFormat(this,15);"></td>'+
                     '<td><input name="horaire_AA_fin" value="00:00" id="horaire_PM_fin" type="text" class="hours auto-sel" pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]" step="1500" onblur="ChkHourFormat(this,15);"></td> '+
                     '</tr> '+
                     '</tbody> </table></div>')

    //Dialogbox definieren
    var dialog = $( "#dialog_horaire" ).dialog({
        autoOpen: false,
        //         height: 400,
        //         width: 350,
        //position: ['center','20px'],
        position: { of: window, my: "top+30", at: "top+30" },
        //position: { my: "center", at: "top+30" },

        buttons: {
            "Ok": saveHoraire,
            Cancel: function() {
                $( this ).dialog( "close" );
            }
        },
        close: function() {

        }
    });
    $('.ui-widget-header').css("background-color","#bbdfe7");

    //Horaire einträge aus lokalem speicher laden, falls vorhanden
    var getUserSchedule = JSON.parse(window.localStorage.getItem('userSchedule'));
    if( getUserSchedule) {
        $("#horaire_AM_deb").val(getUserSchedule.amDeb) ;
        $("#horaire_AM_fin").val(getUserSchedule.amFin) ;
        $("#horaire_PM_deb").val(getUserSchedule.pmDeb) ;
        $("#horaire_PM_fin").val(getUserSchedule.pmFin) ;
        $("#horaire_AA_deb").val(getUserSchedule.aaDeb) ;
        $("#horaire_AA_fin").val(getUserSchedule.AAFin) ;
    }


    //Dialogbox anzeigen
    $( "#buttonHoraire" ).on( "click", function() {
        dialog.dialog( "open" );
    });

    //Horaire einträge lokal speichern
    function saveHoraire(){
        const userSchedule = {amDeb:$("#horaire_AM_deb").val() , amFin:$("#horaire_AM_fin").val(), pmDeb:$("#horaire_PM_deb").val(), pmFin:$("#horaire_PM_fin").val(), aaDeb:$("#horaire_AA_deb").val(), aaFin:$("#horaire_AA_fin").val()};
        window.localStorage.setItem('userSchedule', JSON.stringify(userSchedule));
        dialog.dialog( "close" );
    }

    //Platz für Equipe Icon schaffen
    $("#MainContent_GvChantier > thead > tr > th ").css("height","26px");


    //Equipe icon für jeden wochentag hinzufügen
    $( "#MainContent_GvChantier > thead > tr > th " ).each(function( index ) {
        if (index >0 && index < 8) {
            $(this).prepend('<svg xmlns="http://www.w3.org/2000/svg" '+
                            'id="copyToAll_'+(index+1)+'" '+
                            'width="16" '+
                            'height="16" '+
                            'style="vertical-align: middle; margin-right: 3px; cursor:pointer;" '+
                            'fill="currentColor" '+
                            'class="equipeBtn bi bi-people" '+
                            'viewBox="0 0 16 16">'+
                            '<path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>'+
                            '</svg>');
        }
    });


    //Verhalten von equipe button
    var weekDay;
    var workerNumber;
    var defaultInputColor;
    var buttonId;

    $("svg.equipeBtn").on({
        mouseenter: function () {
            buttonId = $(this).attr("id").split("_");
            weekDay = buttonId[1];
            defaultInputColor = $("input[name*='AM_"+weekDay+"']").css( "background-color");

            $("input[name*='AM_"+weekDay+"'], input[name*='PM_"+weekDay+"'], input[name*='AA_"+weekDay+"']").css( "background-color", btnHooverInputColor );
        },
        mouseleave: function () {
            $("input[name*='AM_"+weekDay+"'], input[name*='PM_"+weekDay+"'], input[name*='AA_"+weekDay+"']").css( "background-color", defaultInputColor);
        },
        click: function() {

            $("td input[name*='AM_"+weekDay+"_deb']").val($("#horaire_AM_deb").val());
            $("td input[name*='AM_"+weekDay+"_fin']").val($("#horaire_AM_fin").val());

            $("td input[name*='PM_"+weekDay+"_deb']").val($("#horaire_PM_deb").val());
            $("td input[name*='PM_"+weekDay+"_fin']").val($("#horaire_PM_fin").val());

            $("td input[name*='AA_"+weekDay+"_deb']").val($("#horaire_AA_deb").val());
            $("td input[name*='AA_"+weekDay+"_fin']").val($("#horaire_AA_fin").val());

        }
    });



    var workerAndDayNumber;
    //Worker icon für jeden Arbeiter und wochentag hinzufügen
    $('tr.categorie td img[src*="rmqvide.png"]').each(function( index ) {

        buttonId = $(this).attr("id").split("_");
        weekDay = (Number(buttonId[2])+1);
        workerNumber = buttonId[1];


        $('<svg xmlns="http://www.w3.org/2000/svg" '+
          'id="copyTo_' + weekDay + '_' + workerNumber + '" '+
          'style="vertical-align: middle; margin-right: 3px; cursor:pointer;"  '+
          'width="16" '+
          'height="16" '+
          'fill="" '+
          'class="bi bi-person workerBtn" '+
          'viewBox="0 0 16 16">'+
          '<path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>'+
          '</svg>').insertBefore(this);

    });

    //Verhalten von worker button
    $("svg.workerBtn").on({
        mouseenter: function () {

            buttonId = $(this).attr("id").split("_");
            weekDay = buttonId[1];
            workerNumber = buttonId[2];

            defaultInputColor = $("input[name*='AM_" + weekDay + "']").css( "background-color");
            $("input[name*='_" + workerNumber + "_'][name*='AM_" + weekDay + "'],"+
              "input[name*='_" + workerNumber + "_'][name*='PM_" + weekDay + "'],"+
              "input[name*='_" + workerNumber + "_'][name*='AA_" + weekDay + "']" ).css( "background-color", btnHooverInputColor );

        },
        mouseleave: function () {
            $("input[name*='_" + workerNumber + "_'][name*='AM_" + weekDay + "'],"+
              "input[name*='_" + workerNumber + "_'][name*='PM_" + weekDay + "'],"+
              "input[name*='_" + workerNumber + "_'][name*='AA_" + weekDay + "']" ).css( "background-color", defaultInputColor );
        },
        click: function() {

            $("td input[name*='_" + workerNumber + "_'][name*='AM_" + weekDay + "_deb']").val($("#horaire_AM_deb").val());
            $("td input[name*='_" + workerNumber + "_'][name*='AM_" + weekDay + "_fin']").val($("#horaire_AM_fin").val());

            $("td input[name*='_" + workerNumber + "_'][name*='PM_" + weekDay + "_deb']").val($("#horaire_PM_deb").val());
            $("td input[name*='_" + workerNumber + "_'][name*='PM_" + weekDay + "_fin']").val($("#horaire_PM_fin").val());

            $("td input[name*='_" + workerNumber + "_'][name*='AA_" + weekDay + "_deb]'").val($("#horaire_AA_deb").val());
            $("td input[name*='_" + workerNumber + "_'][name*='AA_" + weekDay + "_fin]'").val($("#horaire_AA_fin").val());


        }
    });
});
