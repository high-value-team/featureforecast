using System.Collections.Generic;
using System.Linq;

namespace ff.service.core
{
    internal class Histogram
    {
        public Histogram((float start, float end)[] intervals, float[] values) {
            var groups = Group_values_according_to_intervals(intervals, values);
            this.Bins = Compress_value_groups_into_bins(groups);
        }

        private static List<float>[] Group_values_according_to_intervals((float start, float end)[] intervals, float[] values) {
            var groups = intervals.Select(_ => new List<float>()).ToArray();
            foreach (var v in values) {
                for (var i = 0; i < intervals.Length; i++) {
                    if (intervals[i].start <= v && v <= intervals[i].end) {
                        groups[i].Add(v);
                        break;
                    }
                }
            }
            return groups;
        }
        
        private static Bin[] Compress_value_groups_into_bins(List<float>[] groups) {
            return groups.Select(bvs => new Bin {
                                                    MaxValue = bvs.Max(),
                                                    NumberOfValues = bvs.Count
                                                })
                         .ToArray();
        }

        
        public Bin[] Bins { get; }

        
        public class Bin {
            public float MaxValue;
            public int NumberOfValues;
        }
    }
}