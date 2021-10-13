var Navicon = Navicon || {};
Navicon.nav_agreement = (function () {
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
            contactAndAutoOnChange(context);
            creditidOnChange(context);
        }
    }
})();