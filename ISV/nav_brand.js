var Navicon = Navicon || {};
Navicon.nav_brand = (function () {
    return {
        onLoad : function (context) {
            let formContext = context.getFormContext();
            formContext.getControl("IFRAME_nav_brandRelatedCredits").getContentWindow().then(
                function (contentWindow) {
                    contentWindow.Navicon.nav_brandRelatedCredits.initWebResource(Xrm, formContext);
                },
                function (error) {
                    console.error(error);
                }
            );
        }
    }
})();