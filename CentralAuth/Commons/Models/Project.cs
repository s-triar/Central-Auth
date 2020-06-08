using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Models
{
    public class Project
    {
        public Project()
        {
            this.Users = new HashSet<UserProject>();
            this.Roles = new HashSet<AppRole>();
        }
        [Key]
        public string Url { get; set; }
        public string NamaProject { get; set; }
        public string ClientId { get; set; }
        public string ClientSecret { get; set; }
        public string ApiName { get; set; }
        public string ScopeApi { get; set; }
        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> UpdatedAt { get; set; }
        public string UpdatedBy { get; set; }
        public string UserDevNik { get; set; }
        public User UserDev { get; private set; }
        public virtual ICollection<UserProject> Users { get; }
        public virtual ICollection<AppRole> Roles { get; }
    }
}
