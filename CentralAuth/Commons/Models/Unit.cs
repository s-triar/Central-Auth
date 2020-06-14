using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CentralAuth.Commons.Models
{
    public class Unit: MetaClass
    {
        public Unit()
        {
            this.Users = new HashSet<User>();
            this.CabangUnits = new HashSet<BranchUnit>();
        }
        [Key]
        public string Kode { get; set; }
        [Required]
        public string NamaUnit { get; set; }
        public string Keterangan { get; set; }

        public ICollection<User> Users { get; set; }
        public ICollection<BranchUnit> CabangUnits { get; set; }
    }
}