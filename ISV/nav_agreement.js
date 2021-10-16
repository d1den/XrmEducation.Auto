var Navicon = Navicon || {};
Navicon.nav_agreement = (function () {
    const NAME_ERROR_ID = "name_error";
    const DATE_ERROR_ID = "date_error";
    const CREDIT_LAYOUT_XML = [
    "<grid name='resultset' object='1' jump='nav_name' select='1' icon='1' preview='1'>",
        "<row name='result' id='nav_creditid'>",
            "<cell name='nav_name' width='200'/>",
            "<cell name='createdon' width='125'/>",
        "</row>",
    "</grid>"
    ].join("");
    let areMainValuesExist = function (context) {
        let formContext = context.getFormContext();
        let name = formContext.getAttribute("nav_name").getValue();
        let date = formContext.getAttribute("nav_date").getValue();
        let contact = formContext.getAttribute("nav_contactid").getValue();
        let auto = formContext.getAttribute("nav_autoid").getValue();
        if (name != null && date != null
            && contact != null && auto != null) {
            return true;
        }
        else {
            return false;
        }
    }
    let getFethcXmlForCreditBySelectedAuto = function (autoId) {
        return [
            "<fetch>",
            "  <entity name='nav_credit'>",
            "    <attribute name='nav_creditid' />",
            "    <attribute name='nav_name' />",
            "    <attribute name='createdon' />",
            "    <order attribute='nav_name' />",
            "    <link-entity name='nav_nav_credit_nav_auto' from='nav_creditid' to='nav_creditid' intersect='true'>",
            "      <link-entity name='nav_auto' from='nav_autoid' to='nav_autoid' intersect='true'>",
            "        <filter>",
            "          <condition attribute='nav_autoid' operator='eq' value='", autoId, "'/>",
            "        </filter>",
            "      </link-entity>",
            "    </link-entity>",
            "  </entity>",
            "</fetch>",
            ].join("");
    }
    var setVisibleCreditByContactAndAuto = function (context) {
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
    var setVisibleCreditTabBySelectedCredit = function (context) {
        let formContext = context.getFormContext();
        let creditid = formContext.getAttribute("nav_creditid").getValue();
        if (creditid != null) {
            formContext.ui.tabs.get("tab_2").setVisible(true);
        }
        else {
            formContext.ui.tabs.get("tab_2").setVisible(false);
        }
    }
    let validateName = function (context) {
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
                }
                else {
                    formContext.getControl("nav_name").clearNotification(NAME_ERROR_ID);
                }
            }
        }
    }
    let setCreditViewBySelectedAuto = function (context) {
        let formContext = context.getFormContext();
        let auto = formContext.getAttribute("nav_autoid").getValue();
        if (auto == null) {
            formContext.getAttribute("nav_creditid").setValue(null);
            return;
        }
        let fetchXml = getFethcXmlForCreditBySelectedAuto(auto[0].id);
        formContext.getControl("nav_creditid")
        .addCustomView("5aaae264-6bf8-428e-a5ce-046b97b89cb1",
        "nav_credit", "Доступные кредитные программы",
        fetchXml, CREDIT_LAYOUT_XML, true);
    }
    let isSecondDateGreater = function (firstDate, secondDate) {
        if (firstDate.getFullYear() < secondDate.getFullYear()) {
            return true;
        }
        else if (firstDate.getFullYear() == secondDate.getFullYear()) {
            if (firstDate.getMonth() < secondDate.getMonth()) {
                return true;
            }
            else if (firstDate.getMonth() == secondDate.getMonth()) {
                if (firstDate.getDay() <= secondDate.getDay()) {
                    return true;
                }
                else {
                    return true;
                }
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    let isDateInCreditPeriod = function (creditDateStart, creditDateEnd, agreementDate) {
        return isSecondDateGreater(creditDateStart, agreementDate)
        && isSecondDateGreater(agreementDate, creditDateEnd);
    }
    let validateDateByCreditPeriod = function (context) {
        let formContext = context.getFormContext();
        let creditid = formContext.getAttribute("nav_creditid").getValue();
        let dateAttribute = formContext.getAttribute("nav_date");
        if (creditid != null && dateAttribute != null) {
            Xrm.WebApi.retrieveRecord("nav_credit", creditid[0].id, "?$select=nav_datestart,nav_dateend").then(
                function (credit) {
                    let dateStart = new Date(credit.nav_datestart);
                    let dateEnd = new Date(credit.nav_dateend);
                    if (!isDateInCreditPeriod(dateStart,
                    dateEnd, dateAttribute.getValue())) {
                        formContext.getControl("nav_creditid")
                        .setNotification("Срок действия кредитной программы истёк!"
                        + " Выберите другую кредитную программу или дату договора.",
                        DATE_ERROR_ID);
                    }
                    else {
                        formContext.getControl("nav_creditid").clearNotification(DATE_ERROR_ID);
                        return dateEnd.getFullYear() - dateStart.getFullYear();
                    }
                },
                function (error) {
                    console.error(error);
                }
            );
        }
    }
    let setCreditPeriod = function (context) {
        let formContext = context.getFormContext();
        let creditid = formContext.getAttribute("nav_creditid").getValue();
        if (creditid != null) {
            Xrm.WebApi.retrieveRecord("nav_credit", creditid[0].id, "?$select=nav_creditperiod").then(
                function (credit) {
                    if (!isNaN(credit.nav_creditperiod)) {
                        formContext.getAttribute("nav_creditperiod").setValue(credit.nav_creditperiod);
                    }
                    else {
                        formContext.getAttribute("nav_creditperiod").setValue(null);
                    }
                },
                function (error) {
                    console.error(error);
                }
            );
        }
    }
    let setSummaByAutoOrModel = function (context) {
        let formContext = context.getFormContext();
        let auto = formContext.getAttribute("nav_autoid").getValue();
        let summaAttribute = formContext.getAttribute("nav_summa");
        if (auto == null) {
            summaAttribute.setValue(null);
            formContext.getControl("nav_summa").setVisible(false);
        }
        else {
            Xrm.WebApi.retrieveRecord("nav_auto", auto[0].id,
            "?$select=nav_used,nav_amount&$expand=nav_modelid($select=nav_recommendedamount)").then(
                function (auto) {
                    if (auto.nav_used) {
                        summaAttribute.setValue(auto.nav_amount);
                    }
                    else {
                        summaAttribute.setValue(auto.nav_modelid.nav_recommendedamount);
                    }
                    formContext.getControl("nav_summa").setVisible(true);
                },
                function (error) {
                    console.error(error);
                }
            );
        }
    }
    return {
        onLoad : function (context) {
            let formContext = context.getFormContext();
            if (!areMainValuesExist(context)) {
                /*
                так по заданию необходимо скрыть поля сумма и факт оплаты,
                но не прописано, когда их открывать - они скрываются только 
                при создании договора. При открытие созданного они не скрываются
                */
                formContext.getControl("nav_summa").setVisible(false);
                formContext.getControl("nav_fact").setVisible(false);
                formContext.getControl("nav_creditid").setVisible(false);
                formContext.ui.tabs.get("tab_2").setVisible(false);
            }
            setVisibleCreditByContactAndAuto(context);
            setVisibleCreditTabBySelectedCredit(context);
            setCreditViewBySelectedAuto(context);
            formContext.getAttribute("nav_contactid").addOnChange(setVisibleCreditByContactAndAuto);

            formContext.getAttribute("nav_autoid").addOnChange(setVisibleCreditByContactAndAuto);
            formContext.getAttribute("nav_autoid").addOnChange(setCreditViewBySelectedAuto);
            formContext.getAttribute("nav_autoid").addOnChange(setSummaByAutoOrModel);

            formContext.getAttribute("nav_creditid").addOnChange(setVisibleCreditTabBySelectedCredit);
            formContext.getAttribute("nav_creditid").addOnChange(validateDateByCreditPeriod);
            formContext.getAttribute("nav_creditid").addOnChange(setCreditPeriod);

            formContext.getAttribute("nav_name").addOnChange(validateName);

            formContext.getAttribute("nav_date").addOnChange(validateDateByCreditPeriod);
            formContext.getControl("WebResource_calculateCredit").getContentWindow().then(
                function (contentWindow) {
                    contentWindow.Navicon.nav_calculateCredit.setFormContext(formContext);
                },
                function (error) {
                    console.error(error);
                }
            );
        }
    }
})();