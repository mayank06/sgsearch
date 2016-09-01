define(['knockout'], function(ko) {
	return function Publications() {
		var self = this;
		self.pageId = "Publications";
		var db = openDatabase('RDPApp', '1.0', 'Test DB', 2 * 1024 * 1024);
		self.init = function(user) {
			currentPageId = self.pageId;
		};
	};
});