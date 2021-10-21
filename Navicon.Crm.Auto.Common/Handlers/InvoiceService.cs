using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using Navicon.Crm.Auto.Entities;

namespace Navicon.Crm.Auto.Common.Handlers
{
    public sealed class InvoiceService
    {
        private readonly IOrganizationService _service;
        private readonly ITracingService _tracing;
        public InvoiceService(IOrganizationService service, ITracingService tracing)
        {
            _service = service ?? throw new ArgumentNullException(nameof(service));
            _tracing = tracing ?? throw new ArgumentNullException(nameof(tracing));
        }

        public void SetDefaultTypeIfNull(nav_invoice target)
        {
            if (target.nav_type is null)
            {
                target.nav_type = nav_invoice_nav_type.Ruchnoe_sozdanie;
            }
        }

        public void SetAgreementFactSumma(nav_invoice target, bool increase)
        {
            if (target.nav_dogovorid is null || target.nav_amount is null
                || target.nav_fact is null || target.nav_fact == false)
            {
                return;
            }
            var agreement =_service.Retrieve(nav_agreement.EntityLogicalName, target.nav_dogovorid.Id,
                new ColumnSet(nav_agreement.Fields.nav_factsumma, nav_agreement.Fields.nav_summa))
                .ToEntity<nav_agreement>();
            if (increase)
            {
                IncFactSumma(agreement, target);
            }
            else
            {
                DecFactSumma(agreement, target);
            }
        }
        public void UpdateTargetByImage(nav_invoice target, nav_invoice image)
        {
            if (target.nav_dogovorid is null)
            {
                target.nav_dogovorid = image.nav_dogovorid;
            }
            if (target.nav_amount is null)
            {
                target.nav_amount = image.nav_amount;
            }
        }
        private void IncFactSumma(nav_agreement agreement, nav_invoice invoice)
        {
            decimal newFactSumma;
            if (agreement.nav_factsumma != null)
            {
                newFactSumma = agreement.nav_factsumma.Value + invoice.nav_amount.Value;
            }
            else
            {
                newFactSumma = invoice.nav_amount.Value;
            }
            if (newFactSumma <= agreement.nav_summa.Value)
            {
                invoice.nav_paydate = DateTime.Now;
                _service.Update(new nav_agreement(agreement.Id) { nav_factsumma = new Money(newFactSumma) });
            }
            else
            {
                throw new InvalidPluginExecutionException("Сумма счёта больше, чем нужна для закрытия договора!");
            }
        }
        private void DecFactSumma(nav_agreement agreement, nav_invoice invoice)
        {
            if (agreement.nav_factsumma != null)
            {
                var factSumma = agreement.nav_factsumma.Value - invoice.nav_amount.Value;
                _service.Update(new nav_agreement(agreement.Id) { nav_factsumma = new Money(factSumma) });
            }
        }
    }
}
