using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Models
{
    public class User: MetaClass
    {
        public User()
        {
            this.Bawahans = new HashSet<User>();
            this.DevProjeks = new HashSet<Project>();
            this.Projeks = new HashSet<UserProject>();
        }

        [Key]
        public string Nik { set; get; }
        [Required]
        public string Nama { get; set; }
        [Required]
        public string Email { get; set; }
        public string Ext { get; set; }

        public string AtasanNik { get; set; }
        public User Atasan { get; set; }

        public string SubDepartemenKode { get; set; }
        public SubDepartment SubDepartemen { get; set; }
        public string DepartemenKode { get; set; }
        public Department Departemen { get; set; }
        public string DirektoratKode { get; set; }
        public Directorate Direktorat { get; set; }
        public string CabangKode { get; set; }
        public Branch Cabang { get; set; }
        public string UnitKode { get; set; }
        public Unit Unit { get; set; }
        public ICollection<User> Bawahans { get; set; }
        public ICollection<Project> DevProjeks { get; set; }
        public ICollection<UserProject> Projeks { get; set; }
        
    }
}
