var date = new Date();
var actionButton = "";
var onChangeLogic = true;
var VendorId = "", VendorCode = "", VendorName = "",
    CompCode = "", CompName = "",
    BrandId = "", BrandCode = "", BrandName = "",
    CommCode = "", CommId = "", CommName = "",
    ReasonId = "", ReasonCode = "", ReasonName = "";
var dataCmb, dataSite, dataArticle, dataUOM, dataCal, dataComm, dataTemplate, dataPromoByZone, dataPartnership;
var template = [], oldValueDetails = [], dataArticlePIM = [];
var isValid = true, isAtchChanged = false;
var idTempDetail = 0;
var flag = "";
var AppCodeSlipPromo = "";
var ftpUrl = "";
var frmTask = false;
var dataArrayPartenerCode = [];
var partnerArray = [];

$(function () {
    bsCustomFileInput.init();

});

$(document).ready(function () {
    initNewForm();
    //loadDept();
    loadCalType();
    initButtonAction();
    loadPromoByZone();
    //loadPartnership();
   // DisableEnableForm(true);
    loadDataDetail();
    firstSequence("Form", "SlipPromo");
})

function initNewForm() {
    $('#dvDownload').hide();
    $("#cmmPartnership").empty();
}


//Date picker
$('#datePickerFrom').datetimepicker
    ({
        format: 'YYYY-MM-DD'
    });

$('#datePickerTo').datetimepicker
    ({
        format: 'YYYY-MM-DD'
    });

function HideShowObject(idObject, value) {
    $("#" + idObject).css("display", value);
}

$("#txtSupportValue").on("input", function () {
    if (onChangeLogic) {
        onChangeLogic = false;
        $("#txtSupportValueInc").val('');
        $("#txtSupportValueExc").val('');
        onChangeLogic = true;
    }
    else
        return;
});

$("#txtSupportValueInc").on("input", function () {
    if (onChangeLogic) {
        onChangeLogic = false;
        $("#txtSupportValue").val('');

        if ($("#txtSupportValueInc").val() != "") {
            //$("#txtSupportValueExc").val(Number(parseFloat($("#txtSupportValueInc").val()) / 1.11).toLocaleString());
            var dataValueInc = $("#txtSupportValueInc").val() == "" ? "0" : parseFloat($("#txtSupportValueInc").val().replace(/,/g, '')) / 1.11;
            $("#txtSupportValueExc").val(Number(Math.round(dataValueInc)).toLocaleString());
        }
        else {
            $("#txtSupportValueExc").val("");
        }
        onChangeLogic = true;
    }
    else
        return;
});



$("#txtPromoByZone").on("input", function () {
    if ($('#cmmSitePromo').val() != "") {
        $("#txtPromoByZone").val('');
        toastr.error("Cannot input Promo By Zone While Header: Site Promo is not empty!");
    }
});


function loadWorkflow(bu) {
    //set param data
    var paramData = {
        compCode: bu,
        seq: AppCodeSlipPromo
    };

    //init hide all action button
    initButtonAction();

    //get workflow
    //var table = document.getElementById('tblItemDetail');

    //var table = $('#tblItemDetail').DataTable({
    //    bFilter: false,
    //    paging: false
    //});

    $.ajax({
        type: "post",
        url: "/SlipPromo/DataWorkFlow",
        data: paramData,
        //async: false,
        success: function (response) {
            //console.log(response)
            if (!response.is_ok) {
                //error
                toastr.error(response.message);
                // table.column(15).visible(false);
                DisableEnableForm(true);
            }
            else {
                //success
                var isSubmit = true;
                if (response.data == null) {
                    // table.column(1).visible(false);
                    DisableEnableForm(true);
                }
                else {
                    $.each(response.data, function () {
                        var idObject = this['activeButton'].replace(" ", "");
                        HideShowObject("btn" + idObject, "block");

                        if (isSubmit) {
                            if (idObject == "Submit") {
                                HideShowObject("btnAddDetail", "block");
                                DisableEnableForm(false);
                                isSubmit = false;
                                //table.column(1).visible(true);
                            }
                            else {
                                HideShowObject("btnAddDetail", "none");
                                DisableEnableForm(true);
                                //table.column(1).visible(false);
                            }
                        }

                    });
                }
            }
        }
    });

}

function initButtonAction() {
    HideShowObject("btnDraft", "none");
    HideShowObject("btnSubmit", "none");
    HideShowObject("btnCancel", "none");
    HideShowObject("btnSendBack", "none");
    HideShowObject("btnReject", "none");
    HideShowObject("btnApprove", "none");
    HideShowObject("btnReview", "none");
    HideShowObject("btnAddDetail", "none");
}

function HideShowObject(idObject, value) {
    $("#" + idObject).css("display", value);
}

function cmbPromoSupportedchange() {
    if ($('#cmbPromoSupported').val() == "Partnership") {
        HideShowObject("cmmPartnership", "block");
        $("#cmmPartnership").empty();
        $('#cmmPartnership').val('').trigger('change');
    } else {
        HideShowObject("cmmPartnership", "none");
        $("#cmmPartnership").empty();
        $('#cmmPartnership').val('').trigger('change');
        HideShowObject("cmmPartnership", "none");
    }
}


function showCompModal() {
    if (!$("#dvBU").hasClass("disabled")) {
        var paramData = {};
        $("#compModal").modal("show");
        $('#tblComp').DataTable().destroy();
        return _fw_grid_web_method('tblComp', "../DataComp", paramData,
            [
                {
                    "User_Id": "vendor", "name": "-SELECTION-",
                    "render": function (data, type, row) {
                        var html = "<a href='javascript:void(0);' class='btn btn-info' onclick=chooseDataBU(this);> Choose </a>";
                        return html;
                    }
                },
                { "data": "compCode", "name": "Company Code", "autoWidth": true },
                { "data": "compName", "name": "Company Name", "autoWidth": true }
            ], function (err) {
                //console.log(err);
            });

        $($.fn.dataTable.tables(true)).DataTable().columns.adjust().draw();
    }
}

function showVendorModal() {
    if (!$("#dvVendor").hasClass("disabled")) {
        var paramData = {};
        $("#vendorModal").modal("show");
        $('#tblVendor').DataTable().destroy();

        additionalGridConfig = {
            isPaging: true,
            scrollY: "60vh",
            isSearch: true
        }

        return _fw_grid_web_method('tblVendor', "../DataRegisteredVendor", paramData,
            [
                {
                    "userID": "vendor", "name": "-SELECTION-",
                    "render": function (data, type, row) {
                        var html = "<a href='javascript:void(0);' class='btn btn-info' onclick=chooseDataVendor(this);> Choose </a>";
                        return html;
                    }
                },
                { "data": "userID", "name": "Vendor ID", "autoWidth": true, "orderable": "false" },
                { "data": "userName", "name": "Vendor Name", "autoWidth": true },
                { "data": "email", "name": "Email", "autoWidth": true }
            ], function (err) {
                //console.log(err);
            },
            additionalGridConfig
        );
    }
}

//add arif
function showPartnershipModal() {
    if (!$("#dvPartnership").hasClass("disabled")) {
        var paramData = {};
        $("#partnershipModal").modal("show");
        $('#tblPartnership').DataTable().destroy();

        additionalGridConfig = {
            isPaging: true,
            scrollY: "60vh",
            isSearch: true
        }

        return _fw_grid_web_method('tblPartnership', "../DataPartnershipList", paramData,
            [
                {
                    "User_Id": "vendor", "name": "-SELECTION-",
                    "render": function (data, type, row) {
                        var html = "<a href='javascript:void(0);' class='btn btn-info' onclick=chooseDataPartnership(this);> Choose </a>";
                        return html;
                    }
                },
                { "data": "code", "name": "Partnership Code", "autoWidth": true, "orderable": "false" },
                { "data": "name", "name": "Parnership Name", "autoWidth": true },

            ], function (err) {
                //console.log(err);
            },
            additionalGridConfig
        );
    }
}
function showReasonModal() {
    var paramData = {};
    $("#rejectModal").modal("hide");
    $("#reasonModal").modal("show");
    $('#tblReason').DataTable().destroy();
    _fw_grid_web_method('tblReason', "../DataReason", paramData,
        [
            { "data": "reasonId", "name": "Reason Id", "autoWidth": true, "className": "hiddencol" },
            {
                "User_Id": "vendor", "name": "-SELECTION-",
                "render": function (data, type, row) {
                    var html = "<a href='javascript:void(0);' class='btn btn-info' onclick=chooseDataReason(this);> Choose </a>";
                    return html;
                }
            },
            { "data": "reasonCode", "name": "Reason Code", "autoWidth": true },
            { "data": "reasonDesc", "name": "Reason Name", "autoWidth": true }
        ], function (err) {
            //console.log(err);
        });

    $($.fn.dataTable.tables(true)).DataTable()
        .columns.adjust();
}

function showRejectModal() {
    $("#rejectModal").modal("show");
    $("#reasonModal").modal("hide");
}

function showModalExcel() {
    $('#loadingPanel').css('display', 'block');
    var paramData = {
        compCode: $('#txtCompCode').val(),
        fileName: $('#txtAttachmentDetail').html()
    };
    $("#excelModal").modal("show");
    $('#tblModalExcel').DataTable().destroy();
    $('#tblModalExcel tbody').empty();
    $.ajax({
        type: "POST",
        url: "/SlipPromo/ProcessFileExcel",
        data: paramData,
        //async: false,
        success: function (response) {
            var datasres = JSON.parse(response);
            if (!datasres.is_ok) {
                toastr.error(datasres.message);
            }
            else {
                var trHTML = '';

                $.each(datasres.data, function (i, dataValue) {
                    trHTML +=
                        "<tr>" +
                        "<td class='DataTable-MidWidth'style='text-align: center;'>" + ((dataValue.flag == null) ? "" : dataValue.flag) + "</td>" +
                        "<td class='DataTable-Mid3Width'style='text-align: center;'>" + ((dataValue.message == null) ? "" : dataValue.message) + "</td>" +
                        "<td class='DataTable-MidWidth'style='text-align: center;'>" + ((dataValue.Article == null) ? "" : dataValue.Article) + "</td>" +
                        "<td class='DataTable-MidWidth'style='text-align: center;'>" + ((dataValue.ArticleDescription == null) ? "" : dataValue.ArticleDescription) + "</td>" +
                        "<td class='DataTable-MidWidth'style='text-align: center;'>" + ((dataValue.Article == null) ? "" : dataValue.ArticleGet) + "</td>" +
                        "<td class='DataTable-MidWidth'style='text-align: center;'>" + ((dataValue.ArticleDescription == null) ? "" : dataValue.ArticleGetDescription) + "</td>" +
                        "<td class='DataTable-MidWidth'style='text-align: center;'>" + ((dataValue.PromoType == null) ? "" : dataValue.PromoType) + "</td>" +
                        "<td class='DataTable-MidWidth'style='text-align: center;'>" + ((dataValue.PromoQty == null) ? "" : dataValue.PromoQty) + "</td>" +
                        "<td class='DataTable-MidWidth'style='text-align: center;'>" + ((dataValue.MaxQty == null) ? "" : dataValue.MaxQty) + "</td>" +
                        "<td class='DataTable-Mid2Width'style='text-align: center;'>" + ((dataValue.HargaJualNormal == null) ? "" : Number(dataValue.HargaJualNormal)).toLocaleString() + "</td>" +
                        "<td class='DataTable-Mid2Width'style='text-align: center;'>" + ((dataValue.HargaJualPromo == null) ? "" : Number(dataValue.HargaJualPromo)).toLocaleString() + "</td>" +
                        "<td class='DataTable-MidWidth'style='text-align: center;'>" + ((dataValue.PromobyZone == null) ? "" : dataValue.PromobyZone) + "</td>" +
                        "<td class='DataTable-Mid2Width'style='text-align: center;'>" + ((dataValue.SupportPersValue == null) ? "" : dataValue.SupportPersValue) + "</td>" +
                        "<td class='DataTable-Mid2Width'style='text-align: center;'>" + ((dataValue.SupportValueInc == null) ? "" : Number(dataValue.SupportValueInc)).toLocaleString() + "</td>" +
                        "<td class='DataTable-Mid2Width'style='text-align: center;'>" + ((dataValue.SupportValueInc == null || dataValue.SupportValueInc == "") ? "" : Number(Math.round(parseFloat(dataValue.SupportValueInc) / 1.11))).toLocaleString() + "</td>" +
                        "<td class='DataTable-Mid2Width'style='text-align: center;'>" + ((dataValue.PromoSupportedBy == null) ? "" : dataValue.PromoSupportedBy) + "</td>" +
                        "<td class='DataTable-Mid2Width'style='text-align: center;'>" + ((dataValue.PartnershipDetail == null) ? "" : dataValue.PartnershipDetail) + "</td>" +

                        "</tr>";
                });
                $('#tblModalExcel tbody').append(trHTML);
            }
            $('#loadingPanel').css('display', 'none');
        },
        error: function (response) {
            $('#loadingPanel').css('display', 'none');
        }
    });
}



function chooseDataBU(obj) {
    var columnValue = $(obj).closest('tr').find('td');
    CompCode = $(columnValue[1]).text(); // CompCode = 'R110' //
    CompName = $(columnValue[2]).text();

    $('#txtCompCode').val(CompCode);
    $('#txtCompName').val(CompName);
    $('#txtComp').val(CompCode + " - " + CompName);

    $("#compModal").modal("hide");
    loadArticle();
    loadSite();
    loadWorkflow(CompCode);
    resetFormDetail();
    $('#tblItemDetail').DataTable().destroy();
}

function chooseDataVendor(obj) {
    var columnValue = $(obj).closest('tr').find('td');
    VendorCode = $(columnValue[1]).text();
    VendorName = $(columnValue[2]).text();

    $('#txtVendorCode').val(VendorCode);
    $('#txtVendorName').val(VendorName);
    $('#txtVendor').val(VendorName);

    $("#vendorModal").modal("hide");
}

function chooseDataReason(obj) {
    var columnValue = $(obj).closest('tr').find('td');
    ReasonId = $(columnValue[0]).text();
    ReasonCode = $(columnValue[2]).text();
    ReasonName = $(columnValue[3]).text();

    $('#txtReasonId').val(ReasonId);
    $('#txtReasonName').val(ReasonName);
    $('#txtReason').val(ReasonCode + " - " + ReasonName);

    showRejectModal();
}

//arif
function chooseDataPartnership(obj) {
    var columnValue = $(obj).closest('tr').find('td');
    PartnershipCode = $(columnValue[1]).text();
    PartnershipName = $(columnValue[2]).text();

    //$('#txtPartnership').val(PartnershipCode);
    //$('#txtPartnershipName').val(PartnershipName);
    
    
    var length = $('#cmmPartnership > option').length;
    if (length <= 0) {
        
        $("#cmmPartnership").empty();
        $("#cmmPartnership").append($("<option></option>").val(PartnershipCode).html(PartnershipName));
        insert(PartnershipCode, PartnershipName);
        partnerArray.push(PartnershipCode);
        //dataArrayPartenerName.push(PartnershipName);
        $("#cmmPartnership").val(partnerArray).trigger('change');
        
        
    }
    if (length <= 10 && length >0) {
        $("#cmmPartnership").append($("<option></option>").val(PartnershipCode).html(PartnershipName));
        insert(PartnershipCode, PartnershipName);
        partnerArray.push(PartnershipCode);
        //dataArrayPartenerName.push(PartnershipName);
        $("#cmmPartnership").val(partnerArray).trigger('change');
    }


    function insert(code, name) {
        dataArrayPartenerCode.push({
            code: code,
            name: name
        });
    }
    Select2MultipleCheckboxInit('cmmPartnership');
    $("#partnershipModal").modal("hide");
    $('#tblPartnership').DataTable().destroy();
}



function resetFormHeader() {
    $('#loadingPanel').css('display', 'block');
    $('#txttrNontradingTermDId').val("");
    $('#txtVendorCode').val('');
    $('#txtVendorName').val('');
    $('#txtVendor').val('');
    $('#ValidFrom').val('');
    $('#ValidTo').val('');
    $('#txtCompCode').val('');
    $('#txtCompName').val('');
    $('#txtComp').val('');
    $('#txtPromoDescr').val('');
    $('#txtPromoCode').val('');
    $('#cmbDept').val('');
    $('#cmmSitePromo').val('');
    $('#cmbCalType').val('');
    $('#txtAttachment').val('');
    $('#loadingPanel').css('display', 'none');
}

function resetFormDetail() {
    $('#loadingPanel').css('display', 'block');
    $('#txtFVendorCode').val('');
    $('#txtFVendorName').val('');
    $('#cmbArticle').val('');

    $('#txtPromoType').val('');
    $('#txtPromoQty').val('');
    $('#txtMaxQty').val('');
    $('#txtHargaJualNormal').val('');
    $('#txtHargaJualPromo').val('');
    $('#cmmPromoByZone').val('').trigger('change');
    $('#txtSupportValue').val('');
    $('#txtSupportValueInc').val('');
    $('#txtSupportValueExc').val('');
    $('#cmbPromoSupported').val('');
    $('#cmmPartnership').val('').trigger('change');
    $('#txtAttachmentDetail').val('');
    $('#txtAttachmentDetail').html('');
    $('#loadingPanel').css('display', 'none');
}

function loadDept(isEdit, obj) {
    $.ajax({
        type: "POST",
        url: "/SlipPromo/DataDept",
        //data: paramData,
        //async: false,
        success: function (response) {
            dataCmb = null;
            dataCmb = JSON.parse(response);
            if (!dataCmb.is_ok) {
                $("#cmbDept").empty();
                toastr.error(dataCmb.message);
                setTimeout(function () {
                    window.top.close();
                }, 5000);
            }
            else {
                $("#cmbDept").empty();

                $("#cmbDept").select2({
                    placeholder: "Select one Department",
                    tags: true,
                    multiple: false,
                    theme: 'bootstrap4'
                });

                $.each(dataCmb.data, function () {
                    $("#cmbDept").append($("<option></option>").val(this['deptId'] + "-" + this['deptCode']).html(this['deptCode'] + " - " + this['deptName']));
                });

                if (isEdit == true && obj != "") {
                    var deptid = []; var deptNotUse = [];
                    $.each(dataCmb.data, function () {
                        if (this['deptCode'] == obj) {
                            deptid.push(this['deptId'] + "-" + this['deptCode']);
                        }
                        else {
                            deptNotUse.push(this['deptId'] + "-" + this['deptCode']);
                        }
                    });
                    //this code cannot support for multi dept in slip promo
                    if (deptid == null || deptid.length == 0) {
                        toastr.warning(" You must have department " + obj.toString() + " for Create/Approve transaction, please contact your administrator for setting your role");
                        setTimeout(function () {
                            window.top.close();

                        }, 5000);
                    }
                    else {
                        $('#cmbDept').val(deptid).change();
                    }
                }
            }
        }
    });
}

function loadSite() {
    paramData = {
        compCode: $('#txtCompCode').val()
    }

    $.ajax({
        type: "POST",
        url: "/SlipPromo/DataSite",
        data: paramData,
        async: false,
        success: function (response) {
            dataCmb = null;
            dataCmb = JSON.parse(response);
            if (!dataCmb.is_ok) {
                $("#cmmSitePromo").empty();
            }
            else {
                $("#cmmSitePromo").empty();
                $.each(dataCmb.data, function () {
                    $("#cmmSitePromo").append($("<option></option>").val(this['siteCode']).html(this['siteCode']));
                });

                $("#cmmSitePromo").select2({
                    placeholder: "Select one or multiple Site",
                    tags: true,
                    tokenSeparators: [','],
                    multiple: true,
                    theme: 'bootstrap4'
                });
            }
        }
    });
}

function loadCalType() {
    $.ajax({
        type: "POST",
        url: "/SlipPromo/DataCal",
        //data: paramData,
        success: function (response) {
            dataCmb = null;
            dataCmb = JSON.parse(response);
            if (!dataCmb.is_ok) {
                $("#cmbCalType").empty();
            }
            else {
                $("#cmbCalType").empty();
                $.each(dataCmb.data, function () {
                    $("#cmbCalType").append($("<option></option>").val(this['MsCalTypeId']).html(this['MsCalTypeId'] + " - " + this['MsCalTypeName']));
                });

                $("#cmbCalType").select2({
                    placeholder: "Select one Cal Type",
                    tags: true,
                    multiple: false,
                    theme: 'bootstrap4'
                });
            }
        }
    });
}

function loadArticle() {
    paramData = {
        compCode: $('#txtCompCode').val()
    }

    $.ajax({
        type: "POST",
        url: "/SlipPromo/DataArticlePIM",
        data: paramData,
        //async: false,
        success: function (response) {
            dataCmb = null;
            dataCmb = JSON.parse(response);
            dataArticlePIM = dataCmb.data;
            if (!dataCmb.is_ok) {
                $("#cmbArticle").empty();
                $("#cmbArticleGet").empty();
            }
            else {
                $("#cmbArticle").empty();
                $("#cmbArticleGet").empty();
                $.each(dataCmb.data, function () {
                    $("#cmbArticle").append($("<option></option>").val(this['sap_article']).html(this['sap_article']));
                });

                $("#cmbArticle").select2({
                    placeholder: "Select one Article",
                    tags: true,
                    multiple: false,
                    theme: 'bootstrap4'
                });

                $("#cmbArticleGet").select2({
                    placeholder: "Select one Article Get",
                    tags: true,
                    multiple: false,
                    theme: 'bootstrap4'
                });

                $.each(dataCmb.data, function () {
                    $("#cmbArticleGet").append($("<option></option>").val(this['sap_article']).html(this['sap_article']));
                });



            }
        }
    });
}

function loadPartnership() {
    $.ajax({
        type: "POST",
        url: "/SlipPromo/DataPartnership",
        //data: paramData,
        //async: false,
        success: function (response) {
            if (!response.is_ok) {
                $("#cmmPartnership").empty();
            }
            else {
                $("#cmmPartnership").empty();
                dataPartnership = response.data;
                $.each(response.data, function () {
                    $("#cmmPartnership").append($("<option></option>").val(this['code']).html(this['name']));
                });

                //$("#cmmPartnership").select2({
                //    placeholder: "Select multiple Partnership",
                //    tags: true,
                //    multiple: true,
                //    theme: 'bootstrap4'
                //});

                Select2MultipleCheckboxInit('cmmPartnership');
            }
        }
    });
}

function loadPromoByZone() {
    $.ajax({
        type: "POST",
        url: "/SlipPromo/DataPromoByZone",
        //data: paramData,
        //async: false,
        success: function (response) {
            if (!response.is_ok) {
                $("#cmmPromoByZone").empty();
            }
            else {
                $("#cmmPromoByZone").empty();
                dataPromoByZone = response.data;
                $.each(response.data, function () {
                    $("#cmmPromoByZone").append($("<option></option>").val(this['par1']).html(this['par1'] + ' - ' + this['value']));
                });

                $("#cmmPromoByZone").select2({
                    placeholder: "Select multiple Promo By Zone",
                    tags: true,
                    multiple: true,
                    theme: 'bootstrap4'
                });
            }
        }
    });
}

function openFormDetail() {
    var respValidation = formHeaderValidation();
    if (respValidation != "") {
        toastr.error(respValidation);
        //scrollToObject('#formHeaderSlipPromo');
        return;
    }
    var text = new NumericInput(document.getElementById('txtSupportValueInc', 'en-US'));
    $("#formDetailSlipPromo").css("display", "block");
    $('#loadingPanel').css('display', 'block');
    //scrollToObject("#formDetailSlipPromo");

    $('#txttrNontradingTermDId').val("");
    $("#cmbArticle").val('').trigger('change');
    $("#cmbArticleGet").val('').trigger('change');
    $('#txtFVendorCode').val($('#txtVendorCode').val());
    $('#txtFVendorName').val($('#txtVendorName').val());

    $('#loadingPanel').css('display', 'none');
}

function closeFormDetail() {
    $("#formDetailSlipPromo").css("display", "none");
    //scrollToObject("#ListDetailSlipPromo");
    resetFormDetail();
}

function submitDetail() {
    var respValidation = formDetailValidation();
    if (respValidation != "") {
        toastr.error(respValidation);
        //scrollToObject('#formDetailSlipPromo');
        return;
    }

    var dataPromoByZoneArray = $('#cmmPromoByZone').val();
    var dataPromoByZoneName = "";
    for (var i = 0; i < dataPromoByZoneArray.length; i++) {
        $.each(dataPromoByZone, function () {
            if (this['par1'] == dataPromoByZoneArray[i]) {
                dataPromoByZoneName += this['par1'] + " - " + this['value'];
            }
            if (i < (dataPromoByZoneArray.length - 1)) {
                dataPromoByZoneName += " | ";
            }
        });
    }

    var dataPartnershipArray = $('#cmmPartnership').val();
    var dataPartnershipName = "";
    for (var i = 0; i < dataPartnershipArray.length; i++) {
        
        //$.each(dataArrayPartenerCode(myFunction) {
        //    //if (this['code'] == dataPartnershipArray[i]) {
        //    //    dataPartnershipName += this['code'] + " - " + this['name'];
        //    //}
            
        //});
        dataArrayPartenerCode.forEach(myFunction)

        function myFunction(item) {
            if (item.code == dataPartnershipArray[i]) {
                dataPartnershipName += item.code + " - " + item.name;
                if (i < (dataPartnershipArray.length - 1)) {
                    dataPartnershipName += " | ";
                }
            }
            
        }
        
    }
   

    idTempDetail++;
    var dataValue = {
        trNontradingTermDId: ($('#txttrNontradingTermDId').val() == "") ? ("TEMP" + idTempDetail) : ($('#txttrNontradingTermDId').val()),
        VendorCode: $('#txtFVendorCode').val(),
        VendorName: $('#txtFVendorName').val(),
        Article: $('#cmbArticle').val(),
        ArticleDescription: $('#txtArticleDesc').val(),
        ArticleGet: $('#cmbArticleGet').val(),
        ArticleGetDescription: $('#txtArticleGetDesc').val(),
        PromoType: $('#txtPromoType').val(),
        PromoQty: $('#txtPromoQty').val(),
        MaxQty: $('#txtMaxQty').val(),
        HargaJualNormal: $('#txtHargaJualNormal').val(),
        HargaJualPromo: $('#txtHargaJualPromo').val(),
        PromoByZone: dataPromoByZoneName,
        SupportValue: $('#txtSupportValue').val(),//parseFloat(cells[1].innerHTML.replace(/,/g, ''))
        SupportValueInc: ($('#txtSupportValueInc').val()).replace(/,/g, ''),
        SupportValueExc: ($('#txtSupportValueExc').val()).replace(/,/g, ''),
        PromoSupported: $('#cmbPromoSupported').val(),
        Partnership: dataPartnershipName,
        UserLogin: $("#txtUserNameLogin").html()
    };

    var dataTable = [];
    dataTable.push(dataValue);
    if (dataTable != null) {

        if ($('#txttrNontradingTermDId').val() != "")
            deleteDetail($('#txttrNontradingTermDId').val());

        $("#tblItemDetail tbody").append(
            $(
                "<tr>" +
                "<td style='text-align: center;display:none;'>" + dataValue.trNontradingTermDId + "</td>" +
                "<td style='text-align: center;'>" +
                "<a href='javascript:void(0);' class='btn btn-sm btn-info' id='btnEdit' onclick=editDetail(this); data-toggle='tooltip' data-placement='to' title='Update Data'><em class='fa fa-edit'></em></a>" +
                "<a href='javascript:void(0);' class='btn btn-sm btn-danger' id='btnDelete' onclick=deleteDetail('" + dataValue.trNontradingTermDId + "'); data-toggle='tooltip' data-placement='to' title='Delete Data'><em class='fa fa-trash'></em></a>" +
                "</td>" +
                "<td class='DataTable-MidWidth' style='text-align: center;'>" + dataValue.Article + "</td>" +
                "<td class='DataTable-MidWidth' style='text-align: center;'>" + dataValue.ArticleDescription + "</td>" +
                "<td class='DataTable-MidWidth' style='text-align: center;'>" + dataValue.ArticleGet + "</td>" +
                "<td class='DataTable-MidWidth' style='text-align: center;'>" + dataValue.ArticleGetDescription + "</td>" +
                "<td class='DataTable-MidWidth' style='text-align: center;'>" + dataValue.PromoType + "</td>" +
                "<td class='DataTable-MidWidth' style='text-align: center;'>" + dataValue.VendorCode + "</td>" +
                "<td class='DataTable-Mid2Width' style='text-align: center;'>" + dataValue.VendorName + "</td>" +
                "<td class='DataTable-MidWidth' style='text-align: center;'>" + dataValue.PromoQty + "</td>" +
                "<td class='DataTable-MidWidth' style='text-align: center;'>" + dataValue.MaxQty + "</td>" +
                "<td class='DataTable-Mid2Width' style='text-align: center;'>" + Number(dataValue.HargaJualNormal).toLocaleString() + "</td>" +
                "<td class='DataTable-Mid2Width' style='text-align: center;'>" + Number(dataValue.HargaJualPromo).toLocaleString() + "</td>" +
                "<td class='DataTable-MidWidth' style='text-align: center;'>" + dataValue.PromoByZone + "</td>" +
                "<td class='DataTable-Mid2Width' style='text-align: center;'>" + dataValue.SupportValue + "</td>" +
                "<td class='DataTable-Mid2Width' style='text-align: center;'>" + Number(dataValue.SupportValueInc).toLocaleString() + "</td>" +
                "<td class='DataTable-Mid2Width' style='text-align: center;'>" + Number(dataValue.SupportValueExc).toLocaleString() + "</td>" +
                "<td class='DataTable-Mid2Width' style='text-align: center;'>" + dataValue.PromoSupported + "</td>" +
                "<td class='DataTable-Mid2Width' style='text-align: center;'>" + dataValue.Partnership + "</td>" +
                "<td class='DataTable-MaxWidth' style='text-align: center;'>" + dataValue.UserLogin + "</td>" +
                "</tr>"
            ));

        oldValueDetails.push({
            trNontradingTermDId: dataValue.trNontradingTermDId,
            VendorCode: dataValue.VendorCode,
            VendorName: dataValue.VendorName,
            Article: dataValue.Article,
            ArticleDescription: dataValue.ArticleDescription,
            ArticleGet: dataValue.ArticleGet,
            ArticleGetDescription: dataValue.ArticleGetDescription,
            PromoType: dataValue.PromoType,
            PromoQty: dataValue.PromoQty,
            MaxQty: dataValue.MaxQty,
            HargaJualNormal: dataValue.HargaJualNormal,
            HargaJualPromo: dataValue.HargaJualPromo,
            PromoByZone: dataValue.PromoByZone,
            SupportValue: dataValue.SupportValue,
            SupportValueInc: dataValue.SupportValueInc,
            SupportValueExc: dataValue.SupportValueExc,
            PromoSupported: dataValue.PromoSupported,
            Partnership: dataValue.Partnership
        })
        dataArrayPartenerCode = [];
        partnerArray  = [];
        $("#cmmPartnership").empty();
        $("#cmmPartnership").val('').trigger('change');
        
        closeFormDetail();
        //scrollToObject("#ListDetailSlipPromo");
    }
}

function editDetail(obj) {
    openFormDetail();

    var columnValue = $(obj).closest('tr').find('td');

    $('#txttrNontradingTermDId').val($(columnValue[0]).text());
    $('#cmbArticle').val($(columnValue[2]).text()).change();
    $('#cmbArticleGet').val($(columnValue[4]).text()).change();
    $('#txtPromoType').val($(columnValue[6]).text());
    $('#txtFVendorCode').val($(columnValue[7]).text());
    $('#txtFVendorName').val($(columnValue[8]).text());
    $('#txtPromoQty').val($(columnValue[9]).text());
    $('#txtMaxQty').val($(columnValue[10]).text());
    $('#txtHargaJualNormal').val($(columnValue[11]).text());
    $('#txtHargaJualPromo').val($(columnValue[12]).text());
    //$('#txtPromoByZone').val($(columnValue[10]).text());
    $('#txtSupportValue').val($(columnValue[14]).text());
    $('#txtSupportValueInc').val($(columnValue[15]).text());
    $('#txtSupportValueExc').val($(columnValue[16]).text());
    $('#cmbPromoSupported').val($(columnValue[17]).text());

    //Promo By Zone
    var promoByZoneArray = ($(columnValue[13]).text() == null || $(columnValue[13]).text() == "") ? null : $(columnValue[13]).text().split(" | ");
    var promoByZoneCodeArray = [];
    if (promoByZoneArray != null) {
        for (i = 0; i < promoByZoneArray.length; i++) {
            var code = promoByZoneArray[i].split(" - ");
            if (code[0] != "")
                promoByZoneCodeArray.push(code[0]);
        }
    }

    $('#cmmPromoByZone').val(promoByZoneCodeArray).change();

    //Partnership detail
    var partnershipArray = ($(columnValue[18]).text() == null || $(columnValue[18]).text() == "") ? null : $(columnValue[18]).text().split(" | ");
    var promoPartnershipArray = [];
    if (partnershipArray != null) {
        for (i = 0; i < partnershipArray.length; i++) {
            var code = partnershipArray[i].split(" - ");
            if (code[0] != "")
                promoPartnershipArray.push(code[0]);
        }
    }

    $('#cmmPartnership').val(promoPartnershipArray).change();

}

function deleteDetail(id) {
    //var columnValue = $(obj).closest('tr').find('td');


    var table = document.getElementById('tblItemDetail');

    var dataChar = {
        //trNontradingTermDId: $(obj).attr('id'),
        trNontradingTermDId: id
    };

    //if ($(columnValue[2]).text() == "OLD") {
    //    idTemplateDetailDelete += $(columnValue[0]).text() + ",";
    //}

    if (oldValueDetails.length > 0) {
        for (var i = 0; i < oldValueDetails.length; i++) {
            //cari tau index row keberapa
            //if (oldValueDetails[i].trNontradingTermDId > 0) {
            //    dataChar.trNontradingTermDId = $(columnValue[3]).text();
            //}

            if (oldValueDetails[i].trNontradingTermDId == dataChar.trNontradingTermDId) {
                //if (oldValueDetails[i].idTemplateDetail > 0) {
                //    detailDelete.push({ msCharacteristicValueIdList: +oldValueDetails[i].idTemplateDetail });
                //}
                index = i + 1;
                oldValueDetails.splice(index - 1, 1);
                table.deleteRow(index);
            }
        }
    }
}

function loadDataDetail() {
    
    var TempId = $('#txtSPIdEncrypt').val();

    if (TempId.includes("-")) {
        TempId = (TempId.split("-"))[0];
        frmTask = true;
    }
    //console.log(TempId);
    $('#dvDownload').hide();
    if (TempId != "" && TempId != 0 && TempId != "0") {
        $("#loadingPanel").css("display", "block");
        paramData = {
            trNonTradingTermIdEncrypted: TempId
        }

        AppCodeSlipPromo = "";
        oldValueDetails = [];
        $.ajax({
            type: "POST",
            url: "/SlipPromo/DataSlipPromoById",
            data: paramData,
            //async: false,
            success: function (response) {
                //console.log(response)
                var datasres = JSON.parse(response);
                if (!datasres.is_ok) {
                    toastr.error(respSaveValidation);
                }
                else {
                    //console.log(datasres.data);
                    var trHTML = '';
                    $('#actDetailBtn').hide();
                    //console.log(datasres)
                    //setup form header
                    $('#txtSPId').val(datasres.data.trNonTradingTermId);
                    $('#txtCompCode').val(datasres.data.bu);
                    $('#txtCompName').val(datasres.data.buName);
                    $('#txtComp').val(datasres.data.bu + " - " + datasres.data.buName);

                    loadArticle();

                    $('#txtVendorCode').val(datasres.data.vendorCode);
                    $('#txtVendorName').val(datasres.data.vendorName);
                    $('#txtVendor').val(datasres.data.vendorCode + " - " + datasres.data.vendorName);

                    //$('#cmbDept').val(datasres.data.deptCode).trigger('change');;
                    loadDept(true, datasres.data.deptCode);

                    $('#ValidFrom').val(moment(datasres.data.validFrom).format('YYYY-MM-DD'));
                    $('#ValidTo').val(moment(datasres.data.validTo).format('YYYY-MM-DD'));
                    $('#txtPromoDescr').val(datasres.data.promoDesc);
                    $('#txtPromoCode').val(datasres.data.promoCode);

                    //sitePromo
                    loadSite();
                    var siteArray = (datasres.data.sitePromo == null || datasres.data.sitePromo == "") ? null : datasres.data.sitePromo.replace(" ", "").split(",");
                    siteArray = (siteArray == null) ? null : siteArray.slice(0, -1);
                    $('#cmmSitePromo').val(siteArray).change();

                    //rollback caltypeid by salis
                    $('#cmbCalType').val(datasres.data.calTypeId).trigger('change');

                    ftpUrl = "";
                    isAtchChanged = false;
                    if (datasres.data.attachment == null || datasres.data.attachment == "") {
                        $('#dvDownload').hide();
                    }
                    else {
                        ftpUrl = datasres.data.attachment;
                        var fileName = ftpUrl.split("/");
                        //console.log(fileName);
                        $('#txtAttachment').html(fileName[9]);
                        $('#dvDownload').show();
                    }


                    $('#txtSlipPromo').val(datasres.data.slipPromo);
                    $('#txtSPId').val(datasres.data.trNonTradingTermId);

                    AppCodeSlipPromo = datasres.data.seq;

                    //$('#txtMenuId').val(datasres.dataHeader.ms_menu_id);
                    //$('#txtMenuDescr').val(datasres.dataHeader.menuDesc);
                    //$('#txtMenu').val(datasres.dataHeader.menuId + " - " + datasres.dataHeader.menuDesc);
                    oldValueDetails = [];

                    $.each(datasres.data.non_tt_detail, function (i, dataValue) {
                        //add by salis
                        //issue log no 353
                        var promoZoneCodes = "";
                        if (dataValue.promoZone != null && dataValue.promoZoneDesc != null) {
                            //promoZoneCodes = dataValue.promoZone + " - " + dataValue.promoZoneDesc;
                            var promozone = dataValue.promoZone.includes(",");
                            if (promozone == true) {
                                promozone = dataValue.promoZone.split(",");
                                var promoDesc = dataValue.promoZoneDesc.split(",");
                                for (var i = 0; i < promozone.length; i++) {
                                    promoZoneCodes += promozone[i] + " - " + promoDesc[i];

                                    if (i < (promozone.length - 1)) {
                                        promoZoneCodes += "|";
                                    }

                                }
                            }
                            else {
                                promoZoneCodes = dataValue.promoZone + " - " + dataValue.promoZoneDesc;
                            }

                        }
                        var supportByValues = ((dataValue.supportByValue == "" || dataValue.supportByValue == null) ? dataValue.supportByValue : dataValue.supportByValue.replace(/,/g, ''));
                        //
                        trHTML +=
                            "<tr>" +
                            "<td style='text-align: center;display:none;'>" + dataValue.trNontradingTermDId + "</td>" +
                            "<td style='text-align: center;display:none;'>" +
                            "<a href='javascript:void(0);' class='btn btn-sm btn-info' onclick=editDetail(this); ><em class='fa fa-edit'></em></a>" +
                            "<a href='javascript:void(0);' class='btn btn-sm btn-danger' onclick=deleteDetail('" + dataValue.trNontradingTermDId + "'); ><em class='fa fa-trash'></em></a>" +
                            "</td>" +
                            "<td style='text-align: center;' class='DataTable-MidWidth'>" + ((dataValue.article == null) ? "" : dataValue.article) + "</td>" +
                            "<td style='text-align: center;' class='DataTable-MidWidth'>" + ((dataValue.articleDesc == null) ? "" : dataValue.articleDesc) + "</td>" +
                            "<td style='text-align: center;' class='DataTable-MidWidth'>" + ((dataValue.articleGet == null) ? "" : dataValue.articleGet) + "</td>" +
                            "<td style='text-align: center;' class='DataTable-MidWidth'>" + ((dataValue.articleGetDesc == null) ? "" : dataValue.articleGetDesc) + "</td>" +
                            "<td style='text-align: center;' class='DataTable-MidWidth'>" + ((dataValue.promoType == null) ? "" : dataValue.promoType) + "</td>" +
                            "<td class='DataTable-MidWidth'style='text-align: center;'>" + ((datasres.data.vendorCode == null) ? "" : datasres.data.vendorCode) + "</td>" +
                            "<td class='DataTable-Mid2Width'style='text-align: center;'>" + ((datasres.data.vendorName == null) ? "" : datasres.data.vendorName) + "</td>" +
                            "<td class='DataTable-MidWidth'style='text-align: center;'>" + ((dataValue.promoQty == null) ? "" : dataValue.promoQty) + "</td>" +
                            "<td class='DataTable-MidWidth'style='text-align: center;'>" + ((dataValue.maxQty == null) ? "" : dataValue.maxQty) + "</td>" +
                            "<td class='DataTable-Mid2Width'style='text-align: center;'>" + ((dataValue.hargaJualNormal == null) ? "" : dataValue.hargaJualNormal) + "</td>" +
                            "<td class='DataTable-Mid2Width'style='text-align: center;'>" + ((dataValue.hargaJualPromo == null) ? "" : dataValue.hargaJualPromo) + "</td>" +
                            //"<td class='DataTable-MidWidth'style='text-align: center;'>" + ((dataValue.promoZone == null) ? "" : dataValue.promoZone) + "</td>" +
                            "<td class='DataTable-MidWidth'style='text-align: center;'>" + ((promoZoneCodes == null) ? "" : promoZoneCodes) + "</td>" +
                            "<td class='DataTable-Mid2Width'style='text-align: center;'>" + ((dataValue.supportPercg == null) ? "" : dataValue.supportPercg) + "</td>" +
                            "<td class='DataTable-Mid2Width'style='text-align: center;'>" + ((dataValue.supportByValue == null) ? "" : Number(dataValue.supportByValue).toLocaleString()) + "</td>" +
                            "<td class='DataTable-Mid2Width'style='text-align: center;'>" + ((dataValue.supportByValue == null) ? "" : Number(Math.round((parseFloat(supportByValues) / 1.11))).toLocaleString()) + "</td>" +
                            "<td class='DataTable-Mid2Width'style='text-align: center;'>" + ((dataValue.promoBy == null) ? "" : dataValue.promoBy) + "</td>" +
                            "<td class='DataTable-Mid2Width'style='text-align: center;'>" + ((dataValue.partnerShip == null) ? "" : dataValue.partnerShip) + "</td>" +
                            "<td class='DataTable-MaxWidth'style='text-align: center;'>" + ((datasres.data.createdBy == null) ? "" : datasres.data.createdBy) + "</td>" +

                            "</tr>";
                        oldValueDetails.push({
                            trNontradingTermDId: dataValue.trNontradingTermDId,
                            VendorCode: datasres.data.vendor,
                            VendorName: datasres.data.vendorName,
                            Article: dataValue.article,
                            ArticleDescription: dataValue.articleDesc,
                            ArticleGet: dataValue.articleGet,
                            ArticleGetDescription: dataValue.articleGetDesc,
                            PromoType: dataValue.promoType,
                            PromoQty: dataValue.promoQty,
                            MaxQty: dataValue.maxQty,
                            HargaJualNormal: dataValue.hargaJualNormal,
                            HargaJualPromo: dataValue.hargaJualPromo,
                            PromoByZone: dataValue.promoByZone,
                            SupportValue: dataValue.supportValue,
                            SupportValueInc: dataValue.supportValueInc,
                            SupportValueExc: dataValue.supportValueExc,
                            PromoSupported: dataValue.promoBy,
                            Partnership: dataValue.partnership
                        });

                    });

                    $('#tblItemDetail tbody').append(trHTML);
                    loadWorkflow($('#txtCompCode').val());
                }
                $('#loadingPanel').css('display', 'none');
            },
            error: function (response) {
                $('#loadingPanel').css('display', 'none');
            }
        });
    }
    else {
        loadDept(false, "");
    }
}

function formHeaderValidation() {
    var selectedDept = $('#cmbDept').val();
    if ($('#txtCompCode').val() == "" || $('#txtCompName').val() == "" || $('#txtComp').val() == "") {
        return "Bu must be filled";
    }
    else if ($('#txtVendorCode').val() == "" || $('#txtVendorName').val() == "" || $('#txtVendor').val() == "") {
        return "Vendor must be filled";
    }
    else if ($('#cmbDept').val() == "") {
        return "Dept must be filled";
    }
    else if ($('#ValidFrom').val() == "") {
        return "Valid From must be filled";
    }
    else if ($('#ValidTo').val() == "") {
        return "Valid To must be filled";
    }
    else if ($('#txtPromoDescr').val() == "") {
        return "Promo Descr must be filled";
    }
    else if ($('#cmbCalType').val() == "") {
        return "Cal Type must be filled";
    }
    else if (($('#cmbDept').val() != null || $('#cmbDept').val() != "") && selectedDept.length > 0 && selectedDept > 10) {
        return "Department cannot be more than 10.";
    }
    else {
        return "";
    }
}

function formDetailValidation() {
    var table = document.getElementById('tblItemDetail'), rows = table.getElementsByTagName('tr'), cells;
    if ($('#txtFVendorCode').val() == "" || $('#txtFVendorName').val() == "") {
        return "Vendor must be filled"
    }
    else if ($('#cmbArticle').val() == "" || $('#cmbArticle').val() == null) {
        return "Article must be filled"
    }
    else if ($('#cmmSitePromo').val() == "" && ($('#cmmPromoByZone').val() == "" || $('#cmmPromoByZone').val() == null)) {
        return "Promo by Zone must be filled";
    }
    else if ($('#cmmSitePromo').val() != "" && $('#cmmPromoByZone').val() != "") {
        return "Promo by Zone must not be filled While Header: Site Promo is not empty";
    }
    else if ($('#txtSupportValue').val() == "" && $('#txtSupportValueInc').val() == "") {
        return "Support % Value OR Support Value Inc must be filled"
    }
    else if (($('#cmmPartnership').val() == "" || $('#cmmPartnership').val() == null) && $('#cmbPromoSupported').val() == "Partnership") {
        return "Partnership is selected in Promo Supported By, Partnership detail must be filled"
    }
    else if (rows.length > 1) {
        for (var i = 0, j = rows.length; i < j; ++i) {
            cells = rows[i].getElementsByTagName('td');
            if (!cells.length) {
                return "";
                continue;
            }
            if (cells[2].innerHTML == $('#cmbArticle').val()) {
                return "The article is selected on data detail, please choose other article"
            }
        }
    }
    else {
        return "";
    }
}

function formSaveValidation() {
    var table = document.getElementById('tblItemDetail'),
        rows = table.getElementsByTagName('tr');

    if (rows.length <= 1)
        return "Slip Promo at least has one Item Detail.";
    else {
        if (actionButton == "Reject") {
            if ($("#txtReasonId").val() == "")
                return "Reason must be filled.";
            else if ($("#txtRemark").val() == "")
                return "Remark must be filled.";
            else
                return "";
        }
        else {
            return "";
        }
    }
}

function saveData(pType) {
    //generate datadetail
    $('#loadingPanel').css('display', 'block');
    actionButton = pType;

    var respSaveValidation = formSaveValidation();
    if (respSaveValidation != "") {
        toastr.error(respSaveValidation);
        $('#loadingPanel').css('display', 'none');
        return;
    }

    var table = document.getElementById('tblItemDetail'),
        rows = table.getElementsByTagName('tr'),
        cells;

    var dtDetail = [];

    for (var i = 0, j = rows.length; i < j; ++i) {
        cells = rows[i].getElementsByTagName('td');
        if (!cells.length) {
            continue;
        }

        var dtItem = {};
        //add by salis ,split promo zone & promo zone description
        var promoZones = "", pzCode = "", pzDesc = "";

        if ($("#btnSubmit").css('display').toLowerCase() == 'block') {

            //add by salis ,split promo zone & promo zone description
            if (cells[13].innerHTML != "") {
                promoZones = (cells[13].innerHTML).includes("|");
                if (promoZones == true) {
                    promoZones = (cells[13].innerHTML);
                    promoZones = promoZones.split("|");
                    if ((promoZones.length) > 1) {
                        for (var y = 0; y < (promoZones.length); y++) {
                            var promoSplit = promoZones[y].split("-");
                            pzCode += promoSplit[0].replace(" ", "");
                            pzDesc += promoSplit[1].replace(" ", "");
                            if (y < (promoZones.length - 1)) {
                                pzCode += ",";
                                pzDesc += ",";
                            }
                        }
                    }
                    else {
                        var promoSplit = promoZones.split("-");
                        pzCode += promoSplit[0].replace(" ", "");
                        pzDesc += promoSplit[1].replace(" ", "");
                    }
                }
                else {
                    promoZones = (cells[13].innerHTML);
                    if (promoZones != "") {
                        var promoSplit = promoZones.split("-");
                        pzCode += promoSplit[0].replace(" ", "");
                        pzDesc += promoSplit[1].replace(" ", "");
                    }
                }
            }
            //
            var supportValues = cells[15].innerHTML.includes(",");
            if (supportValues == true) {
                supportValues = cells[15].innerHTML.replace(/,/g, '');
            }
            else {
                supportValues = cells[15].innerHTML;
            }
            dtItem = {
                trNontradingTermDId: (~cells[0].innerHTML.indexOf("TEMP")) ? null : cells[0].innerHTML,
                article: cells[2].innerHTML,
                articleDesc: cells[3].innerHTML,
                articleGet: cells[4].innerHTML,
                articleGetDesc: cells[5].innerHTML,
                promoType: cells[6].innerHTML,
                promoQty: cells[9].innerHTML,
                maxQty: cells[10].innerHTML,
                hargaJualNormal: cells[11].innerHTML,
                hargaJualPromo: cells[12].innerHTML,
                //promoZone: cells[10].innerHTML,
                promoZone: pzCode,
                promoZoneDesc: pzDesc,
                supportPercg: cells[14].innerHTML,
                supportByValue: supportValues,
                promoBy: cells[17].innerHTML,
                partnerShip: cells[18].innerHTML
                //promoType: cells[3].innerHTML,
                //promoQty: cells[6].innerHTML,
                //maxQty: cells[7].innerHTML,
                //hargaJualNormal: cells[8].innerHTML,
                //hargaJualPromo: cells[9].innerHTML,
                ////promoZone: cells[10].innerHTML,
                //promoZone: pzCode,
                //promoZoneDesc: pzDesc,
                //supportPercg: cells[11].innerHTML,
                //supportByValue: cells[12].innerHTML,
                //promoBy: cells[14].innerHTML,
                //partnerShip: cells[15].innerHTML
            };
        }
        else {
            //add by salis ,split promo zone & promo zone description
            if (cells[13].innerHTML != "") {
                promoZones = (cells[13].innerHTML).includes("|");
                if (promoZones == true) {
                    promoZones = (cells[13].innerHTML);
                    promoZones = promoZones.split("|");
                    if ((promoZones.length) > 1) {
                        for (var y = 0; y < promoZones.length; y++) {
                            var promoSplit = promoZones[y].split("-");
                            pzCode += promoSplit[0].replace(" ", "");
                            pzDesc += promoSplit[1].replace(" ", "");
                            if (y < (promoZones.length - 1)) {
                                pzCode += ",";
                                pzDesc += ",";
                            }
                        }
                    }
                    else {
                        var promoSplit = promoZones.split("-");
                        pzCode += promoSplit[0].replace(" ", "");
                        pzDesc += promoSplit[1].replace(" ", "");
                    }
                }
                else {
                    promoZones = (cells[13].innerHTML);
                    if (promoZones != "") {
                        var promoSplit = promoZones.split("-");
                        pzCode += promoSplit[0].replace(" ", "");
                        pzDesc += promoSplit[1].replace(" ", "");
                    }
                }
            }
            //
            var supportValues = cells[15].innerHTML.includes(",");
            if (supportValues == true) {
                supportValues = cells[15].innerHTML.replace(/,/g, '');
            }
            else {
                supportValues = cells[15].innerHTML;
            }

            dtItem = {
                trNontradingTermDId: (~cells[0].innerHTML.indexOf("TEMP")) ? null : cells[0].innerHTML,
                article: cells[2].innerHTML,
                articleDesc: cells[3].innerHTML,
                articleGet: cells[4].innerHTML,
                articleGetDesc: cells[5].innerHTML,
                promoType: cells[6].innerHTML,
                promoQty: cells[9].innerHTML,
                maxQty: cells[10].innerHTML,
                hargaJualNormal: cells[11].innerHTML,
                hargaJualPromo: cells[12].innerHTML,
                promoZone: pzCode,
                promoZoneDesc: pzDesc,
                supportPercg: cells[14].innerHTML,
                supportByValue: supportValues,
                promoBy: cells[17].innerHTML,
                partnerShip: cells[18].innerHTML
                //promoType: cells[2].innerHTML,
                //promoQty: cells[5].innerHTML,
                //maxQty: cells[6].innerHTML,
                //hargaJualNormal: cells[7].innerHTML,
                //hargaJualPromo: cells[8].innerHTML,
                ////promoZone: cells[9].innerHTML,
                //promoZone: pzCode,
                //promoZoneDesc: pzDesc,
                //supportPercg: cells[10].innerHTML,
                //supportByValue: cells[11].innerHTML,
                //promoBy: cells[13].innerHTML,
                //partnerShip: cells[14].innerHTML
            };
        }



        if ($('#txtSPId').val() == "" || $('#txtSPId').val() == "0") {
            //new data
            delete dtItem[Object.keys(dtItem)[0]];
        }

        dtDetail.push(dtItem);
    }

    //generate header trNonTradingTermId:
    var dataSiteArray = $('#cmmSitePromo').val();
    var dataSite = "";
    for (var i = 0; i < dataSiteArray.length; i++) {
        dataSite += dataSiteArray[i] + ",";
    }
    var departments = $('#cmbDept').val().split("-");

    var dtSP = {
        trNonTradingTermId: $('#txtSPId').val(),
        bu: $('#txtCompCode').val(),
        vendorCode: $('#txtVendorCode').val(),
        vendorName: $('#txtVendorName').val(),
        deptCode: departments[1],
        validFrom: $('#ValidFrom').val(),
        validTo: $('#ValidTo').val(),
        promoDesc: $('#txtPromoDescr').val(),
        promoCode: $('#txtPromoCode').val(),
        siteCode: dataSite,
        calType: $('#cmbCalType').val(),
        attachment: (isAtchChanged) ? $('#txtAttachment').html() : ftpUrl,
        reasonId: ($("#txtReasonId").val() == "" || $("#txtReasonId").val() == "0") ? null : $("#txtReasonId").val(),
        remark: $('#txtRemark').val(),
        status: 1,
        seq: "1",
        detail: dtDetail
    }

    var dataNew = {};
    var dataUpdate = {};

    if ($('#txtSPId').val() == "" || $('#txtSPId').val() == "0") {
        //new data
        delete dtSP[Object.keys(dtSP)[0]];
        dataNew = dtSP;
        dataUpdate = null
    }
    else {
        dataNew = null;
        dataUpdate = dtSP;
    }

    var dataSPSave = {
        actionButton: pType,
        bu: $('#txtCompCode').val(),
        dataDetailNew: dataNew,
        dataDetailUpdate: dataUpdate
    }
    //console.log(dataSPSave);

    $.ajax({
        type: "POST",
        data: { 'obj': JSON.stringify(dataSPSave) },
        url: "/SlipPromo/DataSave",
        success: function (response) {
            $('#loadingPanel').css('display', 'none');
            var datares = JSON.parse(response);
            if (!datares.is_ok) {
                //error
                toastr.error(datares.message);
            }
            else {
                toastr.success(datares.message + ": Form will be closed in 5sec");
                if (pType != "Draft") {
                    initButtonAction();
                }

                setTimeout(function () {
                    if (frmTask) {
                        window.location.href = "/MyTask/MyTask";
                    }
                    else {
                        window.top.close();
                    }
                }, 5000);
            }
        },
        error: function (response) {
            $('#loadingPanel').css('display', 'none');
        }

    });
}

function uploadFileTemp(pType) {
    var uploadfile = null;
    //var uploadfile = $('#FileAttachment');
    var files = null;
    var filedata = new FormData();
    var isValid = false;

    if (pType == "Header") {
        uploadfile = document.getElementById("FileAttachment");
        files = uploadfile.files;
        for (var i = 0; i < files.length; i++) {
            if (files[i].size > 2097152) {
                $('#txtAttachment').html("");
                $('#txtAttachment').val("");
                $('#FileAttachment').val("");
                toastr.error("File Attachment Size must be under 2MB (2 MegaByte)");
                return;
            }
            else {
                filedata.append("atc", files[i]);
                isValid = true;
            }
        }
    }
    else {
        uploadfile = document.getElementById("FileAttachmentDetail");
        files = uploadfile.files;
        filedata.append("atc", files[0]);
        isValid = true;
    }

    if (isValid) {
        $.ajax({
            type: "post",
            url: "/SlipPromo/DataUpload",
            data: filedata,
            processData: false,
            contentType: false,
            success: function (response) {
                if (response != "OK") {
                    //error
                    toastr.error(datares.message);
                }
                else {
                    toastr.success("File Uploaded");
                    if (pType == "Header") {
                        isAtchChanged = true;
                        $('#dvDownload').hide();
                    }
                }
            }
        });
    }
}

function DisableEnableForm(param) {
    $('#txttrNontradingTermDId').prop('disabled', param);
    $('txtSlipPromo').prop('disabled', param);
    $('#txtVendorCode').prop('disabled', param);
    $('#txtVendorName').prop('disabled', param);
    $('#txtVendor').prop('disabled', param);
    $('#ValidFrom').prop('disabled', param);
    $('#ValidTo').prop('disabled', param);
    $('#txtCompCode').prop('disabled', param);
    $('#txtCompName').prop('disabled', param);
    $('#txtComp').prop('disabled', param);
    $('#txtPromoDescr').prop('disabled', param);
    $('#txtPromoCode').prop('disabled', param);
    $('#cmbDept').prop('disabled', param);
    $('#cmmSitePromo').prop('disabled', param);
    $('#cmbCalType').prop('disabled', param);
    $('#txtAttachment').prop('disabled', param);

    $('#dvBU').prop('disabled', param);


    $('#dvVendor').prop('disabled', param);
    $('#dvValidFrom').prop('disabled', param);
    $('#dvValidTo').prop('disabled', param);
    $('#FileAttachment').prop('disabled', param);

    if (param) {
        //$('#dvBU').prop('onclick', null);
        $('#dvBU').addClass("disabled");
        //$('#dvVendor').prop('onclick', null);
        $('#dvVendor').addClass("disabled");
        $('#dvValidFrom').addClass("disabled");
        $('#dvValidTo').addClass("disabled");
    }
    else {
        $('#dvBU').removeClass("disabled");
        $('#dvVendor').removeClass("disabled");
        $('#dvValidFrom').removeClass("disabled");
        $('#dvValidTo').removeClass("disabled");
    }

}

function downloadFile() {
    $('#loadingPanel').css('display', 'block');
    var paramData = {
        filePath: ftpUrl // compCode: CompCode
    };
    $.ajax({
        type: "POST",
        url: "/SlipPromo/DataDownload",
        data: paramData,
        //async: false,
        success: function (response) {
            dataFile = JSON.parse(response);

            if (!dataFile.is_ok) {
                toastr.error(dataFile.message);
            }
            else {
                $("#fileModal").modal("show");
                $('#iframe-doc').attr('src', dataFile.data.filePath);
            }
            $('#loadingPanel').css('display', 'none');
        },
        error: function (response) {
            $('#loadingPanel').css('display', 'none');
        }
    });

}

function downloadFormatExcel() {
    $('#loadingPanel').css('display', 'block');
    $.ajax({
        type: "POST",
        url: "/SlipPromo/downloadFormatExcel",
        //data: paramData,
        success: function (response) {
            if (!response.is_ok) {
                toastr.error(response.message);
                $('#loadingPanel').css('display', 'none');
            }
            else {
                var str = response.data.filePath;//FormatImportSlipPromo.xls
                window.open(str, '_blank');
                toastr.success(response.message);
                $('#loadingPanel').css('display', 'none');
            }
        }
    });
}

function confirmUploadExcel() {
    $('#btnimportExcl').attr('disabled', true);
    var table = document.getElementById('tblModalExcel'),
        rows = table.getElementsByTagName('tr'),
        cells;
    var tableOnAdd = document.getElementById('tblItemDetail'), rowsAdd = tableOnAdd.getElementsByTagName('tr'), cellsAdd;
    var dtDetail = [];

    for (var i = 0, j = rows.length; i < j; ++i) {
        cells = rows[i].getElementsByTagName('td');
        if (!cells.length) {
            continue;
        }

        if (cells[2].innerHTML != "") {
            if (rowsAdd.length > 1) {
                for (var k = 0, l = rowsAdd.length; k < l; ++l) {
                    cellsAdd = rowsAdd[i].getElementsByTagName('td');
                    if (!cellsAdd.length) {
                        continue;
                    }
                    if (cellsAdd[2].innerHTML == cells[2].innerHTML) {
                        isValid = false;
                        toastr.error("The article " + cells[2].innerHTML + " is selected on data detail, please choose other article");
                        break;
                    }
                }
            }
        }


        if (cells[0].innerHTML == "false") {
            toastr.error("Cannot Confirm Upload while there is still data error");
            isValid = false;
            break;
        }
        else {
            isValid = true;
        }
    }

    if (isValid) {
        var dataTable = [];
        for (var i = 0, j = rows.length; i < j; ++i) {
            cells = rows[i].getElementsByTagName('td');
            if (!cells.length) {
                continue;
            }

            idTempDetail++;
            var dataValue = {
                trNontradingTermDId: ("TEMPEXCEL" + idTempDetail),
                VendorCode: $('#txtVendorCode').val(),
                VendorName: $('#txtVendorName').val(),
                Article: cells[2].innerHTML,
                ArticleDescription: cells[3].innerHTML,
                ArticleGet: cells[4].innerHTML,
                ArticleGetDescription: cells[5].innerHTML,
                PromoType: cells[6].innerHTML,
                PromoQty: cells[7].innerHTML,
                MaxQty: cells[8].innerHTML,
                HargaJualNormal: cells[9].innerHTML,
                HargaJualPromo: cells[10].innerHTML,
                PromoByZone: cells[11].innerHTML,
                SupportValue: cells[12].innerHTML,
                SupportValueInc: cells[13].innerHTML,
                SupportValueExc: cells[14].innerHTML,
                PromoSupported: cells[15].innerHTML,
                PartnershipDetail: cells[16].innerHTML,
                UserLogin: $("#txtUserNameLogin").html()
            };


            dataTable.push(dataValue);
            if (dataTable != null) {

                oldValueDetails.push({
                    trNontradingTermDId: dataValue.trNontradingTermDId,
                    VendorCode: dataValue.VendorCode,
                    VendorName: dataValue.VendorName,
                    Article: dataValue.Article,
                    ArticleDescription: dataValue.ArticleDescription,
                    ArticleGet: dataValue.ArticleGet,
                    ArticleGetDescription: dataValue.ArticleGetDescription,
                    PromoType: dataValue.PromoType,
                    PromoQty: dataValue.PromoQty,
                    MaxQty: dataValue.MaxQty,
                    HargaJualNormal: dataValue.HargaJualNormal,
                    HargaJualPromo: dataValue.HargaJualPromo,
                    PromoByZone: dataValue.PromoByZone,
                    SupportValue: dataValue.SupportValue,
                    SupportValueInc: dataValue.SupportValueInc,
                    SupportValueExc: dataValue.SupportValueExc,
                    PromoSupported: dataValue.PromoSupported,
                    PartnershipDetail: dataValue.PartnershipDetail
                })
            }
        }

        setToTableDetail(dataTable);
        closeFormDetail();
    }
}

function setToTableDetail(ObjData) {
    TimerLoadSpinner();

    if (ObjData != "") {
        if (ObjData.length > 0) {
            $.each(ObjData, function () {
                $("#tblItemDetail tbody").append(
                    $(
                        "<tr>" +
                        "<td style='text-align: center;display:none;'>" + this['trNontradingTermDId'] + "</td>" +
                        "<td style='text-align: center;' class='text-nowrap'>" +
                        "<a href='javascript:void(0);' class='btn btn-sm btn-info' id='btnEdit' onclick=editDetail(this); data-toggle='tooltip' data-placement='to' title='Update Data'><em class='fa fa-edit'></em></a>" +
                        "<a href='javascript:void(0);' class='btn btn-sm btn-danger' id='btnDelete' onclick=deleteDetail('" + this['trNontradingTermDId'] + "'); data-toggle='tooltip' data-placement='to' title='Delete Data'><em class='fa fa-trash'></em></a>" +
                        "</td>" +
                        "<td class='DataTable-MidWidth' style='text-align: center;'>" + this['Article'] + "</td>" +
                        "<td class='DataTable-MidWidth' style='text-align: center;'>" + this['ArticleDescription'] + "</td>" +
                        "<td class='DataTable-MidWidth' style='text-align: center;'>" + this['ArticleGet'] + "</td>" +
                        "<td class='DataTable-MidWidth' style='text-align: center;'>" + this['ArticleGetDescription'] + "</td>" +
                        "<td class='DataTable-MidWidth' style='text-align: center;'>" + this['PromoType'] + "</td>" +
                        "<td class='DataTable-MidWidth' style='text-align: center;'>" + this['VendorCode'] + "</td>" +
                        "<td class='DataTable-Mid2Width' style='text-align: center;'>" + this['VendorName'] + "</td>" +
                        "<td class='DataTable-MidWidth' style='text-align: center;'>" + this['PromoQty'] + "</td>" +
                        "<td class='DataTable-MidWidth' style='text-align: center;'>" + this['MaxQty'] + "</td>" +
                        "<td class='DataTable-Mid2Width' style='text-align: center;'>" + this['HargaJualNormal'] + "</td>" +
                        "<td class='DataTable-Mid2Width' style='text-align: center;'>" + this['HargaJualPromo'] + "</td>" +
                        "<td class='DataTable-MidWidth' style='text-align: center;'>" + this['PromoByZone'] + "</td>" +
                        "<td class='DataTable-Mid2Width' style='text-align: center;'>" + this['SupportValue'] + "</td>" +
                        "<td class='DataTable-Mid2Width' style='text-align: center;'>" + this['SupportValueInc'] + "</td>" +
                        "<td class='DataTable-Mid2Width' style='text-align: center;'>" + this['SupportValueExc'] + "</td>" +
                        "<td class='DataTable-Mid2Width' style='text-align: center;'>" + this['PromoSupported'] + "</td>" +
                        "<td class='DataTable-Mid2Width' style='text-align: center;'>" + this['PartnershipDetail'] + "</td>" +
                        "<td class='DataTable-MaxWidth' style='text-align: center;'>" + this['UserLogin'] + "</td>" +
                        "</tr>"
                    ));
            });
        }
        closeFormDetail();
    }
}

function TimerLoadSpinner() {
    var timer = 5;
    setInterval(function () {
        $('#loadingPanel').css('display', 'block');
        if (--timer < 0) {
            $('#loadingPanel').css('display', 'none');
            $("#excelModal").modal("hide");
            $('#btnimportExcl').attr('disabled', false);
        }
    }, 50);
}

function selectArticle() {
    //var selectDescription = "";
    var selectedArticle = $('#cmbArticle').val();
    if (selectedArticle != "" && selectedArticle != null) {
        for (let i = 0; i < dataArticlePIM.length; i++) {
            if (dataArticlePIM[i].sap_article == selectedArticle) {
                $('#txtArticleDesc').val(dataArticlePIM[i].description);
                break;
            }
        }
    }

    //$('#txtArticleDesc').val(selectDescription);
    //$('#txtArticleDesc').text(selectDescription);
}

function selectArticleGet() {
    var selectedArticle = $('#cmbArticleGet').val();
    if (selectedArticle != "" && selectedArticle != null) {
        for (let i = 0; i < dataArticlePIM.length; i++) {
            if (dataArticlePIM[i].sap_article == selectedArticle) {
                $('#txtArticleGetDesc').val(dataArticlePIM[i].description);
                break;
            }
        }
    }
}