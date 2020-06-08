using CentralAuth.Commons.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Interfaces
{
    public interface IDirectorateService
    {
        IEnumerable<Directorate> GetAll();
        IEnumerable<Directorate> GetAllByFilter(Object entity);
        GridResponse<Directorate> GetAllByFilterGrid(Object entity);
        Directorate GetByDepartemen(string Kode);
        Directorate GetByUser(string Nik);
        Directorate GetByID(string Kode);
        Task<int> Create(Directorate entity);
        Task<int> Update(Directorate entity);
        Task<int> Delete(string Kode);
        Task<int> Delete(Directorate entity);
    }
}
