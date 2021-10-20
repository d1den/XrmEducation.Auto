using System;
using Microsoft.Xrm.Sdk;

namespace Navicon.Crm.Auto.Common
{
    /// <summary>
    /// Базовый класс плагинов
    /// </summary>
    public abstract class BasePlugin : IPlugin
    {
        /// <summary>
        /// Метод выполнения плагина. 
        /// Реализует получение основных сервисов и вызов метода исполнения логики в блоке обработки ошибок.
        /// </summary>
        public virtual void Execute(IServiceProvider serviceProvider)
        {
            var pluginContext = serviceProvider.GetService(typeof(IPluginExecutionContext)) as IPluginExecutionContext;
            var traceService = serviceProvider.GetService(typeof(ITracingService)) as ITracingService;
            var serviceFactory = serviceProvider.GetService(typeof(IOrganizationServiceFactory)) as IOrganizationServiceFactory;
            var service = serviceFactory.CreateOrganizationService(null);
            var target = pluginContext.InputParameters["Target"];
            try
            {
                ExecutePluginLogic(target, service, traceService, pluginContext);
            }
            catch(Exception ex)
            {
                traceService.Trace(ex.ToString());
                throw new InvalidPluginExecutionException(ex.Message);
            }
        }
        /// <summary>
        /// Выполняется в блоке try-catch
        /// </summary>
        /// <param name="target">Целевой объект запроса - может быть Entity или EntityReference</param>
        /// <param name="service">Сервис для доступа к данным</param>
        /// <param name="tracing">Сервис для ведения логов ошибок</param>
        public abstract void ExecutePluginLogic(object target, IOrganizationService service, ITracingService tracing, IPluginExecutionContext pluginContext);
    }
}
