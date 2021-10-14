var Navicon = Navicon || {};
Navicon.nav_communication = (function () {
    const TYPE_PHONE = 808630001;
    const TYPE_EMAIL = 808630002;
    var typeOnChange = function (context) {
        let formContext = context.getFormContext();
        let typeAttribute = formContext.getAttribute("nav_type");
        let type = typeAttribute.getValue();
        if (type === TYPE_EMAIL) {
            formContext.getControl("nav_phone").setVisible(false);
            formContext.getControl("nav_email").setVisible(true);
        }
        else if (type === TYPE_PHONE) {
            formContext.getControl("nav_phone").setVisible(true);
            formContext.getControl("nav_email").setVisible(false);
        }
        else {
            formContext.getControl("nav_phone").setVisible(false);
            formContext.getControl("nav_email").setVisible(false);
        }
    }
    return {
        onLoad : function (context) {
            typeOnChange(context);
            let formContext = context.getFormContext();
            let typeAttribute = formContext.getAttribute("nav_type");
            typeAttribute.addOnChange(typeOnChange);
        }
    }
})();