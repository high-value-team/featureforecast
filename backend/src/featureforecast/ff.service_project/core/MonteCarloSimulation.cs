using System;
using System.Collections.Generic;
using System.Linq;

namespace ff.service.core
{
    public class MonteCarloSimulation
    {
        private readonly Func<int, int> _rnd;
        
        public MonteCarloSimulation() : this(Build_random_number_generator()) {}
        internal MonteCarloSimulation(Func<int,int> rnd) { _rnd = rnd; }
        
        internal IEnumerable<float> Run(int n, float[][] featureValues) {
            while (n-- > 0) {
                yield return featureValues.Select(Pick_sample_value)
                                          .Aggregate(0f, (value, prognosis) => prognosis + value);
            }

            float Pick_sample_value(float[] values) {
                var i = _rnd(values.Length);
                return values[i];
            }
        }
        
        internal static Func<int, int> Build_random_number_generator() {
            var rnd = new Random();
            return n => rnd.Next(0, n);
        }
    }
}