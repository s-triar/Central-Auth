using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Models
{
    public class SubDepartemen
    {

        public SubDepartemen()
        {
            this.Users = new HashSet<User>();
        }
        [Key]
        public string Kode { get; set; }
        public string NamaSubDepartemen { get; set; }

        public virtual Departemen Departemen { get; set; }
        public virtual ICollection<User> Users { get;  }
    }
}
