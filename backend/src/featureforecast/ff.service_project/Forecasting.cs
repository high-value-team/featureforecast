using System;
using System.Collections.Generic;
using System.Linq;
using ff.service.data;

namespace ff.service
{
    public static class Forecasting
    {
        public static Forecast Calculate(History.Datapoint[] historicalData, Feature[] features)
        {
            var flattenedFeatureTags = features.Flatten();
            var featureDatapoints = Select_datapoints_for_features(flattenedFeatureTags, historicalData);
            


            
            // TODO: Forecasting
            // monte carlo: 1000x
            //    aus jeder grunddatenmenge einen zufälligen wert entnehmen
            //    simulation aktualisieren (werte addieren)
            // auswertung der simulationen
            //    simulationsergebnisse gruppieren: den wertebereich in 20 intervalle teilen und die simulationsergebnise zuordnen.
            //        der intervallwert ist der höchste ergebniswert darin.
            //            pro intervall den aktuell höchsten wert und anzahl speichern
            //    intervallwahrscheinlichkeiten berechnen = n werte im intervall / gesamtanzahl der werte.
            //    intervalle auf forecast mappen
            throw new NotImplementedException();
        }

        
        private static IEnumerable<History.Datapoint[]> Select_datapoints_for_features(IEnumerable<string[]> featureTags, 
                                                                                History.Datapoint[] historicalData)
            => featureTags.Select(ft => historicalData.Query_by_tags(ft).ToArray());

        
        internal static IEnumerable<float> Run_simulations(int n, Func<int,int> rnd, History.Datapoint[][] featureDatapoints) {
            while (n-- > 0) {
                yield return featureDatapoints.Select(Sample_datapoint).Aggregate(0f, (value, prognosis) => prognosis + value);
            }

            float Sample_datapoint(History.Datapoint[] datapoints) {
                var i = rnd(datapoints.Length);
                return datapoints[i].Value;
            }
        }


        internal static Func<int, int> Build_random_number_generator() {
            var rnd = new Random();
            return n => rnd.Next(0, n);
        }
    }
}