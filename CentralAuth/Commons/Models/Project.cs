using IdentityModel;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Models
{
    public class Project : MetaClass
    {
        public Project()
        {
            this.Users = new HashSet<UserProject>();
            this.Roles = new HashSet<IdentityRole>();
            this.Collaborations = new HashSet<ProjectToProject>();
        }
        [Key]
        public string ApiName { get; set; }
        [Required]
        public string Url { get; set; }
        [Required]
        public string Type { get; set; }
        [Required]
        public string NamaProject { get; set; }
        public string ClientId { get; set; }
        public string ClientSecret { get; set; }
        public string DeveloperNik { get; set; }
        public User Developer { get; set; }
        public ICollection<UserProject> Users { get; set; }
        public ICollection<IdentityRole> Roles { get; set; }
        public ICollection<ProjectToProject> Collaborations { get; set; }
    }
}
