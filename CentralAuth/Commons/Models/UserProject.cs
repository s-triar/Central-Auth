﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Models
{
    public class UserProject : MetaClass
    {
        [Key]
        public int Id { get; set; }
        public string PenggunaNik { get; set; }
        public User Pengguna { get; set; }
        public string ProjekApiName { get; set; }
        public Project Projek { get; set; }
    }
}
