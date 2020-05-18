using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Models
{
    public class Departemen
    {
        public Departemen()
        {
            this.SubDepartemens = new HashSet<SubDepartemen>();
        }
        [Key]
        public string Kode { get; set; }
        public string NamaDepartemen { get; set; }

        public virtual ICollection<User> Users { get; set; }
        public virtual ICollection<SubDepartemen> SubDepartemens { get;  }
    }
}
