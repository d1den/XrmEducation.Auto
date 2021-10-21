using Microsoft.Xrm.Tooling.Connector;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Navicon.Crm.Auto.ConsoleTest
{
    class Program
    {
        static void Main(string[] args)
        {
            //ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            //var connectionString = "AuthType=OAuth; Url=https://org4a36adb8.api.crm4.dynamics.com/; " +
            //    "Username=admin@d1den10trial.onmicrosoft.com; Password=dDenisov0510; " +
            //    "RequireNewInstance=true; " +
            //    "AppId=147b325e-5aef-40d1-9b8b-0e1798b13f70; " +
            //    "RedirectUri=app://unq147b325e5aef40d19b8b0e1798b13";
            //CrmServiceClient client = new CrmServiceClient(connectionString);
            //if (client.LastCrmException != null)
            //{
            //    Console.WriteLine(client.LastCrmException.Message);
            //}

            //Console.ReadKey();
            DateTime date = new DateTime(2012, 11, 1);
            Console.WriteLine(date.ToLongDateString());
        }
    }
}
