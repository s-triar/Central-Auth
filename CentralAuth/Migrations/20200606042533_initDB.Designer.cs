﻿// <auto-generated />
using System;
using CentralAuth.Datas;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace CentralAuth.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20200606042533_initDB")]
    partial class initDB
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.6-servicing-10079")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("CentralAuth.Commons.Models.AppRole", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Name")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256);

                    b.Property<string>("ProjectUrl")
                        .IsRequired();

                    b.Property<string>("ProjectUrl1");

                    b.HasKey("Id");

                    b.HasAlternateKey("ProjectUrl");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasName("RoleNameIndex");

                    b.HasIndex("ProjectUrl1");

                    b.ToTable("AspNetRoles");
                });

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

                    b.Property<string>("NamaCabang");

                    b.Property<DateTime?>("UpdatedAt");

                    b.Property<string>("UpdatedBy");

                    b.HasKey("Kode");

                    b.ToTable("Cabangs");
                });

            modelBuilder.Entity("CentralAuth.Commons.Models.BranchUnit", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("CabangKode");

                    b.Property<string>("UnitKode");

                    b.HasKey("Id");

                    b.HasIndex("CabangKode");

                    b.HasIndex("UnitKode");

                    b.ToTable("BranchUnit");
                });

            modelBuilder.Entity("CentralAuth.Commons.Models.Department", b =>
                {
                    b.Property<string>("Kode")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreatedAt");

                    b.Property<string>("CreatedBy");

                    b.Property<string>("DirektoratKode");

                    b.Property<string>("NamaDepartemen");

                    b.Property<DateTime?>("UpdatedAt");

                    b.Property<string>("UpdatedBy");

                    b.HasKey("Kode");

                    b.HasIndex("DirektoratKode");

                    b.ToTable("Departemens");
                });

            modelBuilder.Entity("CentralAuth.Commons.Models.Directorate", b =>
                {
                    b.Property<string>("Kode")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreatedAt");

                    b.Property<string>("CreatedBy");

                    b.Property<string>("NamaDirektorat");

                    b.Property<DateTime?>("UpdatedAt");

                    b.Property<string>("UpdatedBy");

                    b.HasKey("Kode");

                    b.ToTable("Directorates");
                });

            modelBuilder.Entity("CentralAuth.Commons.Models.Project", b =>
                {
                    b.Property<string>("Url")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ApiName");

                    b.Property<string>("ClientId");

                    b.Property<string>("ClientSecret");

                    b.Property<DateTime>("CreatedAt");

                    b.Property<string>("CreatedBy");

                    b.Property<string>("NamaProject");

                    b.Property<string>("ScopeApi");

                    b.Property<DateTime?>("UpdatedAt");

                    b.Property<string>("UpdatedBy");

                    b.Property<string>("UserDevNik");

                    b.HasKey("Url");

                    b.HasIndex("UserDevNik");

                    b.ToTable("Projects");
                });

            modelBuilder.Entity("CentralAuth.Commons.Models.SubDepartment", b =>
                {
                    b.Property<string>("Kode")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreatedAt");

                    b.Property<string>("CreatedBy");

                    b.Property<string>("DepartemenKode");

                    b.Property<string>("NamaSubDepartemen");

                    b.Property<DateTime?>("UpdatedAt");

                    b.Property<string>("UpdatedBy");

                    b.HasKey("Kode");

                    b.HasIndex("DepartemenKode");

                    b.ToTable("SubDepartemens");
                });

            modelBuilder.Entity("CentralAuth.Commons.Models.Unit", b =>
                {
                    b.Property<string>("Kode")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreatedAt");

                    b.Property<string>("CreatedBy");

                    b.Property<string>("Keterangan");

                    b.Property<string>("NamaUnit");

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

                    b.Property<string>("BranchKode");

                    b.Property<DateTime>("CreatedAt");

                    b.Property<string>("CreatedBy");

                    b.Property<string>("DepartemenKode");

                    b.Property<string>("DirektoratKode");

                    b.Property<string>("Email");

                    b.Property<string>("Ext");

                    b.Property<string>("Nama");

                    b.Property<string>("SubDepartemenKode");

                    b.Property<string>("UnitKode");

                    b.Property<DateTime?>("UpdatedAt");

                    b.Property<string>("UpdatedBy");

                    b.HasKey("Nik");

                    b.HasIndex("AtasanNik");

                    b.HasIndex("BranchKode");

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

                    b.Property<string>("ProjectUrl");

                    b.Property<string>("UserNik");

                    b.HasKey("Id");

                    b.HasIndex("ProjectUrl");

                    b.HasIndex("UserNik");

                    b.ToTable("UserProject");
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

            modelBuilder.Entity("CentralAuth.Commons.Models.AppRole", b =>
                {
                    b.HasOne("CentralAuth.Commons.Models.Project", "Project")
                        .WithMany("Roles")
                        .HasForeignKey("ProjectUrl1");
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
                    b.HasOne("CentralAuth.Commons.Models.User", "UserDev")
                        .WithMany("DevProjects")
                        .HasForeignKey("UserDevNik");
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

                    b.HasOne("CentralAuth.Commons.Models.Branch")
                        .WithMany("Users")
                        .HasForeignKey("BranchKode");

                    b.HasOne("CentralAuth.Commons.Models.Department", "Departemen")
                        .WithMany("Users")
                        .HasForeignKey("DepartemenKode");

                    b.HasOne("CentralAuth.Commons.Models.Directorate", "Direktorat")
                        .WithMany("Users")
                        .HasForeignKey("DirektoratKode");

                    b.HasOne("CentralAuth.Commons.Models.SubDepartment", "SubDepartemen")
                        .WithMany("Users")
                        .HasForeignKey("SubDepartemenKode");

                    b.HasOne("CentralAuth.Commons.Models.Unit")
                        .WithMany("Users")
                        .HasForeignKey("UnitKode");
                });

            modelBuilder.Entity("CentralAuth.Commons.Models.UserProject", b =>
                {
                    b.HasOne("CentralAuth.Commons.Models.Project", "Project")
                        .WithMany("Users")
                        .HasForeignKey("ProjectUrl");

                    b.HasOne("CentralAuth.Commons.Models.User", "User")
                        .WithMany("Projects")
                        .HasForeignKey("UserNik");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("CentralAuth.Commons.Models.AppRole")
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
                    b.HasOne("CentralAuth.Commons.Models.AppRole")
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