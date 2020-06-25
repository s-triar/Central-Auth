using CentralAuth.Commons.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Services
{
    public class UtilityService: IUtilityService
    {
        public string RandomString(int length, bool includeSpecialChar = false)
        {
            Random random = new Random();
            string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
            if (includeSpecialChar)
            {
                chars += "!@#$%^&*()-=+_,.{}[]";
            }
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}
