using CentralAuth.Commons.Models;
using CentralAuth.Datas;
using IdentityModel;
using IdentityServer4.EntityFramework.Entities;
using IdentityServer4.Models;
using IdentityServer4.Stores;
using IdentityServer4.Validation;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Razor.Language.CodeGeneration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.IdentityServerModels
{
    public class CustomResourceOwnerPasswordValidator : IResourceOwnerPasswordValidator
    {
        private AppDbContext _context;
        private UserManager<AppUser> _userManager;
        private SignInManager<AppUser> _signInManager;
        public CustomResourceOwnerPasswordValidator(AppDbContext context, UserManager<AppUser> userManager, SignInManager<AppUser> signInManager)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        public Task ValidateAsync(ResourceOwnerPasswordValidationContext context)
        {
            var user = _userManager.FindByNameAsync(context.UserName).GetAwaiter().GetResult();
            if (user != null)
            {
                var userProject = _context.UserProjects.FirstOrDefault(x => x.PenggunaNik == user.UserName && x.ProjekApiName == context.Request.Client.ClientName);
                if (userProject != null)
                {
                    var signed = _signInManager.PasswordSignInAsync(user, context.Password, true, false).GetAwaiter().GetResult();
                    if (signed.Succeeded)
                    {
                        context.Result = new GrantValidationResult(user.Id, OidcConstants.AuthenticationMethods.Password);
                    }
                    else
                    {
                        context.Result = new GrantValidationResult(IdentityServer4.Models.TokenRequestErrors.InvalidRequest, "NIK dan Password tidak cocok.");
                    }
                }
                else
                {
                    context.Result = new GrantValidationResult(IdentityServer4.Models.TokenRequestErrors.InvalidRequest, "User tidak terdaftar di projek ini.");
                }
            }
            else
            {
                context.Result = new GrantValidationResult(TokenRequestErrors.InvalidRequest, "User tidak ditemukan.");
            }
            return Task.FromResult(0);
        }
    }
}
