var Navicon = Navicon || {};
Navicon.nav_agreement = (function () {
    const NAME_ERROR_ID = "name_error";
    const CREDIT_LAYOUT_XML = [
    "<grid name='resultset' object='1' jump='nav_name' select='1' icon='1' preview='1'>",
        "<row name='result' id='nav_creditid'>",
            "<cell name='nav_name' width='200'/>",
            "<cell name='createdon' width='125'/>",
        "</row>",
    "</grid>"
    ].join("");
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
    let getValidCreditsFetchXml = function (autoId) {
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
    let autoidOnChange = function (context) {
        let formContext = context.getFormContext();
        let auto = formContext.getAttribute("nav_autoid").getValue();
        if (auto == null) {
            return;
        }
        let fetchXml = getValidCreditsFetchXml(auto[0].id);
        formContext.getControl("nav_creditid")
        .addCustomView("5aaae264-6bf8-428e-a5ce-046b97b89cb1",
        "nav_credit", "Доступные кредитные программы",
        fetchXml, CREDIT_LAYOUT_XML, true);
    }
    return {
        onLoad : function (context) {
            let formContext = context.getFormContext();
            // 1 пункт задания
            if (!baseValuesAreExist(context)) {
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
            // 2 пункт
            formContext.getAttribute("nav_contactid").addOnChange(contactAndAutoOnChange);
            formContext.getAttribute("nav_autoid").addOnChange(contactAndAutoOnChange);
            contactAndAutoOnChange(context);
            // 3 пункт
            formContext.getAttribute("nav_creditid").addOnChange(creditidOnChange);
            creditidOnChange(context);
            // 4 пункт
            formContext.getAttribute("nav_autoid").addOnChange(autoidOnChange);
            autoidOnChange(context);
            // 5 пункт - в случае неправильного ввода отображает ошибку заполнения поля
            formContext.getAttribute("nav_name").addOnChange(nameOnChange);
        }
    }
})();