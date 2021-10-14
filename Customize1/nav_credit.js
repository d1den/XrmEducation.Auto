var Navicon = Navicon || {};
Navicon.nav_credit = (function () {
    const alertMessage = "Даты начала и окончания программы выбраны некорректно!"
    + "Необходимо, чтобы дата окончания была больше даты начала не менее,"
    + "чем на год.";
    let dateIsValid = false;
    let validateDay = function (dateStart, dateEnd) {
        if (dateEnd.getDate() >= dateStart.getDate()) {
            return true;
        }
        else {
            return false;
        }
    }
    let validateMonth = function (dateStart, dateEnd) {
        if (dateEnd.getMonth() > dateStart.getMonth()) {
            return true;
        }
        else if (dateEnd.getMonth() == dateStart.getMonth()) {
            return validateDay(dateStart, dateEnd);
        }
        else {
            return false;
        }
    }
    let validateDate = function (dateStart, dateEnd) {
        if (dateStart == null || dateEnd == null) {
            return false;
        }
        else if (dateEnd.getFullYear() - dateStart.getFullYear() > 1) {
            return true;
        }
        else if (dateEnd.getFullYear() - dateStart.getFullYear() == 1) {
            return validateMonth(dateStart, dateEnd);
        }
        else {
            return false;
        }
    }
    let dateEndOnChange = function (context) {
        let formContext = context.getFormContext();
        let dateStart = formContext.getAttribute("nav_datestart").getValue();
        let dateEnd = formContext.getAttribute("nav_dateend").getValue();
        dateIsValid = validateDate(dateStart, dateEnd);
        if (!dateIsValid
            && dateStart != null && dateEnd != null) {
                Xrm.Navigation.openAlertDialog(alertMessage);
        }
    }
    return {
        onLoad : function (context) {
            let formContext = context.getFormContext();
            let dateStart = formContext.getAttribute("nav_datestart");
            dateStart.addOnChange(dateEndOnChange)
            let dateEnd = formContext.getAttribute("nav_dateend");
            dateEnd.addOnChange(dateEndOnChange);
            dateIsValid = validateDate(dateStart.getValue(), dateEnd.getValue());
        },
        onSave : function (context) {
            if (!dateIsValid) {
                Xrm.Navigation.openAlertDialog(alertMessage);
                context.getEventArgs().preventDefault();
            }
        }
    }
})();