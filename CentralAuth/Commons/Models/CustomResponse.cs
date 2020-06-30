using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Models
{
    public class CustomResponse
    {
        public string message { get; set; }
        public string title { get; set; }
        public bool ok { get; set; }
        public IEnumerable<string> errors { get; set; }
        public dynamic data { get; set; }
    }
}
