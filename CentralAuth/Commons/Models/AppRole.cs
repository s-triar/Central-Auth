using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Models
{
    public class AppRole: IdentityRole<string>
    {
        [Key]
        public string ProjectUrl { get; set; }
        public Project Project { get; private set; }
    }
}
