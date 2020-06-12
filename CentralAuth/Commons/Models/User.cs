using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Models
{
    public class User
    {
        public User()
        {
            this.Bawahans = new HashSet<User>();
            this.DevProjects = new HashSet<Project>();
            this.Projects = new HashSet<UserProject>();
        }

        [Key]
        public string Nik { set; get; }
        public string Nama { get; set; }
        public string Email { get; set; }
        public string Ext { get; set; }

        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> UpdatedAt { get; set; }
        public string UpdatedBy { get; set; }

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
        public virtual ICollection<User> Bawahans { get; set; }
        public virtual ICollection<Project> DevProjects { get; set; }
        public virtual ICollection<UserProject> Projects { get; set; }
        
    }
}
