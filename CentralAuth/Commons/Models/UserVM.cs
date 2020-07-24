using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Models
{
    public class UserVM
    {
        public string Nik { set; get; }
        public string Nama { get; set; }
        public string Email { get; set; }
        public string Ext { get; set; }
        public string AtasanNik { get; set; }
        public string Atasan { get; set; }
        public string SubDepartemenKode { get; set; }
        public string SubDepartemen { get; set; }
        public string DepartemenKode { get; set; }
        public string Departemen { get; set; }
        public string DirektoratKode { get; set; }
        public string Direktorat { get; set; }
        public string CabangKode { get; set; }
        public string Cabang { get; set; }
        public string UnitKode { get; set; }
        public string Unit { get; set; }
    }
}
