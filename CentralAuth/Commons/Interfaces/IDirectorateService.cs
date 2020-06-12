using CentralAuth.Commons.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Interfaces
{
    public interface IDirectorateService: ISimpleGenericService<Directorate>
    {
        Directorate GetByDepartemen(string Kode);
        Directorate GetByUser(string Nik);
    }
}
