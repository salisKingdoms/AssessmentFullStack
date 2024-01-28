var additionalGridConfig = {
    isPaging: true,
    colGrouping: null,
    colGroupingRowSpan: null,
    flag: null,
    scrollY: null,
    isSearch: false
}

var isChecked = false;
var tableLOI = $('#tblLOIDetail').dataTable();
var collapsedGroups = {};
var idGroupLoi = 1;
var selectedLOI = [];

function _fw_grid_web_method(id, url, paramData, columns, callError, additionalGridConfig = null) {
    $('#loadingPanel').css('display', 'block');
    var table = $('#' + id).dataTable({
        "bDestroy": true,
        "bFilter": (additionalGridConfig == null || additionalGridConfig == undefined) ? false : additionalGridConfig.isSearch,
        "paging": (additionalGridConfig == null || additionalGridConfig == undefined) ? true : additionalGridConfig.isPaging,
        "scrollX": true,
        "scrollY": (additionalGridConfig == null || additionalGridConfig == undefined) ? "60vh" : additionalGridConfig.scrollY,
        "autoWidth": false,
        "bScrollCollapse": true,
        "sPaginationType": "full_numbers",
        "bServerSide": true,
        "sAjaxSource": url,
        //"dom": 'lrtip',//delete search box
        "fnServerData": function (sSource, aoData, fnCallback) {
            logsRequest = $.ajax({
                type: "POST",
                url: sSource,
                data: getParamJSON(aoData, paramData),
                //contentType: "application/json; charset=utf-8",
                //dataType: "json",
                success: function (data) {
                    var json = jQuery.parseJSON(data);
                    fnCallback(json);
                    $('#loadingPanel').css('display', 'none');
                },
                error: function (xhr, statusCode, errorThrown) {
                    if (typeof callError === 'function') {
                        callError(xhr, statusCode, errorThrown);
                    }
                    $('#loadingPanel').css('display', 'none');
                }
            });
        },
        "aoColumns": columns
    });

    return table;
}

$('#compModal').on('shown.bs.modal', function (e) {
    $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
});


function _fw_grid_web_method_loi(id, url, paramData, columns, callError, additionalGridConfig = null) {
    $('#loadingPanel').css('display', 'block');
    var tableLOI = $('#' + id).DataTable({
        //"bFilter": false,
        "paging": (additionalGridConfig == null || additionalGridConfig == undefined) ? true : additionalGridConfig.isPaging,
        "scrollX": true,
        "scrollY": "70vh",
        autoWidth: false,
        "bScrollCollapse": true,
        "sPaginationType": "full_numbers",
        "bServerSide": true,
        "sAjaxSource": url,
        "fnServerData": function (sSource, aoData, fnCallback) {

            console.log(aoData);
            logsRequest = $.ajax({
                type: "POST",
                url: sSource,
                data: getParamJSON(aoData, paramData),
                //contentType: "application/json; charset=utf-8",
                //dataType: "json",
                success: function (data) {
                    var json = jQuery.parseJSON(data);
                    fnCallback(json);
                    $('#loadingPanel').css('display', 'none');
                },
                error: function (xhr, statusCode, errorThrown) {
                    if (typeof callError === 'function') {
                        callError(xhr, statusCode, errorThrown);
                    }
                    $('#loadingPanel').css('display', 'none');
                }
            });
        },
        "columns": columns,
        //"columnDefs": [
        //    { targets: 3, visible: false }
        //],
        //"fixedColumns": {
        //    leftColumns: 2
        //},
        //"rowGroup": {
        //    dataSrc: ['schemenamedeptgroup'],
        //    startRender: function (rows, group, level) {

        //        //var groupName = 'group-' + group.replace(/[^A-Za-z0-9]/g, '');
        //        var all;
        //        var _rowscount = group.split('_rowscount')[1];
        //        group = group.replace('_rowscount', '')
        //        var idGroup = "#-" + idGroupLoi + "-" + group.replace(/[^A-Za-z0-9]/g, '');
        //        var collapsed = !!collapsedGroups[group];
        //        var rowNodes = rows.nodes();
        //        rowNodes.each(function (r) {
        //            r.style.display = collapsed ? 'none' : '';
        //            r.id = idGroup;
        //        });
        //        //rows.nodes().each(function (r) {
        //        //    r.style.display = collapsed ? 'none' : '';
        //        //});

        //        // Get selected checkboxes
        //        var checkboxesSelected = $('.dt-checkboxes:checked', rowNodes);
        //        // Parent checkbox is selected when all child checkboxes are selected
        //        //var isSelected = (checkboxesSelected.length == rowNodes.length);
        //        var idObj = "#" + group.replace(/[^A-Za-z0-9]/g, '');
        //        var isEdit = ($('#txtLOIId').val() == "" || $('#txtLOIId').val() == "0") ? false : true;
        //        var isSubmit = ($('txtStatusBtn').val() == "submit") ? true : false;
        //        idGroupLoi++;
        //        return $('<tr/>')
        //            //.append('<td><input type="checkbox" class="form-control" id="chkDetailItem" class="group-checkbox"/></td>' +
        //            //    '<td colspan="26" id="collapseRow" class="group-header">' + group + ' (' + rows.count() + ')</td>')
        //            //.attr('data-name', all)
        //            //.toggleClass('collapsed', collapsed); onclick="calculateRebate();"

        //            .append('<td colspan="0" class="details-control"><i class="fa fa-plus-square m-4" data-schemenamedeptgroup="' + group +'"  aria-hidden="true"><input type="checkbox"  class="group-checkbox ' + (isSubmit ? ' disabled' : '') + '" id="' + idObj + '" data-group-name="'
        //            + group + '"' + '" data-group-id="' + idGroup + '"' + (isEdit ? ' checked' : '') + (isSubmit ? ' disabled' : '') + '> </i><label >' + group + ' (' + _rowscount + ')</label></td>')
        //            .attr('data-name', group).attr('data-id', idGroup);
        //    }
        //},
        "drawCallback": function (settings) {
            var api = this.api();
            var rows = api.rows({ page: 'current' }).nodes();
            var last = null;

            if (additionalGridConfig != null) {
                if (additionalGridConfig.flag = "LOICollectRebate") {

                    $('#tblCollectRebate tbody').unbind('click');
                    $('#tblCollectRebate tbody').on('click', 'i.details-control', function () {
                        var tr = $(this).closest('tr');

                        var tdi = tr.find("i.fa");
                        var row = tableLOI.row(tr);
                        tableLOI.rows().every(function () {
                            // If row has details expanded
                            //if (this.child.isShown() && (this.data().confirm_no + this.data().purch_doc) !== (row.data().confirm_no + row.data().purch_doc)) {
                            if (this.child.isShown() && (this.data().schemenamedeptgroup) !== (row.data().schemenamedeptgroup)) {
                                // Collapse row details
                                this.child.hide();
                                $(this.node()).removeClass('shown');
                                $(this.node()).first().find("i.fa").removeClass('fa-minus-square');
                                $(this.node()).first().find("i.fa").addClass('fa-plus-square');
                                //$(this.node()).first().find("i.fa").show();
                            }
                        });

                        if (row.child.isShown()) {
                            row.child.hide();
                            tr.removeClass('shown');
                            tdi.first().removeClass('fa-minus-square');
                            tdi.first().addClass('fa-plus-square');
                        }
                        else {
                            //tdi.hide();
                            row.child(format_detail_table_collect_rebate(row.data())).show();
                            var childTable = $('#' + row.data().schemenamedeptgroup.replace(/[^A-Za-z0-9]/g, '').replace(/\s/g, '')).DataTable({
                                //bSortCellsTop: true,
                                //ajax: {
                                //    url: '../DataSumSell',
                                //    method: 'POST',
                                //    data: function (d) {
                                //        console.log(url);
                                //        paramData['schemenamedeptgroup'] = row.data().schemenamedeptgroup;
                                //        $.extend(d,
                                //            paramData
                                //        );
                                //    },
                                //},
                                "scrollX": true,
                                "scrollY": "70vh",
                                "dom":
                                    "<'row'<'col-sm-1'lpi><'col-sm-1'r><'col-sm-10'f>>" +
                                    "<'row'<'col-sm-12't>>" +
                                    "<'row'<'col-sm-4'i><'col-sm-4 text-center'><'col-sm-4'B>>",
                                "bScrollCollapse": true,
                                "fnServerData": function (sSource2, aoData2, fnCallback2) {
                                    paramData['schemenamedeptgroup'] = row.data().schemenamedeptgroup;
                                  
                                    logsRequest = $.ajax({
                                        type: "POST",
                                        url: '../DataSumSellByGroup',
                                        data: getParamJSON2(aoData2, paramData),
                                        //contentType: "application/json; charset=utf-8",
                                        //dataType: "json",
                                        success: function (data) {
                                            paramData.schemenamedeptgroup = null;
                                            var json = jQuery.parseJSON(data);
                                            fnCallback2(json);
                                            $('#loadingPanel').css('display', 'none');
                                        },
                                        error: function (xhr, statusCode, errorThrown) {
                                            if (typeof callError === 'function') {
                                                callError(xhr, statusCode, errorThrown);
                                            }
                                            $('#loadingPanel').css('display', 'none');
                                        }
                                    });
                                },
                                //fixedColumns: {
                                //    leftColumns:5
                                //},
                                bFilter: false,
                                bDestroy: false,
                                serverSide: true,
                                bPaginate: true,
                                paging: true,
                                cache: false,
                                iDisplayLength: 10,
                                processing: true,
                                bStateSave: false,
                                //order: [[1, 'asc']],
                                columns: [
                                    { "data": "refNumber", "name": "Ref Number", "orderable": "false" }, //modified refnum by leonagata holianti on 8 May 2023 AR2023 - 001845_SPRINT39_1204527990706554
                                    { "data": "vendorCode", "name": "Vendor Code", "orderable": "false" },
                                    { "data": "vendorName", "name": "Vendor Name", "orderable": "false" },
                                    { "data": "brand", "name": "Brand", "orderable": "false" },
                                    { "data": "calType", "name": "Cal Type", "orderable": "false" },
                                    { "data": "schemeItemName", "name": "Scheme Item Name", "orderable": "false" },
                                    { "data": "dept", "name": "Dept", "orderable": "false" },
                                    { "data": "companyCode", "name": "Company Code", "orderable": "false" },
                                    { "data": "site", "name": "Site", "orderable": "false" },
                                    { "data": "siteDesc", "name": "Site Description", "orderable": "false" },
                                    { "data": "article", "name": "Article", "orderable": "false" },
                                    { "data": "articleDesc", "name": "Article Description", "orderable": "false" },
                                    { "data": "poQty", "name": "PO Qty", "orderable": "false" },
                                    { "data": "grQty", "name": "GR Qty", "orderable": "false" },
                                    { "data": "netPrice", "name": "PO Unit Price", "orderable": "false" },
                                    { "data": "salesQty", "name": "Sales Qty", "orderable": "false" },
                                    { "data": "salesUnitPrice", "name": "Sales Unit Price", "orderable": "false" },
                                    { "data": "valueScheme", "name": "Value Scheme", "orderable": "false" },
                                    { "data": "supportPertg", "name": "Support %", "orderable": "false" },
                                    { "data": "supportByValue", "name": "support By Value", "orderable": "false" },
                                    { "data": "hargaJualPromo", "name": "Harga Jual Promo", "orderable": "false" },
                                    { "data": "hargaJualNormal", "name": "Harga Jual Normal", "orderable": "false" },
                                    { "data": "promoQty", "name": "Promo Qty", "orderable": "false" },
                                    { "data": "maxQty", "name": "Max Qty", "orderable": "false" },
                                    { "data": "promoZone", "name": "Promo Zone", "orderable": "false" },
                                    { "data": "rebateSystem", "name": "Rebate System", "orderable": "false" },
                                    { "data": "nou", "name": "Number", "className": "hiddencol" }, //26

                                    { "data": "newQty", "name": "Qty", "orderable": "false" },
                                    { "data": "schemeRebateValue", "name": "Rebate System", "orderable": "false" },
                                    { "data": "poNumber", "name": "PO Number", "orderable": "false" },
                                    { "data": "receiveNo", "name": "Receipt / SO Number", "orderable": "false" },


                                    { "data": "schemeItemId", "name": "schemeItemId", "className": "hiddencol" },
                                    { "data": "uom", "name": "uom", "className": "hiddencol" },
                                    { "data": "commodity", "name": "commodity", "className": "hiddencol" },
                                    { "data": "commodityDesc", "name": "commodityDesc", "className": "hiddencol" },
                                    { "data": "merchandiseClass", "name": "merchandiseClass", "className": "hiddencol" },
                                    { "data": "mercClassName", "name": "mercClassName", "className": "hiddencol" },
                                    { "data": "productGroup", "name": "productGroup", "className": "hiddencol" },
                                    { "data": "productGroupName", "name": "productGroupName", "className": "hiddencol" },
                                    { "data": "top", "name": "TOP", "className": "hiddencol" },
                                    { "data": "sumsellid", "name": "SumSellId", "className": "hiddencol" },
                                    { "data": "sumselltype", "name": "SumSellType", "className": "hiddencol" },
                                    { "data": "schemenamedeptgroup", "name": "SumDeptGroup", "className": "hiddencol" }

                                ]
                            });
                            tr.addClass('shown');
                            tdi.first().removeClass('fa-plus-square');
                            tdi.first().addClass('fa-minus-square');

                            
                        }

                        //$(".filterheaderdetail > input").on('change',
                        //    function (e) {
                        //        childTable.draw();
                        //    });

                        //$(".filterheaderdetail > select").on('change',
                        //    function (e) {
                        //        childTable.draw();
                        //    });
                    });

                }

            }
            var isChecked = $('input[name="checkAllCollect"]:checked');
            var checked = false;
            if (isChecked.length > 0) {
                checked = isChecked[0].checked;

                $('.group-checkbox').prop('checked', true);
            } else {
                selectedLOI = [];
                $('.group-checkbox').prop('checked', false);
            }

        }
    });


    //reInitForCustom

    //table.dataTable({
    //    "bDestroy": true,
    //    "bFilter": false,
    //    "paging": true,
    //    "scrollX": true,
    //    "scrollY": "60vh",
    //    "autoWidth": false,
    //    "bScrollCollapse": true,
    //    "sPaginationType": "full_numbers",
    //    "bServerSide": true,
    //    "fixedColumns": {
    //        right: colIndexFreeze
    //    }
    //});

    //$($.fn.dataTable.tables(true)).DataTable()
    //    .columns.adjust().draw();
    //$($.fn.dataTable.tables(true)).DataTable().columns.adjust().responsive.recalc().scroller.measure().fixedColumns().relayout();
    return tableLOI;
}


function format_detail_table_collect_rebate(obj) {

    var th =
        '<th class="DataTable-Mid3Width">Ref Number</th>' +
        '<th class="DataTable-MidWidth">Vendor Code</th>' +
        '<th class="DataTable-Mid2Width">Vendor Name</th>' +
        '<th class="DataTable-MidWidth">Brand</th>' +
        '<th class="DataTable-Mid2Width">Cal Type</th>' +
        '<th class="DataTable-MidWidth">Scheme Item Name</th>' +
        '<th class="DataTable-MidWidth">Dept</th>' +
        '<th class="DataTable-MidWidth">Company Code</th>' +
        '<th class="DataTable-MidWidth">Site</th>' +
        '<th class="DataTable-MidWidth">Site Description</th>' +
        '<th class="DataTable-MinWidth">Article</th>' +
        '<th class="DataTable-MinWidth">Article Description</th>' +
        '<th class="DataTable-MinWidth">PO Qty</th>' +
        '<th class="DataTable-MinWidth">GR Qty</th>' +
        '<th class="DataTable-MinWidth">PO Unit Price</th>' +
        '<th class="DataTable-MinWidth">Sales Qty</th>' +
        '<th class="DataTable-MinWidth">Sales Unit Price</th>' +
        '<th class="DataTable-MinWidth">Value Scheme</th>' +
        '<th class="DataTable-MinWidth">Support %</th>' +
        '<th class="DataTable-MinWidth">support By Value</th>' +
        '<th class="DataTable-MinWidth">Harga Jual Promo</th>' +
        '<th class="DataTable-MinWidth">Harga Jual Normal</th>' +
        '<th class="DataTable-MinWidth">Promo Qty</th>' +
        '<th class="DataTable-MinWidth">Max Qty</th>' +
        '<th class="DataTable-MinWidth">Promo Zone</th>' +
        '<th class="DataTable-MinWidth">Rebate System</th>' +
        '<th style="display: none;" class="DataTable-MinWidth">Nou</th>' +
        '<th class="DataTable-MinWidth">Qty</th>' +
        '<th class="DataTable-MinWidth">Rebate System</th>' +
        '<th class="DataTable-MinWidth">PO Number</th>' +
        '<th class="DataTable-MinWidth">Receipt / SO Number</th>' +
        '<th style="display: none;" class="DataTable-MinWidth">schemeItemId</th>' +
        '<th style="display: none;" class="DataTable-MinWidth">uom</th>' +
        '<th style="display: none;" class="DataTable-MinWidth">commodity</th>' +
        '<th style="display: none;" class="DataTable-MinWidth">commodityDesc</th>' +
        '<th style="display: none;" class="DataTable-MinWidth">merchandiseClass</th>' +
        '<th style="display: none;" class="DataTable-MinWidth">mercClassName</th>' +
        '<th style="display: none;" class="DataTable-MinWidth">productGroup</th>' +
        '<th style="display: none;" class="DataTable-MinWidth">productGroupName</th>' +
        '<th style="display: none;" class="DataTable-MinWidth">TOP</th>' +
        '<th style="display: none;" class="DataTable-MinWidth">SumSellId</th>' +
        '<th style="display: none;" class="DataTable-MinWidth">SumSellType</th>' +
        '<th style="display: none;" class="DataTable-MinWidth">SumDeptGroup</th>';

    /*return '<table id=' + a.confirm_no + a.purch_doc + ' class="child_table table-striped cell-border compact stripe" style="margin: 0 auto;width:100%;clear:both;border-collapse:unset;table-layout:fixed;word-wrap:unset;"><thead><tr>' +*/
    return '<table id=' + obj.schemenamedeptgroup.replace(/[^A-Za-z0-9]/g, '').replace(/\s/g, '') + ' class="child_table table-striped cell-border compact stripe" style="margin: 0 auto;width:100%;clear:both;border-collapse:unset;table-layout:fixed;word-wrap:unset;"><thead><tr>' +
       th +
        '</tr></thead><tbody></tbody></table>';
}

function reInitTableLOI(indexRow, existingRowData) {
    tableLOI = $('#tblLOIDetail').DataTable({
        "bDestroy": true,
        "bFilter": false,
        "paging": false,
        "scrollX": true,
        "scrollY": "70vh",
        autoWidth: false,
        "bScrollCollapse": true,
        "sPaginationType": "full_numbers",
        "rowGroup": {
            dataSrc: ['refNum'],
            startRender: function (rows, group, level) {

                //var groupName = 'group-' + group.replace(/[^A-Za-z0-9]/g, '');
                var all;

                var collapsed = !!collapsedGroups[group];
                var rowNodes = rows.nodes();
                rowNodes.each(function (r) {
                    r.style.display = collapsed ? 'none' : '';
                });
                //rows.nodes().each(function (r) {
                //    r.style.display = collapsed ? 'none' : '';
                //});

                // Get selected checkboxes
                var checkboxesSelected = $('.dt-checkboxes:checked', rowNodes);
                // Parent checkbox is selected when all child checkboxes are selected
                //var isSelected = (checkboxesSelected.length == rowNodes.length);
                var idObj = "#" + group.replace(/[^A-Za-z0-9]/g, '');
                var isSelected = $(idObj).val();

                return $('<tr/>')
                    //.append('<td><input type="checkbox" class="form-control" id="chkDetailItem" class="group-checkbox"/></td>' +
                    //    '<td colspan="26" id="collapseRow" class="group-header">' + group + ' (' + rows.count() + ')</td>')
                    //.attr('data-name', all)
                    //.toggleClass('collapsed', collapsed);

                    .append('<td colspan="38"><label><input type="checkbox" class="group-checkbox" id="' + idObj + '" data-group-name="'
                        + group + '"' + (isSelected ? ' checked' : '') + '> ' + group + ' (' + rows.count() + ')</label></td>')
                    .attr('data-name', group)
                    .toggleClass('collapsed', collapsed);
            }
        }
    });

    tableLOI.row(indexRow).data(existingRowData).draw();
}

function reInitDataTables(idObject, sumLeftCol, sumRightIdx) {
    $('#' + idObject).DataTable({
        "bDestroy": true,
        "bFilter": false,
        "paging": true,
        "scrollX": true,
        "scrollY": "60vh",
        "autoWidth": false,
        "bScrollCollapse": true,
        "fixedColumns": {
            left: sumLeftCol,
            right: sumRightIdx
        },
    });

    $($.fn.dataTable.tables(true)).DataTable()
        .columns.adjust();
    //$($.fn.dataTable.tables(true)).DataTable().columns.adjust().responsive.recalc().scroller.measure().fixedColumns().relayout();
    return table;
}

function getParamJSON(aoData, paramData) {
    var strdata = "{"
        + buildParam(paramData)
        + "'sEcho': '" + getValueFromArray(aoData, "sEcho")
        + "', 'sSearch': '" + getValueFromArray(aoData, "sSearch")
        + "', 'iDisplayLength': '" + getValueFromArray(aoData, "iDisplayLength")
        + "', 'iDisplayStart': '" + getValueFromArray(aoData, "iDisplayStart")
        + "', 'iColumns': '" + getValueFromArray(aoData, "iColumns")
        + "', 'iSortingCols': '" + getValueFromArray(aoData, "iSortingCols")
        + "', 'sColumns': '" + getValueFromArray(aoData, "sColumns")
        + "', 'iSortCol': '" + getValueFromArray(aoData, "iSortCol_0")
        + "', 'sSortDir': '" + getValueFromArray(aoData, "sSortDir_0") + "'}"
    strdata = strdata.replace(/'/g, '"')
    //console.log(strdata)
    var jsondata = jQuery.parseJSON(strdata);
    //console.log(jsondata)
    //var jsondata = {
    //    sEcho: getValueFromArray(aoData, "sEcho"),
    //    sSearch: getValueFromArray(aoData, "sSearch"),
    //    iDisplayLength: getValueFromArray(aoData, "iDisplayLength"),
    //    iDisplayStart: getValueFromArray(aoData, "iDisplayStart"),
    //    iColumns: getValueFromArray(aoData, "iColumns"),
    //    iSortingCols: getValueFromArray(aoData, "iSortingCols"),
    //    sColumns: getValueFromArray(aoData, "sColumns"),
    //    iSortCol: getValueFromArray(aoData, "iSortCol_0"),
    //    sSortDir: getValueFromArray(aoData, "sSortDir_0")
    //}
    return jsondata
}

function getParamJSON2(aoData, paramData) {
    var strdata = "{"
        + buildParam(paramData)
        + "'sEcho': '" + getValueFromArray(aoData, "draw")
        + "', 'sSearch': '" + getValueFromArray(aoData, "search").value
        + "', 'iDisplayLength': '" + getValueFromArray(aoData, "length")
        + "', 'iDisplayStart': '" + getValueFromArray(aoData, "start")
        + "'}"
    strdata = strdata.replace(/'/g, '"')
    //console.log(strdata)
    var jsondata = jQuery.parseJSON(strdata);
    //console.log(jsondata)
    //var jsondata = {
    //    sEcho: getValueFromArray(aoData, "sEcho"),
    //    sSearch: getValueFromArray(aoData, "sSearch"),
    //    iDisplayLength: getValueFromArray(aoData, "iDisplayLength"),
    //    iDisplayStart: getValueFromArray(aoData, "iDisplayStart"),
    //    iColumns: getValueFromArray(aoData, "iColumns"),
    //    iSortingCols: getValueFromArray(aoData, "iSortingCols"),
    //    sColumns: getValueFromArray(aoData, "sColumns"),
    //    iSortCol: getValueFromArray(aoData, "iSortCol_0"),
    //    sSortDir: getValueFromArray(aoData, "sSortDir_0")
    //}
    return jsondata
}


function buildParam(paramData) {
    var json = "";
    for (var key in paramData) {
        if (paramData.hasOwnProperty(key)) {
            json += "'" + key + "': '" + (paramData[key] === null ? '0' : paramData[key]) + "',"
        }
    }
    return json;
}

function getValueFromArray(aoData, Key) {
    for (i = 0; i < aoData.length; i++) {
        if (aoData[i].name == Key) {
            return aoData[i].value;
        }
    }
}

function scrollToObject(idObject) {
    $('html, body').animate({
        scrollTop: $(idObject).offset().top
    }, 2000);
}

function HideShowObject(idObject, value) {
    $("#" + idObject).css("display", value);
}

function formatCurrency(angka, prefix) {
    var number_string = angka.toString(),
        split = number_string.split(','),
        sisa = split[0].length % 3,
        rupiah = split[0].substr(0, sisa),
        ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    // tambahkan titik jika yang di input sudah menjadi angka ribuan
    if (ribuan) {
        separator = sisa ? '.' : '';
        if (rupiah >= 0) {
            rupiah += separator + ribuan.join('.');
        }
        else {//jika("-"/minus)
            rupiah += ribuan;
        }
    }

    rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
    return prefix == undefined ? rupiah : (rupiah ? 'Rp. ' + rupiah : '');
}


function formatCurrencyDashboard(angka, prefix) {
    var number_string = angka.toString(),
        split = number_string.split(','), sisa = 0, rupiah = 0, ribuan = 0;

    if (number_string.includes("-")) {
        split = split[0].split("-");
        sisa = split[1].length % 3;
        rupiah = split[1].substr(0, sisa);
        ribuan = split[1].substr(sisa).match(/\d{3}/gi);
    }
    else {
        sisa = split[0].length % 3;
        rupiah = split[0].substr(0, sisa);
        ribuan = split[0].substr(sisa).match(/\d{3}/gi)
    }

    // tambahkan titik jika yang di input sudah menjadi angka ribuan
    if (ribuan) {
        separator = sisa ? '.' : '';
        if (rupiah >= 0) {
            rupiah += separator + ribuan.join('.');
        }
        else {//jika("-"/minus)
            rupiah += ribuan;
        }
    }

    rupiah = (number_string.includes("-")) ? ("-" + rupiah) : (split[1] != undefined ? rupiah + ',' + split[1] : rupiah);
    return prefix == undefined ? rupiah : (rupiah ? 'Rp. ' + rupiah : '');
}

function firstSequence(paramType, MenuType) {
    //set param data
    var paramData = {
        firstSeqCat: paramType,
        firstSeqMenuCat: MenuType
    };

    $.ajax({
        type: "post",
        url: "/Global/FirstSequence",
        data: paramData,
        async: false,
        success: function (response) {
            if (!response.is_ok) {
                //error
                if (paramType == "Button") {
                    $('#btnAdd').hide();
                }
                else {
                    if (response.message != "") {
                        toastr.error(response.message);
                        setTimeout(function () {
                            window.top.close();
                        }, 5000);
                    }
                }
            }
            else {
                //success
                if (paramType == "Button") {
                    $('#btnAdd').show();
                }
            }
        }
    });
}

function _fw_grid_web_method_Report(id, url, paramData, columns, callError, additionalGridConfig = null) {
    $('#loadingPanel').css('display', 'block');
    var table = $('#' + id).dataTable({
        "bDestroy": true,
        "bFilter": (additionalGridConfig == null || additionalGridConfig == undefined) ? false : additionalGridConfig.isSearch,
        "paging": (additionalGridConfig == null || additionalGridConfig == undefined) ? true : additionalGridConfig.isPaging,
        "scrollX": true,
        "scrollY": (additionalGridConfig == null || additionalGridConfig == undefined) ? "60vh" : additionalGridConfig.scrollY,
        "autoWidth": false,
        "bScrollCollapse": true,
        "sPaginationType": "full_numbers",
        "bServerSide": true,
        "sAjaxSource": url,
        //"dom": 'lrtip',//delete search box
        "fnServerData": function (sSource, aoData, fnCallback) {
            logsRequest = $.ajax({
                type: "POST",
                url: sSource,
                data: getParamJSON(aoData, paramData),
                success: function (data) {
                    var json = jQuery.parseJSON(data);
                    fnCallback(json);
                    if (json.data != null) {
                        if (json.data.length > 0) {
                            $('#btnExportExcel').show();
                            $('#txtSize').val(json.SizeData); //added by Leonagata Holianti on 10 march 2023 AR2022-000735_SPRINT31_1204019395080482 (for take size when export excel)
                        }
                        else {
                            $('#btnExportExcel').hide();
                        }
                    }
                    else {
                        $('#tblRebateSellIn').DataTable().row().remove().draw();
                        $('#btnExportExcel').hide();
                    }
                    $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
                    $('#loadingPanel').css('display', 'none');
                },
                error: function (xhr, statusCode, errorThrown) {
                    if (typeof callError === 'function') {
                        callError(xhr, statusCode, errorThrown);
                    }
                    $('#btnExportExcel').hide();
                    $('#loadingPanel').css('display', 'none');
                }
            });
        },
        "aoColumns": columns
    });

    return table;
}

function NumericInput(inp, locale) {
    var numericKeys = '0123456789.';

    // restricts input to numeric keys 0-9
    inp.addEventListener('keypress', function (e) {
        var event = e || window.event;
        var target = event.target;

        if (event.charCode == 0) {
            return;
        }

        if (-1 == numericKeys.indexOf(event.key)) {
            // Could notify the user that 0-9 is only acceptable input.
            event.preventDefault();
            return;
        }
    });

    // add the thousands separator when the user keyup
    inp.addEventListener('keyup', function (e) {
        var event = e || window.event;
        var target = event.target;

        var tmp = target.value.replace(/,/g, '');
        var val = Number(tmp).toLocaleString(locale);

        if (tmp == '') {
            target.value = '';
        } else {
            target.value = val;
        }
    });

    // add the thousands separator when the user blurs
    inp.addEventListener('blur', function (e) {
        var event = e || window.event;
        var target = event.target;

        var tmp = target.value.replace(/,/g, '');
        var val = Number(tmp).toLocaleString(locale);

        if (tmp == '') {
            target.value = '';
        } else {
            target.value = val;
        }
    });

    // strip the thousands separator when the user puts the input in focus.
    inp.addEventListener('focus', function (e) {
        var event = e || window.event;
        var target = event.target;
        var val = target.value.replace(/[,.]/g, '');

        target.value = val;
    });
}

$('#topModal').on('shown.bs.modal', function (e) {
    $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
});

$('#compModal').on('shown.bs.modal', function (e) {
    $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
});

$('#vendorModal').on('shown.bs.modal', function (e) {
    $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
});

$('#statusModal').on('shown.bs.modal', function (e) {
    $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
});

$('#statusDetailModal').on('shown.bs.modal', function (e) {
    $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
});

$('#reasonModal').on('shown.bs.modal', function (e) {
    $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
});

$('#historyModal').on('shown.bs.modal', function (e) {
    $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
});

$('#taxModal').on('shown.bs.modal', function (e) {
    $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
});

$('#reasonReversalModal').on('shown.bs.modal', function (e) {
    $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
});

$('#brandModal').on('shown.bs.modal', function (e) {
    $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
});

$('#commModal').on('shown.bs.modal', function (e) {
    $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
});

$('#deptModal').on('shown.bs.modal', function (e) {
    $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
});

$('#pcModal').on('shown.bs.modal', function (e) {
    $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
});

$('#loiModal').on('shown.bs.modal', function (e) {
    $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
});

$('#mcModal').on('shown.bs.modal', function (e) {
    $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
});

$('#menuModal').on('shown.bs.modal', function (e) {
    $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
});

$('#AppCodeModal').on('shown.bs.modal', function (e) {
    $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
});

$('#custObjModal').on('shown.bs.modal', function (e) {
    $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
});

$('#collectRebateModal').on('shown.bs.modal', function (e) {
    $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
});

$('#productGroupModal').on('shown.bs.modal', function (e) {
    $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
});

$('#paymentTypeModal').on('shown.bs.modal', function (e) {
    $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
});