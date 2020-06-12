using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Models.Authentication
{
    public class UserAddRole
    {
        public string Nik { get; set; }
        public string[] Roles { get; set; }
        public ClaimStandard[] Claims { get; set; }
    }
}
