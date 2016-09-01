/***************************************************************************************************
 *   File Name  : Asset.js
 *   Author   : xxxxx xxxxx
 *   Date of Creation: July, 2015
 *   Last Modified : September, 2015
 *   Copy rights Information : �2015 All rights reserved by TCS.
 *   Description : This file is used to send the soap request and get the respnse data.
 ****************************************************************************************************/
define(['knockout'], function(ko) {
    return function Asset() {
        var self = this;
        self.pageId = "Asset";
        var db = openDatabase('RDPApp', '1.0', 'Test DB', 2 * 1024 * 1024);
        var owl = $("#owl-demo");
        var tileIdAsset;
        var assetDataArray = [];
        var gesnNo = [];
        var currentGesn = '';
        var userProfile;
        var updateDateStatus;
        var assetDataStatus;
        self.gesnNo = ko.observableArray();
        self.gesnForData = ko.observableArray();
        self.assetData = ko.observable();
        self.notificationsCount = ko.observable();
        self.lastUpdateDate = ko.observable();

        self.MWSEL_VAL0 = ko.observable();
        self.N25SEL_VAL0 = ko.observable();
        self.N25A_VAL0 = ko.observable();
        self.N25B_VAL0 = ko.observable();
        self.TLUBSEL_VAL0 = ko.observable();
        self.TLUBA_VAL0 = ko.observable();
        self.TLUBB_VAL0 = ko.observable();
        self.PLUBSEL_VAL0 = ko.observable();
        self.PLUBA_VAL0 = ko.observable();
        self.PLUBB_VAL0 = ko.observable();
        self.CHPA_VAL0 = ko.observable();
        self.CHPB_VAL0 = ko.observable();
        self.CHPC_VAL0 = ko.observable();
        self.CHPD_VAL0 = ko.observable();
        self.T0SEL_VAL0 = ko.observable();
        self.T0A_VAL0 = ko.observable();
        self.T0B_VAL0 = ko.observable();
        self.T2SEL_VAL0 = ko.observable();
        self.T2A_VAL0 = ko.observable();
        self.T2B_VAL0 = ko.observable();
        self.PS3SEL_VAL0 = ko.observable();
        self.PS3A_VAL0 = ko.observable();
        self.PS3B_VAL0 = ko.observable();
        self.T3SEL_VAL0 = ko.observable();
        self.T3A_VAL0 = ko.observable();
        self.T3B_VAL0 = ko.observable();
        self.CRF_VAL0 = ko.observable();
        self.CRFBPHPA_VAL0 = ko.observable();
        self.CRFBPHPB_VAL0 = ko.observable();
        self.VBVSEL_VAL0 = ko.observable();
        self.VBVA_VAL0 = ko.observable();
        self.VBVB_VAL0 = ko.observable();
        self.VSV_VAL0 = ko.observable();
        self.VSVA_VAL0 = ko.observable();
        self.VSVB_VAL0 = ko.observable();
        self.IGVSEL_VAL0 = ko.observable();
        self.PX36SEL_VAL0 = ko.observable();
        self.PX36A_VAL0 = ko.observable();
        self.PX36B_VAL0 = ko.observable();
        self.TGSSEL_VAL0 = ko.observable();
        self.TGSA_VAL0 = ko.observable();
        self.TGSB_VAL0 = ko.observable();
        self.PGSM_VAL0 = ko.observable();
        self.PGSA_VAL0 = ko.observable();
        self.PGSB_VAL0 = ko.observable();
        self.T48SEL_VAL0 = ko.observable();
        self.T48A_VAL0 = ko.observable();
        self.T48B_VAL0 = ko.observable();
        self.T48C_VAL0 = ko.observable();
        self.T48D_VAL0 = ko.observable();
        self.T48E_VAL0 = ko.observable();
        self.T48F_VAL0 = ko.observable();
        self.T48G_VAL0 = ko.observable();
        self.T48H_VAL0 = ko.observable();
        self.TRF_VAL0 = ko.observable();

        self.init = function(gesnNo, tileId, userProfileFromGlobalMenu) {
            currentPageId = self.pageId;
            userProfile = userProfileFromGlobalMenu;
            //console.log(gesnNo);
            //console.log(tileId);
            sqliteTableValidation();
            tileIdAsset = tileId;
            self.initCarouselBind(gesnNo);
        };
        sqliteTableValidation = function() {
            db.transaction(function(tx) {
                tx.executeSql('select countNot, rowid from notificationcount', [], function(tx, results) {
                    var result = getDataInLocalVariableFromSQLite(results);
                    var len = result.length;
                    self.notificationsCount(result[0].countNot);
                }, null);
            });
        };

        self.initCarouselBind = function(gesnNoFromGlobalMenu) {
            gesnNo = [];
            for (var i = 0; i < gesnNoFromGlobalMenu.length; i++) {
                gesnNo.push({
                    id: i + 1,
                    gesn: gesnNoFromGlobalMenu[i]
                });
            };
            self.gesnNo(gesnNo);
            // console.log(self.gesnNo());
            self.owlReset();
            $("#owl-demo").trigger('owl.jumpTo', tileIdAsset - 1);
            // assetDataArray = assetData;
            self.carouselBinding(tileIdAsset, gesnNo);
        };
        self.truncValue = function(data) {
            Number(data);
            data = Math.trunc(data * 100) / 100;
            data = data.toString();
            return data;
        };
        self.carouselBinding = function(data, event) {
            var i;
            // console.log(data);
            // console.log(assetDataArray);
            // console.log(gesnNo);
            if (data.id) {
                i = data.id;
                len = document.getElementsByClassName("subMenu2").length;
                for (var j = 0; j < len; j++) {
                    document.getElementsByClassName("subMenu2")[j].style.backgroundColor = "#E5E5E5";
                    document.getElementsByClassName("subMenu2")[j].style.height = "68px";
                    // $(".subMenu2 .text-color")[2 * j].style.color = "#000000";
                    // $(".subMenu2 .text-color")[(2 * j) + 1].style.color = "#000000";
                    // $(".subMenu2 .text-color5")[2 * j].style.color = "#000000";
                    // $(".subMenu2 .text-color5")[(2 * j) + 1].style.color = "#000000";
                    $(".subMenu2 .text-color")[1 * j].style.color = "#000000";
                    $(".subMenu2 .text-color5")[1 * j].style.color = "#000000";
                    $(".subMenu2 .machineIcon")[j].style.backgroundImage = 'url("../img/Asset/2X-Turbine-image-inactive.png")';
                }
            } else
                i = data;
            document.getElementsByClassName("subMenu2")[i - 1].style.backgroundColor = "white";
            document.getElementsByClassName("subMenu2")[i - 1].style.height = "80px";
            $(".subMenu2 .text-color")[((i - 1) * 1)].style.color = "#AFAFAF";
            $(".subMenu2 .text-color5")[((i - 1) * 1)].style.color = "#484848";
            // $(".subMenu2 .text-color")[((i - 1) * 2)].style.color = "#AFAFAF";
            // $(".subMenu2 .text-color")[((i - 1) * 2) + 1].style.color = "#AFAFAF";
            // $(".subMenu2 .text-color5")[((i - 1) * 2)].style.color = "#484848";
            // $(".subMenu2 .text-color5")[((i - 1) * 2) + 1].style.color = "#484848";
            $(".subMenu2 .machineIcon")[i - 1].style.backgroundImage = 'url("../img/Asset/2X-Turbine-image-active.png")';

            //binding strats from here
            // self.collapseExpand();
            self.defaultCollapseExpand();
            // console.log(i);
            // self.assetBind(i - 1);
            showLoader();
            currentGesn = gesnNo[i - 1].gesn;
            webserviceCallForAssetData(currentGesn);
            //			if (navigationStatus.Asset == "Active") {
            //				clearAllIntervals();
            //				assetViewWebserviceCall = setInterval(webserviceCallForAssetData, 30000);
            //			}
        };

        // function assetDetailsContr(keyTemp,valueTemp){
        // this.keyName=keyTemp;
        // this.value=valueTemp;
        // }
        //

        webserviceCallForAssetData = function() {
            updateDateStatus = "undone";
            assetDataStatus = "undone";
            console.log(currentGesn);
            callService(webServiceURL_dotNet_dashBoardData + currentGesn, '', 'GET', webserviceCallForDateSuccess, webserviceCallForDateError);
            callService(webServiceURL_dotNet_assetViewData + currentGesn + "/screenName/Detailed", '', 'GET', webserviceCallForAssetDataSuccess, webserviceCallForAssetDataError);
        };
        webserviceCallForDateSuccess = function(data) {
            data = $.parseJSON(data);
            if (data.unitStatusResult[0].Error == "Data not found") {
                alert("No Datafound for this organization.");
                config.bindViewModel(app.Organisation, function(viewModel) {
                    app.Organisation.vModel.init(userProfile.userRole);
                    $("#GlobalMenu").hide();
                });
            } else {
                console.log(data.unitStatusResult[0].LRDT);
                self.lastUpdateDate(data.unitStatusResult[0].LRDT);
                updateDateStatus = "done";
                if (assetDataStatus == "done")
                    hideLoader();
            }
        };

        webserviceCallForDateError = function(data, status) {
            data = $.parseJSON(data);
            alert("Last Date isn't updated'");
        };

        webserviceCallForAssetDataSuccess = function(data) {
            var assetDataFromService = [];
            data = CSVtextToJsonConversion(data);
            //console.log(data);
            assetDataFromService.push(data);
            self.assetBind(assetDataFromService);
            assetDataStatus = "done";
            if (updateDateStatus == "done")
                hideLoader();
        };
        webserviceCallForAssetDataError = function(data, status) {
            errorHandling(status);
            hideLoader();
            //            app.GlobalMenu.vModel.iconDashboardView();
        };
        self.dataToBind = ko.observableArray();
        self.assetBind = function(assetDataArrayFromPrev) {
            assetDataArray = assetDataArrayFromPrev;
            // temp = [];
            // self.assetData(temp);
            // console.log(assetDataArray[i]);
            //
            // var modifiedArray = [];
            // var assetDetailsTemp=assetDataArray[i];
            // console.log("=====================");
            // for(i in assetDetailsTemp){
            // //				console.log(i +":" + assetDetailsTemp[''+i]);
            // // console.log(assetDetailsTemp[''+i]);
            //
            // var assetDetailsContrconstr=new assetDetailsContr(i,assetDetailsTemp[''+i]);
            // modifiedArray.push(assetDetailsContrconstr);
            // }
            // console.log(modifiedArray);
            // console.log("=====================");
            //self.dataToBind(modifiedArray);
            // self.dataToBind(assetDataArray[i]);
            // console.log(gesnNo);
            // console.log(gesnNo[i].gesn);
            // self.gesnForData(gesnNo[i].gesn);
            // console.log(self.gesnForData());
            // self.assetData(assetDataArray[i]);
            // currentGesn = gesnNo[i].gesn;
            var i = 0;
            console.log(assetDataArray);
            if (assetDataArray[i].hasOwnProperty('MWSEL_VAL0')) {
                var temp = assetDataArray[i].MWSEL_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.MWSEL_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.MWSEL_VAL0('0');
                //console.log("tag not exist");
            }

            //debugger;

            if (assetDataArray[i].hasOwnProperty('N25SEL_VAL0')) {
                var temp = assetDataArray[i].N25SEL_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.N25SEL_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.N25SEL_VAL0('0');
                //console.log("tag not exist");
            }

            if (assetDataArray[i].hasOwnProperty('N25A_VAL0')) {
                var temp = assetDataArray[i].N25A_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.N25A_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.MWSEL_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('N25B_VAL0')) {
                var temp = assetDataArray[i].N25B_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.N25B_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.N25B_VAL0('0');
                //console.log("tag not exist");
            }

            if (assetDataArray[i].hasOwnProperty('TLUBSEL_VAL0')) {
                var temp = assetDataArray[i].TLUBSEL_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.TLUBSEL_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.TLUBSEL_VAL0('0');
                //console.log("tag not exist");
            }

            if (assetDataArray[i].hasOwnProperty('TLUBA_VAL0')) {
                var temp = assetDataArray[i].TLUBA_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.TLUBA_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.TLUBA_VAL0('0');
                //console.log("tag not exist");
            }

            if (assetDataArray[i].hasOwnProperty('TLUBB_VAL0')) {
                var temp = assetDataArray[i].TLUBB_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.TLUBB_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.TLUBB_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('PLUBSEL_VAL0')) {
                var temp = assetDataArray[i].PLUBSEL_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.PLUBSEL_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.PLUBSEL_VAL0('0');
                //console.log("tag not exist");
            }

            if (assetDataArray[i].hasOwnProperty('PLUBA_VAL0')) {
                var temp = assetDataArray[i].PLUBA_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.PLUBA_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.PLUBA_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('PLUBB_VAL0')) {
                var temp = assetDataArray[i].PLUBB_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.PLUBB_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.PLUBB_VAL0('0');
                //console.log("tag not exist");
            }

            if (assetDataArray[i].hasOwnProperty('CHPA_VAL0')) {
                var temp = assetDataArray[i].CHPA_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.CHPA_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.CHPA_VAL0('0');
                //console.log("tag not exist");
            }

            if (assetDataArray[i].hasOwnProperty('CHPB_VAL0')) {
                var temp = assetDataArray[i].CHPB_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.CHPB_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.CHPB_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('CHPC_VAL0')) {
                var temp = assetDataArray[i].CHPC_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.CHPC_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.CHPC_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('CHPD_VAL0')) {
                var temp = assetDataArray[i].CHPD_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.CHPD_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.CHPD_VAL0('0');
                //console.log("tag not exist");
            }

            if (assetDataArray[i].hasOwnProperty('T0SEL_VAL0')) {
                var temp = assetDataArray[i].T0SEL_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.T0SEL_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.T0SEL_VAL0('0');
                //console.log("tag not exist");
            }

            if (assetDataArray[i].hasOwnProperty('T0A_VAL0')) {
                var temp = assetDataArray[i].T0A_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.T0A_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.T0A_VAL0('0');
                //console.log("tag not exist");
            }

            if (assetDataArray[i].hasOwnProperty('T0B_VAL0')) {
                var temp = assetDataArray[i].T0B_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.T0B_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.T0B_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('T2SEL_VAL0')) {
                var temp = assetDataArray[i].T2SEL_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.T2SEL_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.T2SEL_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('T2A_VAL0')) {
                var temp = assetDataArray[i].T2A_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.T2A_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.T2A_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('T2B_VAL0')) {
                var temp = assetDataArray[i].T2B_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.T2B_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.T2B_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('PS3SEL_VAL0')) {
                var temp = assetDataArray[i].PS3SEL_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.PS3SEL_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.PS3SEL_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('PS3A_VAL0')) {
                var temp = assetDataArray[i].PS3A_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.PS3A_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.PS3A_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('PS3B_VAL0')) {
                var temp = assetDataArray[i].PS3B_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.PS3B_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.PS3B_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('T3SEL_VAL0')) {
                var temp = assetDataArray[i].T3SEL_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.T3SEL_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.T3SEL_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('T3A_VAL0')) {
                var temp = assetDataArray[i].T3A_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.T3A_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.T3A_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('T3B_VAL0')) {
                var temp = assetDataArray[i].T3B_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.T3B_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.T3B_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('CRF_VAL0')) {
                var temp = assetDataArray[i].CRF_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.CRF_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.CRF_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('CRFBPHPA_VAL0')) {
                var temp = assetDataArray[i].CRFBPHPA_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.CRFBPHPA_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.CRFBPHPA_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('CRFBPHPB_VAL0')) {
                var temp = assetDataArray[i].CRFBPHPB_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.CRFBPHPB_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.CRFBPHPB_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('VBVSEL_VAL0')) {
                var temp = assetDataArray[i].VBVSEL_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.VBVSEL_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.VBVSEL_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('VBVA_VAL0')) {
                var temp = assetDataArray[i].VBVA_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.VBVA_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.VBVA_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('VBVB_VAL0')) {
                var temp = assetDataArray[i].VBVB_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.VBVB_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.VBVB_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('VSV_VAL0')) {
                var temp = assetDataArray[i].VSV_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.VSV_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.VSV_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('VSVA_VAL0')) {
                var temp = assetDataArray[i].VSVA_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.VSVA_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.VSVA_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('VSVB_VAL0')) {
                var temp = assetDataArray[i].VSVB_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.VSVB_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.VSVB_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('IGVSEL_VAL0')) {
                var temp = assetDataArray[i].IGVSEL_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.IGVSEL_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.IGVSEL_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('PX36SEL_VAL0')) {
                var temp = assetDataArray[i].PX36SEL_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.PX36SEL_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.PX36SEL_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('PX36A_VAL0')) {
                var temp = assetDataArray[i].PX36A_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.PX36A_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.PX36A_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('PX36B_VAL0')) {
                var temp = assetDataArray[i].PX36B_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.PX36B_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.PX36B_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('TGSSEL_VAL0')) {
                var temp = assetDataArray[i].TGSSEL_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.TGSSEL_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.TGSSEL_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('TGSA_VAL0')) {
                var temp = assetDataArray[i].TGSA_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.TGSA_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.TGSA_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('TGSB_VAL0')) {
                var temp = assetDataArray[i].TGSB_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.TGSB_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.TGSB_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('PGSM_VAL0')) {
                var temp = assetDataArray[i].PGSM_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.PGSM_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.PGSM_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('PGSA_VAL0')) {
                var temp = assetDataArray[i].PGSA_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.PGSA_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.PGSA_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('PGSB_VAL0')) {
                var temp = assetDataArray[i].PGSB_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.PGSB_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.PGSB_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('T48SEL_VAL0')) {
                var temp = assetDataArray[i].T48SEL_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.T48SEL_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.T48SEL_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('T48A_VAL0')) {
                var temp = assetDataArray[i].T48A_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.T48A_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.T48A_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('T48B_VAL0')) {
                var temp = assetDataArray[i].T48B_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.T48B_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.T48B_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('T48C_VAL0')) {
                var temp = assetDataArray[i].T48C_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.T48C_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.T48C_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('T48D_VAL0')) {
                var temp = assetDataArray[i].T48D_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.T48D_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.T48D_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('T48E_VAL0')) {
                var temp = assetDataArray[i].T48E_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.T48E_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.T48E_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('T48F_VAL0')) {
                var temp = assetDataArray[i].T48F_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.T48F_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.T48F_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('T48G_VAL0')) {
                var temp = assetDataArray[i].T48G_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.T48G_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.T48G_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('T48H_VAL0')) {
                var temp = assetDataArray[i].T48H_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.T48H_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.T48H_VAL0('0');
                //console.log("tag not exist");
            }
            if (assetDataArray[i].hasOwnProperty('TRF_VAL0')) {
                var temp = assetDataArray[i].TRF_VAL0;
                temp = (Math.round(temp * 100)) / 100;
                self.TRF_VAL0(temp);
                //console.log("tag exist");
            } else {
                self.TRF_VAL0('0');
                //console.log("tag not exist");
            }

        };
        self.openDataLogPopUp = function() {
            console.log("clicked data log");
            config.bindViewModel(app.DatalogPopup, function(viewModel) {
                app.DatalogPopup.vModel.init(userProfile, "Asset", currentGesn, currDate());
//                showDataLogPopUp();
            });
        };

        self.zoomImage = function() {
            var imgzoom = window.location('../img/Asset/X-turbine.png', '_blank', 'location=no,enableViewportScale=true');
        };

        self.collapseExpand = function() {
            var temp = document.getElementById("firstId").style.height;
            if (temp == "initial") {
                self.defaultCollapseExpand();
                document.getElementById("xyz").style.backgroundImage = "url('../img/Asset/minus.png')";
                $("#firstId .information2").show();
                // $("#firstId .units").show();
                $("#firstId").css('height', "");
                $("#boxheader1").css("background-color", '#365592');
                $("#firstId").css("background-color", '#4F78D0 ');
            } else {
                self.defaultCollapseExpand();
            }
            console.log("inside asset");
        };

        self.collapseExpand1 = function() {
            var temp = document.getElementById("secondId").style.height;
            if (temp == "initial") {
                self.defaultCollapseExpand();
                document.getElementById("box2").style.backgroundImage = "url('../img/Asset/minus.png')";
                $("#secondId .information2").show();
                // $("#secondId .units").show();
                $("#secondId").css('height', "");
                $("#boxheader2").css("background-color", '#365592');
                $("#secondId").css("background-color", '#4F78D0 ');
                $("#overlay-layer1").show();
                $("#overlay-layer1").css('left', '253px');
                $("#overlay-layer1").css('width', '336px');
            } else {
                self.defaultCollapseExpand();
            }
            console.log("inside asset");
        };
        self.collapseExpand2 = function() {
            var temp = document.getElementById("thirdId").style.height;
            if (temp == "initial") {
                self.defaultCollapseExpand();
                document.getElementById("box3").style.backgroundImage = "url('../img/Asset/minus.png')";
                $("#thirdId .information2").show();
                // $("#thirdId .units").show();
                $("#thirdId").css('height', "");
                $("#boxheader3").css("background-color", '#365592');
                $("#thirdId").css("background-color", '#4F78D0 ');
                $("#overlay-layer1").show();
                $("#overlay-layer1").css('left', '67px');
                $("#overlay-layer1").css('width', '186px');
                $("#overlay-layer2").show();
                $("#overlay-layer2").css('left', '473px');
                $("#overlay-layer2").css('width', '118px');
            } else {
                self.defaultCollapseExpand();
            }
            console.log("inside asset");
        };
        self.collapseExpand3 = function() {
            var temp = document.getElementById("fourthId").style.height;
            if (temp == "initial") {
                self.defaultCollapseExpand();
                document.getElementById("box4").style.backgroundImage = "url('../img/Asset/minus.png')";
                $("#fourthId .information2").show();
                // $("#fourthId .units").show();
                $("#fourthId").css('height', "");
                $("#boxheader4").css("background-color", '#365592');
                $("#fourthId").css("background-color", '#4F78D0 ');
                $("#overlay-layer2").show();
                $("#overlay-layer2").css('left', '67px');
                $("#overlay-layer2").css('width', '406px');
            } else {
                self.defaultCollapseExpand();
            }
            console.log("inside asset");
        };
        self.defaultCollapseExpand = function() {
            $(".content").css('height', "initial");
            $(".expandButton").css('background-image', "url('../img/Asset/dotdot.png')");
            $(".information2").hide();
            $(".units").show();
            $(".content").css("background-color", '#313131');
            $(".box-header").css("background-color", '#404040 ');
            $(".overLay").hide();
        };
        self.searchAsset = function(data, event) {
            var target = event.target;
            //$('input').removeClass('iDebrief-search-input-magnifier');
            if (typeof event !== "undefined") {
                var KeyID = event.keyCode;
                var userString = $("#search-machine-asset").val().trim();
                userString = userString.toUpperCase();
                console.log("userString");
                if (KeyID === 8) {
                    $(".subMenu2:contains(" + userString + ")").show();
                } else {
                    $(".subMenu2:contains(" + userString + ")").show();
                    $(".subMenu2:not(:contains(" + userString + "))").hide();
                }
                self.owlReset();
            }

        };
        self.owlReset = function() {
            if ($("#owl-demo").data('owlCarousel')) {
                $("#owl-demo").data('owlCarousel').destroy();
            }
            $("#owl-demo").owlCarousel({
                items: 3, //10 items above 1000px browser width
                itemsDesktop: [1024, 3], //5 items between 1000px and 901px
                itemsTablet: [768, 2], //2 items between 600 and 0
                itemsMobile: false, // itemsMobile disabled - inherit from itemsTablet option
                pagination: false,
                navigation: true,
                loop: true,
                navigationText: ['', '']
            });
        };

        self.iconNotificationsView = function() {
            app.GlobalMenu.vModel.iconNotificationsView();
        };
        // self.collapseExpand = function() {
        // var temp = document.getElementById("firstId").style.height;
        // if (temp < "116px") {
        // self.defaultCollapseExpand();
        // } else {
        // self.defaultCollapseExpand();
        // document.getElementById("firstId").style.minHeight = "115px";
        // // document.getElementById("firstId").style.backgroundColor = "#4F78D0 ";
        // document.getElementById("xyz").style.backgroundImage = "url('../img/Asset/minus.png')";
        // $("#firstId .information2").show();
        // }
        // console.log("inside asset");
        // };
        // self.collapseExpand1 = function() {
        // var temp = document.getElementById("secondId").style.height;
        // //var temp1 = document.getElementById("secondId").style.height;
        // if (temp == "115px") {
        // self.defaultCollapseExpand();
        // // document.getElementById("secondId").style.height = "200px";
        // // document.getElementById("secondId").style.backgroundColor = "#4F78D0";
        // document.getElementById("box2").style.backgroundImage = "url('../img/Asset/minus.png')";
        // $("#secondId .information2").show();
        // } else {
        // self.defaultCollapseExpand();
        // }
        // console.log("inside asset");
        // };
        // self.collapseExpand2 = function() {
        // var temp = document.getElementById("thirdId").style.height;
        // if (temp == "115px") {
        // self.defaultCollapseExpand();
        // // document.getElementById("thirdId").style.height = "200px";
        // // document.getElementById("thirdId").style.backgroundColor = "#4F78D0";
        // document.getElementById("box3").style.backgroundImage = "url('../img/Asset/minus.png')";
        // $("#thirdId .information2").show();
        // } else {
        // self.defaultCollapseExpand();
        // }
        // console.log("inside asset");
        // };
        // self.collapseExpand3 = function() {
        // var temp = document.getElementById("fourthId").style.height;
        // if (temp == "115px") {
        // self.defaultCollapseExpand();
        // // document.getElementById("fourthId").style.height = "200px";
        // // document.getElementById("fourthId").style.backgroundColor = "#4F78D0";
        // document.getElementById("box4").style.backgroundImage = "url('../img/Asset/minus.png')";
        // $("#fourthId .information2").show();
        // } else {
        // self.defaultCollapseExpand();
        // }
        // console.log("inside asset");
        // };
        // self.defaultCollapseExpand = function() {
        // $(".content").css('height', '115px');
        // $(".expandButton").css('background-image', "url('../img/Asset/dotdot.png')");
        // $(".information2").hide();
        // // $(".units").hide();
        // };

    };
});