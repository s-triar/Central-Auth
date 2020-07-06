using AutoMapper.Configuration.Annotations;
using IdentityModel;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Models
{
    public class Project : MetaClass
    {
        public Project()
        {
            this.Users = new HashSet<UserProject>();
            this.Roles = new HashSet<AppRole>();
            this.Followers = new HashSet<ProjectToProject>(); 
            this.Followings = new HashSet<ProjectToProject>();
            this.Claims = new HashSet<ProjectClaim>();
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
        public ICollection<AppRole> Roles { get; set; }
        [NotMapped]
        public ICollection<ProjectToProject> Followers { get; set; }
        [NotMapped]
        public ICollection<ProjectToProject> Followings { get; set; }
        public ICollection<ProjectClaim> Claims { get; set; }
        

    }
}
