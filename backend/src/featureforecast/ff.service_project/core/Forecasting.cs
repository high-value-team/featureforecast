using System;
using System.Collections.Generic;
using System.Linq;
using ff.service.data;

namespace ff.service.core
{
    public static class Forecasting
    {
        private const int NUMBER_OF_SIMULATIONS = 1000;
        private const int NUMBER_OF_FORECAST_INTERVALLS = 20;
        
        public static Forecast Calculate(History.Datapoint[] historicalData, Feature[] features)
        {
            var flattenedFeatureTags = features.Flatten();
            var featureValues = Select_datapoints_for_features(flattenedFeatureTags, historicalData);

            var montecarlo = new MonteCarloSimulation();
            var simulationresults = montecarlo.Run(NUMBER_OF_SIMULATIONS, featureValues).ToArray();

            var intervals = Calculate_intervals(NUMBER_OF_FORECAST_INTERVALLS, simulationresults);
            var histogram = new Histogram(intervals.ToArray(), simulationresults);
            
            // TODO: Forecasting
            // auswertung der simulationen
            //    simulationsergebnisse gruppieren: den wertebereich in 20 intervalle teilen und die simulationsergebnise zuordnen.
            //        der intervallwert ist der höchste ergebniswert darin.
            //            pro intervall den aktuell höchsten wert und anzahl speichern
            //    intervallwahrscheinlichkeiten berechnen = n werte im intervall / gesamtanzahl der werte.
            //    intervalle auf forecast mappen
            throw new NotImplementedException();

            return new Forecast {
                Features = flattenedFeatureTags.Select(ftags => string.Join(",", ftags)).ToArray()
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
    }
}