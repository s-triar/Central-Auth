using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Models
{
    public class Directorate : MetaClass
    {
        public Directorate()
        {
            this.Departemens = new HashSet<Department>();
            this.Users = new HashSet<User>();
        }
        [Key]
        public string Kode { get; set; }
        [Required]
        public string NamaDirektorat { get; set; }
        public ICollection<User> Users { get; set; }
        public ICollection<Department> Departemens { get; set; }
    }
}
