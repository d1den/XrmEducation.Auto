document.onreadystatechange = function() {
    if (document.readyState == "complete") {
        Navicon.nav_brandRelatedCredits.onBrandRelatedCredits();
    }
}
var Navicon = Navicon || {};
Navicon.nav_brandRelatedCredits = (function () {
    let FormContext;
    let Xrm;
    let getFetchXmlForRelatedCreditsAndModels = function (brandId) {
        return [
            "<fetch distinct='true'>",
            "  <entity name='nav_auto'>",
            "    <filter>",
            "      <condition attribute='nav_brandid' operator='eq' value='", brandId, "'/>",
            "    </filter>",
            "    <link-entity name='nav_nav_credit_nav_auto' from='nav_autoid' to='nav_autoid'>",
            "      <link-entity name='nav_credit' from='nav_creditid' to='nav_creditid'>",
            "        <attribute name='nav_name' />",
            "        <attribute name='nav_creditperiod' />",
            "        <attribute name='nav_creditid' />",
            "        <order attribute='nav_name' />",
            "      </link-entity>",
            "    </link-entity>",
            "    <link-entity name='nav_model' from='nav_modelid' to='nav_modelid'>",
            "      <attribute name='nav_modelid' />",
            "      <attribute name='nav_name' />",
            "    </link-entity>",
            "  </entity>",
            "</fetch>",
            ].join("");
    }
    let clickOnCredit = function (e) {
        let pageInput = {
            pageType: "entityrecord",
            entityName: "nav_credit",
            entityId: e.target.id //replace with actual ID
        };
        /*let navigationOptions = {
            target: 2,
            height: {value: 80, unit:"%"},
            width: {value: 70, unit:"%"},
            position: 1
        };
        Xrm.Navigation.navigateTo(pageInput, navigationOptions);
        */
    }
    let getLinkTagForCredit = function (creditId, creditName) {
        let appUrl = GetGlobalContext().getClientUrl();
        let creditUrl = `${appUrl}/main.aspx?app=d365default&forceUCI=1&pagetype=entityrecord&etn=nav_credit&id=${creditId}`;
        let creditLinkTag = document.createElement("a");
        creditLinkTag.setAttribute("href", creditUrl);
        creditLinkTag.setAttribute("target", "_blank");
        //creditLinkTag.setAttribute("id", creditId);
        creditLinkTag.setAttribute("title", creditName);
        creditLinkTag.innerText = creditName;
        //creditLinkTag.addEventListener("click", clickOnCredit);
        return creditLinkTag;
    }
    let getLinkTagForModel = function (modelId, modelName) {
        let appUrl = GetGlobalContext().getClientUrl();
        let modelUrl = `${appUrl}/main.aspx?app=d365default&forceUCI=1&pagetype=entityrecord&etn=nav_model&id=${modelId}`;
        let modelLinkTag = document.createElement("a");
        modelLinkTag.setAttribute("href", modelUrl);
        modelLinkTag.setAttribute("target", "_blank");
        //modelLinkTag.setAttribute("id", modelId);
        modelLinkTag.setAttribute("title", modelName);
        modelLinkTag.innerText = modelName;
        return modelLinkTag;
    }
    let getRowForTable = function (credit, model) {
        let row = document.createElement("tr");

        let creditCol = document.createElement("td");
        creditCol.appendChild(getLinkTagForCredit(credit.id, credit.name));
        row.appendChild(creditCol);
        
        let modelCol = document.createElement("td");
        modelCol.appendChild(getLinkTagForModel(model.id, model.name));
        row.appendChild(modelCol);

        let periodCol = document.createElement("td");
        periodCol.innerText = credit.period;
        row.appendChild(periodCol);

        return row;
    }
    let updateTable = function () {
        let table = document.getElementById("tableBody");
        table.innerHTML = null;
        if (FormContext == null || Xrm == null) {
            return;
        }
        let brandId = FormContext.data.entity.getId();
        Xrm.WebApi.retrieveMultipleRecords("nav_auto", "?fetchXml=" + getFetchXmlForRelatedCreditsAndModels(brandId)).then(
            function (records) {
                for (var i = 0; i < records.entities.length; i++) {
                    let credit = {
                        id: records.entities[i]["nav_credit2.nav_creditid"],
                        name: records.entities[i]["nav_credit2.nav_name"],
                        period: records.entities[i]["nav_credit2.nav_creditperiod"]
                    };
                    let model = {
                        id: records.entities[i]["nav_model3.nav_modelid"],
                        name: records.entities[i]["nav_model3.nav_name"]
                    };
                    table.appendChild(getRowForTable(credit, model));
                }
            },
            function (error) {
                console.log(error);
            }
            );
    }
    return {
        onBrandRelatedCredits : function () {
            document.getElementById("updateButton")
            .addEventListener("click", updateTable);
        },
        initWebResource : function (xrm, formContext) {
            Xrm = xrm;
            FormContext = formContext;
            updateTable();
        }
    }
})();