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

        public void SetDefaultTypeIfNull(Entity target)
        {
            if (target.GetAttributeValue<object>("nav_type") is null)
            {
                var invoice = new nav_invoice();
                invoice.nav_type = nav_invoice_nav_type.Ruchnoe_sozdanie;
                target["nav_type"] = invoice["nav_type"];
            }
        }

        public void SetAgreementFactSumma(object target, bool increase)
        {
            var invoice = GetInvoice(target);
            if (invoice.nav_dogovorid is null || invoice.nav_amount is null
                || invoice.nav_fact is null || invoice.nav_fact == false)
            {
                return;
            }
            var agreement =_service.Retrieve(nav_agreement.EntityLogicalName, invoice.nav_dogovorid.Id,
                new ColumnSet(nav_agreement.Fields.nav_factsumma, nav_agreement.Fields.nav_summa))
                .ToEntity<nav_agreement>();
            if (increase)
            {
                IncFactSumma(agreement, invoice);
            }
            else
            {
                DecFactSumma(agreement, invoice);
            }
        }

        private nav_invoice GetInvoice(object target)
        {
            nav_invoice targetInvoice = target is Entity ? (target as Entity).ToEntity<nav_invoice>() : null;
            if (targetInvoice is null)
            {
                var targetRef = target as EntityReference;
                targetInvoice = _service.Retrieve(nav_invoice.EntityLogicalName, targetRef.Id,
                    new ColumnSet(nav_invoice.Fields.nav_fact, nav_invoice.Fields.nav_dogovorid,
                    nav_invoice.Fields.nav_amount)).ToEntity<nav_invoice>();
            }
            else
            {
                if (targetInvoice.nav_dogovorid is null)
                {
                    targetInvoice.nav_dogovorid = _service.Retrieve(nav_invoice.EntityLogicalName,
                        targetInvoice.Id,
                        new ColumnSet(nav_invoice.Fields.nav_dogovorid)).ToEntity<nav_invoice>()
                        .nav_dogovorid;
                }
                if (targetInvoice.nav_amount is null)
                {
                    targetInvoice.nav_amount = _service.Retrieve(nav_invoice.EntityLogicalName,
                        targetInvoice.Id,
                        new ColumnSet(nav_invoice.Fields.nav_amount)).ToEntity<nav_invoice>()
                        .nav_amount;
                }
            }
            return targetInvoice;
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
                agreement.nav_factsumma = new Money();
            }
            if (newFactSumma <= agreement.nav_summa.Value)
            {
                agreement.nav_factsumma.Value = newFactSumma;
                invoice.nav_paydate = DateTime.Now;
                _service.Update(agreement);
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
                agreement.nav_factsumma.Value -= invoice.nav_amount.Value;
            }
            _service.Update(agreement);
        }
    }
}
