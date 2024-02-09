$(document).ready(function () {

    $('#datePickerTo').datetimepicker
        ({
            format: 'YYYY-MM-DD'
        });
    var table = $('#listData').DataTable();
    $('#employeeNIK').css('disabled', 'false');
    searchDataListEmployee();
});

function saveData() {
    if ($('#employeeID').val() == "" || parseInt($('#employeeID').val()) == 0) {
        var dataHeader = {
            name: $('#employeeName').val(),
            birth_date: $('#birthDate').val(),
            address: $('#address').val(),
            sallary: parseFloat($('#sallary').val()),
            nik: $('#employeeNIK').val(),
        };
        $.ajax({
            type: "POST",
            url: "/Employee/SubmitEmployee",
            data: dataHeader,
            success: function (respon) {
                if (respon.is_ok) {

                    toastr.success("Employee success to submitted");
                    setTimeout(() => {
                        $('#formCrud').css('display', 'none');
                        $('#formList').css('display', 'block');
                        searchDataListEmployee();
                    }, 500);
                }
                else {
                    console.log("Invoice failed to submitted");
                    toastr.error(respon.messageUI);

                }
            }

        });
    }
    else {
        updateData();
    }
}

function getData() {
    $('#loadingPanel').css('display', 'block');
    var dataHeader = {
        id: parseInt($('#employeeID').val())
    };
    $.ajax({
        type: "GET",
        url: "/Employee/GetEmployeeById",
        data: dataHeader,
        success: function (respon) {
            var dataresp = JSON.parse(respon);
            if (dataresp.is_ok) {
                $('#employeeID').val(dataresp.ID);
                $('#employeeName').val(dataresp.name);
                $('#birthDate').val(moment(dataresp.birth_date).format('YYYY-MM-DD'));
                $('#employeeNIK').val(dataresp.nik);
                $('#sallary').val(dataresp.sallary);
                $('#address').val(dataresp.address);
                $('#employeeNIK').prop('disabled', true);;
                $('#loadingPanel').css('display', 'none');
            }
            else {
                console.log("employee not found");
                toastr.error(dataresp.messageUI);
                $('#loadingPanel').css('display', 'none');
            }
        }

    });
}

function updateData() {

    var dataHeader = {
        id: parseInt($('#employeeID').val()),
        name: $('#employeeName').val(),
        birth_date: $('#birthDate').val(),
        address: $('#address').val(),
        sallary: parseFloat($('#sallary').val()),
        nik: $('#employeeNIK').val(),
    };
    $.ajax({
        type: "PUT",
        url: "/Employee/EditEmployee",
        data: dataHeader,
        success: function (respon) {
            if (respon.is_ok) {

                toastr.success("Employee success to changes");
                setTimeout(() => {
                    $('#formCrud').css('display', 'none');
                    $('#formList').css('display', 'block');
                    searchDataListEmployee();
                }, 500);
            }
            else {
                console.log("Invoice failed to submitted");
                toastr.error(respon.messageUI);

            }
        }

    });
}

function editDetail(obj) {
    // $('#btnDelet').css('display', 'block');
    $('#formCrud').css('display', 'block');
    $('#formList').css('display', 'none');
    var columnValue = $(obj).closest('tr').find('td');
    var Id = parseInt($(obj).attr('id'));
    $('#employeeID').val(Id);
    getData();
}

function deleteDetail(obj) {
    $("#confirmModal").modal("show");
    var columnValue = $(obj).closest('tr').find('td');
    var Id = parseInt($(obj).attr('id'));
    $('#employeeID').val(Id);
}


function deleteChoosen() {
    var dataHeader = {
        id: parseInt($('#employeeID').val()),

    };
    $.ajax({
        type: "DELETE",
        url: "/Employee/DeleteEmployee",
        data: dataHeader,
        success: function (respon) {
            if (respon.is_ok) {

                toastr.success("Employee success to delete");
                setTimeout(() => {
                    $('#formCrud').css('display', 'none');
                }, 500);
            }
            else {

                toastr.success("Employee success to delete");

            }
            searchDataListEmployee();
            $("#confirmModal").modal("hide");
        }

    });
}

function onAddNew() {

    $('#formCrud').css('display', 'block');
    Reset();
    $('#formList').css('display', 'none');
    // $('#btnDelet').css('display', 'none');
}

function onClose() {
    $('#formList').css('display', 'block');
    $('#formCrud').css('display', 'none');
    Reset();
}

function searchDataListEmployee() {

    var paramData = {
        name: $('#employeeName').val()
    };

    $('#listData').css('width', '100%');
    $('#listData').DataTable().destroy();
    additionalGridConfig = {
        isPaging: true,
        scrollY: "60vh",
        isSearch: true
    }
    return _fw_grid_web_method('listData', "GetEmployeeList", paramData,
        [

            {
                "orderable": "false", "bSortable": "false",
                "data": "ID", "name": "-Action-", "targets": "1",
                "render": function (data, type, row) {
                    var html = "<div class='text-center'>" +
                        "<button class='btn btn-sm btn-success'  id=" + row.ID + " height='10' type='button' data-toggle='tooltip' data-placement='top' title='Detail Data' name='btnDetail' onclick=editDetail(this); ><em class='fa fa-edit'></em></button>&nbsp;" +
                        "<button class='btn btn-sm btn-danger'  id=" + row.ID + " height='10' type='button' data-toggle='tooltip' data-placement='top' title='Delete Data' name='btnDeleted' onclick=deleteDetail(this); ><em class='fa fa-trash'></em></button>"
                    "</div>";
                    return html;

                }
            },
            { "data": "name", "name": "Name" },
            {
                "render": function (data, type, row) {
                    var html =
                        "<div>" + moment(row.birth_date).format("YYYY-MM-DD") + "</div>";
                    return html;
                }
            },
            {
                "render": function (data, type, row) {
                    var html =
                        "<div>" + Number(row.sallary).toLocaleString() + "</div>";
                    return html;
                }
            },
            { "data": "nik", "name": "NIK" }

        ], function (err) {
        },
        additionalGridConfig);
}

function Reset() {
    $('#employeeID').val("");
    $('#employeeName').val("");
    $('#birthDate').val("");
    $('#employeeNIK').val("");
    $('#sallary').val("");
    $('#address').val("");
    $('#employeeNIK').prop('disabled', false);
    //$('#txtInvNo').value = "";
}