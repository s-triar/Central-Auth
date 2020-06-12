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
    public class UnitService: SimpleGenericRepository<Unit>, IUnitService
    {

        public UnitService(AppDbContext context): base(context)
        {
        }
        public async Task<int> AddBranchUnit(BranchUnit entity)
        {
            var unit = await this._context.Units.FirstOrDefaultAsync(m => m.Kode == entity.UnitKode);
            unit.CabangUnits.Add(entity);
            return await this._context.SaveChangesAsync();
        }
        public Unit GetByUser(string Nik)
        {
            return this._context.Units.FirstOrDefault(x => x.Users.FirstOrDefault(m => m.Nik == Nik) != null);
        }

    }
}
