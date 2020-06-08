using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Models
{
    public class AppUser: IdentityUser<string>
    {
        [Key]
        public string DetailNik { get; set; }
        public User Detail { get; set; }    
    }
}
