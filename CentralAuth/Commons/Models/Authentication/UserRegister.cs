using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Models.Authentication
{
    public class UserRegister
    {
        [Required]
        public string Nik { get; set; }
        [Required]
        public string Nama { get; set; }
        [Required]
        [DataType(dataType:DataType.Password)]
        public string Password { get; set; }
        [Required]
        [DataType(dataType: DataType.Password)]
        [Compare("Password")]
        public string ConfirmPassword { get; set; }
        [Required]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }
        public string Ext { get; set; }
        public string NikAtasan { set; get; }
        public string KodeDirektorat { get; set; }
        public string KodeDepartemen { get; set; }
        public string KodeSubDepartemen { set; get; }
        public string KodeCabang { get; set; }
        public string KodeUnit { set; get; }

    }
}


