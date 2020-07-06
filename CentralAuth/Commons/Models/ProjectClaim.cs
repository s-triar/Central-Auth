using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Models
{
    public class ProjectClaim: MetaClass
    {
        public ProjectClaim()
        {
        }
        [Key]
        public string Id { get; set; }
        [Required]
        public string ProjekApiName { get; set; }
        public Project Projek { get; set; }
        [Required]
        public string ClaimName { get; set; }
    }
}
