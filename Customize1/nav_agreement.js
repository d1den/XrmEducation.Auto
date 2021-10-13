var Navicon = Navicon || {};
Navicon.nav_agreement = (function () {
    const NAME_ERROR_ID = "name_error";
    let baseValuesAreExist = function (context) {
        let formContext = context.getFormContext();
        let name = formContext.getAttribute("nav_name").getValue();
        let date = formContext.getAttribute("nav_date").getValue();
        let contact = formContext.getAttribute("nav_contactid").getValue();
        let auto = formContext.getAttribute("nav_autoid").getValue();
        if (name != null && date != null && contact != null && auto != null) {
            return true;
        }
        else {
            return false;
        }
    }
    var contactAndAutoOnChange = function (context) {
        let formContext = context.getFormContext();
        let contact = formContext.getAttribute("nav_contactid").getValue();
        let auto = formContext.getAttribute("nav_autoid").getValue();
        if (auto != null && contact != null) {
            formContext.getControl("nav_creditid").setVisible(true);
        }
        else {
            formContext.getControl("nav_creditid").setVisible(false);
            formContext.ui.tabs.get("tab_2").setVisible(false);
        }
    }
    var creditidOnChange = function (context) {
        let formContext = context.getFormContext();
        let creditid = formContext.getAttribute("nav_creditid").getValue();
        if (creditid != null) {
            formContext.ui.tabs.get("tab_2").setVisible(true);
        }
        else {
            formContext.ui.tabs.get("tab_2").setVisible(false);
        }
    }
    let nameOnChange = function (context) {
        let formContext = context.getFormContext();
        let name = formContext.getControl("nav_name").getValue();
        if (name == null) {
            return;
        }
        else {
            for (let i = 0; i < name.length; i++) {
                let char = name.charAt(i);
                if (isNaN(char) && char != "-") {
                    formContext.getControl("nav_name")
                    .setNotification("Название договора должно содержать только цифры и знаки \"-\"",
                    NAME_ERROR_ID);
                    return;
                }
                else {
                    formContext.getControl("nav_name").clearNotification(NAME_ERROR_ID);
                }
            }
        }
    }
    return {
        onLoad : function (context) {
            let formContext = context.getFormContext();
            if (!baseValuesAreExist(context)) {
                formContext.getControl("nav_summa").setVisible(false);
                formContext.getControl("nav_fact").setVisible(false);
                formContext.getControl("nav_creditid").setVisible(false);
                formContext.ui.tabs.get("tab_2").setVisible(false);
            }
            formContext.getAttribute("nav_contactid").addOnChange(contactAndAutoOnChange);
            formContext.getAttribute("nav_autoid").addOnChange(contactAndAutoOnChange);
            formContext.getAttribute("nav_creditid").addOnChange(creditidOnChange);
            formContext.getAttribute("nav_name").addOnChange(nameOnChange);

            contactAndAutoOnChange(context);
            creditidOnChange(context);
        }
    }
})();