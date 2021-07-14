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

    var data = {"OkPercent": 33.96175959352855, "KoPercent": 66.03824040647146};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [2.3398850113651558E-4, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [2.420135527589545E-4, 500, 1500, "validLogin"], "isController": false}, {"data": [0.0, 500, 1500, "myAccountPage-1"], "isController": false}, {"data": [0.002259036144578313, 500, 1500, "myAccountPage-0"], "isController": false}, {"data": [0.0, 500, 1500, "identityPage"], "isController": false}, {"data": [0.0, 500, 1500, "shopingCartPage"], "isController": false}, {"data": [0.0, 500, 1500, "myAccountPage"], "isController": false}, {"data": [2.4154589371980676E-4, 500, 1500, "invalidLogin"], "isController": false}, {"data": [0.0, 500, 1500, "homePage"], "isController": false}, {"data": [8.116883116883117E-4, 500, 1500, "identityPage-1"], "isController": false}, {"data": [8.116883116883117E-4, 500, 1500, "identityPage-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 14958, 9878, 66.03824040647146, 3123.722957614648, 192, 16786, 307.0, 8614.0, 9178.249999999996, 13221.41, 8.267267413325786, 109.10189828606055, 7.622232387080889], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["validLogin", 2066, 1432, 69.31268151016457, 2579.2967086156837, 195, 9828, 219.0, 8058.9, 8183.95, 8466.64, 1.1503488073622326, 12.50230028001472, 1.7380702423736494], "isController": false}, {"data": ["myAccountPage-1", 664, 368, 55.42168674698795, 3634.1746987951833, 193, 11930, 307.0, 8068.0, 8180.75, 8475.6, 0.36811155997806855, 5.736805050834322, 0.2598397599014525], "isController": false}, {"data": ["myAccountPage-0", 664, 0, 0.0, 5094.7078313253, 482, 7679, 5119.0, 5340.0, 5426.0, 5828.300000000003, 0.36943853132605065, 0.11381081826183623, 0.2518699522122358], "isController": false}, {"data": ["identityPage", 2061, 1778, 86.26880155264435, 2801.7947598253254, 193, 15850, 219.0, 12846.0, 13140.699999999999, 13508.52, 1.1440402773229126, 5.9765960005426, 1.0147390244850154], "isController": false}, {"data": ["shopingCartPage", 2060, 1408, 68.3495145631068, 2888.684466019412, 192, 12162, 229.5, 8771.8, 8935.95, 9242.329999999994, 1.1460259602696166, 29.399755690630847, 0.44140123439791357], "isController": false}, {"data": ["myAccountPage", 2065, 1769, 85.66585956416465, 2964.2629539951645, 193, 16786, 246.0, 12850.4, 13150.099999999999, 13488.36, 1.1444970475855825, 6.221711022393346, 1.0445213421680377], "isController": false}, {"data": ["invalidLogin", 2070, 1405, 67.8743961352657, 2685.6396135265736, 195, 10245, 221.0, 8034.8, 8184.45, 8390.58, 1.1494980525170677, 13.052558303880916, 1.758332129865792], "isController": false}, {"data": ["homePage", 2076, 1385, 66.71483622350674, 3252.434489402692, 385, 10947, 500.0, 9035.9, 9215.0, 9583.92, 1.1482485061983847, 30.96033546548866, 0.6802860775974836], "isController": false}, {"data": ["identityPage-1", 616, 333, 54.05844155844156, 3737.0211038961047, 193, 9847, 307.0, 8080.200000000001, 8190.3, 8469.26, 0.3421100861384324, 5.489147502520008, 0.23899826758173712], "isController": false}, {"data": ["identityPage-0", 616, 0, 0.0, 5097.594155844151, 919, 7832, 5117.0, 5354.900000000001, 5428.15, 5733.340000000004, 0.34326708910065695, 0.10527378371442853, 0.23139988505289155], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["508/Loop Detected", 9878, 100.0, 66.03824040647146], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 14958, 9878, "508/Loop Detected", 9878, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["validLogin", 2066, 1432, "508/Loop Detected", 1432, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["myAccountPage-1", 664, 368, "508/Loop Detected", 368, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["identityPage", 2061, 1778, "508/Loop Detected", 1778, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["shopingCartPage", 2060, 1408, "508/Loop Detected", 1408, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["myAccountPage", 2065, 1769, "508/Loop Detected", 1769, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["invalidLogin", 2070, 1405, "508/Loop Detected", 1405, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["homePage", 2076, 1385, "508/Loop Detected", 1385, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["identityPage-1", 616, 333, "508/Loop Detected", 333, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
