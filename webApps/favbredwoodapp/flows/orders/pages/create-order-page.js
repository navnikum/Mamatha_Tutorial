define([], function() {
  "use strict";
 
  var PageModule = function PageModule() {};
 
  PageModule.prototype.checkWithUser = function() {
    var self = this;
    var checkPromise = new Promise(function(resolve) {
      // save away the reference to the promise resolving function
      self.userInputComplete = resolve;
 
      // Show the dialog
      document.getElementById("dirtyDataWarningDialog").open();
    });
 
    return checkPromise;
  };
 
  PageModule.prototype.userResponse = function(response) {
    var self = this;
    // close the dialog
    var dialog = document.getElementById("dirtyDataWarningDialog");
    if (dialog.isOpen()) {
      dialog.close();
    }
    if (self.userInputComplete) {
      self.userInputComplete(response);
      delete self.userInputComplete;
    }
  };
 
  return PageModule;
});