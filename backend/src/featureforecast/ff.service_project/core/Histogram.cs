using System.Collections.Generic;
using System.Diagnostics;
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
            foreach (var v in values)
            {
                for (var i = 0; i < intervals.Length; i++) {
                    if (intervals[i].start <= v && v <= intervals[i].end) {
                        groups[i].Add(v);
                        break;
                    }
                    // in case the value is slightly larger than the final interval boundary due to rounding differences
                    if (i==intervals.Length-1)
                        groups[i].Add(v);
                }
            }
            return groups;
        }
        
        private static Bin[] Compress_value_groups_into_bins(List<float>[] groups) {
            return groups.Select(bvs => new Bin {
                                                    MaxValue = bvs.Count > 0 ? bvs.Max() : 0f,
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