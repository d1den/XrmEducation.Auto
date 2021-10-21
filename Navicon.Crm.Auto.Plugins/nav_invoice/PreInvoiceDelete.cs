using Microsoft.Xrm.Sdk;
using Navicon.Crm.Auto.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Navicon.Crm.Auto.Common;
using Navicon.Crm.Auto.Common.Handlers;

namespace Navicon.Crm.Auto.Plugins.nav_invoice
{
    public sealed class PreInvoiceDelete : BasePlugin
    {
        public override void ExecutePluginLogic(object target, IOrganizationService service, ITracingService tracing, IPluginExecutionContext pluginContext)
        {
            InvoiceService invoiceService = new InvoiceService(service, tracing);
            var imageInvoice = pluginContext.PreEntityImages["image"].ToEntity<Entities.nav_invoice>();
            invoiceService.SetAgreementFactSumma(imageInvoice, false);
        }
    }
}
