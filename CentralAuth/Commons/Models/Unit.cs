using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CentralAuth.Commons.Models
{
    public class Unit
    {
        public Unit()
        {
            this.Users = new HashSet<User>();
            this.CabangUnits = new HashSet<BranchUnit>();
        }
        [Key]
        public string Kode { get; set; }
        public string NamaUnit { get; set; }
        public string Keterangan { get; set; }
        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> UpdatedAt { get; set; }
        public string UpdatedBy { get; set; }
        public ICollection<User> Users { get; set; }
        public ICollection<BranchUnit> CabangUnits { get; set; }
    }
}