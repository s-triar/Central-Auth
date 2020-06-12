using Microsoft.EntityFrameworkCore.Migrations;

namespace CentralAuth.Migrations
{
    public partial class init_db_update1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Branches_BranchKode",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "BranchKode",
                table: "Users",
                newName: "CabangKode");

            migrationBuilder.RenameIndex(
                name: "IX_Users_BranchKode",
                table: "Users",
                newName: "IX_Users_CabangKode");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Branches_CabangKode",
                table: "Users",
                column: "CabangKode",
                principalTable: "Branches",
                principalColumn: "Kode",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Branches_CabangKode",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "CabangKode",
                table: "Users",
                newName: "BranchKode");

            migrationBuilder.RenameIndex(
                name: "IX_Users_CabangKode",
                table: "Users",
                newName: "IX_Users_BranchKode");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Branches_BranchKode",
                table: "Users",
                column: "BranchKode",
                principalTable: "Branches",
                principalColumn: "Kode",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
