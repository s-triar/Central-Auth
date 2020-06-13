using CentralAuth.Commons.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Interfaces
{
    public interface IUserService : ISimpleGenericService<User>
    {
        IEnumerable<User> GetByBranch(string Kode);
        IEnumerable<User> GetByDepartment(string Kode);
        IEnumerable<User> GetBySubDepartment(string Kode);
        IEnumerable<User> GetByUnit(string Kode);
        IEnumerable<User> GetByDirectorate(string Kode);
        User GetUserDetail(string Kode);
    }
}
