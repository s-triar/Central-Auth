using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Models
{
    public class SubDepartment : MetaClass
    {

        public SubDepartment()
        {
            this.Users = new HashSet<User>();
        }
        [Key]
        public string Kode { get; set; }
        [Required]
        public string NamaSubDepartemen { get; set; }
        public string DepartemenKode { get; set; }
        public virtual Department Departemen { get; set; }
        public virtual ICollection<User> Users { get;  }
    }
}
