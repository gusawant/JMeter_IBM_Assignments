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

    var data = {"OkPercent": 91.76119402985074, "KoPercent": 8.238805970149254};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.046567164179104475, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.03, 500, 1500, "orderProducts-90"], "isController": false}, {"data": [0.0, 500, 1500, "myAccountPage-74-1"], "isController": false}, {"data": [0.02, 500, 1500, "SelectShippingDeliveryOption-102"], "isController": false}, {"data": [0.08, 500, 1500, "myAccountPage-74-0"], "isController": false}, {"data": [0.0, 500, 1500, "myAccountPage-70-1"], "isController": false}, {"data": [0.14, 500, 1500, "myAccountPage-70-0"], "isController": false}, {"data": [0.0, 500, 1500, "addProductToCart-39"], "isController": false}, {"data": [0.0, 500, 1500, "homePage"], "isController": false}, {"data": [0.0, 500, 1500, "clickOnAccountHistory-69"], "isController": false}, {"data": [0.0, 500, 1500, "clickOnAddCartLink-60-1"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "clickOnAddCartLink-60-0"], "isController": false}, {"data": [0.06, 500, 1500, "SelectPaymentMethod-106-1"], "isController": false}, {"data": [0.06, 500, 1500, "SelectPaymentMethod-106-0"], "isController": false}, {"data": [0.0, 500, 1500, "clickOnCategory-29"], "isController": false}, {"data": [1.0, 500, 1500, "storeMapLocation-65"], "isController": false}, {"data": [1.0, 500, 1500, "clickStoreLocationLink-63"], "isController": false}, {"data": [0.0, 500, 1500, "addProductToCart-17-1"], "isController": false}, {"data": [0.0, 500, 1500, "addProductToCart-17-0"], "isController": false}, {"data": [0.0, 500, 1500, "myAccountPage-17-1"], "isController": false}, {"data": [0.09, 500, 1500, "myAccountPage-17-0"], "isController": false}, {"data": [0.0, 500, 1500, "SelectCategoryByPrice-76"], "isController": false}, {"data": [0.0, 500, 1500, "SearchProductByName-59"], "isController": false}, {"data": [0.02127659574468085, 500, 1500, "submitOrder-99"], "isController": false}, {"data": [0.0, 500, 1500, "myAccountPage-74"], "isController": false}, {"data": [0.02, 500, 1500, "addProductToCart-17"], "isController": false}, {"data": [0.0, 500, 1500, "shopingCartPage"], "isController": false}, {"data": [0.0, 500, 1500, "/index.php-76"], "isController": false}, {"data": [0.0, 500, 1500, "clickOnCategory-71"], "isController": false}, {"data": [0.0, 500, 1500, "contactUsPage-80"], "isController": false}, {"data": [0.0, 500, 1500, "myAccountPage-70"], "isController": false}, {"data": [0.0, 500, 1500, "myAccountPage-1"], "isController": false}, {"data": [0.075, 500, 1500, "myAccountPage-0"], "isController": false}, {"data": [0.0, 500, 1500, "addProductToCart-85-1"], "isController": false}, {"data": [0.15, 500, 1500, "addProductToCart-85-0"], "isController": false}, {"data": [0.08, 500, 1500, "clickOnAddToCart-44-0"], "isController": false}, {"data": [0.0, 500, 1500, "OrderConfirmation-107"], "isController": false}, {"data": [0.0, 500, 1500, "clickOnAddToCart-44-1"], "isController": false}, {"data": [0.0, 500, 1500, "clickOnAccountHistory-69-1"], "isController": false}, {"data": [0.0, 500, 1500, "identityPage-1"], "isController": false}, {"data": [0.125, 500, 1500, "clickOnAccountHistory-69-0"], "isController": false}, {"data": [0.15, 500, 1500, "identityPage-0"], "isController": false}, {"data": [0.01, 500, 1500, "SelectPaymentOption-105"], "isController": false}, {"data": [0.0, 500, 1500, "addProductToCart-39-1"], "isController": false}, {"data": [0.3, 500, 1500, "addProductToCart-39-0"], "isController": false}, {"data": [0.0, 500, 1500, "clickOnCategoryLink-19"], "isController": false}, {"data": [0.0, 500, 1500, "SelectCategory-81"], "isController": false}, {"data": [0.0, 500, 1500, "SearchProduct-2"], "isController": false}, {"data": [0.02, 500, 1500, "SearchProduct-3"], "isController": false}, {"data": [0.0, 500, 1500, "SearchProduct-4"], "isController": false}, {"data": [0.0, 500, 1500, "clickOnCategoryLink-23"], "isController": false}, {"data": [0.0, 500, 1500, "clickOnCategoryLink-20"], "isController": false}, {"data": [0.0, 500, 1500, "clickOnCategoryLink-21"], "isController": false}, {"data": [0.0, 500, 1500, "SearchProduct-1"], "isController": false}, {"data": [0.01020408163265306, 500, 1500, "OrderConfirmation-107-2"], "isController": false}, {"data": [0.08163265306122448, 500, 1500, "OrderConfirmation-107-1"], "isController": false}, {"data": [0.0, 500, 1500, "SearchProduct-19"], "isController": false}, {"data": [0.09183673469387756, 500, 1500, "OrderConfirmation-107-0"], "isController": false}, {"data": [0.04, 500, 1500, "addProductToCart-79"], "isController": false}, {"data": [0.0, 500, 1500, "clickonPriceDrop-72"], "isController": false}, {"data": [0.02, 500, 1500, "addProductToCart-83"], "isController": false}, {"data": [0.0, 500, 1500, "SearchProductByPrice-61"], "isController": false}, {"data": [0.0, 500, 1500, "clickOnCategoryLink-25"], "isController": false}, {"data": [0.0, 500, 1500, "SelectCategory-70"], "isController": false}, {"data": [0.0, 500, 1500, "OrderProducts-95"], "isController": false}, {"data": [0.0, 500, 1500, "SelectCategory-71"], "isController": false}, {"data": [0.0, 500, 1500, "clickOnAddToCart-43"], "isController": false}, {"data": [0.0, 500, 1500, "identityPage"], "isController": false}, {"data": [0.0, 500, 1500, "clickOnAddToCart-46"], "isController": false}, {"data": [0.0, 500, 1500, "clickOnAddToCart-44"], "isController": false}, {"data": [1.0, 500, 1500, "storeMap-64"], "isController": false}, {"data": [0.02, 500, 1500, "addProductToCart-85"], "isController": false}, {"data": [0.02, 500, 1500, "clickaddressLink-75-0"], "isController": false}, {"data": [0.0, 500, 1500, "clickaddressLink-75-1"], "isController": false}, {"data": [0.04, 500, 1500, "addProductToCart-87"], "isController": false}, {"data": [0.0, 500, 1500, "clickOnManufacurerLink-68"], "isController": false}, {"data": [0.0, 500, 1500, "SelectCategory-77"], "isController": false}, {"data": [0.0, 500, 1500, "clickOnCategory-36"], "isController": false}, {"data": [0.0, 500, 1500, "SelectCategory-62"], "isController": false}, {"data": [0.0, 500, 1500, "clickOnCategory-39"], "isController": false}, {"data": [0.0, 500, 1500, "clickOnCategory-38"], "isController": false}, {"data": [0.0, 500, 1500, "clickOnOrderLink-73-1"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "clickOnOrderLink-73-0"], "isController": false}, {"data": [0.0, 500, 1500, "SearchProductbyPrice-13"], "isController": false}, {"data": [0.05, 500, 1500, "addProductToCart-60"], "isController": false}, {"data": [0.0, 500, 1500, "clickOnOrderLink-73"], "isController": false}, {"data": [0.0, 500, 1500, "clickaddressLink-75"], "isController": false}, {"data": [0.0, 500, 1500, "SelectCategory-68"], "isController": false}, {"data": [0.0, 500, 1500, "myAccountPage"], "isController": false}, {"data": [0.0, 500, 1500, "clickOnCategoryLink-49"], "isController": false}, {"data": [0.0, 500, 1500, "SelectCategory-69"], "isController": false}, {"data": [0.0, 500, 1500, "addProductToCart-87-1"], "isController": false}, {"data": [0.15, 500, 1500, "addProductToCart-87-0"], "isController": false}, {"data": [0.2, 500, 1500, "addProductToCart-60-0"], "isController": false}, {"data": [0.0, 500, 1500, "addProductToCart-83-1"], "isController": false}, {"data": [0.0, 500, 1500, "addProductToCart-60-1"], "isController": false}, {"data": [0.0, 500, 1500, "SelectCategory-66"], "isController": false}, {"data": [0.1, 500, 1500, "addProductToCart-83-0"], "isController": false}, {"data": [0.0, 500, 1500, "clickOnCategoryLink-52"], "isController": false}, {"data": [0.0, 500, 1500, "searchProductByName-58"], "isController": false}, {"data": [0.0, 500, 1500, "SearchProduct-20"], "isController": false}, {"data": [0.0, 500, 1500, "clickOnCategoryLink-50"], "isController": false}, {"data": [0.0, 500, 1500, "clickOnCategoryLink-54"], "isController": false}, {"data": [0.1, 500, 1500, "clickOnAddToCart-46-0"], "isController": false}, {"data": [0.0, 500, 1500, "clickOnCategory-42"], "isController": false}, {"data": [0.0, 500, 1500, "clickOnAddCartLink-60"], "isController": false}, {"data": [0.04, 500, 1500, "clickOnOurStoresLink-61"], "isController": false}, {"data": [0.0, 500, 1500, "clickOnAddToCart-46-1"], "isController": false}, {"data": [0.0, 500, 1500, "validLogin"], "isController": false}, {"data": [0.0, 500, 1500, "SelectPaymentMethod-106"], "isController": false}, {"data": [0.04, 500, 1500, "signOut-84"], "isController": false}, {"data": [0.0, 500, 1500, "addProductToCart-79-0"], "isController": false}, {"data": [0.0, 500, 1500, "searchProductByCategory-40"], "isController": false}, {"data": [0.0, 500, 1500, "addProductToCart-79-1"], "isController": false}, {"data": [1.0, 500, 1500, "clickOnFindStoreLink-66"], "isController": false}, {"data": [0.0, 500, 1500, "userLogout-18"], "isController": false}, {"data": [0.0, 500, 1500, "myAccountPage-17"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3350, 276, 8.238805970149254, 3496.7880597014932, 77, 13548, 3414.0, 6140.300000000001, 7066.0, 9104.919999999998, 1.8581875626791624, 67.674604932337, 1.4625497247178327], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["orderProducts-90", 50, 0, 0.0, 3298.44, 880, 6769, 3382.0, 4786.599999999999, 5573.25, 6769.0, 0.03298529449600779, 0.8540768916901467, 0.02376229691778811], "isController": false}, {"data": ["myAccountPage-74-1", 25, 0, 0.0, 3501.8399999999997, 1904, 6121, 3435.0, 5083.4000000000015, 5935.9, 6121.0, 0.016515363912740746, 0.5725508943647597, 0.008935069929353879], "isController": false}, {"data": ["SelectShippingDeliveryOption-102", 50, 0, 0.0, 3021.8199999999997, 1119, 6105, 3033.5, 4471.599999999999, 4881.15, 6105.0, 0.03281880018404783, 0.843861091638623, 0.03001638232458187], "isController": false}, {"data": ["myAccountPage-74-0", 25, 0, 0.0, 2189.36, 974, 3799, 2067.0, 3111.2000000000003, 3609.3999999999996, 3799.0, 0.016544545858833994, 0.008980586298998328, 0.008627722156852884], "isController": false}, {"data": ["myAccountPage-70-1", 25, 0, 0.0, 3202.0, 1682, 5850, 2892.0, 5117.200000000001, 5727.0, 5850.0, 0.016460482660856778, 0.5706315658807773, 0.008857154244269612], "isController": false}, {"data": ["myAccountPage-70-0", 25, 0, 0.0, 1821.4400000000003, 720, 2885, 1820.0, 2581.4, 2813.0, 2885.0, 0.016459106362695503, 0.008954139621611729, 0.008534946756436828], "isController": false}, {"data": ["addProductToCart-39", 25, 0, 0.0, 3620.6000000000004, 1920, 6711, 3459.0, 5905.6, 6475.499999999999, 6711.0, 0.01653715866477658, 0.281414637750232, 0.017041671200604333], "isController": false}, {"data": ["homePage", 25, 0, 0.0, 3861.6, 2268, 5417, 3982.0, 5186.200000000001, 5387.9, 5417.0, 0.01657460028693948, 1.327317299009767, 0.009119914829758964], "isController": false}, {"data": ["clickOnAccountHistory-69", 20, 0, 0.0, 5855.150000000001, 2351, 11180, 5422.0, 10820.200000000008, 11179.5, 11180.0, 0.017297790985602184, 0.6089557245201376, 0.01895324363852114], "isController": false}, {"data": ["clickOnAddCartLink-60-1", 24, 0, 0.0, 4542.916666666666, 3109, 7496, 3946.5, 6833.0, 7352.25, 7496.0, 0.01572023226643174, 1.2628784881312247, 0.008704464545963667], "isController": false}, {"data": ["clickOnAddCartLink-60-0", 24, 0, 0.0, 2492.4999999999995, 991, 4911, 2421.0, 3697.0, 4620.5, 4911.0, 0.015732608584497876, 0.008683150343429735, 0.010309160508005932], "isController": false}, {"data": ["SelectPaymentMethod-106-1", 50, 0, 0.0, 3237.3600000000006, 806, 5017, 3439.0, 4509.5, 4882.099999999999, 5017.0, 0.032235333406829894, 0.8319032933550728, 0.028340650351075015], "isController": false}, {"data": ["SelectPaymentMethod-106-0", 50, 0, 0.0, 2351.86, 597, 3687, 2430.0, 3283.0, 3508.499999999999, 3687.0, 0.03227678505145888, 0.01084235207226643, 0.029226881026479228], "isController": false}, {"data": ["clickOnCategory-29", 25, 0, 0.0, 4918.96, 2962, 8397, 4566.0, 7226.800000000004, 8335.2, 8397.0, 0.016348021922043477, 1.5850786617770822, 0.008365589342920685], "isController": false}, {"data": ["storeMapLocation-65", 25, 0, 0.0, 97.2, 77, 202, 86.0, 144.8, 186.09999999999997, 202.0, 0.016535189860357014, 0.007058459171639901, 0.008606695503486611], "isController": false}, {"data": ["clickStoreLocationLink-63", 20, 0, 0.0, 100.55, 86, 127, 101.0, 119.10000000000002, 126.64999999999999, 127.0, 0.01738985267316815, 0.0963149896834699, 0.009017589618605751], "isController": false}, {"data": ["addProductToCart-17-1", 5, 0, 0.0, 4301.0, 3880, 5088, 3928.0, 5088.0, 5088.0, 5088.0, 0.10626992561105207, 8.537211078639745, 0.08200634298618492], "isController": false}, {"data": ["addProductToCart-17-0", 5, 0, 0.0, 2622.6, 1587, 3357, 2846.0, 3357.0, 3357.0, 3357.0, 0.11179929790040918, 0.06181715085079266, 0.08122917738076606], "isController": false}, {"data": ["myAccountPage-17-1", 50, 0, 0.0, 3210.54, 1690, 5582, 3104.5, 4400.6, 4649.4, 5582.0, 0.03229803072447066, 1.1112761983457593, 0.02462977171105923], "isController": false}, {"data": ["myAccountPage-17-0", 50, 0, 0.0, 2017.68, 796, 4607, 2007.0, 2648.7, 3144.65, 4607.0, 0.032318510556195106, 0.011337358751949612, 0.02302946365492621], "isController": false}, {"data": ["SelectCategoryByPrice-76", 50, 50, 100.0, 225.90000000000003, 193, 414, 205.5, 303.79999999999995, 308.79999999999995, 414.0, 0.03127347465191059, 0.01307194591846755, 0.017377545973571412], "isController": false}, {"data": ["SearchProductByName-59", 25, 25, 100.0, 221.48, 194, 420, 207.0, 267.20000000000016, 385.4999999999999, 420.0, 0.01671434712757259, 0.006986727680162276, 0.009679304537744673], "isController": false}, {"data": ["submitOrder-99", 47, 0, 0.0, 3089.4255319148947, 1070, 5632, 2939.0, 4280.4000000000015, 5574.799999999999, 5632.0, 0.02722664735698769, 0.7050682250181028, 0.02470752624909486], "isController": false}, {"data": ["myAccountPage-74", 25, 0, 0.0, 5691.56, 3043, 9195, 5482.0, 7774.200000000001, 8835.0, 9195.0, 0.016500168961730167, 0.5809806172102703, 0.017531429521838303], "isController": false}, {"data": ["addProductToCart-17", 25, 0, 0.0, 4027.08, 1432, 7965, 3714.0, 7380.000000000001, 7838.099999999999, 7965.0, 0.01620765506998141, 0.27605371942182755, 0.017560614401409158], "isController": false}, {"data": ["shopingCartPage", 25, 0, 0.0, 3881.0800000000004, 1737, 7075, 3510.0, 6338.4000000000015, 6938.799999999999, 7075.0, 0.016774087925743125, 1.3431156354460632, 0.005748401303615017], "isController": false}, {"data": ["/index.php-76", 25, 0, 0.0, 4869.280000000002, 2843, 9113, 4357.0, 7265.2000000000035, 8832.8, 9113.0, 0.016425712415998907, 1.5925600803283042, 0.008742200455780669], "isController": false}, {"data": ["clickOnCategory-71", 25, 0, 0.0, 5332.959999999999, 3331, 7587, 5324.0, 6757.600000000002, 7563.0, 7587.0, 0.016633831483318595, 1.6127636701401433, 0.00886921092762886], "isController": false}, {"data": ["contactUsPage-80", 25, 0, 0.0, 3243.76, 1832, 4710, 3243.0, 4340.8, 4617.599999999999, 4710.0, 0.01658229594489902, 0.4790042327139514, 0.008550246346588557], "isController": false}, {"data": ["myAccountPage-70", 25, 0, 0.0, 5023.68, 3260, 8389, 4990.0, 7359.600000000003, 8369.8, 8389.0, 0.016440532620647205, 0.5788839977390979, 0.01737173466361355], "isController": false}, {"data": ["myAccountPage-1", 20, 0, 0.0, 3069.55, 1938, 4757, 2962.0, 4635.900000000001, 4752.7, 4757.0, 0.017412775056547987, 0.5994279794564079, 0.012003591711344944], "isController": false}, {"data": ["myAccountPage-0", 20, 0, 0.0, 1910.9999999999998, 881, 2995, 1809.0, 2713.3, 2981.6, 2995.0, 0.01746310046870962, 0.006324405086739221, 0.011028698313588388], "isController": false}, {"data": ["addProductToCart-85-1", 10, 0, 0.0, 3609.6000000000004, 2111, 4558, 3755.5, 4511.6, 4558.0, 4558.0, 0.127826564916721, 10.269304108186015, 0.092948886950186], "isController": false}, {"data": ["addProductToCart-85-0", 10, 0, 0.0, 1996.4, 816, 2789, 2111.5, 2780.4, 2789.0, 2789.0, 0.13221567020123223, 0.07363534835523707, 0.08999445520533093], "isController": false}, {"data": ["clickOnAddToCart-44-0", 25, 0, 0.0, 2186.0, 1052, 3468, 2147.0, 3031.4000000000005, 3368.7, 3468.0, 0.016282847388035884, 0.009017262789850967, 0.010510705198722383], "isController": false}, {"data": ["OrderConfirmation-107", 49, 0, 0.0, 7818.469387755102, 3777, 13548, 8009.0, 10808.0, 11943.0, 13548.0, 0.02890579189481595, 1.0126780333162848, 0.07040313938284365], "isController": false}, {"data": ["clickOnAddToCart-44-1", 25, 0, 0.0, 3938.56, 1827, 6567, 3549.0, 5665.600000000001, 6426.0, 6567.0, 0.01626597074337438, 1.3066657622786932, 0.008847798539120636], "isController": false}, {"data": ["clickOnAccountHistory-69-1", 20, 0, 0.0, 3760.6, 1902, 7659, 3415.0, 6803.800000000006, 7629.0, 7659.0, 0.017320171157931382, 0.6004120211622181, 0.009658025128104316], "isController": false}, {"data": ["identityPage-1", 50, 0, 0.0, 3490.900000000001, 1587, 5684, 3499.5, 4751.9, 5306.8499999999985, 5684.0, 0.03137597453776914, 1.0793990949835464, 0.021569756870710905], "isController": false}, {"data": ["clickOnAccountHistory-69-0", 20, 0, 0.0, 2094.1, 448, 4121, 1945.0, 3662.2000000000003, 4098.9, 4121.0, 0.017357751060341618, 0.009351827402334444, 0.00933996175219554], "isController": false}, {"data": ["identityPage-0", 50, 0, 0.0, 2102.4199999999996, 749, 4051, 2123.5, 3083.2, 3756.349999999998, 4051.0, 0.03140190672377627, 0.01093362873368671, 0.020016262262444576], "isController": false}, {"data": ["SelectPaymentOption-105", 50, 0, 0.0, 3357.0800000000004, 1083, 5560, 3293.0, 5118.8, 5327.6, 5560.0, 0.030508491123249423, 0.7899661329053602, 0.022674005941833733], "isController": false}, {"data": ["addProductToCart-39-1", 5, 0, 0.0, 3100.4, 2326, 3853, 3144.0, 3853.0, 3853.0, 3853.0, 0.11958575494487098, 9.607080448326995, 0.08644274981464208], "isController": false}, {"data": ["addProductToCart-39-0", 5, 0, 0.0, 1782.6, 1151, 3087, 1438.0, 3087.0, 3087.0, 3087.0, 0.12779879357938861, 0.07066374699672835, 0.08736245654841018], "isController": false}, {"data": ["clickOnCategoryLink-19", 25, 0, 0.0, 5089.44, 3358, 8397, 4846.0, 7660.600000000001, 8261.4, 8397.0, 0.01627506685797465, 1.5780215821220342, 0.008630235648320543], "isController": false}, {"data": ["SelectCategory-81", 50, 0, 0.0, 4585.680000000001, 2115, 9623, 4353.5, 6536.0, 6987.399999999998, 9623.0, 0.029886431560071727, 2.1069870040720264, 0.02297052450687388], "isController": false}, {"data": ["SearchProduct-2", 21, 0, 0.0, 2983.809523809524, 1995, 4415, 2964.0, 4060.8, 4379.7, 4415.0, 0.014003416833707424, 0.007112412511986258, 0.008522261723527207], "isController": false}, {"data": ["SearchProduct-3", 25, 0, 0.0, 3116.6799999999994, 955, 7770, 2898.0, 4495.0, 6808.199999999997, 7770.0, 0.0166794876328271, 0.008219859999052606, 0.010259187979159982], "isController": false}, {"data": ["SearchProduct-4", 25, 0, 0.0, 3879.84, 2230, 6309, 3755.0, 5283.800000000004, 6305.1, 6309.0, 0.016654065090748002, 0.8277083361090108, 0.012553001562151306], "isController": false}, {"data": ["clickOnCategoryLink-23", 25, 0, 0.0, 4522.96, 2148, 9022, 4094.0, 7801.2, 8659.9, 9022.0, 0.01671966801427191, 0.9206691723179146, 0.008947634835762702], "isController": false}, {"data": ["clickOnCategoryLink-20", 25, 0, 0.0, 4744.24, 2117, 7373, 4585.0, 6509.6, 7122.799999999999, 7373.0, 0.016540648975670688, 1.457250558329606, 0.0090133614535393], "isController": false}, {"data": ["clickOnCategoryLink-21", 25, 0, 0.0, 3937.76, 1656, 6237, 3944.0, 5558.400000000002, 6230.7, 6237.0, 0.01653184396848898, 0.9156691317574739, 0.009008563412516457], "isController": false}, {"data": ["SearchProduct-1", 25, 0, 0.0, 3042.84, 1543, 5213, 3084.0, 4374.0, 4984.7, 5213.0, 0.016470687446964387, 0.004206459161259889, 0.01008765267503729], "isController": false}, {"data": ["OrderConfirmation-107-2", 49, 0, 0.0, 3343.673469387756, 1324, 6145, 3396.0, 4857.0, 5603.0, 6145.0, 0.02895602879292953, 0.9961339038680527, 0.02334095066483633], "isController": false}, {"data": ["OrderConfirmation-107-1", 49, 0, 0.0, 2127.163265306122, 738, 3606, 2041.0, 3391.0, 3455.5, 3606.0, 0.02896047840346202, 0.008641507546568745, 0.022778903074598057], "isController": false}, {"data": ["SearchProduct-19", 22, 0, 0.0, 4262.545454545455, 1658, 7679, 3993.5, 7461.6, 7652.15, 7679.0, 0.014598423901070462, 0.7257117063434133, 0.011972677556648522], "isController": false}, {"data": ["OrderConfirmation-107-0", 49, 0, 0.0, 2346.816326530613, 708, 5306, 2420.0, 3450.0, 4098.0, 5306.0, 0.028960581102925313, 0.00966545541991365, 0.0244129802875963], "isController": false}, {"data": ["addProductToCart-79", 50, 0, 0.0, 3517.880000000001, 958, 7885, 2960.5, 6309.8, 7248.499999999998, 7885.0, 0.031703277611652605, 0.539939635572409, 0.032528058193268254], "isController": false}, {"data": ["clickonPriceDrop-72", 25, 0, 0.0, 3768.56, 1971, 6041, 3756.0, 5795.200000000001, 6040.7, 6041.0, 0.01666385602961634, 0.9119106441963456, 0.008901493406445447], "isController": false}, {"data": ["addProductToCart-83", 50, 0, 0.0, 3567.5400000000004, 1321, 7613, 2915.0, 6431.9, 7246.349999999999, 7613.0, 0.031168241805713388, 0.531039268595129, 0.032029020983707114], "isController": false}, {"data": ["SearchProductByPrice-61", 25, 25, 100.0, 255.39999999999995, 194, 489, 207.0, 414.8, 468.9, 489.0, 0.01660255865351921, 0.006960103885530007, 0.009630781093935949], "isController": false}, {"data": ["clickOnCategoryLink-25", 25, 0, 0.0, 5361.84, 3209, 9030, 4925.0, 8149.400000000001, 8841.6, 9030.0, 0.016532751380484743, 1.6030123447987963, 0.008847605230962537], "isController": false}, {"data": ["SelectCategory-70", 49, 49, 100.0, 238.73469387755094, 194, 488, 207.0, 390.0, 439.5, 488.0, 0.030531402170221912, 0.012764214431695333, 0.018008756748841833], "isController": false}, {"data": ["OrderProducts-95", 50, 0, 0.0, 3393.34, 1529, 6092, 3276.0, 4962.799999999999, 5761.149999999999, 6092.0, 0.03195641656083767, 0.824728951666559, 0.022632882369708895], "isController": false}, {"data": ["SelectCategory-71", 48, 0, 0.0, 4822.854166666665, 2926, 8192, 4327.5, 7310.8, 7970.0999999999985, 8192.0, 0.029891363575505273, 2.6253747853504295, 0.02243798320479009], "isController": false}, {"data": ["clickOnAddToCart-43", 25, 0, 0.0, 4527.759999999998, 3170, 6921, 4303.0, 6243.000000000001, 6762.599999999999, 6921.0, 0.016456365289181124, 1.5956033929980797, 0.00922456413670895], "isController": false}, {"data": ["identityPage", 50, 0, 0.0, 5593.919999999999, 3023, 9259, 5428.0, 8143.499999999999, 8592.849999999999, 9259.0, 0.03133833493158841, 1.0890157079486553, 0.04151962132322985], "isController": false}, {"data": ["clickOnAddToCart-46", 25, 0, 0.0, 6063.279999999999, 3980, 9510, 5741.0, 8440.400000000001, 9300.9, 9510.0, 0.01624413505503838, 1.3139500124105192, 0.019321637204137446], "isController": false}, {"data": ["clickOnAddToCart-44", 25, 0, 0.0, 6124.88, 3344, 10035, 5691.0, 8486.400000000003, 9794.699999999999, 10035.0, 0.0162443883760355, 1.3139279883420523, 0.0193219385175891], "isController": false}, {"data": ["storeMap-64", 25, 0, 0.0, 136.07999999999998, 77, 210, 127.0, 205.0, 208.5, 210.0, 0.01631412921051361, 0.01943038279799062, 0.01531042790166365], "isController": false}, {"data": ["addProductToCart-85", 50, 0, 0.0, 3659.2200000000003, 1044, 8315, 3236.0, 6530.2, 7009.549999999998, 8315.0, 0.0326255758414136, 0.555781782204706, 0.033511309248045726], "isController": false}, {"data": ["clickaddressLink-75-0", 25, 0, 0.0, 2332.9999999999995, 1241, 4536, 2004.0, 3438.0000000000014, 4319.999999999999, 4536.0, 0.016267494877365864, 0.008884848178723809, 0.008467358173472661], "isController": false}, {"data": ["clickaddressLink-75-1", 25, 0, 0.0, 3680.2399999999993, 1755, 6235, 3418.0, 5673.200000000001, 6139.0, 6235.0, 0.01622283162387949, 0.5623891727118345, 0.008760962781255231], "isController": false}, {"data": ["addProductToCart-87", 50, 0, 0.0, 3253.06, 727, 8089, 2977.5, 5504.3, 6429.099999999994, 8089.0, 0.031100851976739053, 0.5297799307601733, 0.03194397663579596], "isController": false}, {"data": ["clickOnManufacurerLink-68", 25, 0, 0.0, 4843.639999999999, 2679, 7538, 4512.0, 7166.600000000001, 7518.2, 7538.0, 0.016721669812570145, 1.2632568353169693, 0.009063014400367608], "isController": false}, {"data": ["SelectCategory-77", 45, 0, 0.0, 4358.7555555555555, 1644, 8510, 4197.0, 6016.8, 7534.299999999992, 8510.0, 0.030001020034681178, 1.6500307104191543, 0.02293502458250247], "isController": false}, {"data": ["clickOnCategory-36", 25, 0, 0.0, 5331.360000000001, 3183, 8090, 5084.0, 7774.400000000001, 8047.7, 8090.0, 0.016606297240764074, 1.6101673383360358, 0.00888696375775265], "isController": false}, {"data": ["SelectCategory-62", 50, 0, 0.0, 4357.540000000002, 2389, 8806, 4105.0, 5890.0, 6729.549999999998, 8806.0, 0.03103173056513747, 2.008497850315655, 0.023198642951390656], "isController": false}, {"data": ["clickOnCategory-39", 25, 0, 0.0, 4991.960000000002, 3094, 6451, 5174.0, 6121.8, 6389.5, 6451.0, 0.016646258353924755, 1.6140069046182715, 0.009331008100735165], "isController": false}, {"data": ["clickOnCategory-38", 25, 0, 0.0, 4729.799999999999, 2606, 7066, 4668.0, 6334.8, 6886.599999999999, 7066.0, 0.01656822929368976, 1.6064076197783568, 0.00886659145795116], "isController": false}, {"data": ["clickOnOrderLink-73-1", 24, 0, 0.0, 3422.166666666667, 1561, 5510, 3487.5, 4691.0, 5381.0, 5510.0, 0.015889430747902264, 0.5508633402198567, 0.00861194732918531], "isController": false}, {"data": ["clickOnOrderLink-73-0", 24, 0, 0.0, 2144.5833333333326, 613, 3707, 1984.5, 3433.5, 3646.25, 3707.0, 0.01591681870544534, 0.00865852658175044, 0.00831591602286451], "isController": false}, {"data": ["SearchProductbyPrice-13", 25, 0, 0.0, 4438.400000000001, 2558, 7577, 4146.0, 6560.000000000004, 7550.9, 7577.0, 0.016215613170710193, 0.8059444785918232, 0.013484929249658176], "isController": false}, {"data": ["addProductToCart-60", 20, 0, 0.0, 3257.5, 1372, 6823, 2678.0, 6582.500000000004, 6819.7, 6823.0, 0.017399580496114238, 0.3658720577309381, 0.018248319798634654], "isController": false}, {"data": ["clickOnOrderLink-73", 25, 1, 4.0, 5352.759999999998, 204, 8459, 5876.0, 7776.0, 8258.6, 8459.0, 0.016534511825152167, 0.5592507979142044, 0.017241749733298325], "isController": false}, {"data": ["clickaddressLink-75", 25, 0, 0.0, 6013.52, 3436, 10771, 5546.0, 8739.2, 10269.999999999998, 10771.0, 0.016201762492530986, 0.5705077261749842, 0.01718272858094595], "isController": false}, {"data": ["SelectCategory-68", 50, 50, 100.0, 262.0799999999999, 193, 1243, 206.5, 399.6999999999998, 603.7999999999992, 1243.0, 0.03176626130799487, 0.013359822358301826, 0.017775456767071346], "isController": false}, {"data": ["myAccountPage", 20, 0, 0.0, 4981.0, 3005, 7665, 4562.0, 7374.500000000003, 7655.95, 7665.0, 0.017392181518720073, 0.6050177761682763, 0.022973305392793724], "isController": false}, {"data": ["clickOnCategoryLink-49", 20, 0, 0.0, 4991.750000000001, 3190, 6966, 4978.5, 6951.5, 6965.8, 6966.0, 0.017350628439762088, 1.6823653932823572, 0.009285297250966431], "isController": false}, {"data": ["SelectCategory-69", 50, 50, 100.0, 238.64000000000001, 194, 571, 206.0, 305.4, 358.04999999999956, 571.0, 0.029587216902111874, 0.012367687815214811, 0.017567410035628925], "isController": false}, {"data": ["addProductToCart-87-1", 10, 0, 0.0, 3511.6, 2671, 4836, 3570.5, 4764.3, 4836.0, 4836.0, 0.08860849223789607, 7.118238618239173, 0.06429307591089531], "isController": false}, {"data": ["addProductToCart-87-0", 10, 0, 0.0, 1962.3999999999999, 732, 3253, 1952.0, 3232.2000000000003, 3253.0, 3253.0, 0.08924109373884485, 0.04932662017205683, 0.06074320540622546], "isController": false}, {"data": ["addProductToCart-60-0", 5, 0, 0.0, 1684.0, 966, 2174, 1991.0, 2174.0, 2174.0, 2174.0, 0.1492581868115466, 0.08308317039314606, 0.10144892384847308], "isController": false}, {"data": ["addProductToCart-83-1", 10, 0, 0.0, 3843.5, 2499, 4793, 4265.0, 4757.1, 4793.0, 4793.0, 0.09511670820096259, 7.641224904051021, 0.06899676840983887], "isController": false}, {"data": ["addProductToCart-60-1", 5, 0, 0.0, 3783.0, 3020, 4655, 3498.0, 4655.0, 4655.0, 4655.0, 0.13826668878933687, 11.108027115826005, 0.10000030245838173], "isController": false}, {"data": ["SelectCategory-66", 50, 0, 0.0, 4157.199999999999, 1709, 9109, 4027.5, 6030.8, 7000.5999999999985, 9109.0, 0.029367109424786427, 1.6184001780748098, 0.022045980817404123], "isController": false}, {"data": ["addProductToCart-83-0", 10, 0, 0.0, 2137.6, 1350, 3095, 2103.0, 3091.8, 3095.0, 3095.0, 0.0972507220866115, 0.05424766841393797, 0.06619507157653146], "isController": false}, {"data": ["clickOnCategoryLink-52", 22, 0, 0.0, 4302.09090909091, 2457, 6143, 4383.0, 5321.4, 6049.0999999999985, 6143.0, 0.014618833842334549, 1.417346816217337, 0.008194541626464874], "isController": false}, {"data": ["searchProductByName-58", 25, 25, 100.0, 232.79999999999998, 194, 409, 206.0, 319.80000000000007, 388.9, 409.0, 0.0167588627569804, 0.007004680917956652, 0.009295931685512565], "isController": false}, {"data": ["SearchProduct-20", 25, 0, 0.0, 4158.72, 2580, 5836, 4041.0, 5185.6, 5647.9, 5836.0, 0.016699274783894685, 0.8489206799477113, 0.01362230294187784], "isController": false}, {"data": ["clickOnCategoryLink-50", 25, 0, 0.0, 4968.88, 2602, 7883, 4813.0, 7350.200000000002, 7851.5, 7883.0, 0.016636609858189537, 1.6130934902609286, 0.009325599666602338], "isController": false}, {"data": ["clickOnCategoryLink-54", 25, 0, 0.0, 5778.2, 3761, 8704, 5223.0, 8151.400000000001, 8612.199999999999, 8704.0, 0.016202970069225567, 1.571033648626928, 0.007911606479114049], "isController": false}, {"data": ["clickOnAddToCart-46-0", 25, 0, 0.0, 2222.3999999999996, 1161, 4004, 2210.0, 3176.2, 3756.1999999999994, 4004.0, 0.01628103409313663, 0.009006082960660463, 0.01050953470269855], "isController": false}, {"data": ["clickOnCategory-42", 25, 1, 4.0, 4913.52, 204, 8290, 4710.0, 7901.400000000001, 8242.0, 8290.0, 0.016568536746363535, 1.542508765998579, 0.008866755993171112], "isController": false}, {"data": ["clickOnAddCartLink-60", 24, 0, 0.0, 7035.708333333333, 4383, 11657, 6155.5, 10906.0, 11554.0, 11657.0, 0.01569519923093524, 1.2695299727214167, 0.018975250632712718], "isController": false}, {"data": ["clickOnOurStoresLink-61", 25, 0, 0.0, 3248.2000000000007, 1296, 5813, 3155.0, 4957.400000000001, 5572.7, 5813.0, 0.016817474566933215, 0.4691700952592212, 0.008901436733669728], "isController": false}, {"data": ["clickOnAddToCart-46-1", 25, 0, 0.0, 3840.5199999999995, 2573, 6334, 3734.0, 5065.200000000001, 5976.4, 6334.0, 0.0162625319070876, 1.3064422424388984, 0.008845928000241986], "isController": false}, {"data": ["validLogin", 25, 0, 0.0, 3855.9200000000005, 2154, 6413, 3782.0, 6004.200000000001, 6331.4, 6413.0, 0.01621030339852253, 0.5574109120224687, 0.023969719720612178], "isController": false}, {"data": ["SelectPaymentMethod-106", 50, 0, 0.0, 5589.819999999999, 1635, 8705, 5988.5, 7477.7, 7896.4, 8705.0, 0.03221626650842036, 0.842233253138992, 0.05749596813424647], "isController": false}, {"data": ["signOut-84", 25, 0, 0.0, 3306.6000000000004, 1186, 4884, 3308.0, 4653.0, 4831.8, 4884.0, 0.016659281052066918, 0.5774777088407472, 0.008947856033825004], "isController": false}, {"data": ["addProductToCart-79-0", 10, 0, 0.0, 2340.2999999999997, 1778, 3379, 2294.0, 3309.7000000000003, 3379.0, 3379.0, 0.12280033892893544, 0.06770807749929389, 0.0835857775717461], "isController": false}, {"data": ["searchProductByCategory-40", 20, 0, 0.0, 3764.25, 2007, 5029, 3760.0, 4846.5, 5020.2, 5029.0, 0.017402971905512304, 0.9537652866073689, 0.01282959325338988], "isController": false}, {"data": ["addProductToCart-79-1", 10, 0, 0.0, 4004.4000000000005, 2834, 5401, 3783.5, 5380.8, 5401.0, 5401.0, 0.12181454952979584, 9.785657783340643, 0.08822038079228184], "isController": false}, {"data": ["clickOnFindStoreLink-66", 20, 0, 0.0, 91.45000000000002, 79, 149, 83.0, 126.90000000000002, 147.95, 149.0, 0.017426703285979173, 0.010296901194513377, 0.007913493191387027], "isController": false}, {"data": ["userLogout-18", 25, 0, 0.0, 3849.2000000000003, 2031, 7898, 3362.0, 6355.000000000001, 7493.5999999999985, 7898.0, 0.016682259018095582, 0.5740625988423848, 0.012215844826297647], "isController": false}, {"data": ["myAccountPage-17", 50, 0, 0.0, 5228.720000000002, 2587, 8908, 4963.0, 6889.3, 8050.149999999994, 8908.0, 0.03224547837779448, 1.1207797722501862, 0.04756711896324338], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["403/Forbidden", 271, 98.18840579710145, 8.08955223880597], "isController": false}, {"data": ["508/Loop Detected", 5, 1.8115942028985508, 0.14925373134328357], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3350, 276, "403/Forbidden", 271, "508/Loop Detected", 5, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["SelectCategoryByPrice-76", 50, 50, "403/Forbidden", 50, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["SearchProductByName-59", 25, 25, "403/Forbidden", 25, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["SearchProductByPrice-61", 25, 25, "403/Forbidden", 24, "508/Loop Detected", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["SelectCategory-70", 49, 49, "403/Forbidden", 49, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["clickOnOrderLink-73", 25, 1, "508/Loop Detected", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["SelectCategory-68", 50, 50, "403/Forbidden", 48, "508/Loop Detected", 2, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["SelectCategory-69", 50, 50, "403/Forbidden", 50, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["searchProductByName-58", 25, 25, "403/Forbidden", 25, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["clickOnCategory-42", 25, 1, "508/Loop Detected", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
