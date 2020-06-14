using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Models
{
    public class ProjectToProject : MetaClass
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string ProjekApiName { get; set; }
        public Project Projek { get; set; }
        [Required]
        public string KolaborasiApiName { get; set; }
        public Nullable<bool> Approve { get; set; }
    }
}
