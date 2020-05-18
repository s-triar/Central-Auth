using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Models
{
    public class Project
    {
        public Project()
        {
            this.Userproject = new HashSet<UserProject>();
            this.Projectscope = new HashSet<ProjectScope>();
        }
        [Key]
        public string Url { get; set; }
        public string NamaProject { get; set; }


        public virtual User UserDev { get; set; }
        public virtual ICollection<UserProject> Userproject { get; }
        public virtual ICollection<ProjectScope> Projectscope { get; }
    }
}
