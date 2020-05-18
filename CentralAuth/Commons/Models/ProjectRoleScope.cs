using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Models
{
    public class ProjectRoleScope
    {
        [Key]
        public virtual ProjectRole DataRole { get; set; }
        [Key]
        public virtual ProjectScope DataScope { get; }
    }
}
