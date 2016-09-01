/***************************************************************************************************
 *   File Name  : Datalog.js
 *   Author   : xxxxx xxxxx
 *   Date of Creation: July, 2015
 *   Last Modified : September, 2015
 *   Copy rights Information : �2015 All rights reserved by TCS.
 *   Description : This file is used to send the soap request and get the respnse data.
 ****************************************************************************************************/

define(['knockout'], function(ko) {
    return function Datalog() {
        var self = this;
        self.pageId = "Datalog";
        var db = openDatabase('RDPApp', '1.0', 'Test DB', 2 * 1024 * 1024);
        document.getElementById("gesn-no-list").style.display = "none";
        $(".datalogtile-historical").css("height", "100px");
        $(".datalogtile-historical").css("overflow", "hidden");
        $(".history-log-body").css("height", "80px");
        $(".history-log-body").css("overflow", "hidden");
        self.upTimeHours = ko.observable();
        self.upTimeMinutes = ko.observable();
        self.upTimeNotes = ko.observable('');
        self.idleTimeHours = ko.observable();
        self.idleTimeMinutes = ko.observable();
        self.idleTimeNotes = ko.observable('');
        self.plannedOutageHrs = ko.observable();
        self.plannedOutageMinutes = ko.observable();
        self.plannedOutageNotes = ko.observable('');
        self.unplannedOutageHrs = ko.observable();
        self.unplannedOutageMinutes = ko.observable();
        self.unplannedOutageNotes = ko.observable('');
        self.dataLogNotes = ko.observable('');
        self.pickedGesnNo = ko.observable();
        self.pickedDate = ko.observable();
        self.dataLogsList = ko.observableArray();
        var dataLogsListTempData = [];
        self.dataLogsHistoryList = ko.observableArray();
        self.valueOptions = ko.observableArray(['Percentage', 'Value']);
        self.selectedChoice = ko.observable();
        self.gesnList = ko.observableArray();
        var datalogFromDate;
        var historyFromDate;
        var datalogToDate;
        var historyToDate;
        self.datalogFromDate = ko.observable();
        self.datalogToDate = ko.observable();
        self.historyFromDate = ko.observable();
        self.historyToDate = ko.observable();
        // var autoFillGesn;
        //for static datalog
        var pickedGesnNo = '';
        var pickedDate;
        //for static datalog
        var todayDate = '';
        var todayDateThreeLetterMonthFormat = '';
        var currentTime = '';
        var currentGesn = '';
        var upTimeHours;
        var upTimeMinutes;
        var upTimeNotes = '';
        var idleTimeHours;
        var idleTimeMinutes;
        var idleTimeNotes = '';
        var plannedOutageHrs;
        var plannedOutageMinutes;
        var plannedOutageNotes = '';
        var unplannedOutageHrs;
        var unplannedOutageMinutes;
        var unplannedOutageNotes = '';
        var dataLogNotes = '';
        var userProfile;
        var gesnArrayGlobal;
//        var datalog = new Object();
        var isEdit;
        // webServiceURL_getHistoricalNotes = 'http://3.209.197.8:8084/empowerme/historicalnotes';
        //   webServiceURL_getDataLogs = 'http://3.209.197.8:8084/empowerme/datalogs';
        self.init = function(gesnArray, userProfileFromGlobalMenu) {
            currentPageId = self.pageId;
            userProfile = userProfileFromGlobalMenu;
            var toDayDate = currDate();
            $(".date-select").val('');
            resetScrollInDatalog();
            //resetScrollInDatalog();
            // self.currDateToDate(toDayDate);
            datePickerFunctions();
            datalogFromDate = null;
            historyFromDate = null;
            datalogToDate = null;
            historyToDate = null;
            autoFillGesn(gesnArray);
            gesnArrayGlobal = [];
            for (var i = 0; i < gesnArray.length; i++)
                gesnArrayGlobal.push(gesnArray[i].globalSerialNumber);
            // self.getDataForDatalogFromWebService();
            // self.getDataForHistoryFromWebService();
            self.allUnitsTab();
            //        datePickersInitiation();
        };

        //Gesn Auto fill functionality----------------------------------------------start----------
        //-----------------------------------------------------------------------------------------
        autoFillGesn = function(gesnArray) {
            console.log(gesnArray);
            self.gesnList(gesnArray);
            $('html').click(function() {
                $('#gesn-no-list').hide();
                $('.gm-gesn').hide();
            });

        };
        self.dropdownGesnDiv = function(data, event) {
            console.log("in dropdown gesn div");
            console.log("hello");
            console.log(event);
            console.log(event.currentTarget.nextElementSibling);
            var x = event.currentTarget.nextElementSibling.style.display;
            console.log(x);
            if (x == "none") {
                event.currentTarget.nextElementSibling.style.display = "block";
            } else if (x == "block") {
                event.currentTarget.nextElementSibling.style.display = "none";
            }
        };

        self.searchGesn = function(data, event) {
            document.getElementById("gesn-no-list").style.display = "block";
            var target = event.target;
            if (typeof event !== "undefined") {
                var KeyID = event.keyCode;
                var userString1 = $("#gesn-tag").val().trim();
                var userString = userString1.toUpperCase();
                console.log("userString");
                if (KeyID === 8) {
                    $(".gm-gesn:contains(" + userString + ")").show();
                } else {
                    $(".gm-gesn:contains(" + userString + ")").show();
                    $(".gm-gesn:not(:contains(" + userString + "))").hide();
                }
            }

        };

        self.clickedGesn = function(data, event) {
            console.log("Inside clickedElement");
            console.log(data);
            self.pickedGesnNo(data.globalSerialNumber);
            console.log(self.pickedGesnNo());
            $("#gesn-tag").val(data.globalSerialNumber);
            document.getElementById("gesn-no-list").style.display = "none";
            var dateToBePassed = self.pickedDate();
            console.log(validateDateDatalog(dateToBePassed));
            if (validateDateDatalog(dateToBePassed)) {
                console.log("insideIF");
                callForHistory();
            }
        };

        self.onClickGesn = function(data, event) {
            console.log("in oncliockgesn");
            console.log(event);
            $('#gesn-no-list').show();
            $('.gm-gesn').show();
            event.stopPropagation();
        };
        //---------------------------------------------------------------------------------------
        //Gesn Auto fill functionality----------------------------------------------end----------

        self.allUnitsTab = function() {
            self.resetDatalog();
            $("#all-units").show();
            $("#all-units-tab").css('background-color', '#4e79d1');
            $("#all-units-tab").css('color', 'white');
            $("#todate-datepicker").datepicker('option', 'minDate', null);
            $("#allunits-datepicker").datepicker('option', 'maxDate', currDate());
            self.getDataForDatalogFromWebService();
            //			if (navigationStatus.Datalog == "Active") {
            //				clearAllIntervals();
            //				dataLogWebserviceCallAll = setInterval(self.getDataForDatalogFromWebService, 30000);
            //			}
            // self.getDataForHistoryFromWebService();
        };
        self.addDatalogTab = function() {
            self.resetDatalog();
            $("#add-datalog").show();
            $("#add-datalog-tab").css('background-color', '#4e79d1');
            $("#add-datalog-tab").css('color', 'white');
            clearAllIntervals();
        };
        self.historicalNotesTab = function() {
            self.resetDatalog();
            $("#historical-notes").show();
            $("#historical-notes-tab").css('color', 'white');
            $("#historical-notes-tab").css('background-color', '#4e79d1');
            $("#todate-datepicker-history").datepicker('option', 'minDate', null);
            $("#history-datepicker").datepicker('option', 'maxDate', currDate());
            showLoader();
            self.getDataForHistoryFromWebService();
            // if (navigationStatus.Datalog == "Active") {
            // clearAllIntervals();
            // dataLogWebserviceCallHistory = setInterval(self.getDataForHistoryFromWebService, 30000);
            // }
        };
        self.resetDatalog = function() {
            $(".datalog-container").hide();
            $(".date-select").val('');
            self.datalogFromDate('');
            self.datalogToDate('');
            self.historyFromDate('');
            self.historyToDate('');
            datalogFromDate = null;
            datalogToDate = null;
            historyFromDate = null;
            historyToDate = null;
            resetDatalogFields();
            self.selectedChoice("Percentage");
            $(".datalog-tabs").css('color', '#4e79d1');
            $(".datalog-tabs").css('background-color', 'white');
            isEdit = "No";
            document.getElementById("gesn-tag").disabled = false;
            $("#createDatalog").html("Create log");
        };

        self.resetDateTab = function() {
            self.datalogFromDate('');
            self.datalogToDate('');
            self.historyFromDate('');
            self.historyToDate('');
            $("#todate-datepicker").datepicker('option', 'minDate', null);
            $("#allunits-datepicker").datepicker('option', 'maxDate', currDate());
            $("#todate-datepicker-history").datepicker('option', 'minDate', null);
            $("#history-datepicker").datepicker('option', 'maxDate', currDate());
        };

        self.openDataLogPopUpFromDatalog = function(data, event) {
            console.log("clicked data log");
            console.log(data);
            config.bindViewModel(app.DatalogPopup, function(viewModel) {
                app.DatalogPopup.vModel.init(userProfile, "Asset", data.gesn, currDate());
                showDataLogPopUp();
            });
        };

        self.collapseExpandDatalog = function(data, event) {
            //console.log(data);
            // console.log(event);
            // console.log(event.target);
            // console.log(event.target.id);
            // console.log(event.currentTarget.nextSibling.parentElement);
            //            var x = event.currentTarget;
            var x = event.currentTarget.nextSibling.parentNode;
            if (x.style.height == "100px") {
                self.defaultExpandCollapseDatalog();
                x.style.height = "200px";
                x.style.overflow = "auto";
                x.children[1].style.height = "160px";
                x.children[1].style.overflow = "auto";
                x.children[2].style.backgroundImage = 'url("../img/Notification/X-Notification-up-dropdown-arrow.png")';
                x.children[3].style.display = "block";
            } else {
                self.defaultExpandCollapseDatalog();
                x.style.height = "100px";
                x.style.overflow = "hidden";
                x.children[1].style.height = "80px";
                x.children[1].style.overflow = "hidden";
                x.children[2].style.backgroundImage = 'url("../img/Notification/X-Notification-down-dropdown-arrow.png")';
                x.children[3].style.display = "none";
            }

        };

        self.defaultExpandCollapseDatalog = function() {
            $(".datalogtile-historical").css('height', '100px');
            $(".datalogtile-historical").css('overflow', 'hidden');
            $(".edit-button").css('display', 'none');
        };
        self.getDataForHistoryFromWebService = function(range) {
            console.log("in history");
            if (range == null || range == undefined) {
                var startDate = '';
                var endDate = '';
                showLoader();
                console.log(startDate + "    " + endDate);
                callService(webServiceURL_getHistoricalNotes + '?globalDUNSNumber=' + globalDUNSNumber + '&startDate=&endDate=', '', 'GET', getDataForHistoryFromWebServiceSuccess, getDataForHistoryFromWebServiceError);
            } else if (range == "Range") {
                var startDate = self.historyFromDate();
                var endDate = self.historyToDate();
                console.log(startDate + "    " + endDate);
                showLoader();
                callService(webServiceURL_getHistoricalNotes + '?globalDUNSNumber=' + globalDUNSNumber + '&startDate=' + startDate + '&endDate=' + endDate, '', 'GET', getDataForHistoryFromWebServiceSuccess, getDataForHistoryFromWebServiceError);
            }
        };
        getDataForHistoryFromWebServiceSuccess = function(data) {
            data = $.parseJSON(data);
            console.log(data);
            var newhistoricalNotes = [];
            if (data.historicalNotes == null) {
                $(".datalogtile-historical").hide();
                hideLoader();
            } else if (data.historicalNotes.length == 0) {
                $(".datalogtile-historical").hide();
                hideLoader();
            } else {
                $(".datalogtile-historical").show();
                self.dataLogsHistoryList(data.historicalNotes);
                hideLoader();
            }
        };
        getDataForHistoryFromWebServiceError = function(result, status) {
            data = $.parseJSON(result);
            if (data.errorCode == "RESOURCE_NOT_FOUND") {
                alert("Data is not available, for requested date range!");
                $(".datalogtile-historical").hide();
            }
            if (status != 404) {
                errorHandling(status);
            }
            //            alert(data.errorMessage);
            hideLoader();
        };
        self.getDataForDatalogFromWebService = function(range) {
            if (range == null || range == undefined) {
                var startDate = '';
                var endDate = currDate();
                showLoader();
                console.log(startDate + "    " + endDate);
                callService(webServiceURL_getDataLogs + '?globalDUNSNumber=' + globalDUNSNumber + '&startDate=&endDate=' + endDate, '', 'GET', getDataForDatalogFromWebServiceSuccess, getDataForDatalogFromWebServiceError);
            } else if (range == "Range") {
                var startDate = self.datalogFromDate();
                var endDate = self.datalogToDate();
                console.log(startDate + "    " + endDate);
                showLoader();
                callService(webServiceURL_getDataLogs + '?globalDUNSNumber=' + globalDUNSNumber + '&startDate=' + startDate + '&endDate=' + endDate, '', 'GET', getDataForDatalogFromWebServiceSuccess, getDataForDatalogFromWebServiceError);
            }
        };
        getDataForDatalogFromWebServiceSuccess = function(data) {
            data = $.parseJSON(data);
            console.log(data);
            console.log(gesnArrayGlobal);
            if (data.dataLogsList == null) {
                $(".datalogtile").hide();
                hideLoader();
            } else if (data.dataLogsList.length == 0) {
                $(".datalogtile").hide();
                hideLoader();
            } else {
                $(".datalogtile").show();
                var newdataloglist = [];
                dataLogsListTempData = data.dataLogsList;
                if (self.selectedChoice() == "Value")
                    self.selectedChoiceValue();
                else
                    self.selectedChoicePercentage();
                hideLoader();
            }
        };

        getDataForDatalogFromWebServiceError = function(result, status) {
            data = $.parseJSON(result);
            if (data.errorCode == "RESOURCE_NOT_FOUND") {
                alert("Data is not available, for requested date range!", "Message");
                $(".datalogtile").hide();
            }
            hideLoader();
            if (status != 404) {
                errorHandling(status);
            }
        };
        self.changedDropDown = function(data, event) {
            console.log(self.selectedChoice());
            var selectedChoice = self.selectedChoice();
            var temp = self.dataLogsList();
            if (selectedChoice == "Value") {
                self.selectedChoiceValue();
            } else {
                self.selectedChoicePercentage();
            }
            hideLoader();
        };
        self.selectedChoiceValue = function() {
            var datalogtemp = [];
            for (i = 0; i < dataLogsListTempData.length; i++) {
                var a = Number(dataLogsListTempData[i].upTime);
                var b = Number(dataLogsListTempData[i].idleTime);
                var c = Number(dataLogsListTempData[i].plannedOutageTime);
                var d = Number(dataLogsListTempData[i].unPlannedOutageTime);
                datalogtemp.push({
                    gesn: dataLogsListTempData[i].gesn_unit_detail,
                    logDate: dataLogsListTempData[i].logDate,
                    upTimePercent: (Math.round(a * 10000 / (a + b + c + d)) / 100) + "%",
                    idleTimePercent: (Math.round(b * 10000 / (a + b + c + d)) / 100) + "%",
                    plannedOutageTimePercent: (Math.round(c * 10000 / (a + b + c + d)) / 100) + "%",
                    unPlannedOutageTimePercent: (Math.round(d * 10000 / (a + b + c + d)) / 100) + "%",
                    upTimeVal: a,
                    idleTimeVal: b,
                    plannedOutageTimeVal: c,
                    unPlannedOutageTimeVal: d
                });
            }
            self.dataLogsList(datalogtemp);
            self.selectedChoice("Value");
        };
        self.selectedChoicePercentage = function() {
            var datalogtemp = [];
            for (i = 0; i < dataLogsListTempData.length; i++) {
                var a = Number(dataLogsListTempData[i].upTime);
                var b = Number(dataLogsListTempData[i].idleTime);
                var c = Number(dataLogsListTempData[i].plannedOutageTime);
                var d = Number(dataLogsListTempData[i].unPlannedOutageTime);
                datalogtemp.push({
                    gesn: dataLogsListTempData[i].gesn_unit_detail,
                    logDate: dataLogsListTempData[i].logDate,
                    upTimePercent: (Math.round(a * 10000 / (a + b + c + d)) / 100) + "%",
                    idleTimePercent: (Math.round(b * 10000 / (a + b + c + d)) / 100) + "%",
                    plannedOutageTimePercent: (Math.round(c * 10000 / (a + b + c + d)) / 100) + "%",
                    unPlannedOutageTimePercent: (Math.round(d * 10000 / (a + b + c + d)) / 100) + "%",
                    upTimeVal: (Math.round(a * 10000 / (a + b + c + d)) / 100) + "%",
                    idleTimeVal: (Math.round(b * 10000 / (a + b + c + d)) / 100) + "%",
                    plannedOutageTimeVal: (Math.round(c * 10000 / (a + b + c + d)) / 100) + "%",
                    unPlannedOutageTimeVal: (Math.round(d * 10000 / (a + b + c + d)) / 100) + "%"
                });
            }
            self.dataLogsList(datalogtemp);
            self.selectedChoice("Percentage");
        };

        self.createDataLog = function() {
            //            $(".datalog-input-container input").css('background-color', '#EDEDED');
            //            $(".datalog-input-container textarea").css('background-color', '#EDEDED');
            upTimeHours = self.upTimeHours();
            upTimeMinutes = self.upTimeMinutes();
            upTimeNotes = self.upTimeNotes();
            idleTimeHours = self.idleTimeHours();
            idleTimeMinutes = self.idleTimeMinutes();
            idleTimeNotes = self.idleTimeNotes();
            plannedOutageHrs = self.plannedOutageHrs();
            plannedOutageMinutes = self.plannedOutageMinutes();
            plannedOutageNotes = self.plannedOutageNotes();
            unplannedOutageHrs = self.unplannedOutageHrs();
            unplannedOutageMinutes = self.unplannedOutageMinutes();
            unplannedOutageNotes = self.unplannedOutageNotes();
            dataLogNotes = self.dataLogNotes();
            pickedGesnNo = self.pickedGesnNo();
            pickedDate = self.pickedDate();


            console.log(pickedDate);
            if (validategesnDatalog(pickedGesnNo)) {
                if (validateDateDatalog(pickedDate)) {
                    if (checkTime(upTimeHours, upTimeMinutes)) {
                        if (checkTime(idleTimeHours, idleTimeMinutes)) {
                            if (checkTime(plannedOutageHrs, plannedOutageMinutes)) {
                                if (checkTime(unplannedOutageHrs, unplannedOutageMinutes)) {
                                    if (totalTimeValidation()) {
                                        console.log("valid");
                                        self.postWebService();
                                    } else
                                        console.log("total should be 24hours");
                                } else
                                    alert("Please enter valid data");
                            } else
                                alert("Please enter valid data");
                        } else
                            alert("Please enter valid data");
                    } else
                        alert("Please enter valid data");
                } else
                    alert("Please enter valid date");
            } else
                alert("Please enter proper unit serial number");

            if (checkTime(upTimeHours, upTimeMinutes) == false) {
                $("#uptimeHr").css('background-color', '#F1C5C5');
                $("#uptimeMn").css('background-color', '#F1C5C5');
            }
            if (checkTime(idleTimeHours, idleTimeMinutes) == false) {
                $("#idletimeHr").css('background-color', '#F1C5C5');
                $("#idletimeMn").css('background-color', '#F1C5C5');
            }
            if (checkTime(plannedOutageHrs, plannedOutageMinutes) == false) {
                $("#plannedHr").css('background-color', '#F1C5C5');
                $("#plannedMn").css('background-color', '#F1C5C5');
            }
            if (checkTime(unplannedOutageHrs, unplannedOutageMinutes) == false) {
                $("#unplannedHr").css('background-color', '#F1C5C5');
                $("#unplannedMn").css('background-color', '#F1C5C5');
            }
        };

        self.cancelDataLog = function() {
//            hideDataLogPopUp();
            resetDatalogFields();
            document.getElementById("gesn-tag").disabled = false;
            isEdit = "No";
            $("#createDatalog").html("Create log");
            //            $(".datalog-input-container input").css('background-color', '#EDEDED');
            //            $(".datalog-input-container textarea").css('background-color', '#EDEDED');
        };
        self.postWebService = function() {
            showLoader();
            var datalog = editDataLogParseFunction();
            var jsonDatalog = JSON.stringify(datalog);
            console.log(datalog);
            console.log(jsonDatalog);
            //       alert(jsonDatalog);
            if (isEdit == "Yes") {
                callService(webServiceURL_editDatalog, jsonDatalog, 'POST', postWebServiceSuccess, postWebServiceError);
            } else if (isEdit == "No") {
                callService(webServiceURL_createDatalog, jsonDatalog, 'POST', postWebServiceSuccess, postWebServiceError);
            }

        };

        postWebServiceSuccess = function(result) {
            hideLoader();
            alert(result);
            self.cancelDataLog();
        };

        postWebServiceError = function(result, status) {
            hideLoader();
            errorHandling(status);
            self.resetDatalog();
        };

        editDataLogParseFunction = function() {
            if (isEdit == "Yes") {
                var datalogEdit = ({
                    data_log: {
                        gesn_unit_detail: self.pickedGesnNo(),
                        globalDUNSNumber: globalDUNSNumber,
                        log_date: self.pickedDate(),
                        uptime_hours: self.upTimeHours(),
                        uptime_minutes: self.upTimeMinutes(),
                        uptime_notes: self.upTimeNotes(),
                        idletime_hours: self.idleTimeHours(),
                        idletime_minutes: self.idleTimeMinutes(),
                        idletime_notes: self.idleTimeNotes(),
                        planned_outage_hours: self.plannedOutageHrs(),
                        planned_outage_minutes: self.plannedOutageMinutes(),
                        planned_outage_notes: self.plannedOutageNotes(),
                        unplanned_outage_hours: self.unplannedOutageHrs(),
                        unplanned_outage_minutes: self.unplannedOutageMinutes(),
                        unplanned_outage_notes: self.unplannedOutageNotes(),
                        data_log_notes: self.dataLogNotes()
                    }
                });
                return datalogEdit;
            } else if (isEdit == "No") {
                var datalogAdd = ({
                    dataLog: {
                        gesn_unit_detail: self.pickedGesnNo(),
                        globalDUNSNumber: globalDUNSNumber,
                        logDate: self.pickedDate(),
                        upTimehours: self.upTimeHours(),
                        upTimeminutes: self.upTimeMinutes(),
                        upTimenotes: self.upTimeNotes(),
                        idleTimehours: self.idleTimeHours(),
                        idleTimeminutes: self.idleTimeMinutes(),
                        idleTimenotes: self.idleTimeNotes(),
                        plannedOutagehours: self.plannedOutageHrs(),
                        plannedOutageminutes: self.plannedOutageMinutes(),
                        plannedOutagenotes: self.plannedOutageNotes(),
                        unplannedOutagehours: self.unplannedOutageHrs(),
                        unplannedOutageminutes: self.unplannedOutageMinutes(),
                        unplannedOutagenotes: self.unplannedOutageNotes(),
                        dataLogNotes: self.dataLogNotes()
                    }
                });
                return datalogAdd;
            }
        };
        self.searchDatalog = function(data, event) {
            var target = event.target;
            if (typeof event !== "undefined") {
                var KeyID = event.keyCode;
                var userString = $("#search-machine-datalog").val().trim();
                userString = userString.toUpperCase();
                console.log("userString");
                if (KeyID === 8) {
                    $(".datalogtile:contains(" + userString + ")").show();
                    $(".datalogtile-historical:contains(" + userString + ")").show();
                } else {
                    $(".datalogtile:contains(" + userString + ")").show();
                    $(".datalogtile:not(:contains(" + userString + "))").hide();
                    $(".datalogtile-historical:contains(" + userString + ")").show();
                    $(".datalogtile-historical:not(:contains(" + userString + "))").hide();
                };
            };

        };
        self.changedDatalogDate = function(data, event) {
            pickedDate = self.pickedDate();
            console.log(pickedDate);
            var gesnValidity = self.pickedGesnNo();
            if (validategesnDatalog(gesnValidity)) {
                callForHistory();
            }
        };
        self.changedGetDatalogDate = function() {
            var fromDate = self.datalogFromDate();
            var toDate = self.datalogToDate();
            if (fromDate == '' || fromDate == null || fromDate == undefined) {
                $("#todate-datepicker").datepicker('option', 'minDate', null);
            } else {
                $("#todate-datepicker").datepicker('option', 'minDate', fromDate);
            }
            if (toDate == '' || toDate == null || toDate == undefined) {
                $("#allunits-datepicker").datepicker('option', 'maxDate', null);
            } else {
                $("#allunits-datepicker").datepicker('option', 'maxDate', toDate);
            }
            console.log("FromDate: " + fromDate + ", toDate: " + toDate);
            //datePickerFunctions();
            if (validateDateDatalog(fromDate) && validateDateDatalog(toDate)) {
                console.log("Ready to call webservice:");
                self.getDataForDatalogFromWebService("Range");
            }
        };

        self.changedGetHistoricalDate = function() {
            var fromDate = self.historyFromDate();
            var toDate = self.historyToDate();
            if (fromDate == '' || fromDate == null || fromDate == undefined) {
                $("#todate-datepicker-history").datepicker('option', 'minDate', null);
            } else {
                $("#todate-datepicker-history").datepicker('option', 'minDate', fromDate);
            }
            if (toDate == '' || toDate == null || toDate == undefined) {
                $("#history-datepicker").datepicker('option', 'maxDate', null);
            } else {
                $("#history-datepicker").datepicker('option', 'maxDate', toDate);
            }
            console.log("FromDate: " + fromDate + ", toDate: " + toDate);
            if (validateDateDatalog(fromDate) && validateDateDatalog(toDate)) {
                console.log("Ready to call webservice:");
                self.getDataForHistoryFromWebService("Range");
            }
        };

        datePickerFunctions = function() {
            $("#allunits-datepicker").datepicker({
                maxDate: +0,
                dateFormat: 'yy-mm-dd'
            });
            $("#todate-datepicker").datepicker({
                maxDate: +0,
                dateFormat: 'yy-mm-dd'
            });
            $("#history-datepicker").datepicker({
                maxDate: +0,
                dateFormat: 'yy-mm-dd'
            });
            $("#todate-datepicker-history").datepicker({
                maxDate: +0,
                dateFormat: 'yy-mm-dd'
            });
            $("#datalog-date-select").datepicker({
                maxDate: +0,
                beforeShowDay: availableLogs,
                dateFormat: 'yy-mm-dd'
            });
            $("#Datalog").bind("click touchstart", function(event) {
                $('.ui-datepicker-div').hide();
            });
        };

        var datesAvailableForDatalogs = [];
        availableLogs = function(date) {
            //console.log(date);
            calenderDays = currDate(date);
            //console.log('xyz: '+xyz);
            //console.log('abc: '+abc);
            if ($.inArray(calenderDays, datesAvailableForDatalogs) != -1) {
                return [true, 'availableLog', 'Log is available'];
            } else {
                return [true, '', ''];
            }

        };


        validategesnDatalog = function(gesnAddDatalog) {
            //console.log(gesnArray);
            for (i = 0; i < gesnArrayGlobal.length; i++) {
                if (gesnArrayGlobal[i] == gesnAddDatalog) {
                    console.log("found: " + i);
                    return true;
                } else if (i == gesnArrayGlobal.length - 1) {
                    console.log("last one: " + i + ", last2: " + gesnArrayGlobal.length - 1);
                    if (gesnArrayGlobal[i] != gesnAddDatalog) {
                        return false;
                    }
                }
            };
        };

        validateDateDatalog = function(passedDate) {
            var dateSelected = passedDate;
            console.log(dateSelected);
            if (dateSelected == "" || dateSelected == undefined) {
                return false;
            } else {
                return true;
            }
        };

        codeToBeUsedInFuture = function(historicalNotes) {
            for (i = 0; i < historicalNotes.length; i++) {
                if (gesn == historicalNotes[i].gesn) {
                    console.log("gesn: " + i);
                    if (dateOf == historicalNotes[i].logDate) {
                        console.log("date: " + i);
                        break;
                    }
                }
            }
        };

        callForHistory = function() {
            showLoader();
            var gesn = self.pickedGesnNo();
            var dateOf = self.pickedDate();
            callService(webServiceURL_getDatalogToCheck + '?serialNumber=' + gesn + '&logDate=' + dateOf, '', 'GET', getDataForSpecificDayGesnSuccess, getDataForSpecificDayGesnError);
            //callService(webServiceURL_getHistoricalNotes + '?globalDUNSNumber=' + globalDUNSNumber + '&startDate=&endDate=', '', 'GET', SuccessTemp, ErrorTemp);
        };

        self.editDataLog = function(data, event) {
            console.log(data);
            config.bindViewModel(app.DatalogPopup, function(viewModel) {
                app.DatalogPopup.vModel.init(userProfile, "Datalog", data);
                showDataLogPopUp();
            });
        };
        getDataForSpecificDayGesnSuccess = function(data) {
            data = $.parseJSON(data);
            console.log(data);
            var datalogDataTemp = ({
                dataLogNotes: data.data_log_notes,
                gesn: data.gesn_unit_detail,
                idleTimeHours: data.idletime_hours,
                idleTimeMinutes: data.idletime_minutes,
                idleTimeNotes: data.idletime_notes,
                logDate: data.log_date,
                plannedOutageNotes: data.planned_outage_notes,
                plannedOutageTimeHours: data.planned_outage_hours,
                plannedOutageTimeMinutes: data.planned_outage_minutes,
                unPlannedOutageNotes: data.unplanned_outage_notes,
                unPlannedOutageTimeHours: data.unplanned_outage_hours,
                unPlannedOutageTimeMinutes: data.unplanned_outage_minutes,
                upTimeHours: data.uptime_hours,
                upTimeMinutes: data.uptime_minutes,
                upTimeNotes: data.uptime_notes
            });
            fillDatalogFields(datalogDataTemp);
            document.getElementById("gesn-tag").disabled = true;
            isEdit = "Yes";
            $("#createDatalog").html("Edit log");
            hideLoader();
        };
        getDataForSpecificDayGesnError = function(data, status) {
            hideLoader();
            resetDatalogFields("except date, gesn");
            document.getElementById("gesn-tag").disabled = false;
            isEdit = "No";
            $("#createDatalog").html("Create log");
            if (status == 404) {
                alert("No data found, please create new Datalog", "Message");
            } else {
                errorHandling(status);
            }
        };
        fillDatalogFields = function(dataLogFieldsObject) {
            self.upTimeHours(dataLogFieldsObject.upTimeHours);
            self.upTimeMinutes(dataLogFieldsObject.upTimeMinutes);
            self.upTimeNotes(dataLogFieldsObject.upTimeNotes);
            self.idleTimeHours(dataLogFieldsObject.idleTimeHours);
            self.idleTimeMinutes(dataLogFieldsObject.idleTimeMinutes);
            self.idleTimeNotes(dataLogFieldsObject.idleTimeNotes);
            self.plannedOutageHrs(dataLogFieldsObject.plannedOutageTimeHours);
            self.plannedOutageMinutes(dataLogFieldsObject.plannedOutageTimeMinutes);
            self.plannedOutageNotes(dataLogFieldsObject.plannedOutageNotes);
            self.unplannedOutageHrs(dataLogFieldsObject.unPlannedOutageTimeHours);
            self.unplannedOutageMinutes(dataLogFieldsObject.unPlannedOutageTimeMinutes);
            self.unplannedOutageNotes(dataLogFieldsObject.unPlannedOutageNotes);
            self.dataLogNotes(dataLogFieldsObject.dataLogNotes);
            self.pickedGesnNo(dataLogFieldsObject.gesn);
            self.pickedDate(dataLogFieldsObject.logDate);
            $(".datalog-input-container input").css('background-color', '#E1F1D3');
            $(".datalog-input-container textarea").css('background-color', '#E1F1D3');
        }

        /***********************************************/
        /*********For Datalog****************************/
        checkTime = function(hours, minutes) {
            var hoursNo = Number(hours);
            var minutesNo = Number(minutes);
            console.log(hoursNo);
            console.log(minutesNo);
            var temp1 = hoursNo * 10 / 10;
            var temp2 = minutesNo * 10 / 10;
            var hoursStg = String(temp1);
            var minuteStg = String(temp2);
            if (hours > 24 || hours < 0 || minutes < 0 || minutes > 59 || hours == undefined || minutes == undefined || hours != hoursStg || minutes != minuteStg || hours % 1 != 0 || minutes % 1 != 0)
                return false;
            else
                return true;
        };
        totalTimeValidation = function() {
            upTimeHours = Number(upTimeHours);
            upTimeMinutes = Number(upTimeMinutes);
            idleTimeHours = Number(idleTimeHours);
            idleTimeMinutes = Number(idleTimeMinutes);
            plannedOutageHrs = Number(plannedOutageHrs);
            plannedOutageMinutes = Number(plannedOutageMinutes);
            unplannedOutageHrs = Number(unplannedOutageHrs);
            unplannedOutageMinutes = Number(unplannedOutageMinutes);
            var totalTimeMinutes = ((upTimeHours * 60) + upTimeMinutes) + (idleTimeHours * 60) + idleTimeMinutes + (plannedOutageHrs * 60) + plannedOutageMinutes + (unplannedOutageHrs * 60) + unplannedOutageMinutes;
            totalTimeMinutes = totalTimeMinutes;
            var actualTime = 24 * 60;
            // console.log(totalTimeMinutes);
            // console.log(actualTime);
            if (totalTimeMinutes > actualTime)

                alert("Log Hours exceeds 24 hours");
            if (totalTimeMinutes < actualTime)

                alert("Log Hours less than 24 hours");
            if (totalTimeMinutes != actualTime)
                return false;
            else
                return true;
        };

        resetDatalogFields = function(condition) {
            self.upTimeHours('');
            self.upTimeMinutes('');
            self.upTimeNotes('');
            self.idleTimeHours('');
            self.idleTimeMinutes('');
            self.idleTimeNotes('');
            self.plannedOutageHrs('');
            self.plannedOutageMinutes('');
            self.plannedOutageNotes('');
            self.unplannedOutageHrs('');
            self.unplannedOutageMinutes('');
            self.unplannedOutageNotes('');
            self.dataLogNotes('');
            console.log(condition);
            if (condition != "except date, gesn") {
                console.log("about to clear data");
                self.pickedGesnNo('');
                self.pickedDate('');
            }
            $(".datalog-input-container input").css('background-color', '#EDEDED');
            $(".datalog-input-container textarea").css('background-color', '#EDEDED');
        };
//       resetScrollInDatalog = function() {
//       var datalogBlock = document.getElementsByClassName("datalog-block");
//       datalogBlock[0].scrollTop = 0;
//       var datalogContainer = document.getElementsByClassName("datalog-container");
//       for (i = 0; i < notificationContainer.length; i++) {
//       notificationContainer[i].scrollTop = 0;
//       };
//       };
        resetScrollInDatalog = function() {
            var datalogScroll = document.getElementsByClassName("all-units-datalog");
            datalogScroll[0].scrollTop = 0;
            datalogScroll[1].scrollTop = 0;
        };
    };
});