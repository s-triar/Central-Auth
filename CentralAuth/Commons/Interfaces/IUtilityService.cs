using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Interfaces
{
    public interface IUtilityService
    {
        string RandomString(int length, bool includeSpecialChar = false);
    }
}
