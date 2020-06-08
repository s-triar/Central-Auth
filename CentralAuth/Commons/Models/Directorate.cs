using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Models
{
    public class Directorate
    {
        public Directorate()
        {
            this.Departemens = new HashSet<Department>();
            this.Users = new HashSet<User>();
        }
        [Key]
        public string Kode { get; set; }
        public string NamaDirektorat { get; set; }
        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> UpdatedAt { get; set; }
        public string UpdatedBy { get; set; }
        public ICollection<User> Users { get; set; }
        public ICollection<Department> Departemens { get; set; }
    }
}
