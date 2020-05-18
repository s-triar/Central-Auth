﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Models
{
    public class ProjectRole
    {

        public ProjectRole()
        {

        }

        [Key]
        public string NamaRole { get; set; }
        [Key]
        public string UrlProject { get; set; }
        public virtual Project DataProject { get; set; }
    }

    
}
