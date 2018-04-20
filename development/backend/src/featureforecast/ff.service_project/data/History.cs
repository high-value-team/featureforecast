using System;
using System.Collections.Generic;
using System.Linq;

namespace ff.service.data
{
    public class History {
        public string Id;
        public string Name;
        public string Email;
        public Datapoint[] HistoricalData;
        public DateTime LastUsed;

        public string[] Compile_tags() => HistoricalData.SelectMany(dp => dp.Tags)
                                                        .Select(t => t.ToLower())
                                                        .Distinct()
                                                        .OrderBy(t => t)
                                                        .ToArray();

        public class Datapoint {
            public float Value;
            public string[] Tags;
        }
    }
      
    
    internal static class DatapointExtensions
    {
        public static IEnumerable<History.Datapoint> Query_by_tags(this IEnumerable<History.Datapoint> datapoints, 
                                                                   string[] tagsRequired)
        {
            return tagsRequired.Length == 0 ? datapoints.Where(No_tags) 
                                            : datapoints.Where(Required_tags_are_matching);

            bool No_tags(History.Datapoint dp)
                => dp.Tags.Length == 0;
            
            bool Required_tags_are_matching(History.Datapoint dp)
                => tagsRequired.All(t => Match_any_tag(dp.Tags, t));

            bool Match_any_tag(string[] datapointTags, string requiredTag)
                => datapointTags.Any(dpt => string.Compare(requiredTag, dpt, StringComparison.CurrentCultureIgnoreCase) == 0);
        }
    }
}