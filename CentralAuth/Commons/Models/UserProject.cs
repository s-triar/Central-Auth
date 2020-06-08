using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Models
{
    public class UserProject
    {
        [Key]
        public int Id { get; set; }
        public string UserNik { get; set; }
        public User User { get; set; }
        public string ProjectUrl { get; set; }
        public Project Project { get; set; }
    }
}
