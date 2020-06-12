using CentralAuth.Commons.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Interfaces
{
    public interface IDepartmentService: ISimpleGenericService<Department>
    {
        Department GetBySubDepartment(string Kode);
        Department GetByUser(string Nik);
    }
}
