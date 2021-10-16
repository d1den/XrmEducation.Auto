var Navicon = Navicon || {};
Navicon.nav_auto = (function () {
    var setVisibleByUsed = function (context) {
        let formContext = context.getFormContext();
        let used = formContext.getAttribute("nav_used").getValue();
        if (used) {
            formContext.getControl("nav_km").setVisible(true);
            formContext.getControl("nav_ownerscount").setVisible(true);
            formContext.getControl("nav_isdamaged").setVisible(true);
        }
        else {
            formContext.getControl("nav_km").setVisible(false);
            formContext.getControl("nav_ownerscount").setVisible(false);
            formContext.getControl("nav_isdamaged").setVisible(false);
        }
    }
    return {
        onLoad : function (context) {
            setVisibleByUsed(context);
            let formContext = context.getFormContext();
            let usedAttribute = formContext.getAttribute("nav_used");
            usedAttribute.addOnChange(setVisibleByUsed);
        }
    }
})();