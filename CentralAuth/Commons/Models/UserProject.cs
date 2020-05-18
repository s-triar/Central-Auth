using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Models
{
    public class UserProject
    {
        [Key]
        public virtual Project DataProject { get; set; }
        [Key]
        public virtual User DataUser { get; }
    }

    
}
