using Microsoft.Xrm.Sdk;
using Navicon.Crm.Auto.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Navicon.Crm.Auto.Common;
using Navicon.Crm.Auto.Common.Handlers;

namespace Navicon.Crm.Auto.Plugins.nav_agreement
{
    public sealed class PostAgreementCreate : BasePlugin
    {

        public override void ExecutePluginLogic(object target, IOrganizationService service, ITracingService tracing, IPluginExecutionContext pluginContext)
        {
            var targetEntity = target as Entity;
            AgreementService agreementService = new AgreementService(service, tracing);
            agreementService.SetDateInContact(targetEntity);
        }
    }
}
