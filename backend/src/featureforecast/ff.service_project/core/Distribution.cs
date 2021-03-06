﻿using System.Collections.Generic;
using System.Linq;

namespace ff.service.core
{
    class Distribution
    {
        private readonly Histogram _histogram;
        public Distribution(Histogram histogram) { _histogram = histogram; }

        public Forecast.PossibleOutcome[] Values => Calculate().ToArray();
        
        private IEnumerable<Forecast.PossibleOutcome> Calculate() {
            var totalNumberOfValues = _histogram.Bins.Aggregate(0, (t, b) => t + b.NumberOfValues);
            var nonemptyBins = _histogram.Bins.Where(b => b.NumberOfValues > 0);
            
            var cummulatedNumberOfValues = 0;
            foreach (var bin in nonemptyBins) {
                cummulatedNumberOfValues += bin.NumberOfValues;
                yield return new Forecast.PossibleOutcome {
                    Prognosis = bin.MaxValue,
                    Count = bin.NumberOfValues,
                    CummulatedProbability = (float)cummulatedNumberOfValues / totalNumberOfValues
                };
            }
        }
    }
}