define(['ojs/ojconverterutils-i18n'], function(IntlConverterUtils) {
  'use strict';
  
  var PageModule = function PageModule() {};
    
  PageModule.prototype.getInitials = function(firstName, lastName) {
    return IntlConverterUtils.IntlConverterUtils.getInitials(firstName, lastName);
  };
  
  return PageModule;
});
