using System;
using System.Collections.Generic;
using System.Linq;
using ff.service.data;

namespace ff.service
{
    public class Feature {
        public string[] Tags;
        public int Quantity;
    }
    
    
    internal static class FeatureExtensions
    {
        public static IEnumerable<string[]> Flatten(this IEnumerable<Feature> features) {
            foreach(var f in features)
                for (var n = f.Quantity; n > 0; n--)
                    yield return f.Tags;
        }
    }
}