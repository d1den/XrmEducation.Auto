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
            alert(alertMessage);
        }
    }
    return {
        onLoad : function (context) {
            let formContext = context.getFormContext();
            formContext.getAttribute("nav_datestart").addOnChange(dateEndOnChange);
            formContext.getAttribute("nav_dateend").addOnChange(dateEndOnChange);
        },
        onSave : function (context) {
            if (!dateIsValid) {
                alert(alertMessage);
                context.getEventArgs().preventDefault();
            }
        }
    }
})();