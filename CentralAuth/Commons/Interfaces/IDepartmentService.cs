using CentralAuth.Commons.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Interfaces
{
    public interface IDepartmentService
    {
        IEnumerable<Department> GetAll();
        IEnumerable<Department> GetAllByFilter(Department entity);
        Department GetBySubDepartemen(string Kode);
        Department GetByUser(string Nik);
        Department GetByID(string Kode);
        Task<int> Create(Department entity);
        Task<int> Update(Department entity);
        Task<int> Delete(string Kode);
        Task<int> Delete(Department entity);
    }
}
