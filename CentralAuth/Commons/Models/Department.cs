using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Models
{
    public class Department
    {
        public Department()
        {
            this.SubDepartemens = new HashSet<SubDepartment>();
            this.Users = new HashSet<User>();
        }
        [Key]
        public string Kode { get; set; }
        public string NamaDepartemen { get; set; }
        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> UpdatedAt { get; set; }
        public string UpdatedBy { get; set; }
        public string DirektoratKode { get; set; }
        public Directorate Direktorat { get; set; }
        public ICollection<User> Users { get; set; }
        public ICollection<SubDepartment> SubDepartemens { get; set; }
    }
}
