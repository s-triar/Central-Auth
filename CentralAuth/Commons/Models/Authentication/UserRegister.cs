using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Models.Authentication
{
    public class UserRegister
    {
        public string Nik { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
    }
}
