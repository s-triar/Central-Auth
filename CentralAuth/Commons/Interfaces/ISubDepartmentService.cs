using CentralAuth.Commons.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Interfaces
{
    public interface ISubDepartmentService: ISimpleGenericService<SubDepartment>
    {
        SubDepartment GetByUser(string Nik);
    }
}
