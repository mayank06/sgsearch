/***************************************************************************************************
 *   File Name  : GlobalMenu.js
 *   Author   : Krishna Kotu
 *   Date of Creation: July, 2015
 *   Last Modified : September, 2015
 *   Copy rights Information : �2015 All rights reserved by TCS.
 *   Description : This file is used to send the soap request and get the respnse data.
 ****************************************************************************************************/

define(['knockout'], function(ko) {
    return function GlobalMenu() {
        var self = this;
        self.pageId = "GlobalMenu";
        var db = openDatabase('RDPApp', '1.0', 'Test DB', 2 * 1024 * 1024);
        document.getElementById("dashboard-org-list").style.display = "none";
        self.dashboardArray = ko.observableArray();
        self.orgList = ko.observableArray();
        self.countOnline = ko.observable();
        self.countOffline = ko.observable();
        self.countIssue = ko.observable();
        self.countAll = ko.observable();
        self.alertCountGlobal = ko.observable();
        self.organisationListVal = ko.observable();
        self.gesnCode = ko.observable();
        self.organisationListLabel = ko.observable();
        self.organisationListValue = ko.observable();
        self.organisationListValueUpp = ko.observable();
        self.currentOrganization = ko.observable();
        self.siteInfo = ko.observableArray();
        self.machineData = ko.observableArray();
        self.notificationsCount = ko.observable();
        self.firstName = ko.observable();
        self.lastName = ko.observable();
        var tileId;
        var eqlistToGetIdinAssetForCarousel = [];
        var unitResult = [];
        var serialNumberArrayGlobal;
        var alertData;
        var assetDataFromWebService = [];
        var organizationlistarray = "";
        var alertCountGlobal;
        var notificationCountGlobal;
        var userRole;
        var userProfile;
        //       	var startTime;
        //		var endTime;
        var eqlistGlobal;
        var msg = '';
        var srNoArrayGlobal;
        var srNoGlobal;
        var lastTimeNotificationcountCalled;
        var dotnetserviceStatus = "undone";
        var alertStatus = "undone";
        self.timeTaken = ko.observable();
        self.init = function(user, userProfilefromOrganisation) {
            console.log("in init function");
            resetScrollInDashboard();
            userProfile = userProfilefromOrganisation;
            console.log(userProfile);
            self.firstName(userProfile.firstName);
            self.lastName(userProfile.lastName);
            currentPageId = self.pageId;
            $("#" + currentPageId).hide();
            self.organisationListLabel('');
            $('html').click(function() {
                $('#dashboard-org-list').hide();
            });
            $('#search-tag').click(function(event) {
                console.log(event);
                $('#dashboard-org-list').show();
                event.stopPropagation();
            });
            userRole = user;
            hideOrgSearchOnUserRole(userRole);
            sqliteTableValidation();
            iconDashboardView();
            console.log("inside dashboard init" + userRole);
        };
        hideOrgSearchOnUserRole = function(uRole) {
            if (uRole == "Non-GE User") {
                hideLoaderWhite();
                $("#search-tag").hide();
                $("#dropdown-icon-id").hide();
                $("#pointer-for-org").hide();

            } else {
                $("#search-tag").show();
                $("#dropdown-icon-id").show();
                $("#pointer-for-org").show();
            }
        };
        sqliteTableValidation = function() {
            console.log("in sqliteTableValidation function");
            db.transaction(function(tx) {
                tx.executeSql('select lastDay, rowid from notificationInfo', [], function(tx, results) {
                    var result = getDataInLocalVariableFromSQLite(results);
                    var len = result.length;
                    if (len > 1) {
                        db.transaction(function(tx) {
                            tx.executeSql('delete from notificationInfo where rowid > 1');
                        });
                        db.transaction(function(tx) {
                            tx.executeSql('delete from notificationcount where rowid > 1');
                        });
                        lastTimeNotificationcountCalled = result[0].lastDay;
                        self.sqliteTableModification(lastTimeNotificationcountCalled);
                    } else {
                        lastTimeNotificationcountCalled = result[0].lastDay;
                        self.sqliteTableModification(lastTimeNotificationcountCalled);
                    };
                }, null);

            });

        };
        self.sqliteTableModification = function(lastDay) {
            console.log("in sqliteTableModification function");
            var toDay = new Date();
            var updatedCount;
            var countFromwebservice;
            toDayUTC = toDay.toUTCString();
            //			$.ajax({
            //				url : "http://3.209.197.8:8084/dpsapp/resources/notificationcount?previousDate=" + lastDay + "&currentDate=" + toDayUTC,
            //				success : function(data) {
            //					console.log(data.count);
            //					countFromwebservice = Number(data.count);
            //					db.transaction(function(tx) {
            //						tx.executeSql('select countNot, rowid from notificationcount', [], function(tx, results) {
            //							var result = getDataInLocalVariableFromSQLite(results);
            //							var len = result.length;
            //							updatedCount = result[0].countNot + countFromwebservice;
            //							notificationCountGlobal = updatedCount;
            //							// updatedCount = 154;
            //							if (updatedCount <= 0) {
            //								$(".notification-count").hide();
            //								notificationCountGlobal = 0;
            //							} else if (updatedCount > 99) {
            //								$(".notification-count").show();
            //								notificationCountGlobal = updatedCount;
            //								self.notificationsCount("99+");
            //							} else {
            //								$(".notification-count").show();
            //								self.notificationsCount(notificationCountGlobal);
            //							}
            //							console.log(notificationCountGlobal);
            //							db.transaction(function(tx) {
            //								tx.executeSql('update notificationcount set countNot = ' + notificationCountGlobal + ' where rowid == 1');
            //							});
            //						}, null);
            //
            //					});
            //				}
            //			});
            db.transaction(function(tx) {
                tx.executeSql('update notificationInfo set lastDay = "' + toDayUTC + '" where rowid == 1');
            });
        };

        self.clickedElement = function(data, event) {
            console.log("in clickedElement function");
            console.log(navigationStatus);
            self.organisationListLabel(data.label);
            self.organisationListValue(data.value);
            var temp = data.label;
            self.organisationListValueUpp(data.value);
            document.getElementById("dashboard-org-list").style.display = "none";
            var currentOrg = self.currentOrganization();
            organisationName = temp;
            console.log("currentOrg");
            console.log(currentOrg);
            console.log(temp);
            self.getGlobalDUSN();
        };
        self.dropdownDiv = function(data, event) {
            console.log("in dropdownDiv function");
            var x = event.currentTarget.nextElementSibling.style.display;
            if (x == "block") {
                event.currentTarget.nextElementSibling.style.display = "none";
                $("#search-tag").val("");
                console.log("dropdown hide");
            } else if (x == "none") {
                event.currentTarget.nextElementSibling.style.display = "block";
                console.log("dropdown show");
            }
        };
        self.emptyInput = function() {
            console.log("in emptyInput function");
            $("#search-tag").val("");
            $(".gm-orgname").css('display', 'block');
            document.getElementById("dashboard-org-list").style.display = "none";
        };
        self.onFocus = function(data, event) {
            console.log("in onFocus function");
            console.log(event);
            console.log(data);
            var x = event.currentTarget.nextElementSibling.style.display;
            console.log(x);
            if (x == "none") {
                event.currentTarget.nextElementSibling.style.display = "block";
            } else if (x == "block") {
                event.currentTarget.nextElementSibling.style.display = "none";
            }
        };

        self.searchOrganisation = function(data, event) {
            console.log("in searchOrganisation function");
            document.getElementById("dashboard-org-list").style.display = "block";
            var target = event.target;
            if (typeof event !== "undefined") {
                var KeyID = event.keyCode;
                var userString1 = $("#search-tag").val().trim();
                var userString = userString1.toUpperCase();
                console.log("userString");
                if (KeyID === 8) {
                    $(".gm-orgname:contains(" + userString + ")").show();
                } else {
                    $(".gm-orgname:contains(" + userString + ")").show();
                    $(".gm-orgname:not(:contains(" + userString + "))").hide();
                }
            }

        };

        self.emptyInput = function(data, event) {
            console.log("in emptyInput function");
            $("#search-tag").val("");
            $(".gm-orgname").css('display', 'block');
            document.getElementById("dashboard-org-list").style.display = "none";
        };

        self.searchDashboard = function(data, event) {
            console.log("in searchDashboard function");
            var target = event.target;
            if (typeof event !== "undefined") {
                var KeyID = event.keyCode;
                var userString = $("#search-machine").val().trim();
                console.log("userString");
                userString = userString.toUpperCase();
                console.log(userString);
                var tempUnitResult = unitResult;
                for (i = 0; i < unitResult.length; i++) {
                    tempUnitResult[i]["GesnName"] = "SN" + unitResult[i].Gesn;
                };
                var newUnitResult = [];
                for (i = 0; i < tempUnitResult.length; i++) {
                    if (tempUnitResult[i].GesnName.search(userString) != -1) {
                        newUnitResult.push(tempUnitResult[i]);
                    };
                }
                filterByAll(newUnitResult);
            }

        };

        self.online = function(data, event) {
            console.log("in online function");
            console.log(unitResult);
            self.filterByMachineStatus("Online");
            $(".dashboard-summary").css('color', "#5178D3");
            $(".dashboard-summary").css('background-color', "inherit");
            document.getElementById("online-machine").style.backgroundColor = "#5F5F5F";
            document.getElementById("online-machine").style.color = "white";
        };
        self.offline = function(data, event) {
            console.log("in offline function");
            console.log(unitResult);
            self.filterByMachineStatusTemp("Online");
//            self.filterByMachineStatus("Offline");
            $(".dashboard-summary").css('color', "#5178D3");
            $(".dashboard-summary").css('background-color', "inherit");
            document.getElementById("offline-machine").style.backgroundColor = "#5F5F5F";
            document.getElementById("offline-machine").style.color = "white";
        };

        self.alert = function(data, event) {
            console.log("in alert function");
            console.log(unitResult);
            self.filterByMachineStatus("Issue");
            $(".dashboard-summary").css('color', "#5178D3");
            $(".dashboard-summary").css('background-color', "inherit");
            document.getElementById("alert-machine").style.backgroundColor = "#5178D3";
            document.getElementById("alert-machine").style.color = "white";
        };

        self.all = function(data, event) {
            console.log("in all function");
            filterByAll(unitResult);
            $(".dashboard-summary").css('color', "#5178D3");
            $(".dashboard-summary").css('background-color', "inherit");
            document.getElementById("all-machine").style.backgroundColor = "#5F5F5F";
            document.getElementById("all-machine").style.color = "white";
        };

        self.filterByMachineStatus = function(machineStatus) {
            console.log("in filterByMachineStatus function");
            var newUnitResult = [];
            for (i = 0; i < unitResult.length; i++) {
                if (unitResult[i].Status == machineStatus) {
                    newUnitResult.push(unitResult[i]);
                }
            }
            console.log(newUnitResult);
            filterByAll(newUnitResult);
        };
       
       
       
       /*********** Need to update later****************/
 /**/       self.filterByMachineStatusTemp = function(machineStatus) {  /**/
         /**/    console.log("in filterByMachineStatus function");  /**/
        /**/     var newUnitResult = [];  /**/
        /**/     for (i = 0; i < unitResult.length; i++) {  /**/
         /**/        if (unitResult[i].Status != machineStatus) {  /**/
          /**/           newUnitResult.push(unitResult[i]);  /**/
        /**/         }  /**/
            } /**/
       /**/      console.log(newUnitResult); /**/
      /**/       filterByAll(newUnitResult); /**/
   /**/      }; /**/
/*********** Need to update later****************/
       
       
       
       
        self.sendOrganizationData = function(data, curOrg) {
            console.log("in sendOrganizationData function");
            self.currentOrganization(curOrg);
            // console.log(data);
            self.orgList(data);
            document.getElementById("search-tag").placeholder = curOrg;
        };

        self.getGlobalDUSN = function() {
            console.log("in getGlobalDUSN function");
            showLoader();
            var DUNSNo;
            var OrgVal = self.organisationListValue();
            console.log(OrgVal);
            db.transaction(function(tx) {
                tx.executeSql('select organisationName, globalDUNS from organisation where rowid = "' + OrgVal + '";', [], function(tx, results) {
                    var len = results.rows.length;
                    console.log(results.rows);
                    var xArray;
                    var result = getDataInLocalVariableFromSQLite(results);
                    console.log(result);
                    DUNSNo = result[0].globalDUNS;
                    console.log(DUNSNo);
                    globalDUNSNumber = DUNSNo;
                    self.currentOrganization(result[0].organisationName);
                    document.getElementById("search-tag").placeholder = result[0].organisationName;
//                    var startTime = new Date();
                    callService(webServiceURL_getSrNo_GE + DUNSNo, '', 'GET', getMachineDataFromDunsSuccess, getMachineDataFromDunsError);
                }, null);

            });
        };
        getMachineDataFromDunsSuccess = function(data) {
            data = $.parseJSON(data);
            var endTime = new Date();
            //                                alert(msg+", .NET: "+(endTime-startTime)/1000);

//            msg = ",DUNS: " + (endTime - startTime) / 1000;
//            console.log(((endTime - startTime) / 1000));
            console.log("sample data example");
            console.log(data);
            self.getMachineSerialNoFromGlobalDUSN(data);
            //   showLoader();

        }

        getMachineDataFromDunsError = function(data, status) {
            data = $.parseJSON(data);
            hideLoader();
            errorHandling(status);
        }
        self.getMachineSerialNoFromGlobalDUSN = function(data) {
            console.log("in getMachineSerialNoFromGlobalDUSN function");
            //var toDay = new Date();
            //startTime = toDay.getTime();
            //console.log(data);
            if (data.errorMessage == "No equipment exists for the User") {
                $("#GlobalMenu").hide();
                alert("No equipment exists for the User");
                config.bindViewModel(app.Organisation, function(viewModel) {
                    app.Organisation.vModel.init(userRole);
                    hideLoader();
                    // $("#Organisation").show();
                });
                // $("#Organisation").show();

            } else {
                $(".site-name").show();
                tileId = 1;
                $("#search-tag").val('');
                var eqlist = data.equipmentList;
                eqlistGlobal = eqlist;
                var srNoArray = [];
                for (var i = 0; i < eqlist.length; i++) {
                    srNoArray.push(eqlist[i].globalSerialNumber);
                }
                serialNumberArrayGlobal = srNoArray;
                var srNo;
                srNo = eqlist[0].globalSerialNumber;
                for (var i = 1; i < eqlist.length; i++) {
                    srNo = srNo + "," + eqlist[i].globalSerialNumber;
                }
                srNoGlobal = srNo;
                srNoArrayGlobal = srNoArray;
                tabNavigationFunction();
            }

        };

        tabNavigationFunction = function() {
            console.log("in tabNavigationFunction function");
            console.log(navigationStatus);
            if (navigationStatus.Dashboard == "Active") {
                self.iconDashboardView();
            } else if (navigationStatus.Asset == "Active") {
                self.iconAssetView();
            } else if (navigationStatus.Datalog == "Active") {
                self.iconDatalogView();
            } else if (navigationStatus.Notifications == "Active") {
                self.iconNotificationsView();
            } else if (navigationStatus.Collaboration == "Active") {
                self.iconCollaborationView();
            }
        };

        repeatWebserviceCallDashboard = function() {
            console.log("in repeatWebserviceCallDashboard function");
            if (userRole == "Non-GE User") {
                //alertWebServiceCall(srNoArrayGlobal);
                webserviceCallForNonGEDashData(srNoGlobal);
            } else {
                //alertWebServiceCall(srNoArrayGlobal);
                webserviceCallForDashData(srNoGlobal);
            }
        };

        webserviceCallForDashData = function(srNo) {
            console.log("in webserviceCallForDashData function");
            var startTime = new Date();
            callService(webServiceURL_dotNet_dashBoardData + srNo, '', 'GET', webserviceCallForDashDataSuccess, webserviceCallForDashDataError);
        };

        webserviceCallForDashDataSuccess = function(machine) {
            var endTime = new Date();

            //  alert(msg+", .NET: "+(endTime-startTime)/1000);
            var temp = machine;
            var temp = $.parseJSON(machine);
            unitResult = temp.unitStatusResult;
            var modelArray = new Array();
            for (var i = 0; i < temp.unitStatusResult.length; i++) {
                modelArray.push(temp.unitStatusResult[i]);
            }
            if (modelArray[0].Error == "Data not found") {
                $(".site-name").hide();
                $(".dashboard-tile").hide();
                self.countOnline(0);
                self.countOffline(0);
                self.countIssue(0);
                self.countAll(0);
                var countOnline = 0,
                    countOffline = 0,
                    countIssue = 0;
                if (userRole == "Non-GE User") {
                    $("#Login").hide();
                } else {
                    $("#Organisation").hide();
                }
                $("#" + currentPageId).show();
                //iconDashboardView();
                self.emptyInput();
                alert("No Datafound for this organization.");
                config.bindViewModel(app.Organisation, function(viewModel) {
                                     app.Organisation.vModel.init(userRole);
                                     $("#GlobalMenu").hide();
                            hideLoader();
                 });
            } else {
                dashBoardBinding(modelArray);
            };
            hideLoader();
        };

        webserviceCallForDashDataError = function(data, status) {
//                alert("sorry! Please try aftersome time");
                hideLoader();
                errorHandling(status);
            }
            //machData is unitStatusResult from .net service
            //eqlist is the equipment list from local webservice
            //srNo is comma separated
            //srNoarray is array of above
        dashBoardBinding = function(machData) {
            console.log("in dashBoardBinding function");
            var eqlist = eqlistGlobal;
            var srNo = srNoGlobal;
            var srNoArray = srNoArrayGlobal;
            if (machData.length == eqlist.length) {
                eqlistToGetIdinAssetForCarousel = eqlist;
                for (var i = 0; i < machData.length; i++) {
                    if (machData[i].Gesn == eqlist[i].globalSerialNumber)
                        machData[i]["SiteName"] = eqlist[i].title;
                };
                self.all(machData);
                var statusArray = [];
                for (var i = 0; i < machData.length; i++) {
                    statusArray.push(machData[i].Status);
                };
                var countOnline = 0,
                    countOffline = 0,
                    countIssue = 0;
                for (var i = 0; i < statusArray.length; i++) {
                    if (statusArray[i] == "Online") {
                        countOnline++;
                    } else if (statusArray[i] == "Offline") {
                        countOffline++;
                    } else {
                        countIssue++;
                    }
                };
                self.countOnline(countOnline);
                self.countOffline(countOffline+countIssue); //Note: this is temporary change
                self.countIssue(countIssue);
                self.countAll(countOnline + countOffline + countIssue);
                if (userRole == "Non-GE User") {
                    $("#Login").hide();
                } else {
                    $("#Organisation").hide();
                }
                $("#" + currentPageId).show();
                iconDashboardView();
                self.emptyInput();
            }
        };

        self.alertBinding = function(Gesn) {
            console.log("in alertBinding function");
            for (var i = 0; i < alertData.length; i++)
                if (alertData[i].gesn == Gesn) {
                    return alertData[i].alertCount;
                } else
                    continue;
        };
        self.alertColor = function(Gesn) {
            console.log("in alertColor function");
            for (var i = 0; i < alertData.length; i++)
                if (alertData[i].gesn == Gesn) {
                    // console.log(Gesn);
                    if (alertData[i].alertCount > 0)
                        return "#F19868";
                    else
                        return "#606060";
                } else
                    continue;
        };
        self.alertImageBinding = function(Gesn) {
            console.log("in alertImageBinding function");
            for (var i = 0; i < alertData.length; i++)
                if (alertData[i].gesn == Gesn) {
                    // console.log(Gesn);
                    if (alertData[i].alertCount > 0)
                        return '<img src="../img/GlobalMenu/X-Alerta.png">';
                    else
                        return '<img src="../img/GlobalMenu/X-No-Alerta.png">';
                } else
                    continue;
        };
        alertWebServiceCall = function(serialNo) {
            console.log("in alertWebServiceCall function");
            alertData = [];
            console.log(serialNo);
            for (var i = 0; i < serialNo.length; i++)
                $.ajax({
                    url: webServiceURL_getAlert_ForGesn + serialNo[i],
                    success: function(data) {
                        alertData.push(data);
                        if (alertData.length == serialNo.length) {
                            self.all();
                            alertStatus = "done";
                            //							if (dotnetserviceStatus == "done") {
                            //								hideLoader();
                            //								dotnetserviceStatus = "undone";
                            //								alertStatus = "undone";
                            //							}
                        }
                    },
                    error: function() {
                        alert("please try later");
                        hideLoader();
                    },
                    complete: function() {
                        // console.log("i count	" + i + "   and  " + (serialNo.length - 1));
                    }
                });
            console.log(alertData);
        };

        // filterByAll = function(machData) {
        // console.log("in filterByAll function");
        // var siteArray = [];
        // for (var i = 0; i < machData.length; i++)
        // siteArray.push(machData[i].SiteName);
        // var machineData = [];
        // var siteArrayDist = DistinctArray(siteArray);
        // var siteInfo = [];
        // for (var i = 0; i < siteArrayDist.length; i++) {
        // machineData = [];
        // for (var j = 0; j < machData.length; j++) {
        // if (siteArrayDist[i] == machData[j].SiteName) {
        // machineData.push(machData[j]);
        // } else {
        // continue;
        // }
        // }
        // siteInfo.push({
        // machineData : machineData,
        // siteName : machineData[0].SiteName
        // });
        // };
        // self.siteInfo(siteInfo);
        // };

        filterByAll = function(machData) {
       var siteArray = [];
                for (var i = 0; i < machData.length; i++)
                    siteArray.push(machData[i].SiteName);
                var machineData = [];
                var siteArrayDist = DistinctArray(siteArray);
                var siteInfo = [];
                for (var i = 0; i < siteArrayDist.length; i++) {
                    machineData = [];
                    for (var j = 0; j < machData.length; j++) {
                        if (siteArrayDist[i] == machData[j].SiteName) {
                            machineData.push(machData[j]);
                        } else {
                            continue;
                        }
                    }
                    // console.log(machineData);
                    siteInfo.push({
                        machineData: machineData,
                        siteName: machineData[0].SiteName
                    });
                };
                self.siteInfo(siteInfo);
//            if (userRole == "GE User") {
//       
//
//            } else if (userRole == "Non-GE User") {
//                var siteInfo = [];
//
//                siteInfo.push({
//                    machineData: machData,
//                    siteName: ""
//                });
//
//                self.siteInfo(siteInfo);
//                // console.log(self.siteInfo());
//                $(".site-name").hide();
//                $(".dashboard-tile").show();
//            };

        };

        function constructorForDash(modelvalue, modelArray) {
            console.log("in constructorForDash function");
            this.modelvalue = modelvalue;
            this.modelArray = modelArray;
        }


        self.nonGEDashboard = function(EqList) {
            //			var toDay = new Date();
            //			startTime = toDay.getTime();
            // $(".dummy-location-search").hide();
            console.log("Inside DashboardData");
            console.log("EqList");
            self.dashboardArray([]);
            console.log(EqList);
            eqlistToGetIdinAssetForCarousel = EqList;
            var serialNoArray = [];
            var srNo;
            for (var i = 0; i < EqList.length; i++) {
                serialNoArray.push(EqList[i].globalSerialNumber);
            }
            srNoArray = serialNoArray;
            serialNumberArrayGlobal = serialNoArray;
            srNo = srNoArray[0];
            for (var i = 1; i < EqList.length; i++) {
                srNo = srNo + "," + srNoArray[i];
            }
            console.log("srNo");
            console.log(srNo);

            console.log("srNoArray");
            console.log(srNoArray);
            srNoGlobal = srNo;
            srNoArrayGlobal = srNoArray;
            //alertWebServiceCall(srNoArray);
            webserviceCallForNonGEDashData(srNo);
            // self.callWebserviceToGetDataForAsset(serialNoArray);
        };
        webserviceCallForNonGEDashData = function(srNo) {
            var eqlist = eqlistGlobal;
            var srNo = srNoGlobal;
            var srNoArray = srNoArrayGlobal;
            showLoader();
            callService(webServiceURL_dotNet_dashBoardData + srNo, '', 'GET', webserviceCallForNonGEDashDataSuccess, webserviceCallForNonGEDashDataError);
        };

        webserviceCallForNonGEDashDataSuccess = function(data) {
            console.log("Machine");
            console.log(data);
            data = JSON.parse(data);
            console.log(data);
            unitResult = data.unitStatusResult;
            if (unitResult[0].Error == "Data not found") {
                $(".site-name").hide();
                $(".dashboard-tile").hide();
                self.countOnline(0);
                self.countOffline(0);
                self.countIssue(0);
                self.countAll(0);
                var countOnline = 0,
                    countOffline = 0,
                    countIssue = 0;
                $("#" + currentPageId).show();
       
            } else {
                console.log(unitResult);
                console.log(userRole);
                self.all();
                var statusArray = [];
                for (var i = 0; i < unitResult.length; i++) {
                    statusArray.push(unitResult[i].Status);
                };
                var countOnline = 0,
                    countOffline = 0,
                    countIssue = 0;
                for (var i = 0; i < statusArray.length; i++) {
                    if (statusArray[i] == "Online") {
                        countOnline++;
                    } else if (statusArray[i] == "Offline") {
                        countOffline++;
                    } else {
                        countIssue++;
                    };
                };
                // console.log("serialNoArray");
                // console.log(serialNoArray);
            };
            self.countOnline(countOnline);
            self.countOffline(countOffline+countIssue); //Note: this is temporary change
            self.countIssue(countIssue);
            self.countAll(countOnline + countOffline + countIssue);
            // console.log(self.countOnline);

            $("#Login").hide();
            $("#" + currentPageId).show();
            iconDashboardView();
            hideLoader();
        };

        webserviceCallForNonGEDashDataError = function(data, status) {
//            alert("sorry! Please try aftersome time");
            hideLoader();
            errorHandling(status);
        };
        self.dashTile = function(data, event) {
            console.log("in dashTile function");
            // console.log(data);
            tileId = self.getIdOfClickedTile(data.Gesn);
            self.iconAssetView();
        };

        self.getIdOfClickedTile = function(gesnNo) {
            console.log("in getIdOfClickedTile function");
            var localEqData = [];
            localEqData = eqlistToGetIdinAssetForCarousel;
            for (var i = 0; i < localEqData.length; i++) {
                if (gesnNo == localEqData[i].globalSerialNumber)
                    return i + 1;
            };
        };

        //For menu
        iconDashboardView = function() {
            console.log("in iconDashboardView function");
            self.defaultIcon();
            navigationStatus.Dashboard = "Active";
            $("#icon-dashboard").css('background-image', 'url("../img/GlobalMenu/2X-Selected-Dashboard.png")');
            $("#icon-dashboard").css('background-color', 'black');
            $("#icon-dashboard").css('color', '#29B3FF');
            $("#dashboardLine").hide();
            $("#Dashboard").show();
            $(".dashboard-summary").show();
                        if (userRole == "Non-GE User") {
                $("#search-tag").hide();
                $("#dropdown-icon-id").hide();
            } else {
                // $(".dummy-location-search").hide();
                $("#search-tag").show();
                $("#dropdown-icon-id").show();
            }
        };
        self.iconDashboardView = function() {
            iconDashboardView();
            showLoader();
            console.log(srNoGlobal);
       resetScrollInDashboard();

//            if (userRole == "Non-GE User") {
//                //alertWebServiceCall(srNoArrayGlobal);
//                webserviceCallForNonGEDashData(srNoGlobal);
//            } else {
//                //alertWebServiceCall(srNoArrayGlobal);
                webserviceCallForDashData(srNoGlobal);
//            }
            // repeatWebserviceCallDashboard();
            // clearAllIntervals();
            // dashboardWebserviceCall = setInterval(repeatWebserviceCallDashboard, 30000);
        };
        self.iconAssetView = function() {
            console.log("in iconAssetView function");
            self.defaultIcon();
            navigationStatus.Asset = "Active";
            console.log("inside icon Asset");
            $("#icon-asset-view").css('background-image', 'url("../img/GlobalMenu/2X-Selected-Asset-View.png")');
            $("#icon-asset-view").css('background-color', 'black');
            $("#icon-asset-view").css('color', '#29B3FF');
            $("#assetLine").hide();
            $("#dashboardLine").hide();
            $("#search-tag").show();
            if (userRole == "Non-GE User") {
                $("#search-tag").hide();
            }
            $("#dropdown-icon-id").hide();
            $(".dashboard-summary").hide();
            if (tileId == null || tileId == undefined)
                tileId = 1;
            config.bindViewModelGlobalMenu(app.Asset, function(viewModel) {
                app.Asset.vModel.init(srNoArrayGlobal, tileId, userProfile);
                $("#Asset").show();
            });
        };
        self.iconDatalogView = function() {
            console.log("in iconDatalogView function");
            self.defaultIcon();
            navigationStatus.Datalog = "Active";
            console.log("inside icon data log");
            $("#icon-datalog").css('background-image', 'url("../img/GlobalMenu/2X-Selected-Data-Log.png")');
            $("#icon-datalog").css('background-color', 'black');
            $("#icon-datalog").css('color', '#29B3FF');
            $("#datalogLine").hide();
            $("#assetLine").hide();
            hideOrgSearchOnUserRole(userRole);
            var gesnIdArray = [];
            for (i = 0; i < srNoArrayGlobal.length; i++) {
                gesnIdArray.push({
                    globalSerialNumber: srNoArrayGlobal[i]
                });
            }
            console.log(gesnIdArray);
            console.log(eqlistToGetIdinAssetForCarousel);
            config.bindViewModelGlobalMenu(app.Datalog, function(viewModel) {
                app.Datalog.vModel.init(gesnIdArray, userProfile);
                $("#Datalog").show();
                //showLoader();
            });
        };

        self.iconNotificationsView = function() {
            console.log("in iconNotificationsView function");
            self.defaultIcon();
            navigationStatus.Notifications = "Active";
            console.log("inside icon notification");
            $("#icon-notifications").css('background-image', 'url("../img/GlobalMenu/2X-Selected-Notifications.png")');
            $("#icon-notifications").css('background-color', 'black');
            $("#icon-notifications").css('color', '#29B3FF');
            $("#datalogLine").hide();
            $("#notificationLine").hide();
            hideOrgSearchOnUserRole(userRole);
            config.bindViewModelGlobalMenu(app.Notifications, function(viewModel) {
                app.Notifications.vModel.init(userProfile);
                $("#Notifications").show();
            });
        };
        self.iconTrendingView = function() {
            console.log("in iconTrendingView function");
            self.defaultIcon();
            navigationStatus.Trending = "Active";
            console.log("inside icon trending");
            $("#icon-trending").css('background-image', 'url("../img/GlobalMenu/2X-Selected-Trending.png")');
            $("#icon-trending").css('background-color', 'black');
            $("#icon-trending").css('color', '#4E79D1');
            $("#notificationLine").hide();
            $("#trendLine").hide();
            hideOrgSearchOnUserRole(userRole);
            config.bindViewModelGlobalMenu(app.Trending, function(viewModel) {
                app.Trending.vModel.init();
                $("#Trending").show();
            });
        };
        self.iconPublicationsView = function() {
            console.log("in iconPublicationsView function");
            self.defaultIcon();
            navigationStatus.Publications = "Active";
            console.log("inside icon publication");
            $("#icon-publications").css('background-image', 'url("../img/GlobalMenu/2X-Selected-Publications.png")');
            $("#icon-publications").css('background-color', 'black');
            $("#icon-publications").css('color', '#4E79D1');
            $("#publicationLine").hide();
            $("#trendLine").hide();
            hideOrgSearchOnUserRole(userRole);
            config.bindViewModelGlobalMenu(app.Publications, function(viewModel) {
                app.Publications.vModel.init();

                $("#Publications").show();
            });
        };
        self.iconCollaborationView = function() {
            console.log("in iconCollaborationView function");
            self.defaultIcon();
            navigationStatus.Collaboration = "Active";
            console.log("inside icon collaboration");
            $("#icon-callaboration").css('background-image', 'url("../img/GlobalMenu/2X-Selected-Collaboration.png")');
            $("#icon-callaboration").css('background-color', 'black');
            $("#icon-callaboration").css('color', '#29B3FF');
            $("#notificationLine").hide();
            $(".end-call").show();
            config.bindViewModelGlobalMenu(app.Collaboration, function(viewModel) {
                app.Collaboration.vModel.init();
                $("#Collaboration").show();
            });
        };
        self.defaultIcon = function(iconId) {
            console.log("in defaultIcon function");
            $("#icon-dashboard").css("background-image", 'url("../img/GlobalMenu/2X-un-Selected-Dashboard.png")');
            $("#icon-asset-view").css("background-image", 'url("../img/GlobalMenu/2X-Un-Selected-Asset-View.png")');
            $("#icon-datalog").css("background-image", 'url("../img/GlobalMenu/2X-Un-Selected-Data-Log.png")');
            $("#icon-notifications").css("background-image", 'url("../img/GlobalMenu/2X-un-Selected-Notifications.png")');
            $("#icon-trending").css("background-image", 'url("../img/GlobalMenu/2X-un-Selected-Trending.png")');
            $("#icon-publications").css("background-image", 'url("../img/GlobalMenu/2X-Un-Selected-Publications.png")');
            $("#icon-callaboration").css("background-image", 'url("../img/GlobalMenu/2X-Un-Selected-Collaboration.png")');
            $(".horLine").show();
            $(".menu-item").css("background-color", "#2f2f2f");
            $(".menu-item").css("color", "#787878");
            $(".end-call").hide();
            $("#Dashboard").hide();
            $("#Asset").hide();
            $("#Collaboration").hide();
            $("#Datalog").hide();
            $("#Notifications").hide();
            $("#Publications").hide();
            $("#Trending").hide();
            defaultNavigationStatus();
        };
        resetScrollInDashboard = function() {
            var dashboard = document.getElementsByClassName("site-dash-container");
            dashboard[0].scrollTop = 0;
        };

    };

});