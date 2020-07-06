using Microsoft.EntityFrameworkCore.Migrations;

namespace CentralAuth.Migrations.Db.AppDb
{
    public partial class addProjectClaimAddRelation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ApiName",
                table: "ProjectClaims",
                newName: "ProjekApiName");

            migrationBuilder.AlterColumn<string>(
                name: "ProjekApiName",
                table: "ProjectClaims",
                nullable: false,
                oldClrType: typeof(string));

            migrationBuilder.CreateIndex(
                name: "IX_ProjectClaims_ProjekApiName",
                table: "ProjectClaims",
                column: "ProjekApiName");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectClaims_Projects_ProjekApiName",
                table: "ProjectClaims",
                column: "ProjekApiName",
                principalTable: "Projects",
                principalColumn: "ApiName",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectClaims_Projects_ProjekApiName",
                table: "ProjectClaims");

            migrationBuilder.DropIndex(
                name: "IX_ProjectClaims_ProjekApiName",
                table: "ProjectClaims");

            migrationBuilder.RenameColumn(
                name: "ProjekApiName",
                table: "ProjectClaims",
                newName: "ApiName");

            migrationBuilder.AlterColumn<string>(
                name: "ApiName",
                table: "ProjectClaims",
                nullable: false,
                oldClrType: typeof(string));
        }
    }
}
