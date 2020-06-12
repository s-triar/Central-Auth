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
using System.Reflection;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Services
{
    public class DepartmentService :SimpleGenericRepository<Department>,  IDepartmentService
    {
        public DepartmentService(AppDbContext context): base(context)  
        {
        }
        override
        public GridResponse<Department> GetAllByFilterGrid(object entity)
        {
            Grid search = entity as Grid;
            var q = _context.Departments.Where(CustomFilter<Department>.FilterGrid(entity));
            if (search.Sort != null && search.Sort.Count > 0)
            {
                foreach (Sort s in search.Sort)
                {
                    PropertyInfo info = CustomFilter<Department>.SortGrid(s);
                    if (s.SortType == "ASC")
                    {
                        q = q.OrderBy(x => info.GetValue(x, null));
                    }
                    else if (s.SortType == "DESC")
                    {
                        q = q.OrderByDescending(x => info.GetValue(x, null));
                    }
                }
            }
            var n = q.Count();
            if (search.Pagination != null)
            {
                q = q.Skip(search.Pagination.NumberDisplay * (search.Pagination.PageNumber - 1)).Take(search.Pagination.NumberDisplay);
            }
            var q_enum = q.Include(x => x.Direktorat).Select(x => new Department
            {
                Kode = x.Kode,
                Direktorat = new Directorate
                {
                    Kode = x.Direktorat.Kode,
                    NamaDirektorat = x.Direktorat.NamaDirektorat
                },
                DirektoratKode = x.DirektoratKode,
                NamaDepartemen = x.NamaDepartemen
            }).AsEnumerable();
            return new GridResponse<Department>
            {
                Data = q_enum,
                NumberData = n
            };
        }
        public Department GetBySubDepartment(string Kode)
        {
            return this._context.Departments.FirstOrDefault(x => x.SubDepartemens.FirstOrDefault(m => m.Kode == Kode) != null);
        }

        public Department GetByUser(string Nik)
        {
            return this._context.Departments.FirstOrDefault(x => x.Users.FirstOrDefault(m => m.Nik == Nik) != null);
        }
    }
}
