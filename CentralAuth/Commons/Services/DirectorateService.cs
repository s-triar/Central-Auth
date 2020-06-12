using CentralAuth.Commons.Filters;
using CentralAuth.Commons.Generics;
using CentralAuth.Commons.Interfaces;
using CentralAuth.Commons.Models;
using CentralAuth.Datas;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Services
{
    public class DirectorateService : SimpleGenericRepository<Directorate>, IDirectorateService
    {
        public DirectorateService(AppDbContext context): base(context)
        {

        }
        public Directorate GetByDepartemen(string Kode)
        {
            return this._context.Directorates.FirstOrDefault(x => x.Departemens.Where(y => y.Kode == Kode) != null);
        }

        public Directorate GetByUser(string Nik)
        {
            return this._context.Directorates.FirstOrDefault(x => x.Users.FirstOrDefault(m => m.Nik == Nik) != null);
        }
    }
}
