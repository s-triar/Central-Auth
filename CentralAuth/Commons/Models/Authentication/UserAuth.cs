using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Models.Authentication
{
    public class UserAuth
    {
        public int Id { get; set; }
        public string Nik { get; set; }
        public string Name { get; set; }

        [JsonIgnore]
        public string Password { get; set; }

        public string Token { get; set; }
    }
}
