using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Models
{
    public class SubDepartment
    {

        public SubDepartment()
        {
            this.Users = new HashSet<User>();
        }
        [Key]
        public string Kode { get; set; }
        public string NamaSubDepartemen { get; set; }
        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> UpdatedAt { get; set; }
        public string UpdatedBy { get; set; }
        public virtual Department Departemen { get; set; }
        public virtual ICollection<User> Users { get;  }
    }
}
