using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Models
{
    public class Department : MetaClass
    {
        public Department()
        {
            this.SubDepartemens = new HashSet<SubDepartment>();
            this.Users = new HashSet<User>();
        }
        [Key]
        public string Kode { get; set; }
        [Required]
        public string NamaDepartemen { get; set; }
        public string DirektoratKode { get; set; }
        public Directorate Direktorat { get; set; }
        public ICollection<User> Users { get; set; }
        public ICollection<SubDepartment> SubDepartemens { get; set; }
    }
}
