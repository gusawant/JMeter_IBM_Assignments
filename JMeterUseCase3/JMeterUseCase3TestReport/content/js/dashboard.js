/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 70.93063785291042, "KoPercent": 29.069362147089578};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0020332287672824444, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "SelectCategory-81"], "isController": false}, {"data": [0.0, 500, 1500, "orderProducts-90"], "isController": false}, {"data": [0.011904761904761904, 500, 1500, "SearchProduct-2"], "isController": false}, {"data": [0.0, 500, 1500, "SelectShippingDeliveryOption-102"], "isController": false}, {"data": [0.011904761904761904, 500, 1500, "SearchProduct-3"], "isController": false}, {"data": [0.003968253968253968, 500, 1500, "SearchProduct-4"], "isController": false}, {"data": [0.007936507936507936, 500, 1500, "SearchProduct-1"], "isController": false}, {"data": [0.008, 500, 1500, "addProductToCart-39"], "isController": false}, {"data": [0.0, 500, 1500, "OrderConfirmation-107-2"], "isController": false}, {"data": [0.003703703703703704, 500, 1500, "OrderConfirmation-107-1"], "isController": false}, {"data": [0.0, 500, 1500, "SearchProduct-19"], "isController": false}, {"data": [0.003703703703703704, 500, 1500, "OrderConfirmation-107-0"], "isController": false}, {"data": [0.0, 500, 1500, "addProductToCart-79"], "isController": false}, {"data": [0.0, 500, 1500, "homePage"], "isController": false}, {"data": [0.0, 500, 1500, "addProductToCart-83"], "isController": false}, {"data": [0.0, 500, 1500, "SearchProductByPrice-61"], "isController": false}, {"data": [0.0, 500, 1500, "SelectCategory-70"], "isController": false}, {"data": [0.0, 500, 1500, "OrderProducts-95"], "isController": false}, {"data": [0.0, 500, 1500, "SelectCategory-71"], "isController": false}, {"data": [0.0, 500, 1500, "SelectPaymentMethod-106-1"], "isController": false}, {"data": [0.0034965034965034965, 500, 1500, "SelectPaymentMethod-106-0"], "isController": false}, {"data": [0.0, 500, 1500, "identityPage"], "isController": false}, {"data": [0.0, 500, 1500, "addProductToCart-85"], "isController": false}, {"data": [0.0, 500, 1500, "addProductToCart-87"], "isController": false}, {"data": [0.0, 500, 1500, "addProductToCart-17-1"], "isController": false}, {"data": [0.0, 500, 1500, "addProductToCart-17-0"], "isController": false}, {"data": [0.0035971223021582736, 500, 1500, "myAccountPage-17-1"], "isController": false}, {"data": [0.0035971223021582736, 500, 1500, "myAccountPage-17-0"], "isController": false}, {"data": [0.0, 500, 1500, "SelectCategoryByPrice-76"], "isController": false}, {"data": [0.0027624309392265192, 500, 1500, "SelectCategory-77"], "isController": false}, {"data": [0.0, 500, 1500, "clickOnWomenTab-86"], "isController": false}, {"data": [0.0, 500, 1500, "SelectCategory-62"], "isController": false}, {"data": [0.0, 500, 1500, "SearchProductByName-59"], "isController": false}, {"data": [0.002793296089385475, 500, 1500, "submitOrder-99"], "isController": false}, {"data": [0.011904761904761904, 500, 1500, "addProductToCart-17"], "isController": false}, {"data": [0.0, 500, 1500, "shopingCartPage"], "isController": false}, {"data": [0.0, 500, 1500, "SearchProductbyPrice-13"], "isController": false}, {"data": [0.003125, 500, 1500, "myAccountPage-1"], "isController": false}, {"data": [0.00819672131147541, 500, 1500, "addProductToCart-60"], "isController": false}, {"data": [0.01875, 500, 1500, "myAccountPage-0"], "isController": false}, {"data": [0.0, 500, 1500, "addProductToCart-85-1"], "isController": false}, {"data": [0.0, 500, 1500, "myAccountPage"], "isController": false}, {"data": [0.0, 500, 1500, "SelectCategory-68"], "isController": false}, {"data": [0.0, 500, 1500, "addProductToCart-85-0"], "isController": false}, {"data": [0.0, 500, 1500, "SelectCategory-69"], "isController": false}, {"data": [0.0, 500, 1500, "addProductToCart-87-1"], "isController": false}, {"data": [0.0, 500, 1500, "addProductToCart-87-0"], "isController": false}, {"data": [0.0, 500, 1500, "addProductToCart-60-0"], "isController": false}, {"data": [0.0, 500, 1500, "addProductToCart-83-1"], "isController": false}, {"data": [0.0, 500, 1500, "addProductToCart-60-1"], "isController": false}, {"data": [0.0, 500, 1500, "SelectCategory-66"], "isController": false}, {"data": [0.0, 500, 1500, "addProductToCart-83-0"], "isController": false}, {"data": [0.0, 500, 1500, "SearchProduct-20"], "isController": false}, {"data": [0.0, 500, 1500, "searchProductByName-58"], "isController": false}, {"data": [0.0, 500, 1500, "OrderConfirmation-107"], "isController": false}, {"data": [0.0, 500, 1500, "identityPage-1"], "isController": false}, {"data": [0.009900990099009901, 500, 1500, "verifyLoginUser-0"], "isController": false}, {"data": [0.017241379310344827, 500, 1500, "identityPage-0"], "isController": false}, {"data": [0.0049504950495049506, 500, 1500, "verifyLoginUser-1"], "isController": false}, {"data": [0.0, 500, 1500, "validLogin"], "isController": false}, {"data": [0.0, 500, 1500, "userLogin"], "isController": false}, {"data": [0.0, 500, 1500, "SelectPaymentMethod-106"], "isController": false}, {"data": [0.0, 500, 1500, "SelectPaymentOption-105"], "isController": false}, {"data": [0.0, 500, 1500, "addProductToCart-79-0"], "isController": false}, {"data": [0.0, 500, 1500, "searchProductByCategory-40"], "isController": false}, {"data": [0.0, 500, 1500, "addProductToCart-39-1"], "isController": false}, {"data": [0.0, 500, 1500, "addProductToCart-39-0"], "isController": false}, {"data": [0.0, 500, 1500, "addProductToCart-79-1"], "isController": false}, {"data": [0.0, 500, 1500, "userLogout-18"], "isController": false}, {"data": [0.0, 500, 1500, "verifyLoginUser"], "isController": false}, {"data": [0.0, 500, 1500, "myAccountPage-17"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 8607, 2502, 29.069362147089578, 5454.294179156503, 193, 19860, 6114.0, 9853.0, 12272.199999999999, 16136.040000000005, 2.9128086419753085, 63.64167998150517, 2.488252087436715], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["SelectCategory-81", 180, 39, 21.666666666666668, 6930.327777777773, 194, 10535, 8612.5, 9997.8, 10203.75, 10527.71, 0.06286055329160557, 3.4774961456440603, 0.049123448872194365], "isController": false}, {"data": ["orderProducts-90", 179, 38, 21.22905027932961, 5513.189944134083, 196, 8389, 6801.0, 7854.0, 8035.0, 8355.4, 0.062322454989434777, 1.2770778717769455, 0.04546068393149543], "isController": false}, {"data": ["SearchProduct-2", 126, 20, 15.873015873015873, 5650.809523809522, 195, 8276, 6732.0, 7576.3, 7711.45, 8223.890000000001, 0.04542912677646814, 0.02146707922893792, 0.02957343762562866], "isController": false}, {"data": ["SelectShippingDeliveryOption-102", 179, 42, 23.463687150837988, 5398.441340782125, 195, 8319, 6916.0, 7884.0, 8045.0, 8274.199999999999, 0.062405781215790136, 1.2348947068043916, 0.05683986754983049], "isController": false}, {"data": ["SearchProduct-3", 126, 21, 16.666666666666668, 5621.380952380952, 196, 12217, 6648.0, 7642.4, 7784.65, 11047.090000000018, 0.04552710633325408, 0.02170921448759242, 0.029750134774687798], "isController": false}, {"data": ["SearchProduct-4", 126, 13, 10.317460317460318, 6954.13492063492, 198, 9778, 7847.0, 8907.3, 9093.6, 9655.960000000001, 0.0456271451095305, 2.034958506909615, 0.03649492633388786], "isController": false}, {"data": ["SearchProduct-1", 126, 18, 14.285714285714286, 5721.269841269841, 195, 7790, 6810.0, 7539.6, 7653.849999999999, 7789.46, 0.045318491886910936, 0.012072146005031072, 0.02934265572476857], "isController": false}, {"data": ["addProductToCart-39", 125, 16, 12.8, 5585.184, 197, 14355, 5835.0, 7125.2, 10891.799999999994, 14269.979999999998, 0.04592090143096876, 0.3368793204680111, 0.044320127507648584], "isController": false}, {"data": ["OrderConfirmation-107-2", 127, 9, 7.086614173228346, 6548.9133858267705, 194, 8552, 7250.0, 7940.4, 8077.4, 8490.4, 0.044556947813990534, 1.4258069121815888, 0.036751396132316594], "isController": false}, {"data": ["OrderConfirmation-107-1", 135, 8, 5.925925925925926, 4266.251851851853, 196, 5904, 4607.0, 5208.2, 5319.4, 5774.039999999995, 0.04732976011174031, 0.01472036339702166, 0.03809045957372364], "isController": false}, {"data": ["SearchProduct-19", 126, 15, 11.904761904761905, 6761.873015873018, 194, 10022, 7733.0, 8816.3, 8955.3, 9807.080000000004, 0.04603681483700776, 2.0170964197242176, 0.040076691487573715], "isController": false}, {"data": ["OrderConfirmation-107-0", 135, 0, 0.0, 5082.66666666667, 1168, 6244, 5222.0, 5799.0, 5943.0, 6203.319999999999, 0.047261642905729824, 0.015373709188258528, 0.04089684251527864], "isController": false}, {"data": ["addProductToCart-79", 180, 43, 23.88888888888889, 5525.499999999999, 195, 15172, 6030.5, 11844.20000000001, 13415.199999999999, 14500.509999999998, 0.06295196450348561, 0.5890629666751536, 0.06122857250649892], "isController": false}, {"data": ["homePage", 127, 18, 14.173228346456693, 6717.732283464567, 387, 10226, 7696.0, 8702.6, 8944.199999999999, 10006.759999999998, 0.04506611234165649, 3.1012923999594406, 0.025675430576541067], "isController": false}, {"data": ["addProductToCart-83", 180, 47, 26.11111111111111, 5335.655555555553, 194, 14509, 5843.0, 11202.000000000004, 13823.8, 14368.06, 0.06282393591958536, 0.6704304448501823, 0.06085250772210879], "isController": false}, {"data": ["SearchProductByPrice-61", 122, 122, 100.0, 257.1967213114753, 193, 1024, 205.0, 407.4, 491.29999999999967, 934.7599999999984, 0.04516569702332142, 0.019230706935711075, 0.027258203867590466], "isController": false}, {"data": ["SelectCategory-70", 181, 181, 100.0, 229.55248618784537, 193, 716, 205.0, 306.8, 308.0, 451.9600000000022, 0.061795180727004934, 0.02661829810353663, 0.03741771809516526], "isController": false}, {"data": ["OrderProducts-95", 179, 38, 21.22905027932961, 5508.17877094972, 194, 8413, 6904.0, 7811.0, 7924.0, 8274.599999999999, 0.062401321374125907, 1.2745375248297994, 0.044619109981980314], "isController": false}, {"data": ["SelectCategory-71", 181, 35, 19.337016574585636, 7761.629834254145, 195, 11370, 9670.0, 10673.2, 10862.4, 11333.92, 0.06175613287872631, 4.379880061955732, 0.04690619260475427], "isController": false}, {"data": ["SelectPaymentMethod-106-1", 143, 11, 7.6923076923076925, 6390.0769230769265, 196, 8553, 6971.0, 7914.4, 8005.999999999999, 8404.28, 0.04995772807624318, 1.191538145061696, 0.044034049969082105], "isController": false}, {"data": ["SelectPaymentMethod-106-0", 143, 0, 0.0, 5250.846153846154, 936, 6247, 5420.0, 5993.599999999999, 6050.2, 6246.12, 0.04989161656862208, 0.01644700690423217, 0.045560103501554136], "isController": false}, {"data": ["identityPage", 120, 77, 64.16666666666667, 5065.983333333332, 194, 13619, 312.5, 12965.0, 13114.55, 13597.369999999999, 0.1659900267658918, 2.133448687036179, 0.14749175669320203], "isController": false}, {"data": ["addProductToCart-85", 180, 46, 25.555555555555557, 5330.016666666669, 196, 14526, 5804.5, 11042.7, 13718.05, 14372.1, 0.06278041920578584, 0.6700328115975315, 0.060544003013808904], "isController": false}, {"data": ["addProductToCart-87", 179, 46, 25.69832402234637, 5410.363128491624, 194, 14736, 5933.0, 12698.0, 13924.0, 14615.199999999999, 0.06238301007433336, 0.6415659128777701, 0.06008877631630765], "isController": false}, {"data": ["addProductToCart-17-1", 12, 0, 0.0, 8227.666666666664, 6726, 8831, 8421.5, 8792.6, 8831.0, 8831.0, 0.014475603180290017, 1.1628616752072725, 0.01118655011393506], "isController": false}, {"data": ["addProductToCart-17-0", 12, 0, 0.0, 5302.666666666667, 3932, 5923, 5512.5, 5914.0, 5923.0, 5923.0, 0.014516843167284842, 0.008074757735057935, 0.010547393863730393], "isController": false}, {"data": ["myAccountPage-17-1", 139, 17, 12.23021582733813, 6160.4316546762575, 196, 9011, 7070.0, 7881.0, 8023.0, 8720.599999999997, 0.04783060670199708, 1.4471964350111095, 0.03701549143883756], "isController": false}, {"data": ["myAccountPage-17-0", 139, 0, 0.0, 4668.424460431658, 1103, 5540, 4823.0, 5336.0, 5472.0, 5530.8, 0.04780287333098331, 0.016873874246631875, 0.03480498942490392], "isController": false}, {"data": ["SelectCategoryByPrice-76", 181, 181, 100.0, 249.20994475138136, 193, 715, 205.0, 401.80000000000007, 413.0, 631.3600000000007, 0.061857924991285215, 0.026652000151227248, 0.03534142594905778], "isController": false}, {"data": ["SelectCategory-77", 181, 29, 16.022099447513813, 7052.458563535911, 195, 10135, 8498.0, 9401.4, 9523.8, 9880.800000000003, 0.061834277985733016, 2.8593496075914726, 0.048908877476403045], "isController": false}, {"data": ["clickOnWomenTab-86", 60, 24, 40.0, 6480.299999999999, 193, 11345, 10318.5, 11150.9, 11265.9, 11345.0, 0.0751205685124625, 4.384512728867332, 0.040934841044877025], "isController": false}, {"data": ["SelectCategory-62", 182, 41, 22.52747252747253, 6720.34065934066, 193, 10034, 8541.0, 9738.4, 9895.8, 10004.119999999999, 0.062169192432437966, 3.123407474863322, 0.046987163940502036], "isController": false}, {"data": ["SearchProductByName-59", 122, 122, 100.0, 226.66393442622947, 193, 512, 205.0, 307.0, 308.0, 483.7099999999995, 0.04518406395100566, 0.019233463697382325, 0.027225163532978998], "isController": false}, {"data": ["submitOrder-99", 179, 38, 21.22905027932961, 5519.2793296089385, 196, 8324, 6779.0, 7930.0, 8016.0, 8231.999999999998, 0.06244339976752915, 1.279524864813528, 0.056738885053038514], "isController": false}, {"data": ["addProductToCart-17", 126, 16, 12.698412698412698, 5865.873015873015, 196, 14627, 6040.5, 8213.89999999999, 13951.049999999997, 14550.86, 0.045835249198246907, 0.39247675486708505, 0.04699832433058709], "isController": false}, {"data": ["shopingCartPage", 126, 27, 21.428571428571427, 5920.500000000001, 194, 8872, 7404.5, 8395.7, 8503.55, 8823.130000000001, 0.04519840485502612, 2.8485798620838834, 0.016384001387878003], "isController": false}, {"data": ["SearchProductbyPrice-13", 126, 19, 15.079365079365079, 6486.960317460316, 194, 9292, 7600.0, 8808.8, 8999.2, 9248.53, 0.045723343290861425, 1.9321872497236638, 0.04008943245537256], "isController": false}, {"data": ["myAccountPage-1", 160, 18, 11.25, 6148.912500000005, 194, 8937, 7004.0, 8008.1, 8294.25, 8919.92, 0.05471200285596655, 1.6742006448151487, 0.03769464649891055], "isController": false}, {"data": ["addProductToCart-60", 122, 18, 14.754098360655737, 5471.868852459016, 197, 14335, 5816.5, 6736.6, 9235.999999999998, 14306.25, 0.04516740261149037, 0.24972843157027436, 0.04285928354873618], "isController": false}, {"data": ["myAccountPage-0", 160, 0, 0.0, 4457.631250000003, 519, 5944, 4634.5, 5221.4, 5376.7, 5891.539999999999, 0.05472309940690421, 0.01927933803689773, 0.034858587601934596], "isController": false}, {"data": ["addProductToCart-85-1", 24, 2, 8.333333333333334, 7106.958333333333, 286, 8739, 7897.0, 8594.5, 8704.5, 8739.0, 0.019649260696566292, 1.4477417933634622, 0.014263623487416286], "isController": false}, {"data": ["myAccountPage", 246, 104, 42.27642276422764, 6977.569105691056, 194, 14553, 9687.5, 12832.800000000001, 13170.55, 14319.84, 0.0841019602936184, 1.7072453550333484, 0.09048212282065667], "isController": false}, {"data": ["SelectCategory-68", 181, 181, 100.0, 249.8066298342541, 193, 1025, 204.0, 408.8, 421.8, 616.6400000000034, 0.061791720933567065, 0.026624809141248703, 0.035544975347322386], "isController": false}, {"data": ["addProductToCart-85-0", 24, 0, 0.0, 5182.375, 3491, 5863, 5488.0, 5812.0, 5856.5, 5863.0, 0.019683069771561573, 0.010929165450143606, 0.013397558233182049], "isController": false}, {"data": ["SelectCategory-69", 181, 181, 100.0, 225.90607734806636, 193, 505, 205.0, 306.0, 308.0, 468.1000000000003, 0.06179087714027724, 0.026680454218422214, 0.03765648283596229], "isController": false}, {"data": ["addProductToCart-87-1", 24, 3, 12.5, 7171.791666666667, 211, 9063, 8158.0, 8963.5, 9050.25, 9063.0, 0.01402381126287342, 0.9866501031699657, 0.010191457892045869], "isController": false}, {"data": ["addProductToCart-87-0", 24, 0, 0.0, 5294.291666666668, 3810, 6052, 5471.0, 5842.5, 6001.0, 6052.0, 0.014046086379919715, 0.007841483770039815, 0.009560666217582071], "isController": false}, {"data": ["addProductToCart-60-0", 12, 0, 0.0, 5038.833333333334, 3378, 5922, 5560.0, 5889.0, 5922.0, 5922.0, 0.013801527138977927, 0.007635317504131832, 0.00938072547727406], "isController": false}, {"data": ["addProductToCart-83-1", 24, 2, 8.333333333333334, 7201.166666666667, 210, 9119, 8092.0, 8857.0, 9083.25, 9119.0, 0.01961871036407422, 1.4454613326969517, 0.014227077478374461], "isController": false}, {"data": ["addProductToCart-60-1", 12, 5, 41.666666666666664, 4391.083333333333, 197, 8782, 5533.0, 8684.2, 8782.0, 8782.0, 0.013887185137008654, 0.6535633902264305, 0.01006956539475481], "isController": false}, {"data": ["SelectCategory-66", 181, 38, 20.994475138121548, 6638.966850828731, 194, 10719, 8181.0, 9316.8, 9517.900000000001, 10075.300000000005, 0.061789379463941294, 2.695174295336506, 0.04695811482310144], "isController": false}, {"data": ["addProductToCart-83-0", 24, 0, 0.0, 5094.958333333334, 3497, 5876, 5364.5, 5828.0, 5871.25, 5876.0, 0.019655890870493888, 0.010899677766239041, 0.01337905853196703], "isController": false}, {"data": ["SearchProduct-20", 125, 13, 10.4, 7145.928000000002, 194, 12288, 7987.0, 9138.2, 9349.3, 11962.219999999994, 0.045789407554666144, 2.0954853412766967, 0.039653984672087396], "isController": false}, {"data": ["searchProductByName-58", 122, 122, 100.0, 242.74590163934423, 193, 914, 205.0, 307.7, 427.8499999999999, 829.3599999999985, 0.045184097419876924, 0.019236009711803233, 0.02612205632086635], "isController": false}, {"data": ["OrderConfirmation-107", 177, 59, 33.333333333333336, 11888.89830508474, 195, 19860, 15958.0, 18452.4, 18877.2, 19505.88, 0.06149578597520851, 1.4488129364420206, 0.1268353978647065], "isController": false}, {"data": ["identityPage-1", 58, 15, 25.862068965517242, 5488.05172413793, 195, 8326, 7460.0, 8150.4, 8249.25, 8326.0, 0.08028826254815565, 2.0624358364410424, 0.053597606302351754], "isController": false}, {"data": ["verifyLoginUser-0", 101, 0, 0.0, 4290.514851485145, 626, 5562, 4491.0, 5093.6, 5181.3, 5555.500000000001, 0.03611874412623394, 0.011825619910296774, 0.023607236864220702], "isController": false}, {"data": ["identityPage-0", 58, 0, 0.0, 4759.603448275862, 534, 5468, 4947.5, 5319.4, 5394.7, 5468.0, 0.08110651662893349, 0.031684964285164915, 0.04787567786868855], "isController": false}, {"data": ["verifyLoginUser-1", 101, 6, 5.9405940594059405, 6355.891089108909, 193, 9289, 6862.0, 7729.6, 7953.9, 9269.860000000004, 0.03615595603149363, 1.170141804621626, 0.02499006382421189], "isController": false}, {"data": ["validLogin", 120, 61, 50.833333333333336, 3700.7999999999997, 197, 9108, 828.0, 8168.5, 8334.5, 9028.409999999996, 0.17076575634288058, 2.9349683420744057, 0.24655139889173025], "isController": false}, {"data": ["userLogin", 127, 19, 14.960629921259843, 5876.110236220472, 199, 8136, 6860.0, 7884.0, 7993.2, 8122.5599999999995, 0.04514900593976056, 1.3223616416267436, 0.06763949331972464], "isController": false}, {"data": ["SelectPaymentMethod-106", 178, 46, 25.84269662921348, 9404.876404494382, 196, 14416, 11759.5, 13739.4, 13878.3, 14156.090000000002, 0.061963131240696835, 1.2095494078300164, 0.09974061151953788], "isController": false}, {"data": ["SelectPaymentOption-105", 179, 40, 22.3463687150838, 5420.664804469271, 194, 8684, 6884.0, 7834.0, 7965.0, 8371.999999999996, 0.06237029417872608, 1.2604270299570794, 0.04710710286150728], "isController": false}, {"data": ["addProductToCart-79-0", 24, 0, 0.0, 5257.000000000001, 4084, 5912, 5403.0, 5754.5, 5895.75, 5912.0, 0.019764408253616885, 0.010982371383113289, 0.0134529224148154], "isController": false}, {"data": ["searchProductByCategory-40", 123, 19, 15.447154471544716, 6670.878048780486, 195, 10238, 7921.0, 9226.6, 9417.0, 10073.120000000003, 0.045385996833311994, 2.1046714638450723, 0.03565023350726379], "isController": false}, {"data": ["addProductToCart-39-1", 12, 2, 16.666666666666668, 5992.0, 204, 8618, 6767.5, 8563.4, 8618.0, 8618.0, 0.014617193961637175, 0.9796969650137463, 0.010591755780795686], "isController": false}, {"data": ["addProductToCart-39-0", 12, 0, 0.0, 4804.166666666667, 3539, 5918, 4966.5, 5772.200000000001, 5918.0, 5918.0, 0.014648509025922978, 0.008125344850316652, 0.010013629216939535], "isController": false}, {"data": ["addProductToCart-79-1", 24, 5, 20.833333333333332, 6393.291666666664, 193, 9595, 7868.0, 8798.0, 9421.75, 9595.0, 0.01973332061630449, 1.257144849562208, 0.014332673055055142], "isController": false}, {"data": ["userLogout-18", 175, 41, 23.428571428571427, 5482.02285714286, 195, 11465, 6967.0, 7945.400000000001, 8247.4, 9907.760000000018, 0.0607256190976867, 1.6064925256522364, 0.045813277613240264], "isController": false}, {"data": ["verifyLoginUser", 126, 31, 24.603174603174605, 8581.595238095239, 195, 14280, 10718.5, 12586.3, 12864.849999999999, 13959.510000000006, 0.04504254912229588, 1.1846252559337302, 0.054131771351866316], "isController": false}, {"data": ["myAccountPage-17", 176, 54, 30.681818181818183, 8627.852272727272, 196, 14198, 10995.5, 13024.3, 13155.05, 13671.319999999992, 0.06049922863483491, 1.4686672486136738, 0.0807218101523893], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["403/Forbidden", 894, 35.73141486810552, 10.386894388288603], "isController": false}, {"data": ["508/Loop Detected", 1608, 64.26858513189448, 18.682467758800975], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 8607, 2502, "508/Loop Detected", 1608, "403/Forbidden", 894, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["SelectCategory-81", 180, 39, "508/Loop Detected", 39, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["orderProducts-90", 179, 38, "508/Loop Detected", 38, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["SearchProduct-2", 126, 20, "508/Loop Detected", 20, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["SelectShippingDeliveryOption-102", 179, 42, "508/Loop Detected", 42, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["SearchProduct-3", 126, 21, "508/Loop Detected", 21, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["SearchProduct-4", 126, 13, "508/Loop Detected", 13, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["SearchProduct-1", 126, 18, "508/Loop Detected", 18, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["addProductToCart-39", 125, 16, "508/Loop Detected", 16, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["OrderConfirmation-107-2", 127, 9, "508/Loop Detected", 9, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["OrderConfirmation-107-1", 135, 8, "508/Loop Detected", 8, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["SearchProduct-19", 126, 15, "508/Loop Detected", 15, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["addProductToCart-79", 180, 43, "508/Loop Detected", 43, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["homePage", 127, 18, "508/Loop Detected", 18, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["addProductToCart-83", 180, 47, "508/Loop Detected", 47, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["SearchProductByPrice-61", 122, 122, "403/Forbidden", 107, "508/Loop Detected", 15, null, null, null, null, null, null], "isController": false}, {"data": ["SelectCategory-70", 181, 181, "403/Forbidden", 144, "508/Loop Detected", 37, null, null, null, null, null, null], "isController": false}, {"data": ["OrderProducts-95", 179, 38, "508/Loop Detected", 38, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["SelectCategory-71", 181, 35, "508/Loop Detected", 35, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["SelectPaymentMethod-106-1", 143, 11, "508/Loop Detected", 11, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["identityPage", 120, 77, "508/Loop Detected", 77, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["addProductToCart-85", 180, 46, "508/Loop Detected", 46, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["addProductToCart-87", 179, 46, "508/Loop Detected", 46, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["myAccountPage-17-1", 139, 17, "508/Loop Detected", 17, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["SelectCategoryByPrice-76", 181, 181, "403/Forbidden", 144, "508/Loop Detected", 37, null, null, null, null, null, null], "isController": false}, {"data": ["SelectCategory-77", 181, 29, "508/Loop Detected", 29, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["clickOnWomenTab-86", 60, 24, "508/Loop Detected", 24, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["SelectCategory-62", 182, 41, "508/Loop Detected", 41, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["SearchProductByName-59", 122, 122, "403/Forbidden", 107, "508/Loop Detected", 15, null, null, null, null, null, null], "isController": false}, {"data": ["submitOrder-99", 179, 38, "508/Loop Detected", 38, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["addProductToCart-17", 126, 16, "508/Loop Detected", 16, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["shopingCartPage", 126, 27, "508/Loop Detected", 27, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["SearchProductbyPrice-13", 126, 19, "508/Loop Detected", 19, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["myAccountPage-1", 160, 18, "508/Loop Detected", 18, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["addProductToCart-60", 122, 18, "508/Loop Detected", 18, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["addProductToCart-85-1", 24, 2, "508/Loop Detected", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["myAccountPage", 246, 104, "508/Loop Detected", 104, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["SelectCategory-68", 181, 181, "403/Forbidden", 144, "508/Loop Detected", 37, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["SelectCategory-69", 181, 181, "403/Forbidden", 141, "508/Loop Detected", 40, null, null, null, null, null, null], "isController": false}, {"data": ["addProductToCart-87-1", 24, 3, "508/Loop Detected", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["addProductToCart-83-1", 24, 2, "508/Loop Detected", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["addProductToCart-60-1", 12, 5, "508/Loop Detected", 5, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["SelectCategory-66", 181, 38, "508/Loop Detected", 38, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["SearchProduct-20", 125, 13, "508/Loop Detected", 13, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["searchProductByName-58", 122, 122, "403/Forbidden", 107, "508/Loop Detected", 15, null, null, null, null, null, null], "isController": false}, {"data": ["OrderConfirmation-107", 177, 59, "508/Loop Detected", 59, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["identityPage-1", 58, 15, "508/Loop Detected", 15, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["verifyLoginUser-1", 101, 6, "508/Loop Detected", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["validLogin", 120, 61, "508/Loop Detected", 61, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["userLogin", 127, 19, "508/Loop Detected", 19, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["SelectPaymentMethod-106", 178, 46, "508/Loop Detected", 46, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["SelectPaymentOption-105", 179, 40, "508/Loop Detected", 40, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["searchProductByCategory-40", 123, 19, "508/Loop Detected", 19, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["addProductToCart-39-1", 12, 2, "508/Loop Detected", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["addProductToCart-79-1", 24, 5, "508/Loop Detected", 5, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["userLogout-18", 175, 41, "508/Loop Detected", 41, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["verifyLoginUser", 126, 31, "508/Loop Detected", 31, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["myAccountPage-17", 176, 54, "508/Loop Detected", 54, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
