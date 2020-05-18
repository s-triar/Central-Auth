using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Models
{
    public class ProjectScope
    {

        public ProjectScope()
        {

        }

        [Key]
        public string NamaScope { get; set; }
        [Key]
        public string UrlProject { get; set; }
        public virtual Project DataProject { get; set; }
    }
    
}
