function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

var app = angular.module('DemoMock', ['ngTable', 'ngMockE2E'])
.run(function($httpBackend, $filter, $log, ngTableParams) {
    // emulation of api server
    $httpBackend.whenGET(/data.*/).respond(function(method, url, data, headers) {
        var query = url.split('?')[1],
            requestParams = {};

        $log.log('Ajax request: ', url);

        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            requestParams[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
        // parse url params
        for (var key in requestParams) {
            if (key.indexOf('[') >= 0) {
                var params = key.split(/\[(.*)\]/), value = requestParams[key], lastKey = '';

                angular.forEach(params.reverse(), function(name) {
                    if (name != '') {
                        var v = value;
                        value = {};
                        value[lastKey = name] = isNumber(v) ? parseFloat(v) : v;
                    }
                });
                requestParams[lastKey] = angular.extend(requestParams[lastKey] || {}, value[lastKey]);
            } else {
                requestParams[key] = isNumber(requestParams[key]) ? parseFloat(requestParams[key]) : requestParams[key];
            }
        }

        data = [{name: "Moroni", age: 50},
                {name: "Tiancum", age: 43},
                {name: "Jacob", age: 27},
                {name: "Nephi", age: 29},
                {name: "Enos", age: 34},
                {name: "Tiancum", age: 43},
                {name: "Jacob", age: 27},
                {name: "Nephi", age: 29},
                {name: "Enos", age: 34},
                {name: "Tiancum", age: 43},
                {name: "Jacob", age: 27},
                {name: "Nephi", age: 29},
                {name: "Enos", age: 34},
                {name: "Tiancum", age: 43},
                {name: "Jacob", age: 27},
                {name: "Nephi", age: 29},
				{name: "Hari", age: 31},
                {name: "Enos", age: 34}];

        var params = new ngTableParams(requestParams);
        data = params.filter() ? $filter('filter')(data, params.filter()) : data;
        data = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;

        var total = data.length;
        data = data.slice((params.page() - 1) * params.count(), params.page() * params.count());

        return [200, {
            result: data,
            total: total
        }];
    });
    $httpBackend.whenGET(/.*/).passThrough();
});
