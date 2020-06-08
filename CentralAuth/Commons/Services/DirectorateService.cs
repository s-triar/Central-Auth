using CentralAuth.Commons.Filters;
using CentralAuth.Commons.Interfaces;
using CentralAuth.Commons.Models;
using CentralAuth.Datas;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Services
{
    public class DirectorateService : IDirectorateService
    {
        private readonly AppDbContext _context;
        public DirectorateService(AppDbContext context)
        {
            this._context = context;
        }

        public async Task<int> Create(Directorate entity)
        {
            entity.CreatedAt = DateTime.Now;
            this._context.Directorates.Add(entity);
            return await this._context.SaveChangesAsync();
        }

        public async Task<int> Delete(string Kode)
        {
            Directorate entity = await this._context.Directorates.FirstOrDefaultAsync(m => m.Kode == Kode);
            this._context.Directorates.Remove(entity);
            return await this._context.SaveChangesAsync();
        }

        public async Task<int> Delete(Directorate entity)
        {
            this._context.Directorates.Remove(entity);
            return await this._context.SaveChangesAsync();
        }

        public IEnumerable<Directorate> GetAll()
        {
            return this._context.Directorates.AsEnumerable();
        }

        public IEnumerable<Directorate> GetAllByFilter(Object entity)
        {
            return this._context.Directorates.Where(CustomFilter<Directorate>.ContainFilter(entity)).AsEnumerable();
        }

        public GridResponse<Directorate> GetAllByFilterGrid(object entity)
        {
            Grid search = entity as Grid;
            var q = this._context.Directorates.Where(CustomFilter<Directorate>.FilterGrid(entity));
            if(search.Sort != null && search.Sort.Count > 0)
            {
                foreach (Sort s in search.Sort)
                {
                    PropertyInfo info = CustomFilter<Directorate>.SortGrid(s);
                    if (s.SortType == "ASC")
                    {
                        q = q.OrderBy(x => info.GetValue(x, null));
                    }else if(s.SortType == "DESC")
                    {
                        q = q.OrderByDescending(x => info.GetValue(x, null));
                    }
                }
            }
            var n = q.Count();
            q = q.Skip(search.Pagination.NumberDisplay*(search.Pagination.PageNumber-1)).Take(search.Pagination.NumberDisplay);
            var q_enum = q.AsEnumerable();
            return new GridResponse<Directorate>
            {
                Data = q_enum,
                NumberData = n
            };
        }

        public Directorate GetByDepartemen(string Kode)
        {
            return this._context.Directorates.FirstOrDefault(x => x.Departemens.FirstOrDefault(m => m.Kode == Kode) != null);
        }

        public Directorate GetByID(string Kode)
        {
            return this._context.Directorates.FirstOrDefault(x => x.Kode == Kode);
        }

        public Directorate GetByUser(string Nik)
        {
            return this._context.Directorates.FirstOrDefault(x => x.Users.FirstOrDefault(m => m.Nik == Nik) != null);
        }

        public async Task<int> Update(Directorate entity)
        {
            entity.UpdatedAt = DateTime.Now;
            this._context.Directorates.Update(entity);
            return await this._context.SaveChangesAsync();
        }
    }
}
