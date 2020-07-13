﻿// <auto-generated />
using System;
using CentralAuth.Datas;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace CentralAuth.Migrations.Db.AppDb
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20200706012911_addProjectClaimAddRelation")]
    partial class addProjectClaimAddRelation
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.6-servicing-10079")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("CentralAuth.Commons.Models.AppUser", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("AccessFailedCount");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("DetailNik")
                        .IsRequired();

                    b.Property<string>("DetailNik1");

                    b.Property<string>("Email")
                        .HasMaxLength(256);

                    b.Property<bool>("EmailConfirmed");

                    b.Property<bool>("LockoutEnabled");

                    b.Property<DateTimeOffset?>("LockoutEnd");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256);

                    b.Property<string>("PasswordHash");

                    b.Property<string>("PhoneNumber");

                    b.Property<bool>("PhoneNumberConfirmed");

                    b.Property<string>("SecurityStamp");

                    b.Property<bool>("TwoFactorEnabled");

                    b.Property<string>("UserName")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasAlternateKey("DetailNik");

                    b.HasIndex("DetailNik1");

                    b.HasIndex("NormalizedEmail")
                        .HasName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasName("UserNameIndex");

                    b.ToTable("AspNetUsers");
                });

            modelBuilder.Entity("CentralAuth.Commons.Models.Branch", b =>
                {
                    b.Property<string>("Kode")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Alamat");

                    b.Property<DateTime>("CreatedAt");

                    b.Property<string>("CreatedBy");

                    b.Property<string>("Keterangan");

                    b.Property<string>("NamaCabang")
                        .IsRequired();

                    b.Property<string>("Singkatan")
                        .IsRequired();

                    b.Property<DateTime?>("UpdatedAt");

                    b.Property<string>("UpdatedBy");

                    b.HasKey("Kode");

                    b.HasIndex("Singkatan")
                        .IsUnique();

                    b.ToTable("Branches");
                });

            modelBuilder.Entity("CentralAuth.Commons.Models.BranchUnit", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("CabangKode");

                    b.Property<DateTime>("CreatedAt");

                    b.Property<string>("CreatedBy");

                    b.Property<string>("UnitKode");

                    b.Property<DateTime?>("UpdatedAt");

                    b.Property<string>("UpdatedBy");

                    b.HasKey("Id");

                    b.HasIndex("CabangKode");

                    b.HasIndex("UnitKode");

                    b.ToTable("BranchUnits");
                });

            modelBuilder.Entity("CentralAuth.Commons.Models.Department", b =>
                {
                    b.Property<string>("Kode")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreatedAt");

                    b.Property<string>("CreatedBy");

                    b.Property<string>("DirektoratKode");

                    b.Property<string>("NamaDepartemen")
                        .IsRequired();

                    b.Property<DateTime?>("UpdatedAt");

                    b.Property<string>("UpdatedBy");

                    b.HasKey("Kode");

                    b.HasIndex("DirektoratKode");

                    b.ToTable("Departments");
                });

            modelBuilder.Entity("CentralAuth.Commons.Models.Directorate", b =>
                {
                    b.Property<string>("Kode")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreatedAt");

                    b.Property<string>("CreatedBy");

                    b.Property<string>("NamaDirektorat")
                        .IsRequired();

                    b.Property<DateTime?>("UpdatedAt");

                    b.Property<string>("UpdatedBy");

                    b.HasKey("Kode");

                    b.ToTable("Directorates");
                });

            modelBuilder.Entity("CentralAuth.Commons.Models.Project", b =>
                {
                    b.Property<string>("ApiName")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClientId");

                    b.Property<string>("ClientSecret");

                    b.Property<DateTime>("CreatedAt");

                    b.Property<string>("CreatedBy");

                    b.Property<string>("DeveloperNik");

                    b.Property<string>("NamaProject")
                        .IsRequired();

                    b.Property<string>("Type")
                        .IsRequired();

                    b.Property<DateTime?>("UpdatedAt");

                    b.Property<string>("UpdatedBy");

                    b.Property<string>("Url")
                        .IsRequired();

                    b.HasKey("ApiName");

                    b.HasIndex("ClientId")
                        .IsUnique();

                    b.HasIndex("DeveloperNik");

                    b.ToTable("Projects");
                });

            modelBuilder.Entity("CentralAuth.Commons.Models.ProjectClaim", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimName")
                        .IsRequired();

                    b.Property<DateTime>("CreatedAt");

                    b.Property<string>("CreatedBy");

                    b.Property<string>("ProjekApiName")
                        .IsRequired();

                    b.Property<DateTime?>("UpdatedAt");

                    b.Property<string>("UpdatedBy");

                    b.HasKey("Id");

                    b.HasIndex("ProjekApiName");

                    b.ToTable("ProjectClaims");
                });

            modelBuilder.Entity("CentralAuth.Commons.Models.ProjectToProject", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<bool?>("Approve");

                    b.Property<DateTime>("CreatedAt");

                    b.Property<string>("CreatedBy");

                    b.Property<string>("KolaborasiApiName")
                        .IsRequired();

                    b.Property<string>("ProjekApiName")
                        .IsRequired();

                    b.Property<DateTime?>("UpdatedAt");

                    b.Property<string>("UpdatedBy");

                    b.HasKey("Id");

                    b.HasIndex("KolaborasiApiName");

                    b.HasIndex("ProjekApiName");

                    b.ToTable("ProjectToProjects");
                });

            modelBuilder.Entity("CentralAuth.Commons.Models.SubDepartment", b =>
                {
                    b.Property<string>("Kode")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreatedAt");

                    b.Property<string>("CreatedBy");

                    b.Property<string>("DepartemenKode");

                    b.Property<string>("NamaSubDepartemen")
                        .IsRequired();

                    b.Property<DateTime?>("UpdatedAt");

                    b.Property<string>("UpdatedBy");

                    b.HasKey("Kode");

                    b.HasIndex("DepartemenKode");

                    b.ToTable("SubDepartments");
                });

            modelBuilder.Entity("CentralAuth.Commons.Models.Unit", b =>
                {
                    b.Property<string>("Kode")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreatedAt");

                    b.Property<string>("CreatedBy");

                    b.Property<string>("Keterangan");

                    b.Property<string>("NamaUnit")
                        .IsRequired();

                    b.Property<DateTime?>("UpdatedAt");

                    b.Property<string>("UpdatedBy");

                    b.HasKey("Kode");

                    b.ToTable("Units");
                });

            modelBuilder.Entity("CentralAuth.Commons.Models.User", b =>
                {
                    b.Property<string>("Nik")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("AtasanNik");

                    b.Property<string>("CabangKode");

                    b.Property<DateTime>("CreatedAt");

                    b.Property<string>("CreatedBy");

                    b.Property<string>("DepartemenKode");

                    b.Property<string>("DirektoratKode");

                    b.Property<string>("Email")
                        .IsRequired();

                    b.Property<string>("Ext");

                    b.Property<string>("Nama")
                        .IsRequired();

                    b.Property<string>("SubDepartemenKode");

                    b.Property<string>("UnitKode");

                    b.Property<DateTime?>("UpdatedAt");

                    b.Property<string>("UpdatedBy");

                    b.HasKey("Nik");

                    b.HasIndex("AtasanNik");

                    b.HasIndex("CabangKode");

                    b.HasIndex("DepartemenKode");

                    b.HasIndex("DirektoratKode");

                    b.HasIndex("SubDepartemenKode");

                    b.HasIndex("UnitKode");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("CentralAuth.Commons.Models.UserProject", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreatedAt");

                    b.Property<string>("CreatedBy");

                    b.Property<string>("PenggunaNik");

                    b.Property<string>("ProjekApiName");

                    b.Property<DateTime?>("UpdatedAt");

                    b.Property<string>("UpdatedBy");

                    b.HasKey("Id");

                    b.HasIndex("PenggunaNik");

                    b.HasIndex("ProjekApiName");

                    b.ToTable("UserProjects");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Name")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256);

                    b.Property<string>("ProjectApiName");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasName("RoleNameIndex");

                    b.HasIndex("ProjectApiName");

                    b.ToTable("AspNetRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<string>("RoleId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<string>("UserId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider");

                    b.Property<string>("ProviderKey");

                    b.Property<string>("ProviderDisplayName");

                    b.Property<string>("UserId")
                        .IsRequired();

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId");

                    b.Property<string>("RoleId");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId");

                    b.Property<string>("LoginProvider");

                    b.Property<string>("Name");

                    b.Property<string>("Value");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens");
                });

            modelBuilder.Entity("CentralAuth.Commons.Models.AppUser", b =>
                {
                    b.HasOne("CentralAuth.Commons.Models.User", "Detail")
                        .WithMany()
                        .HasForeignKey("DetailNik1");
                });

            modelBuilder.Entity("CentralAuth.Commons.Models.BranchUnit", b =>
                {
                    b.HasOne("CentralAuth.Commons.Models.Branch", "Cabang")
                        .WithMany("CabangUnits")
                        .HasForeignKey("CabangKode");

                    b.HasOne("CentralAuth.Commons.Models.Unit", "Unit")
                        .WithMany("CabangUnits")
                        .HasForeignKey("UnitKode");
                });

            modelBuilder.Entity("CentralAuth.Commons.Models.Department", b =>
                {
                    b.HasOne("CentralAuth.Commons.Models.Directorate", "Direktorat")
                        .WithMany("Departemens")
                        .HasForeignKey("DirektoratKode");
                });

            modelBuilder.Entity("CentralAuth.Commons.Models.Project", b =>
                {
                    b.HasOne("CentralAuth.Commons.Models.User", "Developer")
                        .WithMany("DevProjeks")
                        .HasForeignKey("DeveloperNik");
                });

            modelBuilder.Entity("CentralAuth.Commons.Models.ProjectClaim", b =>
                {
                    b.HasOne("CentralAuth.Commons.Models.Project", "Projek")
                        .WithMany("ProjectClaims")
                        .HasForeignKey("ProjekApiName")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("CentralAuth.Commons.Models.ProjectToProject", b =>
                {
                    b.HasOne("CentralAuth.Commons.Models.Project", "Kolaborasi")
                        .WithMany()
                        .HasForeignKey("KolaborasiApiName")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("CentralAuth.Commons.Models.Project", "Projek")
                        .WithMany()
                        .HasForeignKey("ProjekApiName")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("CentralAuth.Commons.Models.SubDepartment", b =>
                {
                    b.HasOne("CentralAuth.Commons.Models.Department", "Departemen")
                        .WithMany("SubDepartemens")
                        .HasForeignKey("DepartemenKode");
                });

            modelBuilder.Entity("CentralAuth.Commons.Models.User", b =>
                {
                    b.HasOne("CentralAuth.Commons.Models.User", "Atasan")
                        .WithMany("Bawahans")
                        .HasForeignKey("AtasanNik");

                    b.HasOne("CentralAuth.Commons.Models.Branch", "Cabang")
                        .WithMany("Users")
                        .HasForeignKey("CabangKode");

                    b.HasOne("CentralAuth.Commons.Models.Department", "Departemen")
                        .WithMany("Users")
                        .HasForeignKey("DepartemenKode");

                    b.HasOne("CentralAuth.Commons.Models.Directorate", "Direktorat")
                        .WithMany("Users")
                        .HasForeignKey("DirektoratKode");

                    b.HasOne("CentralAuth.Commons.Models.SubDepartment", "SubDepartemen")
                        .WithMany("Users")
                        .HasForeignKey("SubDepartemenKode");

                    b.HasOne("CentralAuth.Commons.Models.Unit", "Unit")
                        .WithMany("Users")
                        .HasForeignKey("UnitKode");
                });

            modelBuilder.Entity("CentralAuth.Commons.Models.UserProject", b =>
                {
                    b.HasOne("CentralAuth.Commons.Models.User", "Pengguna")
                        .WithMany("Projeks")
                        .HasForeignKey("PenggunaNik");

                    b.HasOne("CentralAuth.Commons.Models.Project", "Projek")
                        .WithMany("Users")
                        .HasForeignKey("ProjekApiName");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole", b =>
                {
                    b.HasOne("CentralAuth.Commons.Models.Project")
                        .WithMany("Roles")
                        .HasForeignKey("ProjectApiName");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole")
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("CentralAuth.Commons.Models.AppUser")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("CentralAuth.Commons.Models.AppUser")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole")
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("CentralAuth.Commons.Models.AppUser")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.HasOne("CentralAuth.Commons.Models.AppUser")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}