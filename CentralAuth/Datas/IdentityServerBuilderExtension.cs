using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace CentralAuth.Datas
{
    public static class IdentityServerBuilderExtension
    {
        public static IIdentityServerBuilder AddEFConfigurationStore(
            this IIdentityServerBuilder builder, string connectionString)
        {
            string assemblyNamespace = typeof(IdentityServerBuilderExtension)
                .GetTypeInfo()
                .Assembly
                .GetName()
                .Name;

            builder.AddConfigurationStore(options =>
                options.ConfigureDbContext = b =>
                    b.UseMySql(connectionString, optionsBuilder =>
                        optionsBuilder.MigrationsAssembly(assemblyNamespace)
                    )
            );

            return builder;
        }
    }
}
