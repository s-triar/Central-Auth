using IdentityModel;
using IdentityServer4.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Constants
{
    public static class IdentityServerConfiguration
    {
        public static IEnumerable<ApiResource> GetApis() =>
            new List<ApiResource>
            {
                new ApiResource("aaa")
            };

        public static IEnumerable<Client> GetClients() =>
           new List<Client>
           {
                new Client
                {
                    ClientId = "cid",
                    ClientSecrets = {new Secret("SECRET".ToSha256())},
                    AllowedGrantTypes = GrantTypes.ResourceOwnerPasswordAndClientCredentials,
                    AllowedScopes = {"aaa"}
                }
           };
    }
}
