define(['fndconfig/config', 'ojs/ojconverter-number', 'ojs/ojconverter-datetime', 'oj-sp/common-util/common-util'], function (Config, NumberConverter, DateTimeConverter, utilityClass) {
  'use strict';
  var AppModule = function AppModule() {
    // get the default date format pattern from user profile
    var dateOptions = {
      formatStyle: "date",
      pattern: utilityClass.getDateFormatPattern()
    };
    // create just one instance of converter per application
    this.dateConverter = new DateTimeConverter.IntlDateTimeConverter(
      dateOptions
    );
    // create map to cache currency converters
    this.currencyConverterMap = new Map();
  };
 
  AppModule.prototype.formatDate = function (date) {
    return this.dateConverter.format(date);
  };
 
  AppModule.prototype.formatCurrency = function (currCode, value) {
    // if caller provides the currency code then use it otherwise get the default one from the user profile
    currCode = currCode ? currCode : utilityClass.getCurrencyCode();
    // if converter doesn't exists in map create a new one and update cache
    if(!this.currencyConverterMap.get(currCode)) {
      var numberOptions = {
        style: "currency",
        currency: currCode,
        pattern: utilityClass.getNumberFormatPattern(),
      };
      // update the cache with new converter
      this.currencyConverterMap.set(currCode, new NumberConverter.IntlNumberConverter(numberOptions));
    }
    return this.currencyConverterMap.get(currCode).format(value || 0);
  };
  return AppModule;
});