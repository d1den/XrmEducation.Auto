using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Workflow;
using System;
using System.Activities;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Navicon.Crm.Auto.Common;
using Navicon.Crm.Auto.Common.Handlers;

namespace Navicon.Crm.Auto.Workflows.Agreement
{
    public sealed class HasRujnoeTypeInvoicesActivity : BaseActivity
    {
        [Input("Договор")]
        [RequiredArgument]
        [ReferenceTarget("nav_agreement")]
        public InArgument<EntityReference> AgreementReference { get; set; }

        [Output("Есть счета c типом \"Ручное создание\"")]
        public OutArgument<bool> HasFactInvoices { get; set; }
        public override void ExecuteActivityLogic(CodeActivityContext context, IOrganizationService service, ITracingService tracing)
        {
            AgreementService agreementService = new AgreementService(service, tracing);
            HasFactInvoices.Set(context, agreementService
                .HasRujnoeTypeInvoices(AgreementReference.Get(context)));
        }
    }
}
