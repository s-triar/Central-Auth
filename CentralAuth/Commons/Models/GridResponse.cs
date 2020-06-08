using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Models
{
    public class GridResponse <T> 
    {
        public long NumberData { get; set; }
        public IEnumerable<T> Data { get; set; }
    }
}
