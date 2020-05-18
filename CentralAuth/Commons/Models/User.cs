using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Models
{
    public class User : IdentityUser
    {
        public User()
        {
            this.DataBawahan = new HashSet<User>();
        }
        public string Nik { set; get; }
        public string KodeSubDepartemen { set; get; }
        public string Atasan { set; get; }

        public virtual User DataAtasan { get; set; }
        public virtual SubDepartemen SubDepartemen { get; set; }
        public virtual ICollection<User> DataBawahan { get; set; }
    }
}
