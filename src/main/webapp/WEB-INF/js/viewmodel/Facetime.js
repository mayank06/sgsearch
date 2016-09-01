/***************************************************************************************************
 *   File Name  : Facetime.js
 *   Author   : xxxxx xxxxx
 *   Date of Creation: July, 2015
 *   Last Modified : September, 2015
 *   Copy rights Information : �2015 All rights reserved by TCS.
 *   Description : This file is used to send the soap request and get the respnse data.
 ****************************************************************************************************/

define(['knockout'], function(ko) {
    return function Facetime() {
        var self = this;
        self.pageId = "Facetime";
        self.userName = ko.observable();

        self.init = function() {
            currentPageId = self.pageId;
            console.log("inside log in init");

        };
        // self.submitInput = function() {
        // if (self.userName() && self.userName().length > 0) {
        // window.location.href = "facetime:" + self.userName();
        // } else {
        // alert('Please enter a valid phone number');
        // }
        //
        // };
        // self.goBack = function() {
        // hideFacetime();
        // };
    };
});