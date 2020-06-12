using CentralAuth.Commons.Filters;
using CentralAuth.Commons.Interfaces;
using CentralAuth.Commons.Models;
using CentralAuth.Commons.Utilities;
using CentralAuth.Datas;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Extensions.Internal;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Generics
{
    public class SimpleGenericRepository<T> : ISimpleGenericService<T> where T : class, new()
    {
        protected readonly AppDbContext _context;

        public SimpleGenericRepository(AppDbContext context)
        {
            _context = context;
        }

        public void Add(T entity)
        {
            if (CustomReflection.PropertyExists(entity, "CreatedAt")) {
                PropertyInfo prop = entity.GetType().GetProperty("CreatedAt", BindingFlags.Public | BindingFlags.Instance);
                if (null != prop && prop.CanWrite)
                {
                    prop.SetValue(entity, DateTime.Now, null);
                }
            }
            _context.Set<T>().Add(entity);
        }
        
        public IAsyncEnumerable<T> AllIncluding(params Expression<Func<T, object>>[] includeProperties)
        {
            IQueryable<T> query = _context.Set<T>();
            foreach (var includeProperty in includeProperties)
            {
                query = query.Include(includeProperty);
            }
            return query.AsAsyncEnumerable();
        }

        public async Task<int> SaveAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public async Task<IDbContextTransaction> BeginTransactionAsync()
        {
            return await _context.Database.BeginTransactionAsync();
        }

        public void Commit(IDbContextTransaction trans)
        {
            trans.Commit();
        }

        public void Rollback(IDbContextTransaction trans)
        {
            trans.Rollback();
        }

        public int Count()
        {
            return _context.Set<T>().Count();
        }

        public void Delete(T entity)
        {
            _context.Entry<T>(entity).State = EntityState.Deleted;
        }
        public async void DeleteByKey(dynamic key)
        {
            T entity = await _context.Set<T>().FindAsync(key);
            _context.Entry<T>(entity).State = EntityState.Deleted;
        }

        public void DeleteWhere(Expression<Func<T, bool>> predicate)
        {
            IEnumerable<T> entities = _context.Set<T>().Where(predicate);

            foreach (var entity in entities)
            {
                _context.Entry<T>(entity).State = EntityState.Deleted;
            }
        }

        public IEnumerable<T> FindBy(Expression<Func<T, bool>> predicate)
        {
            return _context.Set<T>().Where(predicate).AsEnumerable();
        }
        public T FindByKey(dynamic key)
        {
            return _context.Set<T>().Find(key);
        }

        public IEnumerable<T> GetAll()
        {
            return _context.Set<T>().AsEnumerable();
        }

        public IEnumerable<T> GetAllByFilter(object entity)
        {
            return _context.Set<T>().Where(CustomFilter<T>.ContainFilter(entity)).AsEnumerable();
        }

        public virtual GridResponse<T> GetAllByFilterGrid(object entity)
        {
            Grid search = entity as Grid;
            var q = _context.Set<T>().Where(CustomFilter<T>.FilterGrid(entity));
            if (search.Sort != null && search.Sort.Count > 0)
            {
                foreach (Sort s in search.Sort)
                {
                    PropertyInfo info = CustomFilter<T>.SortGrid(s);
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
            var q_enum = q.AsEnumerable();
            return new GridResponse<T>
            {
                Data = q_enum,
                NumberData = n
            };
        }


        public T GetSingle(Expression<Func<T, bool>> predicate)
        {
            return _context.Set<T>().FirstOrDefault(predicate);
        }

        public T GetSingle(Expression<Func<T, bool>> predicate, params Expression<Func<T, object>>[] includeProperties)
        {
            IQueryable<T> query = _context.Set<T>();
            foreach (var includeProperty in includeProperties)
            {
                query = query.Include(includeProperty);
            }

            return query.Where(predicate).FirstOrDefault();
        }

        public void Update(T entity)
        {
            if (CustomReflection.PropertyExists(entity, "UpdatedAt"))
            {
                PropertyInfo prop = entity.GetType().GetProperty("UpdatedAt", BindingFlags.Public | BindingFlags.Instance);
                if (null != prop && prop.CanWrite)
                {
                    prop.SetValue(entity, DateTime.Now, null);
                }
            }
            _context.Entry<T>(entity).State = EntityState.Modified;
        }
    }
}
