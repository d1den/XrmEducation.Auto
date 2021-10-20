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
    public sealed class PreInvoiceCreate : BasePlugin
    {
        public override void ExecutePluginLogic(object target, IOrganizationService service, ITracingService tracing, IPluginExecutionContext pluginContext)
        {
            var targetInvoice = target as Entity;
            InvoiceService invoiceService = new InvoiceService(service, tracing);
            invoiceService.SetDefaultTypeIfNull(targetInvoice);
        }
    }
}
