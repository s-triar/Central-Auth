using IdentityServer4.EntityFramework.DbContexts;
using IdentityServer4.EntityFramework.Options;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Datas
{
    public class AppPersistentDbContext : PersistedGrantDbContext
    {
        public AppPersistentDbContext(DbContextOptions<PersistedGrantDbContext> options,
        OperationalStoreOptions storeOptions)
        : base(options, storeOptions)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                base.OnConfiguring(optionsBuilder);
            }
        }
    }
}
