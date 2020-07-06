using Microsoft.EntityFrameworkCore.Migrations;

namespace CentralAuth.Migrations.Db.AppDb
{
    public partial class updateProj2ProjTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "KolaborasiApiName",
                table: "ProjectToProjects",
                nullable: false,
                oldClrType: typeof(string));


            migrationBuilder.CreateIndex(
                name: "IX_ProjectToProjects_KolaborasiApiName",
                table: "ProjectToProjects",
                column: "KolaborasiApiName");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectToProjects_Projects_KolaborasiApiName",
                table: "ProjectToProjects",
                column: "KolaborasiApiName",
                principalTable: "Projects",
                principalColumn: "ApiName",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectToProjects_Projects_KolaborasiApiName",
                table: "ProjectToProjects");

            migrationBuilder.DropIndex(
                name: "IX_ProjectToProjects_KolaborasiApiName",
                table: "ProjectToProjects");

            migrationBuilder.AlterColumn<string>(
                name: "KolaborasiApiName",
                table: "ProjectToProjects",
                nullable: false,
                oldClrType: typeof(string));


        }
    }
}
