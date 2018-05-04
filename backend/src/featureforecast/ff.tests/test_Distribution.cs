using equalidator;
using ff.service;
using ff.service.core;
using NUnit.Framework;

namespace ff.tests
{
    [TestFixture]
    public class test_Distribution
    {
        [Test]
        public void Calculate()
        {
            var intervals = new[] {
                (4f, 23.2f),
                (23.2f, 42.4f),
                (42.4f, 61.6f),
                (61.6f, 80.8f),
                (80.8f, 100f)
            };
            var values = new[] { 20f,30f,40f,50f,70f,100f, 4f,6f,7f,8f,9f,10f,11f };
            var histogram = new Histogram(intervals, values);
            var sut = new Distribution(histogram);

            var result = sut.Values;
            
            Equalidator.AreEqual(new[] {
                    new Forecast.PossibleOutcome{Prognosis = 20f, Count=8, CummulatedProbability = 8f/13f},
                    new Forecast.PossibleOutcome{Prognosis = 40f, Count=2, CummulatedProbability = 10f/13f},
                    new Forecast.PossibleOutcome{Prognosis = 50f, Count=1, CummulatedProbability = 11f/13f},
                    new Forecast.PossibleOutcome{Prognosis = 70f, Count=1, CummulatedProbability = 12f/13f},
                    new Forecast.PossibleOutcome{Prognosis = 100f, Count=1, CummulatedProbability = 13f/13f},
                },
                result);
        }
        
        [Test]
        public void Calculate_with_empty_intervals_removed()
        {
            var intervals = new[] {
                (4f, 23.2f),
                (23.2f, 42.4f),
                (42.4f, 61.6f),
                (61.6f, 80.8f),
                (80.8f, 100f)
            };
            var values = new[] { 20f,30f,40f,70f,100f, 4f,6f,7f,8f,9f,10f,11f };
            var histogram = new Histogram(intervals, values);
            var sut = new Distribution(histogram);

            var result = sut.Values;
            
            Equalidator.AreEqual(new[] {
                    new Forecast.PossibleOutcome{Prognosis = 20f, Count=8, CummulatedProbability = 8f/12f},
                    new Forecast.PossibleOutcome{Prognosis = 40f, Count=2, CummulatedProbability = 10f/12f},
                    new Forecast.PossibleOutcome{Prognosis = 70f, Count=1, CummulatedProbability = 11f/12f},
                    new Forecast.PossibleOutcome{Prognosis = 100f, Count=1, CummulatedProbability = 12f/12f},
                },
                result);
        }
    }
}