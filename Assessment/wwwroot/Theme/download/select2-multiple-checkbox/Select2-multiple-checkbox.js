var Select2MultiCheckBoxObj = [];
var id_selectElement = '';
var staticWordInID = 'state_';

function Select2MultipleCheckboxInit(id_selectElement_) {
    id_selectElement = id_selectElement_;
    //Begin - Select 2 Multi-Select Code
    $.map($('#' + id_selectElement + ' option'), function (option) {
        AddItemInSelect2MultiCheckBoxObj(option.value, false);
    });

    function formatResult(state) {
        if (Select2MultiCheckBoxObj.length > 0) {
            var stateId = staticWordInID + state.id;
            let index = Select2MultiCheckBoxObj.findIndex(x => x.id == state.id);
            if (index > -1) {
                var checkbox = $('<div class="checkbox"><input class="select2Checkbox" id="' + stateId + '" type="checkbox" ' + (Select2MultiCheckBoxObj[index]["IsChecked"] ? 'checked' : '') +
                    '><label for="checkbox' + stateId + '">' + state.text + '</label></div>', { id: stateId });
                return checkbox;
            }
        }
    }

    let optionSelect2 = {
        templateResult: formatResult,
        closeOnSelect: false,
        width: '100%'
    };

    let $select2 = $("#" + id_selectElement).select2(optionSelect2);

    //var scrollTop;
    //$select2.on("select2:selecting", function (event) {
    //    var $pr = $('#' + event.params.args.data._resultId).parent();
    //    scrollTop = $pr.prop('scrollTop');
    //    let xxxx = 2;
    //});

    $select2.on("select2:select", function (event) {
        $("#" + staticWordInID + event.params.data.id).prop("checked", true);
        AddItemInSelect2MultiCheckBoxObj(event.params.data.id, true);
        //If all options are slected then selectAll option would be also selected.
        if (Select2MultiCheckBoxObj.filter(x => x.IsChecked === false).length === 1) {
            AddItemInSelect2MultiCheckBoxObj(0, true);
            $("#" + staticWordInID + "0").prop("checked", true);
        }
    });

    $select2.on("select2:unselect", function (event) {
        $("#" + staticWordInID + "0").prop("checked", false);
        AddItemInSelect2MultiCheckBoxObj(0, false);
        $("#" + staticWordInID + event.params.data.id).prop("checked", false);
        AddItemInSelect2MultiCheckBoxObj(event.params.data.id, false);
    });

    $(document).on("click", "#" + staticWordInID + "0", function () {
        //var b = !($("#state_SelectAll").is(':checked'));
        var b = $("#" + staticWordInID + "0").is(':checked');

        IsCheckedAllOption(b);
        //state_CheckAll = b;
        //$(window).scroll();
    });
    $(document).on("click", ".select2Checkbox", function (event) {
        let selector = "#" + this.id;
        let isChecked = Select2MultiCheckBoxObj[Select2MultiCheckBoxObj.findIndex(x => x.id == this.id.replaceAll(staticWordInID, ''))]['IsChecked'];
        $(selector).prop("checked", isChecked);
    });
}

function AddItemInSelect2MultiCheckBoxObj(id, IsChecked) {
    if (Select2MultiCheckBoxObj.length > 0) {
        let index = Select2MultiCheckBoxObj.findIndex(x => x.id == id);
        if (index > -1) {
            Select2MultiCheckBoxObj[index]["IsChecked"] = IsChecked;
        }
        else {
            Select2MultiCheckBoxObj.push({ "id": id, "IsChecked": IsChecked });
        }
    }
    else {
        Select2MultiCheckBoxObj.push({ "id": id, "IsChecked": IsChecked });
    }
}

function IsCheckedAllOption(trueOrFalse) {
    $.map($('#' + id_selectElement + ' option'), function (option) {
        AddItemInSelect2MultiCheckBoxObj(option.value, trueOrFalse);
    });
    $('#' + id_selectElement + " > option").not(':first').prop("selected", trueOrFalse); //This will select all options and adds in Select2
    $("#" + id_selectElement).trigger("change");//This will effect the changes
    $(".select2-results__option").not(':first').attr("aria-selected", trueOrFalse); //This will make grey color of selected options

    $("input[id^='" + staticWordInID + "']").prop("checked", trueOrFalse);
}