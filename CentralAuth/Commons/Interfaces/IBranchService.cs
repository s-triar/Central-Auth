using CentralAuth.Commons.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Interfaces
{
    public interface IBranchService : ISimpleGenericService<Branch>
    {
        Branch GetByUser(string Nik);
        Task<int> AddBranchUnit(BranchUnit entity);
    }
}
