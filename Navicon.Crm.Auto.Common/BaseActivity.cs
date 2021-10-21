using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Workflow;
using System;
using System.Activities;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Navicon.Crm.Auto.Common
{
    public abstract class BaseActivity : CodeActivity
    {
        protected override void Execute(CodeActivityContext context)
        {
            var tracing = context.GetExtension<ITracingService>();
            var serviceFactory = context.GetExtension<IOrganizationServiceFactory>();
            var service = serviceFactory.CreateOrganizationService(Guid.Empty);
            try
            {
                ExecuteActivityLogic(context, service, tracing);
            }
            catch(Exception ex)
            {
                throw new InvalidWorkflowException(ex.Message, ex);
            }
        }
        public abstract void ExecuteActivityLogic(CodeActivityContext context, IOrganizationService service, ITracingService tracing);
    }
}
