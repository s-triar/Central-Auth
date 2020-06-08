using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CentralAuth.Migrations
{
    public partial class initDB : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Cabangs",
                columns: table => new
                {
                    Kode = table.Column<string>(nullable: false),
                    NamaCabang = table.Column<string>(nullable: true),
                    Keterangan = table.Column<string>(nullable: true),
                    Alamat = table.Column<string>(nullable: true),
                    CreatedAt = table.Column<DateTime>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    UpdatedAt = table.Column<DateTime>(nullable: true),
                    UpdatedBy = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cabangs", x => x.Kode);
                });

            migrationBuilder.CreateTable(
                name: "Directorates",
                columns: table => new
                {
                    Kode = table.Column<string>(nullable: false),
                    NamaDirektorat = table.Column<string>(nullable: true),
                    CreatedAt = table.Column<DateTime>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    UpdatedAt = table.Column<DateTime>(nullable: true),
                    UpdatedBy = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Directorates", x => x.Kode);
                });

            migrationBuilder.CreateTable(
                name: "Units",
                columns: table => new
                {
                    Kode = table.Column<string>(nullable: false),
                    NamaUnit = table.Column<string>(nullable: true),
                    Keterangan = table.Column<string>(nullable: true),
                    CreatedAt = table.Column<DateTime>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    UpdatedAt = table.Column<DateTime>(nullable: true),
                    UpdatedBy = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Units", x => x.Kode);
                });

            migrationBuilder.CreateTable(
                name: "Departemens",
                columns: table => new
                {
                    Kode = table.Column<string>(nullable: false),
                    NamaDepartemen = table.Column<string>(nullable: true),
                    CreatedAt = table.Column<DateTime>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    UpdatedAt = table.Column<DateTime>(nullable: true),
                    UpdatedBy = table.Column<string>(nullable: true),
                    DirektoratKode = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Departemens", x => x.Kode);
                    table.ForeignKey(
                        name: "FK_Departemens_Directorates_DirektoratKode",
                        column: x => x.DirektoratKode,
                        principalTable: "Directorates",
                        principalColumn: "Kode",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "BranchUnit",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CabangKode = table.Column<string>(nullable: true),
                    UnitKode = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BranchUnit", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BranchUnit_Cabangs_CabangKode",
                        column: x => x.CabangKode,
                        principalTable: "Cabangs",
                        principalColumn: "Kode",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BranchUnit_Units_UnitKode",
                        column: x => x.UnitKode,
                        principalTable: "Units",
                        principalColumn: "Kode",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SubDepartemens",
                columns: table => new
                {
                    Kode = table.Column<string>(nullable: false),
                    NamaSubDepartemen = table.Column<string>(nullable: true),
                    CreatedAt = table.Column<DateTime>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    UpdatedAt = table.Column<DateTime>(nullable: true),
                    UpdatedBy = table.Column<string>(nullable: true),
                    DepartemenKode = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubDepartemens", x => x.Kode);
                    table.ForeignKey(
                        name: "FK_SubDepartemens_Departemens_DepartemenKode",
                        column: x => x.DepartemenKode,
                        principalTable: "Departemens",
                        principalColumn: "Kode",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Nik = table.Column<string>(nullable: false),
                    Nama = table.Column<string>(nullable: true),
                    Email = table.Column<string>(nullable: true),
                    Ext = table.Column<string>(nullable: true),
                    CreatedAt = table.Column<DateTime>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    UpdatedAt = table.Column<DateTime>(nullable: true),
                    UpdatedBy = table.Column<string>(nullable: true),
                    AtasanNik = table.Column<string>(nullable: true),
                    SubDepartemenKode = table.Column<string>(nullable: true),
                    DepartemenKode = table.Column<string>(nullable: true),
                    DirektoratKode = table.Column<string>(nullable: true),
                    BranchKode = table.Column<string>(nullable: true),
                    UnitKode = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Nik);
                    table.ForeignKey(
                        name: "FK_Users_Users_AtasanNik",
                        column: x => x.AtasanNik,
                        principalTable: "Users",
                        principalColumn: "Nik",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Users_Cabangs_BranchKode",
                        column: x => x.BranchKode,
                        principalTable: "Cabangs",
                        principalColumn: "Kode",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Users_Departemens_DepartemenKode",
                        column: x => x.DepartemenKode,
                        principalTable: "Departemens",
                        principalColumn: "Kode",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Users_Directorates_DirektoratKode",
                        column: x => x.DirektoratKode,
                        principalTable: "Directorates",
                        principalColumn: "Kode",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Users_SubDepartemens_SubDepartemenKode",
                        column: x => x.SubDepartemenKode,
                        principalTable: "SubDepartemens",
                        principalColumn: "Kode",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Users_Units_UnitKode",
                        column: x => x.UnitKode,
                        principalTable: "Units",
                        principalColumn: "Kode",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    UserName = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(maxLength: 256, nullable: true),
                    Email = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(nullable: false),
                    PasswordHash = table.Column<string>(nullable: true),
                    SecurityStamp = table.Column<string>(nullable: true),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    PhoneNumber = table.Column<string>(nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(nullable: false),
                    TwoFactorEnabled = table.Column<bool>(nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(nullable: true),
                    LockoutEnabled = table.Column<bool>(nullable: false),
                    AccessFailedCount = table.Column<int>(nullable: false),
                    DetailNik = table.Column<string>(nullable: false),
                    DetailNik1 = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                    table.UniqueConstraint("AK_AspNetUsers_DetailNik", x => x.DetailNik);
                    table.ForeignKey(
                        name: "FK_AspNetUsers_Users_DetailNik1",
                        column: x => x.DetailNik1,
                        principalTable: "Users",
                        principalColumn: "Nik",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    Url = table.Column<string>(nullable: false),
                    NamaProject = table.Column<string>(nullable: true),
                    ClientId = table.Column<string>(nullable: true),
                    ClientSecret = table.Column<string>(nullable: true),
                    ApiName = table.Column<string>(nullable: true),
                    ScopeApi = table.Column<string>(nullable: true),
                    CreatedAt = table.Column<DateTime>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    UpdatedAt = table.Column<DateTime>(nullable: true),
                    UpdatedBy = table.Column<string>(nullable: true),
                    UserDevNik = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.Url);
                    table.ForeignKey(
                        name: "FK_Projects_Users_UserDevNik",
                        column: x => x.UserDevNik,
                        principalTable: "Users",
                        principalColumn: "Nik",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<string>(nullable: false),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(nullable: false),
                    ProviderKey = table.Column<string>(nullable: false),
                    ProviderDisplayName = table.Column<string>(nullable: true),
                    UserId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(nullable: false),
                    LoginProvider = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    Name = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    ProjectUrl = table.Column<string>(nullable: false),
                    ProjectUrl1 = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                    table.UniqueConstraint("AK_AspNetRoles_ProjectUrl", x => x.ProjectUrl);
                    table.ForeignKey(
                        name: "FK_AspNetRoles_Projects_ProjectUrl1",
                        column: x => x.ProjectUrl1,
                        principalTable: "Projects",
                        principalColumn: "Url",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UserProject",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UserNik = table.Column<string>(nullable: true),
                    ProjectUrl = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserProject", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserProject_Projects_ProjectUrl",
                        column: x => x.ProjectUrl,
                        principalTable: "Projects",
                        principalColumn: "Url",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserProject_Users_UserNik",
                        column: x => x.UserNik,
                        principalTable: "Users",
                        principalColumn: "Nik",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    RoleId = table.Column<string>(nullable: false),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(nullable: false),
                    RoleId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoles_ProjectUrl1",
                table: "AspNetRoles",
                column: "ProjectUrl1");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_DetailNik1",
                table: "AspNetUsers",
                column: "DetailNik1");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BranchUnit_CabangKode",
                table: "BranchUnit",
                column: "CabangKode");

            migrationBuilder.CreateIndex(
                name: "IX_BranchUnit_UnitKode",
                table: "BranchUnit",
                column: "UnitKode");

            migrationBuilder.CreateIndex(
                name: "IX_Departemens_DirektoratKode",
                table: "Departemens",
                column: "DirektoratKode");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_UserDevNik",
                table: "Projects",
                column: "UserDevNik");

            migrationBuilder.CreateIndex(
                name: "IX_SubDepartemens_DepartemenKode",
                table: "SubDepartemens",
                column: "DepartemenKode");

            migrationBuilder.CreateIndex(
                name: "IX_UserProject_ProjectUrl",
                table: "UserProject",
                column: "ProjectUrl");

            migrationBuilder.CreateIndex(
                name: "IX_UserProject_UserNik",
                table: "UserProject",
                column: "UserNik");

            migrationBuilder.CreateIndex(
                name: "IX_Users_AtasanNik",
                table: "Users",
                column: "AtasanNik");

            migrationBuilder.CreateIndex(
                name: "IX_Users_BranchKode",
                table: "Users",
                column: "BranchKode");

            migrationBuilder.CreateIndex(
                name: "IX_Users_DepartemenKode",
                table: "Users",
                column: "DepartemenKode");

            migrationBuilder.CreateIndex(
                name: "IX_Users_DirektoratKode",
                table: "Users",
                column: "DirektoratKode");

            migrationBuilder.CreateIndex(
                name: "IX_Users_SubDepartemenKode",
                table: "Users",
                column: "SubDepartemenKode");

            migrationBuilder.CreateIndex(
                name: "IX_Users_UnitKode",
                table: "Users",
                column: "UnitKode");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "BranchUnit");

            migrationBuilder.DropTable(
                name: "UserProject");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "Projects");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Cabangs");

            migrationBuilder.DropTable(
                name: "SubDepartemens");

            migrationBuilder.DropTable(
                name: "Units");

            migrationBuilder.DropTable(
                name: "Departemens");

            migrationBuilder.DropTable(
                name: "Directorates");
        }
    }
}
