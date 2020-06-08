using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Models
{
    public class Filter
    {
            public string ColumnName { get; set; }
            public string FilterType { get; set; }
            public string FilterValue { get; set; }
    }
}
