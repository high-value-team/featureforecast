using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using ff.service;
using ff.service.core;
using ff.service.data;
using NUnit.Framework;

namespace ff.tests
{
    [TestFixture]
    public class test_Forecasting
    {
        [Test]
        public void Forecast()
        {
            var rndNumbers = new Queue<int>(new[] { 0,2,1, 1,5,3, 3,4,2 });
            var montecarlo = new MonteCarloSimulation(_ => rndNumbers.Dequeue());
            var sut = new Forecasting(montecarlo, 3, 2);

            //TODO: integrationstest forecasting
            var historicalData = new[] {
                new History.Datapoint{Value=1f, Tags=new[]{"a"}},
                new History.Datapoint{Value=2f, Tags=new[]{"a"}},
                new History.Datapoint{Value=2f, Tags=new[]{"a"}},
                new History.Datapoint{Value=3f, Tags=new[]{"a"}},
                new History.Datapoint{Value=3f, Tags=new[]{"a"}},
                new History.Datapoint{Value=4f, Tags=new[]{"a"}},
                new History.Datapoint{Value=10f, Tags=new[]{"b"}},
                new History.Datapoint{Value=10f, Tags=new[]{"b"}},
                new History.Datapoint{Value=20f, Tags=new[]{"b"}},
                new History.Datapoint{Value=20f, Tags=new[]{"b"}},
                new History.Datapoint{Value=30f, Tags=new[]{"b"}}
            };
            var features = new[] {
                new Feature {Quantity = 2, Tags = new[] {"a"}},
                new Feature {Quantity = 1, Tags = new[] {"b"}},
            };
            
            /*
             * 3 Simulationen, 2 Intervalle
             * 2a(0..5), 1b(0..4)
             *
             * a: 0=1  1=2  3=3
             * a: 2=2  5=4  4=3
             * b: 1=10 3=20 2=20
             *    13   26   26
             *
             * 26-13=13
             * 13/2=6,5
             * 13..19,5, 19,5..26
             * (13,1,0.33), (26,2,1.0)
             */

            var result = sut.Calculate(historicalData, features);
            
            foreach(var f in result.Features)
                Debug.WriteLine($"{string.Join(",", f)}");
            
            foreach(var po in result.Distribution)
                Debug.WriteLine($"{po.Prognosis}, {po.CummulatedProbability}");
            
            Assert.AreEqual(new[]{"a", "a", "b"}, result.Features);
            Assert.AreEqual(2, result.Distribution.Length);
            Assert.AreEqual(13f, result.Distribution[0].Prognosis);
            Assert.AreEqual(0.33f, result.Distribution[0].CummulatedProbability, 0.01f);
            Assert.AreEqual(26f, result.Distribution[1].Prognosis);
            Assert.AreEqual(1f, result.Distribution[1].CummulatedProbability, 0.01f);
        }
        
        
        [Test,Category("Scaffolding")]
        public void Scaffolding_Calc_intervals()
        {
            var simulationResults = new[] { 4f,6f,7f,8f,9f,10f,11f,20f,30f,40f,50f,70f,100f };

            (float start, float end)[] result = Forecasting.Calculate_intervals(5, simulationResults).ToArray();
            
            Assert.AreEqual(5, result.Length);
            var expected = new[] {
                (4f, 23.2f),
                (23.2f, 42.4f),
                (42.4f, 61.6f),
                (61.6f, 80.8f),
                (80.8f, 100f)
            };
            for (var i = 0; i < expected.Length; i++)
                AreEqual(expected[i], result[i]);


            void AreEqual((float min, float max) e, (float start, float end) r) {
                Assert.AreEqual(e.min, r.start, 0.01f);
                Assert.AreEqual(e.max, r.end, 0.01f);
            }
        }
    }
}