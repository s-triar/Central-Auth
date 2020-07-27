using CentralAuth.Commons.Models;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Interfaces
{
    public interface IEmailService
    {
        void SendEmail(Message message);
    }
}
