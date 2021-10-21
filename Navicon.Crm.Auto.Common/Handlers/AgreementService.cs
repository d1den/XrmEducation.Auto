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

        public void SetDateInContact(Entity target)
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
        public bool HasRelatedInvoices(EntityReference entityReference)
        {
            QueryExpression query = new QueryExpression(nav_invoice.EntityLogicalName);
            query.ColumnSet = new ColumnSet(null);
            query.Criteria.AddCondition(nav_invoice.Fields.nav_dogovorid, ConditionOperator.Equal, entityReference.Id);

            var invoices = _service.RetrieveMultiple(query);
            if (invoices.Entities?.Count > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        public bool HasFactInvoices(EntityReference entityReference)
        {
            QueryExpression query = new QueryExpression(nav_invoice.EntityLogicalName);
            query.ColumnSet = new ColumnSet(null);
            query.Criteria.AddCondition(nav_invoice.Fields.nav_dogovorid, ConditionOperator.Equal, entityReference.Id);
            query.Criteria.AddCondition(nav_invoice.Fields.nav_fact, ConditionOperator.Equal, true);
            var invoices = _service.RetrieveMultiple(query);
            if (invoices.Entities?.Count > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        public bool HasRujnoeTypeInvoices(EntityReference entityReference)
        {
            QueryExpression query = new QueryExpression(nav_invoice.EntityLogicalName);
            query.ColumnSet = new ColumnSet(null);
            query.Criteria.AddCondition(nav_invoice.Fields.nav_dogovorid, ConditionOperator.Equal, entityReference.Id);
            query.Criteria.AddCondition(nav_invoice.Fields.nav_type, ConditionOperator.Equal, (int)nav_invoice_nav_type.Ruchnoe_sozdanie);
            var invoices = _service.RetrieveMultiple(query);
            if (invoices.Entities?.Count > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        public void DeleteRelatedAutoInvoices(EntityReference entityReference)
        {
            QueryExpression query = new QueryExpression(nav_invoice.EntityLogicalName);
            query.ColumnSet = new ColumnSet(null);
            query.Criteria.AddCondition(nav_invoice.Fields.nav_dogovorid, ConditionOperator.Equal, entityReference.Id);
            query.Criteria.AddCondition(nav_invoice.Fields.nav_type, ConditionOperator.Equal, (int)nav_invoice_nav_type.Avtomaticheskoe_sozdanie);
            var invoices = _service.RetrieveMultiple(query);
            foreach(var entity in invoices.Entities)
            {
                _service.Delete(nav_invoice.EntityLogicalName, entity.Id);
            }
        }
        public void CreatePaymentPlan(EntityReference entityReference)
        {
            nav_agreement agreement = _service.Retrieve(nav_agreement.EntityLogicalName, entityReference.Id,
                new ColumnSet(
                    nav_agreement.Fields.nav_name,
                    nav_agreement.Fields.nav_creditperiod,
                    nav_agreement.Fields.nav_creditamount
                )).ToEntity<nav_agreement>();
            if(agreement.nav_creditperiod is null 
                || agreement.nav_creditamount is null)
            {
                return;
            }
            int invoicesCount = (int)agreement.nav_creditperiod * 12;
            int month = DateTime.Now.Month;
            int year = DateTime.Now.Year;
            decimal invoiceSumma = agreement.nav_creditamount.Value / invoicesCount;
            for (int i = 0; i < invoicesCount; i++)
            {
                if (month == 12)
                {
                    month = 1;
                    year++;
                }
                else
                {
                    month++;
                }
                nav_invoice newInvoice = new nav_invoice();
                newInvoice.nav_name = $"Счёт №{i + 1} по договору {agreement.nav_name}";
                var invoiceDate = new DateTime(year, month, 1);
                newInvoice.nav_date = invoiceDate;
                newInvoice.nav_paydate = invoiceDate;
                newInvoice.nav_dogovorid = agreement.ToEntityReference();
                newInvoice.nav_type = nav_invoice_nav_type.Avtomaticheskoe_sozdanie;
                newInvoice.nav_amount = new Money(invoiceSumma);
                _service.Create(newInvoice);
            }
        }

        public void SetPaymentPlanDate(EntityReference entityReference)
        {
            _service.Update(new nav_agreement(entityReference.Id) { nav_paymentplandate = DateTime.Now.AddDays(1) });
        }
    }
}
