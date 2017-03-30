angular.module('ng').directive('pickADate', function () {
    return {
        restrict: "A",
        scope: {
            pickADate: '=',
            minDate: '=',
            maxDate: '=',
            pickADateOptions: '='
        },
        link: function (scope, element, attrs) {
            var options = $.extend(scope.pickADateOptions || {}, {
                onSet: function (e) {
                    if (scope.$$phase || scope.$root.$$phase) // we are coming from $watch or link setup
                        return;
                    var select = element.pickadate('picker').get('select'); // selected date
                    scope.$apply(function () {
                        if (e.hasOwnProperty('clear')) {
                            console.log('teste'); 
                            scope.pickADate = null;
                            return;
                        }
                        if (!scope.pickADate)
                            scope.pickADate = new Date();
                        scope.pickADate.setYear(select.obj.getFullYear());
                        // Interesting: getYear returns only since 1900. Use getFullYear instead.
                        // It took me half a day to figure that our. Ironically setYear()
                        // (not setFullYear, duh) accepts the actual year A.D.
                        // So as I got the $#%^ 114 and set it, guess what, I was transported to ancient Rome 114 A.D.
                        // That's it I'm done being a programmer, I'd rather go serve Emperor Trajan as a sex slave.
                        scope.pickADate.setMonth(select.obj.getMonth());
                        scope.pickADate.setDate(select.obj.getDate());
                    });
                },
                onOpen: function() {
                    if (scope.pickADate != null) {                        
                        return;
                    }
                    element.pickadate('picker').set('select', new Date())
                },
                onClear: function() {
                    console.log('LIMPOU');
                    element.pickadate('picker').clear();
                },
                onClose: function () {
                    element.parent().parent().find('.data-picker').each(function(){
                        $(this).val(element.context.value);
                    });
                    element.blur();
                    //element.pickadate('picker').clear();
                }
            });
            element.pickadate(options);
            function updateValue(newValue) {
                if (newValue) {
                    scope.pickADate = (newValue instanceof Date) ? newValue : new Date(newValue);
                    // needs to be in milliseconds
                    element.pickadate('picker').set('select', scope.pickADate.getTime());
                } else {
                    element.pickadate('picker').clear();
                    scope.pickADate = null;
                }
            }
            updateValue(scope.pickADate);            
            element.pickadate('picker').set('min', scope.minDate ? scope.minDate : false);
            element.pickadate('picker').set('max', scope.maxDate ? scope.maxDate : false);
            scope.$watch('pickADate', function (newValue, oldValue) {
                if (newValue == oldValue)
                    return;
                updateValue(newValue);
            }, true);
            scope.$watch('minDate', function (newValue, oldValue) {
                element.pickadate('picker').set('min', newValue ? newValue : false);
            }, true);
            scope.$watch('maxDate', function (newValue, oldValue) {
                element.pickadate('picker').set('max', newValue ? newValue : false);
            }, true);
        }
    };
});

