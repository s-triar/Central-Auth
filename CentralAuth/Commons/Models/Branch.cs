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
    public class Branch : MetaClass
    {
        public Branch()
        {
            this.Users = new HashSet<User>();
            this.CabangUnits = new HashSet<BranchUnit>();
        }
        [Key]
        public string Kode { get; set; }
        [Required]
        public string Singkatan { get; set; }
        [Required]
        public string NamaCabang { get; set; }
        public string Keterangan { get; set; }
        public string Alamat { get; set; }
        public ICollection<BranchUnit> CabangUnits { get; set; }
        public ICollection<User> Users { get; set; }
    }
}
