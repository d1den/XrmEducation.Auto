document.onreadystatechange = function() {
    if (document.readyState == "complete") {
        Navicon.nav_calculateCredit.onCalculateCreditLoad();
    }
}
var Navicon = Navicon || {};
Navicon.nav_calculateCredit = (function () {
    let FormContext;
    let calculateCredit = function () {
        if (FormContext == null) {
            return;
        }
        let amount = FormContext.getAttribute("nav_summa").getValue() - FormContext.getAttribute("nav_initialfee").getValue();
        FormContext.getAttribute("nav_creditamount").setValue(amount);
        let creditId = FormContext.getAttribute("nav_creditid").getValue();
        if (creditId == null) {
            return;
        }
        parent.Xrm.WebApi.retrieveRecord("nav_credit", creditId[0].id, "?$select=nav_percent").then(
            function (credit) {
                let creditPeriod = FormContext.getAttribute("nav_creditperiod").getValue();
                if (creditPeriod != null && !isNaN(credit.nav_percent)) {
                    let fullAmount = (credit.nav_percent/100 * creditPeriod
                    * amount) + amount;
                    FormContext.getAttribute("nav_fullcreditamount").setValue(fullAmount);
                }
            },
            function (error) {
                console.error(error);
            }
        );
    };
    return {
        onCalculateCreditLoad : function () {
            document.getElementById("calculateButton")
            .addEventListener("click", calculateCredit);
        },
        setFormContext : function (formContext) {
            FormContext = formContext;
        }
    }
})();