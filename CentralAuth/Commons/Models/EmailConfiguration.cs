using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Models
{
    public class EmailConfiguration
    {
        public string From { get; set; }
        public string SmptpServer { get; set; }
        public int Port { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
