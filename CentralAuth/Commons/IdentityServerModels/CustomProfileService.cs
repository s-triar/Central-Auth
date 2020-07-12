using CentralAuth.Commons.Models;
using CentralAuth.Datas;
using IdentityServer4.Extensions;
using IdentityServer4.Models;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace CentralAuth.Commons.IdentityServerModels
{
    public class CustomProfileService : IProfileService
    {

        private AppDbContext _context;
        private UserManager<AppUser> _userManager;
        private SignInManager<AppUser> _signInManager;
        public CustomProfileService(AppDbContext context, UserManager<AppUser> userManager, SignInManager<AppUser> signInManager)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
        }
        public async Task GetProfileDataAsync(ProfileDataRequestContext context)
        {
            var sub = context.Subject.GetSubjectId();

            var user = await _userManager.FindByIdAsync(context.Subject.GetSubjectId());

            var claims = await this.getClaimsUserAsync(
                                        user, 
                                        context.Client.AllowedScopes.ToList(), 
                                        context.RequestedResources.IdentityResources.Select(x => x.Name).ToList()
                                    );

            context.IssuedClaims = claims;
        }

        public async Task IsActiveAsync(IsActiveContext context)
        {
            var sub = context.Subject.GetSubjectId();
            var user = await _userManager.FindByIdAsync(context.Subject.GetSubjectId());
            context.IsActive = user != null;
        }

        private async Task<List<Claim>> getClaimsUserAsync(AppUser user, List<string> allowedscopes, List<string> requestedscopes)
        {
            
            var claims = new List<Claim>{ new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) };
            if (requestedscopes.Contains("email"))
            {
                claims.Add(new Claim(ClaimTypes.Email, user.Email));
            }
            if (requestedscopes.Contains("profile"))
            {
                claims.Add(new Claim(ClaimTypes.GivenName, user.UserName));
                claims.Add(new Claim(ClaimTypes.NameIdentifier, user.Id));
            }
            if (requestedscopes.Contains("all"))
            {
                var roles = await _userManager.GetRolesAsync(user);
                roles = roles.Where(x => x.Contains(":="))
                             .Where(x => allowedscopes.Contains(x.Split(":=")[0]))
                             .ToList();
                foreach (var r in roles)
                {
                    claims.Add(new Claim(ClaimTypes.Role, r));
                }
            }
            else
            {
                var temp = "general_approval:=test".Split(":=");
                var roles = await _userManager.GetRolesAsync(user);
                roles = roles.Where(x=>x.Contains(":="))
                             .Where(x => requestedscopes.Contains(x.Split(":=")[0]))
                             .ToList();
                foreach (var r in roles)
                {
                    claims.Add(new Claim(ClaimTypes.Role, r));
                }
            }
            
            return claims;
        }
    }
}
