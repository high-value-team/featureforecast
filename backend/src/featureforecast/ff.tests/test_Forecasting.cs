﻿using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using equalidator;
using ff.service;
using ff.service.core;
using NUnit.Framework;

namespace ff.tests
{
    [TestFixture]
    public class test_Forecasting
    {
        [Test]
        public void Forecast()
        {
            var rndNumbers = new Queue<int>(new[] { 0 });
            var montecarlo = new MonteCarloSimulation(_ => rndNumbers.Dequeue());
            var sut = new Forecasting(montecarlo);

            historicalData
            
            var result = sut.Calculate(historicalData, features);
        }
        
        
        [Test]
        public void Calc_intervals()
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


        [Test]
        public void Calc_distribution()
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

            var result = Forecasting.Calculate_distribution(histogram).ToArray();
            
            Equalidator.AreEqual(new[] {
                    new Forecast.PossibleOutcome{Prognosis = 20f, CummulatedProbability = 8f/13f},
                    new Forecast.PossibleOutcome{Prognosis = 40f, CummulatedProbability = 10f/13f},
                    new Forecast.PossibleOutcome{Prognosis = 50f, CummulatedProbability = 11f/13f},
                    new Forecast.PossibleOutcome{Prognosis = 70f, CummulatedProbability = 12f/13f},
                    new Forecast.PossibleOutcome{Prognosis = 100f, CummulatedProbability = 13f/13f},
                },
                result);
        }
    }
}