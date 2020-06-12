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
    public class UserService: SimpleGenericRepository<User>, IUserService
    {
        public UserService(AppDbContext context): base(context)
        {

        }

        public IEnumerable<User> GetByBranch(string Kode)
        {
            return this._context.Users.Where(x => x.CabangKode == Kode).AsEnumerable();
        }

        public IEnumerable<User> GetByDepartment(string Kode)
        {
            return this._context.Users.Where(x => x.DepartemenKode == Kode).AsEnumerable();
        }

        public IEnumerable<User> GetBySubDepartment(string Kode)
        {
            return this._context.Users.Where(x => x.SubDepartemenKode == Kode).AsEnumerable();
        }

        public IEnumerable<User> GetByUnit(string Kode)
        {
            return this._context.Users.Where(x => x.UnitKode == Kode).AsEnumerable();
        }
        public IEnumerable<User> GetByDirectorate(string Kode)
        {
            return this._context.Users.Where(x => x.DirektoratKode == Kode).AsEnumerable();
        }

        override
        public GridResponse<User> GetAllByFilterGrid(object entity)
        {
            Grid search = entity as Grid;
            var q = _context.Users.Where(CustomFilter<User>.FilterGrid(entity));
            if (search.Sort != null && search.Sort.Count > 0)
            {
                foreach (Sort s in search.Sort)
                {
                    PropertyInfo info = CustomFilter<User>.SortGrid(s);
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
            var q_enum = q.Include(x => x.Departemen)
                          .Include(x => x.SubDepartemen)
                          .Include(x => x.Cabang)
                          .Include(x => x.Unit)
                          .Include(x => x.Direktorat)
                          .Include(x => x.Atasan)
                          .Select(x => new User
            {
                Nik = x.Nik,
                Email = x.Email,
                Ext = x.Ext,
                Nama = x.Nama,
                AtasanNik = x.AtasanNik,
                Atasan = new User
                {
                    AtasanNik = x.Atasan.AtasanNik,
                    Email = x.Atasan.Email,
                    Ext = x.Atasan.Ext,
                    Nama = x.Atasan.Nama,
                    Nik = x.Atasan.Nik
                },
                DepartemenKode = x.DepartemenKode,
                Departemen = new Department
                {
                    DirektoratKode = x.Departemen.DirektoratKode,
                    Kode = x.Departemen.Kode,
                    NamaDepartemen = x.Departemen.NamaDepartemen
                },
                SubDepartemenKode = x.SubDepartemenKode,
                SubDepartemen = new SubDepartment
                {
                    Kode = x.SubDepartemen.Kode,
                    NamaSubDepartemen = x.SubDepartemen.NamaSubDepartemen,
                    DepartemenKode = x.SubDepartemen.DepartemenKode
                },
                DirektoratKode = x.DirektoratKode,
                Direktorat = new Directorate
                {
                    Kode = x.Direktorat.Kode,
                    NamaDirektorat = x.Direktorat.NamaDirektorat
                },
                CabangKode = x.CabangKode,
                Cabang = new Branch
                {
                    Kode = x. Cabang.Kode,
                    Alamat = x.Cabang.Alamat,
                    NamaCabang = x.Cabang.NamaCabang,
                    Singkatan = x.Cabang.Singkatan,
                    Keterangan = x.Cabang.Keterangan
                },
                UnitKode = x.UnitKode,
                Unit = new Unit
                {
                    Kode = x.Unit.Kode,
                    NamaUnit = x.Unit.NamaUnit,
                    Keterangan = x.Unit.Keterangan
                }
                
            }).AsEnumerable();
            return new GridResponse<User>
            {
                Data = q_enum,
                NumberData = n
            };
        }
    }
}
