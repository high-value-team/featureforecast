using System;
using System.Collections.Generic;
using System.Linq;
using ff.service.data;

namespace ff.service.core
{
    public class Forecasting
    {
        private const int NUMBER_OF_SIMULATIONS = 1000;
        private const int NUMBER_OF_FORECAST_INTERVALS = 20;
        
        
        private readonly MonteCarloSimulation _montecarlo;
        private readonly int _numberOfSimulations;
        private readonly int _numberOfForecastIntervals;

        public Forecasting(MonteCarloSimulation montecarlo) : this(montecarlo, NUMBER_OF_SIMULATIONS, NUMBER_OF_FORECAST_INTERVALS) {}
        internal Forecasting(MonteCarloSimulation montecarlo, int numberOfSimulations, int numberOfForecastIntervals) {
            _montecarlo = montecarlo;
            _numberOfSimulations = numberOfSimulations;
            _numberOfForecastIntervals = numberOfForecastIntervals;
        }
        
        
        public Forecast Calculate(History.Datapoint[] historicalData, Feature[] features)
        {
            var flattenedFeatureTags = features.Flatten().ToArray();
            var featureValues = Select_datapoints_for_features(flattenedFeatureTags, historicalData);

            var simulationresults = _montecarlo.Run(_numberOfSimulations, featureValues).ToArray();

            var intervals = Calculate_intervals(_numberOfForecastIntervals, simulationresults);
            var histogram = new Histogram(intervals.ToArray(), simulationresults);

            var distribution = Calculate_distribution(histogram);
            
            return new Forecast {
                Features = flattenedFeatureTags.Select(ftags => string.Join(",", ftags)).ToArray(),
                Distribution = distribution.ToArray()
            };
        }

        
        private static float[][] Select_datapoints_for_features(IEnumerable<string[]> featureTags, 
                                                                                History.Datapoint[] historicalData)
            => featureTags.Select(ft => historicalData.Query_by_tags(ft)
                                                      .Select(dp => dp.Value)
                                                      .ToArray())
                          .ToArray();


        internal static IEnumerable<(float start, float end)> Calculate_intervals(int n, float[] simulationResults) {
            var minResult = simulationResults.Min();
            var maxResult = simulationResults.Max();

            var intervalWidth = (maxResult - minResult) / n;

            var intervalStart = minResult;
            while (n-- > 0) {
                var intervalEnd = intervalStart + intervalWidth;
                yield return (intervalStart, intervalEnd);
                intervalStart = intervalEnd;
            }
        }


        internal static IEnumerable<Forecast.PossibleOutcome> Calculate_distribution(Histogram histogram) {
            var totalNumberOfValues = histogram.Bins.Aggregate(0, (t, b) => t + b.NumberOfValues);
            
            var cummulatedNumberOfValues = 0;
            foreach (var bin in histogram.Bins) {
                cummulatedNumberOfValues += bin.NumberOfValues;
                yield return new Forecast.PossibleOutcome {
                    Prognosis = bin.MaxValue,
                    CummulatedProbability = (float)cummulatedNumberOfValues / totalNumberOfValues
                };
            }
        }
    }
}