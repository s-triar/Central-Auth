using CentralAuth.Commons.Filters;
using CentralAuth.Commons.Generics;
using CentralAuth.Commons.Interfaces;
using CentralAuth.Commons.Models;
using CentralAuth.Datas;
using Microsoft.AspNetCore.Internal;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Extensions.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Services
{
    public class DepartmentService : IDepartmentService
    {
        private readonly AppDbContext _context;
        public DepartmentService(AppDbContext context)  {
            this._context = context;
        }

        public async Task<int> Create(Department entity)
        {
            entity.CreatedAt = DateTime.Now;
            this._context.Departemens.Add(entity);
            return await this._context.SaveChangesAsync();
        }

        public async Task<int> Delete(string Kode)
        {
            Department entity = await this._context.Departemens.FirstOrDefaultAsync(m => m.Kode == Kode);
            this._context.Departemens.Remove(entity);
            return await this._context.SaveChangesAsync();
        }

        public async Task<int> Delete(Department entity)
        {
            this._context.Departemens.Remove(entity);
            return await this._context.SaveChangesAsync();
        }

        public IEnumerable<Department> GetAll()
        {
            return this._context.Departemens.AsEnumerable();
        }
        public IEnumerable<Department> GetAllByFilter(Department entity)
        {
            return this._context.Departemens.Where(CustomFilter<Department>.ContainFilter(entity)).AsEnumerable();
        }

        public Department GetByID(string Kode)
        {
            return this._context.Departemens.FirstOrDefault(x => x.Kode == Kode);
        }
        public Department GetBySubDepartemen(string Kode)
        {
            return this._context.Departemens.FirstOrDefault(x => x.SubDepartemens.FirstOrDefault(m => m.Kode == Kode) != null);
        }

        public Department GetByUser(string Nik)
        {
            return this._context.Departemens.FirstOrDefault(x => x.Users.FirstOrDefault(m => m.Nik == Nik) != null);
        }

        public async Task<int> Update(Department entity)
        {
            entity.UpdatedAt = DateTime.Now;
            this._context.Departemens.Update(entity);            
            return await this._context.SaveChangesAsync();
        }
        
    }
}
