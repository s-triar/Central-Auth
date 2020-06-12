using CentralAuth.Commons.Filters;
using CentralAuth.Commons.Generics;
using CentralAuth.Commons.Interfaces;
using CentralAuth.Commons.Models;
using CentralAuth.Datas;
using IdentityServer4.EntityFramework.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Services
{
    public class SubDepartmentService:SimpleGenericRepository<SubDepartment>, ISubDepartmentService
    {
        public SubDepartmentService(AppDbContext context): base(context)
        {
        }
        override
        public GridResponse<SubDepartment> GetAllByFilterGrid(object entity)
        {
            Grid search = entity as Grid;
            var q = _context.SubDepartments.Where(CustomFilter<SubDepartment>.FilterGrid(entity));
            if (search.Sort != null && search.Sort.Count > 0)
            {
                foreach (Sort s in search.Sort)
                {
                    PropertyInfo info = CustomFilter<SubDepartment>.SortGrid(s);
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
            var q_enum = q.Include(x => x.Departemen).Select(x=> new SubDepartment
            {
                Kode = x.Kode,
                Departemen = new Department
                {
                    DirektoratKode = x.Departemen.DirektoratKode,
                    Kode = x.Departemen.Kode,
                    NamaDepartemen = x.Departemen.NamaDepartemen
                },
                DepartemenKode = x.DepartemenKode,
                NamaSubDepartemen = x.NamaSubDepartemen
            }).AsEnumerable();
            return new GridResponse<SubDepartment>
            {
                Data = q_enum,
                NumberData = n
            };
        }
        public SubDepartment GetByUser(string Nik)
        {
            return this._context.SubDepartments.FirstOrDefault(x => x.Users.FirstOrDefault(m => m.Nik == Nik) != null);
        }
    }
}
