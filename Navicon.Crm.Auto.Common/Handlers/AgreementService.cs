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
    public sealed class AgreementService
    {
        private readonly IOrganizationService _service;
        private readonly ITracingService _tracing;
        public AgreementService(IOrganizationService service, ITracingService tracing)
        {
            _service = service ?? throw new ArgumentNullException(nameof(service));
            _tracing = tracing ?? throw new ArgumentNullException(nameof(tracing));
        }

        public void SetFirstAgreementsDateInContact(Entity target)
        {
            var agreement = target.ToEntity<nav_agreement>();
            var contact = _service.Retrieve(Contact.EntityLogicalName,
                agreement.nav_contactid.Id, new ColumnSet(Contact.Fields.nav_date))
                .ToEntity<Contact>();
            if (contact.nav_date is null)
            {
                contact.nav_date = agreement.nav_date;
                _service.Update(contact);
            }
        }

        public void CheckAndSetPayment(Entity target)
        {
            var agreement = target.ToEntity<nav_agreement>();
            decimal totalSumma;
            if (agreement.nav_summa != null)
            {
                totalSumma = agreement.nav_summa.Value;
            }
            else
            {
                totalSumma = _service.Retrieve(nav_agreement.EntityLogicalName, agreement.Id,
                new ColumnSet(nav_agreement.Fields.nav_summa)).ToEntity<nav_agreement>()
                .nav_summa.Value;
            }
            if (agreement.nav_factsumma.Value == totalSumma)
            {
                agreement.nav_fact = true;
            }
        }
    }
}
