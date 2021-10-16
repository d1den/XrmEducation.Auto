var Navicon = Navicon || {};
Navicon.nav_credit = (function () {
    const ALERT_MESSAGE = "Даты начала и окончания программы выбраны некорректно!"
    + "Необходимо, чтобы дата окончания была больше даты начала не менее,"
    + "чем на год.";
    let dateIsValid = false;
    let isCorrectDay = function (dateStart, dateEnd) {
        if (dateEnd.getDate() >= dateStart.getDate()) {
            return true;
        }
        else {
            return false;
        }
    }
    let isCorrectMonth = function (dateStart, dateEnd) {
        if (dateEnd.getMonth() > dateStart.getMonth()) {
            return true;
        }
        else if (dateEnd.getMonth() == dateStart.getMonth()) {
            return isCorrectDay(dateStart, dateEnd);
        }
        else {
            return false;
        }
    }
    let isCorrectDate = function (dateStart, dateEnd) {
        if (dateStart == null || dateEnd == null) {
            return false;
        }
        else if (dateEnd.getFullYear() - dateStart.getFullYear() > 1) {
            return true;
        }
        else if (dateEnd.getFullYear() - dateStart.getFullYear() == 1) {
            return isCorrectMonth(dateStart, dateEnd);
        }
        else {
            return false;
        }
    }
    let validateStartAndEndDate = function (context) {
        let formContext = context.getFormContext();
        let dateStart = formContext.getAttribute("nav_datestart").getValue();
        let dateEnd = formContext.getAttribute("nav_dateend").getValue();
        dateIsValid = isCorrectDate(dateStart, dateEnd);
        if (!dateIsValid && dateStart != null && dateEnd != null) {
            Xrm.Navigation.openAlertDialog(ALERT_MESSAGE);
        }
    }
    return {
        onLoad : function (context) {
            let formContext = context.getFormContext();
            let dateStart = formContext.getAttribute("nav_datestart");
            dateStart.addOnChange(validateStartAndEndDate)
            let dateEnd = formContext.getAttribute("nav_dateend");
            dateEnd.addOnChange(validateStartAndEndDate);
            dateIsValid = isCorrectDate(dateStart.getValue(), dateEnd.getValue());
        },
        onSave : function (context) {
            if (!dateIsValid) {
                Xrm.Navigation.openAlertDialog(ALERT_MESSAGE);
                context.getEventArgs().preventDefault();
            }
        }
    }
})();