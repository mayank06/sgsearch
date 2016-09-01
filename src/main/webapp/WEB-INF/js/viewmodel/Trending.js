define(['knockout'], function(ko) {
	return function Trending() {
		var self = this;
		self.pageId = "Trending";
		var db = openDatabase('RDPApp', '1.0', 'Test DB', 2 * 1024 * 1024);
		self.init = function(user) {
			currentPageId = self.pageId;
		};
	};
});