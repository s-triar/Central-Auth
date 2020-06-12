using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Models
{
    public class Branch 
    {
        public Branch()
        {
            this.Users = new HashSet<User>();
            this.CabangUnits = new HashSet<BranchUnit>();
        }
        [Key]
        public string Kode { get; set; }
        public string Singkatan { get; set; }
        public string NamaCabang { get; set; }
        public string Keterangan { get; set; }
        public string Alamat { get; set; }
        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> UpdatedAt { get; set; }
        public string UpdatedBy { get; set; }
        public ICollection<BranchUnit> CabangUnits { get; set; }
        public ICollection<User> Users { get; set; }
    }
}
