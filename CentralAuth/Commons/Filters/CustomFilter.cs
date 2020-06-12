using CentralAuth.Commons.Models;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Remotion.Linq.Clauses;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Filters
{
    public static class CustomFilter<T> where T : class, new()
    {
        public static Expression<Func<T, bool>> ContainFilter(Object obj)
        {
            var properties = obj.GetType().GetProperties();
            var interfaces = obj.GetType().GetInterfaces();
            var parameter = Expression.Parameter(obj.GetType(), "a");
            MethodInfo method = typeof(string).GetMethod("Contains", new[] { typeof(string) });
            Expression<Func<T, bool>> res = null;
            foreach (var prop in properties)
            {
                var g = prop.ToString();
                if (!g.ToLower().Contains("icollection") && !g.ToLower().Contains("datetime"))
                {
                    var valuePrimitive = obj.GetType().GetProperty(prop.Name).GetValue(obj, null);
                    var value = Expression.Constant(valuePrimitive);
                    if (valuePrimitive != null)
                    {
                        var property = Expression.Property(parameter, prop.Name);
                        var methodCall = Expression.Call(property, method, value);
                        var temp = Expression.Lambda<Func<T, bool>>(methodCall, parameter);
                        if (res == null)
                        {
                            res = temp;
                        }
                        else
                        {
                            res = Expression.Lambda<Func<T, bool>>(Expression.AndAlso(res.Body, temp.Body), parameter);
                        }
                    }
                }
            }
            return res;
        }


        public static Expression<Func<T, bool>> FilterGrid(Object obj)
        {
            var properties = obj.GetType().GetProperties();
            var parameter = Expression.Parameter(typeof(T), "a");
            Expression<Func<T, bool>> res = null;
            foreach (var prop in properties)
            {
                var g = prop.ToString();

                if (g.Contains("Filter"))
                {
                    var filters = obj.GetType().GetProperty(prop.Name).GetValue(obj, null);
                    if (filters == null)
                    {
                        return Expression.Lambda<Func<T, bool>>(Expression.Constant(true), parameter);
                    }
                    List<Filter> filterArray = filters as List<Filter>;
                    if(filterArray.Count > 0)
                    {
                        foreach(var f in filterArray)
                        {
                            var value = Expression.Constant(f.FilterValue);
                            string key = f.ColumnName;
                            string[] keys = key.Split('.');
                            MemberExpression property = null;
                            for (int i = 0; i < keys.Length; i++)
                            {
                                var k = keys[i].First().ToString().ToUpper() + keys[i].Substring(1);
                                if (i == 0)
                                {
                                    property = Expression.Property(parameter, k);
                                }
                                else
                                {
                                    property = Expression.Property(property, k);
                                }

                            }
                            Expression<Func<T, bool>> temp = null;
                            switch(f.FilterType){
                                case "CONTAIN":
                                    MethodInfo method_tolower = typeof(string).GetMethod("ToLower", System.Type.EmptyTypes);
                                    MethodInfo method_contain = typeof(string).GetMethod("Contains", new[] { typeof(string) });
                                    var methodCall_to_lower = Expression.Call(property, method_tolower);
                                    if(f.FilterValue == null)
                                    {
                                        value = Expression.Constant("");
                                    }
                                    var methodCall_contain = Expression.Call(methodCall_to_lower, method_contain, value);
                                    temp = Expression.Lambda<Func<T, bool>>(methodCall_contain, parameter);
                                    break;
                                case "NOT_CONTAIN":
                                    MethodInfo method_not_tolower = typeof(string).GetMethod("ToLower", System.Type.EmptyTypes);
                                    MethodInfo method_not_contain = typeof(string).GetMethod("Contains", new[] { typeof(string) });
                                    //var methodCall_not_contain = Expression.Call(property, method_not_contain, value);
                                    var methodCall_not_to_lower = Expression.Call(property, method_not_tolower);
                                    if (f.FilterValue == null)
                                    {
                                        value = Expression.Constant("");
                                    }
                                    var methodCall_not_contain = Expression.Call(methodCall_not_to_lower, method_not_contain, value);
                                    var not_contain = Expression.Not(methodCall_not_contain);
                                    temp = Expression.Lambda<Func<T, bool>>(methodCall_not_contain, parameter);
                                    break;
                                case "GREATER_THAN":
                                    var comparison_gt = Expression.GreaterThan(property, Expression.Constant(Decimal.Parse(f.FilterValue)));
                                    temp = Expression.Lambda<Func<T, bool>>(comparison_gt, parameter);
                                    break;
                                case "GREATER_THAN_OR_EQUAL":
                                    var comparison_gtoe = Expression.GreaterThanOrEqual(property, Expression.Constant(Decimal.Parse(f.FilterValue)));
                                    temp = Expression.Lambda<Func<T, bool>>(comparison_gtoe, parameter);
                                    break;
                                case "LESS_THAN":
                                    var comparison_lt = Expression.LessThan(property, Expression.Constant(Decimal.Parse(f.FilterValue)));
                                    temp = Expression.Lambda<Func<T, bool>>(comparison_lt, parameter);
                                    break;
                                case "LESS_THAN_OR_EQUAL":
                                    var comparison_ltoe = Expression.LessThanOrEqual(property, Expression.Constant(Decimal.Parse(f.FilterValue)));
                                    temp = Expression.Lambda<Func<T, bool>>(comparison_ltoe, parameter);
                                    break;
                                case "EQUAL":
                                    MethodInfo method_tostring_equal = typeof(string).GetMethod("ToString", System.Type.EmptyTypes);
                                    var methodCall_to_string_equal = Expression.Call(property, method_tostring_equal);
                                    var comparison_e = Expression.Equal(methodCall_to_string_equal, Expression.Constant(f.FilterValue));
                                    temp = Expression.Lambda<Func<T, bool>>(comparison_e, parameter);
                                                                         
                                    break;
                                case "NOT_EQUAL":
                                    MethodInfo method_tostring_not_equal = typeof(string).GetMethod("ToString", System.Type.EmptyTypes);
                                    var methodCall_to_string_not_equal = Expression.Call(property, method_tostring_not_equal);
                                    var comparison_not_e = Expression.NotEqual(methodCall_to_string_not_equal, Expression.Constant(f.FilterValue));
                                    temp = Expression.Lambda<Func<T, bool>>(comparison_not_e, parameter);
                                    
                                    break;
                            }

                            if (res == null)
                            {
                                if (temp == null)
                                {
                                    res = Expression.Lambda<Func<T, bool>>(Expression.Constant(true), parameter);
                                }
                                else
                                {
                                    res = temp;
                                }
                            }
                            else
                            {
                                res = Expression.Lambda<Func<T, bool>>(Expression.AndAlso(res.Body, temp.Body), parameter);
                            }
                        }
                    }
                    else
                    {
                        res = Expression.Lambda<Func<T, bool>>(Expression.Constant(true), parameter);
                    }
                    break;
                }
            }
            return res;
        }

        public static PropertyInfo SortGrid(Sort obj)
        {
            string key = obj.ColumnName;
            key = key.First().ToString().ToUpper() + key.Substring(1);
            //var parameter = Expression.Parameter(typeof(T), "a");
            var property =  typeof(T).GetProperty(key);
            return property;

            
        }
    }
}
