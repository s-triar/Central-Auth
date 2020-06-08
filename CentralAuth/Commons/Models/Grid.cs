using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Models
{
    public class Grid
    {
        public List<Filter> Filter { get; set; }
        public List<Sort> Sort { get; set; }
        public Pagination Pagination { get; set; }
    }
}
