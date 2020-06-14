using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Models
{
    public class BranchUnit : MetaClass
    {
        [Key]
        public int Id { get; set; }
        public string CabangKode { get; set; }
        public Branch Cabang { get; set; }
        public string UnitKode { get; set; }
        public Unit Unit { get; set; }
    }
}
