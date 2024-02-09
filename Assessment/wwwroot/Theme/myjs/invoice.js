var dataCmb, cmbPayment, cmbCourier, cmbProduct;
var productChoosen = {}; var oldValueDetails = []; var detailforUp = [];
$(document).ready(function () {

    $('#datePickerTo').datetimepicker
        ({
            format: 'YYYY-MM-DD'
        });
    var table = $('#listData').DataTable();


})

function searchInvoice() {
    $('#loadingPanel').css('display', 'block');

    loadSales(false, "");
    loadPayment(false, "");
    loadCourier(false, "");
    loadProduct(false, "");
    loadDataInvoice();

}

function addDataDetail() {
    $('#formDetailInvoice').css('display', 'block');
}

function resetForm() {
    $('#formCrud').css('display', 'none');
    $("#typeSales").empty();
    $("#typePayment").empty();
    $("#typeCourier").empty();
    $('#loadingPanel').css('display', 'none');
    $('#txtInvNo').value = "";
    $('#InvDate').value = "";
    $('#txtTo').value = "";
    $('#txtShipTo').value = "";
    var table = $('#listData').DataTable();
    table.rows(':gt(0)').remove().draw();
}

function showCloseModal() {
    $('#formCrud').css('display', 'none');
    $("#typeSales").empty();
    $("#typePayment").empty();
    $("#typeCourier").empty();
    $('#loadingPanel').css('display', 'none');
    $('#txtInvNo').value = "";
    $('#InvDate').value = "";
    $('#txtTo').value = "";
    $('#txtShipTo').value = "";
    var table = $('#listData').DataTable();
    table.rows(':gt(0)').remove().draw();
}

function newForm() {
    $('#formCrud').css('display', 'block');
    $("#typeSales").empty();
    $("#typePayment").empty();
    $("#typeCourier").empty();
    $('#loadingPanel').css('display', 'block');
    $('#txtInvNo').value = "";
    $('#InvDate').value = "";
    $('#txtTo').value = "";
    $('#txtShipTo').value = "";
    loadSales(false, "");
    loadPayment(false, "");
    loadCourier(false, "");
    loadProduct(false, "");
    var table = $('#listData').DataTable();
    table.rows(':gt(0)').remove().draw();
    $('#loadingPanel').css('display', 'none');
}

function loadSales(isEdit, obj) {
    $.ajax({
        type: "GET",
        url: "/Invoice/GetSalesList",
        //data: paramData,
        //async: false,
        success: function (response) {
            dataCmb = null;
            dataCmb = JSON.parse(response);
            if (!dataCmb.is_ok) {
                $("#typeSales").empty();
                toastr.error(dataCmb.message);
                setTimeout(function () {
                    window.top.close();
                }, 5000);
            }
            else {
                $("#typeSales").empty();


                $("#typeSales").append($("<option></option>").val(this['']).html('-Select Sales-'));
                $.each(dataCmb.data, function () {
                    $("#typeSales").append($("<option></option>").val(this['SalesID']).html(this['SalesName']));
                });


            }
        }
    });
}

function loadPayment(isEdit, obj) {
    $.ajax({
        type: "GET",
        url: "/Invoice/GetPaymentList",
        success: function (response) {
            cmbPayment = null;
            cmbPayment = JSON.parse(response);
            if (!cmbPayment.is_ok) {
                $("#typePayment").empty();
                toastr.error(cmbPayment.message);
                setTimeout(function () {
                    window.top.close();
                }, 5000);
            }
            else {
                $("#typePayment").empty();


                $("#typePayment").append($("<option></option>").val(this['']).html('-Select Payment-'));
                $.each(cmbPayment.data, function () {
                    $("#typePayment").append($("<option></option>").val(this['PaymentID']).html(this['PaymentName']));
                });


            }
        }
    });
}

function loadCourier(isEdit, obj) {
    $.ajax({
        type: "GET",
        url: "/Invoice/GetCourierList",
        success: function (response) {
            cmbCourier = null;
            cmbCourier = JSON.parse(response);
            if (!cmbCourier.is_ok) {
                $("#typeCourier").empty();
                toastr.error(cmbCourier.message);
                setTimeout(function () {
                    window.top.close();
                }, 5000);
            }
            else {
                $("#typeCourier").empty();


                $("#typeCourier").append($("<option></option>").val(this['']).html('-Select Courier-'));
                $.each(cmbCourier.data, function () {
                    $("#typeCourier").append($("<option></option>").val(this['CourierID']).html(this['CourierName']));
                });


            }
        }
    });
}

function loadProduct(isEdit, obj) {
    $.ajax({
        type: "GET",
        url: "/Invoice/GetProductList",
        success: function (response) {
            cmbProduct = null;
            cmbProduct = JSON.parse(response);
            if (!cmbProduct.is_ok) {
                $("#typeProduct").empty();
                toastr.error(cmbProduct.message);
                setTimeout(function () {
                    window.top.close();
                }, 5000);
            }
            else {
                $("#typeProduct").empty();


                $("#typeProduct").append($("<option></option>").val(this['']).html('-Select Product-'));
                $.each(cmbProduct.data, function () {
                    $("#typeProduct").append($("<option></option>").val(this['ProductID']).html(this['ProductName']));
                });


            }
        }
    });
}

function addDetail(obj, id) {

    $('#formDetailInvoice').css('display', 'none');

    var itemName = "", weight = 0, qty = 0, unitPrice = 0, total = 0;

    var dataValue = {
        itemID: $('#typeProduct').val(),
        ItemName: $('#txtProdName').val(),
        weight: parseInt($('#txtWeight').val()),
        qty: parseInt($('#txtqty').val()),
        unitPrice: parseFloat($('#txtPrice').val()),
        total: parseFloat($('#txtPrice').val()) * parseInt($('#txtqty').val())
    };
    console.log(dataValue);
    var dataTable = [];
    dataTable.push(dataValue);

    if (dataTable != null) {

        $("#listData").append(
            $("<tr>" + '<td style="text-align: center;display:none">' + dataValue.itemID + "</td>" + '<td style="text-align: center;">' + dataValue.ItemName +
                "</td>" + '<td style="text-align: center;">' + dataValue.weight + "</td>"
                + '<td style="text-align: center;">' + dataValue.qty + "</td>"
                + '<td style="text-align: center;">' + Number(dataValue.unitPrice).toLocaleString() + "</td>"
                + '<td style="text-align: center;">' + dataValue.total + "</td>" + "</tr>"));

    }

}

function productChange() {
    var prodSelect = $('#typeProduct').find(':selected').text();
    $('#txtProdName').val(prodSelect);
    $('#txtProdID').val($('#typeProduct').val());

}

function calculateTotal() {
    var qty = parseFloat($('#txtqty').val());
    var price = parseFloat($('#txtPrice').val());
    var totals = qty * price;
    $('#txtTotal').val(totals);
    console.log(totals);
}

function saveData() {

    SetToObject();
    var invNo = "";
    if ($('#txtInvNo').val() != "") {
        invNo = $('#txtInvNo').val();
    }
    var dataHeader = {
        InvoiceNo: invNo,
        InvoiceDate: $('#InvDate').val(),
        InvoiceTo: $('#txtTo').val(),
        ShipTo: $('#txtShipTo').val(),
        SalesID: parseInt($('#typeSales').val()),
        CourierID: parseInt($('#typeCourier').val()),
        PaymentType: parseInt($('#typePayment').val()),
        CourierFee: 0,
        dataDetail: detailforUp
    };
    $.ajax({
        type: "POST",
        url: "/Invoice/SubmitInvoice",
        data: dataHeader,
        success: function (respon) {
            if (respon.is_ok) {

                toastr.success("Invoice success to submitted");
                setTimeout(() => {
                    $('#formCrud').css('display', 'none');
                }, 500);
            }
            else {
                console.log("Invoice failed to submitted");
                toastr.error("Invoice failed to submitted");

            }
        }

    });
}

function SetToObject() {
    if (oldValueDetails.length > 0) {
        oldValueDetails.length = 0;
    }

    $("#listData tr").each(function () {
        if (!this.rowIndex) return;
        var self = $(this);
        var itemID = parseInt(self.find("td:eq(0)").text());
        var itemname = self.find("td:eq(1)").text().trim();
        var weight = parseFloat(self.find("td:eq(2)").text());
        var qty = parseFloat(self.find("td:eq(3)").text());
        var price = parseFloat(self.find("td:eq(4)").text());
        var total = parseFloat(self.find("td:eq(5)").text());

        oldValueDetails.push({ ProductID: itemID, prodName: itemname, Weight: weight, Qty: qty, Price: price, Total: total });
        detailforUp.push({ InvoiceNo: "", ProductID: itemID, Weight: weight, Qty: qty, Price: price });
    });

    console.log(oldValueDetails);
}

function loadDataInvoice() {
    oldValueDetails = [];
    detailforUp = [];
    var dataHeader = {
        InvoiceNo: $('#txtInvNo').val()
    };

    var table = $('#listData').DataTable();
    table.rows(':gt(0)').remove().draw();
    //$('#listData').DataTable().destroy();
    //$('#listData').css('width', '100%');

    $.ajax({
        type: "GET",
        url: "/Invoice/ReadInvoice",
        data: dataHeader,
        success: function (respon) {
            var dataresp = JSON.parse(respon);
            if (dataresp.is_ok) {
                $('#txtInvNo').val(dataresp.InvoiceNo);
                $('#InvDate').val(moment(dataresp.InvoiceDate).format('YYYY-MM-DD'));
                $('#txtTo').val(dataresp.InvoiceTo);
                $('#txtShipTo').val(dataresp.ShipTo);
                $('#typeSales').val(dataresp.SalesID).trigger('change.select2');
                getSales();
                $('#typeCourier').val(dataresp.CourierID).trigger('change.select2');
                getCourier();
                $('#typePayment').val(dataresp.PaymentType).trigger('change.select2');
                getPayment();
                if (dataresp.dataDetail != null) {
                    $.each(dataresp.dataDetail, function (i, item) {
                        $("#listData").append(
                            $("<tr>" + '<td style="text-align: center;display:none">' + item.ProductID + "</td>" +
                                '<td style="text-align: center;">' + item.ProductName +
                                "</td>" + '<td style="text-align: center;">' + item.Weight + "</td>"
                                + '<td style="text-align: center;">' + item.Qty + "</td>"
                                + '<td style="text-align: center;">' + Number(item.Price).toLocaleString() + "</td>"
                                + '<td style="text-align: center;">' + Number(item.Total).toLocaleString() + "</td>" + "</tr>"));
                    });
                }
                $('#formCrud').css('display', 'block');
                $('#loadingPanel').css('display', 'none');
            }
            else {
                console.log("Invoice cannot find");
                toastr.error("Invoice cannot find");
                $('#formCrud').css('display', 'none');
                $('#loadingPanel').css('display', 'none');
            }
        }

    });
}

function getSales() {
    var selectedValue = $('#typeSales').val();
    //$('#typeSales').val(selectedValue).trigger('change.select2');
    console.log(selectedValue);
}
function getPayment() {
    var selectedValue = $('#typePayment').val();
    //$('#typeSales').val(selectedValue).trigger('change.select2');
    console.log(selectedValue);
}
function getCourier() {
    var selectedValue = $('#typeCourier').val();
    //$('#typeSales').val(selectedValue).trigger('change.select2');
    console.log(selectedValue);
}

function showDeleteModal() {
    $('#confirmModal').modal("show");
}

function closeModal() {
    $('#confirmModal').modal("hide");
}
function deleteChoosen() {
    $('#loadingPanel').css('display', 'block');
    var dataHeader = {
        InvoiceNo: $('#txtInvNo').val()
    };
    $.ajax({
        type: "DELETE",
        url: "/Invoice/DeleteInvoice",
        data: dataHeader,
        success: function (respon) {

            if (respon.is_ok) {
                toastr.error("Invoice deleted success");
                $('#loadingPanel').css('display', 'none');
            }
            else {

                toastr.error("Invoice deleted failed");
                $('#formCrud').css('display', 'none');
                showCloseModal();
                closeModal();
                $('#loadingPanel').css('display', 'none');
            }
        }

    });
}