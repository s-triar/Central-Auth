using CentralAuth.Commons.IdentityServerModels;
using CentralAuth.Commons.Models;
using IdentityServer4.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace CentralAuth.Datas
{
    public class AppDbContext : IdentityDbContext<AppUser, IdentityRole, string>
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Directorate> Directorates { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<SubDepartment> SubDepartments { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Unit> Units { get; set; }
        public DbSet<Branch> Branches { get; set; }
        public DbSet<ProjectToProject> ProjectToProjects { get; set; }
        public DbSet<UserProject> UserProjects { get; set; }
        public DbSet<BranchUnit> BranchUnits { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Branch>()
                   .HasIndex(b => b.Singkatan)
                   .IsUnique();
            builder.Entity<Project>()
                   .HasIndex(b => b.ClientId)
                   .IsUnique();
        }
    }
}
