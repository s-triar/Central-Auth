using CentralAuth.Commons.Models;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Interfaces
{
    public interface ISimpleGenericService<T> where T : class, new()
    {
        void Add(T entity);
        IAsyncEnumerable<T> AllIncluding(params Expression<Func<T, object>>[] includeProperties);
        Task<int> SaveAsync();
        Task<IDbContextTransaction> BeginTransactionAsync();
        void Commit(IDbContextTransaction trans);
        void Rollback(IDbContextTransaction trans);
        int Count();
        void Delete(T entity);
        void DeleteByKey(dynamic key);
        void DeleteWhere(Expression<Func<T, bool>> predicate);
        IEnumerable<T> FindBy(Expression<Func<T, bool>> predicate);
        T FindByKey(dynamic key);
        IEnumerable<T> GetAll();
        IEnumerable<T> GetAllByFilter(object entity);
        GridResponse<T> GetAllByFilterGrid(object entity);
        T GetSingle(Expression<Func<T, bool>> predicate);
        T GetSingle(Expression<Func<T, bool>> predicate, params Expression<Func<T, object>>[] includeProperties);
        void Update(T entity);
    }
}
