using CentralAuth.Commons.Filters;
using CentralAuth.Commons.Generics;
using CentralAuth.Commons.Interfaces;
using CentralAuth.Commons.Models;
using CentralAuth.Datas;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Services
{
    public class BranchService: SimpleGenericRepository<Branch>, IBranchService
    {

        public BranchService(AppDbContext context): base(context)
        {
        }

        public async Task<int> AddBranchUnit(BranchUnit entity)
        {
            var branch = await this._context.Branches.FirstOrDefaultAsync(m => m.Kode == entity.CabangKode);
            branch.CabangUnits.Add(entity);
            return await this._context.SaveChangesAsync();
        }
        public Branch GetByUser(string Nik)
        {
            return this._context.Branches.FirstOrDefault(x => x.Users.FirstOrDefault(m => m.Nik == Nik) != null);
        }
    }
}
