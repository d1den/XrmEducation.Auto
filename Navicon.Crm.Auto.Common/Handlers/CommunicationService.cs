using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Navicon.Crm.Auto.Entities;
using Microsoft.Xrm.Sdk.Query;

namespace Navicon.Crm.Auto.Common.Handlers
{
    public sealed class CommunicationService
    {
        private readonly IOrganizationService _service;
        private readonly ITracingService _tracing;
        public CommunicationService(IOrganizationService service, ITracingService tracing)
        {
            _service = service ?? throw new ArgumentNullException(nameof(service));
            _tracing = tracing ?? throw new ArgumentNullException(nameof(tracing));
        }

        public void CheckForMainDublicate(Entity target)
        {
            var communication = target.ToEntity<nav_communication>();

            bool? isMain = false;
            EntityReference contactId;
            nav_communication_nav_type? type;

            if (TryGetCommunicationFromDB(communication.Id, out nav_communication communicationFromDB))
            {
                isMain = communication.nav_main ?? communicationFromDB.nav_main;
                contactId = communication.nav_contactid ?? communicationFromDB.nav_contactid;
                type = communication.nav_type ?? communicationFromDB.nav_type;
            }
            else
            {
                isMain = communication.nav_main;
                contactId = communication.nav_contactid;
                type = communication.nav_type;
            }
            if (contactId is null || type is null || isMain == false)
            {
                return;
            }

            QueryExpression query = new QueryExpression(nav_communication.EntityLogicalName);
            query.ColumnSet = new ColumnSet(null);
            query.Criteria.AddCondition(nav_communication.Fields.nav_contactid, ConditionOperator.Equal, contactId.Id);
            query.Criteria.AddCondition(nav_communication.Fields.nav_main, ConditionOperator.Equal, true);
            query.Criteria.AddCondition(nav_communication.Fields.nav_type, ConditionOperator.Equal, (int)type);

            var sameCommunications = _service.RetrieveMultiple(query).Entities;
            if (sameCommunications != null && sameCommunications.Count > 0)
            {
                throw new InvalidPluginExecutionException($"Средство связи такого контакта с основным " +
                    $"{ (type == nav_communication_nav_type.E_mail ? "E-Mail" : "телефоном")} " +
                    $"уже существует!");
            }
        }

        private bool TryGetCommunicationFromDB(Guid id, out nav_communication communication)
        {
            communication = null;
            try
            {
                communication = _service.Retrieve(nav_communication.EntityLogicalName, id, new ColumnSet(
                    nav_communication.Fields.nav_contactid,
                    nav_communication.Fields.nav_main,
                    nav_communication.Fields.nav_type))
                    .ToEntity<nav_communication>();
                return true;
            }
            catch 
            {
                return false;
            }
        }
    }
}
