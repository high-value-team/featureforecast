using System;
using System.IO;
using System.Linq;
using ff.service;
using ff.service.adapters;
using ff.service.core;
using ff.service.data.dto;
using NUnit.Framework;

namespace ff.tests
{
    [TestFixture]
    public class test_RequestHandler
    {
        private const string REPO_PATH = "testrepo";
        
        [SetUp]
        public void Initialize()
        {
            Environment.CurrentDirectory = TestContext.CurrentContext.TestDirectory;
            if (Directory.Exists(REPO_PATH)) Directory.Delete(REPO_PATH, true);
            Directory.CreateDirectory(REPO_PATH);
        }
        
        [Test]
        public void Acceptance()
        {
            const int NUMBER_OF_SIMULATIONS = 1000;
            const int GRANULARITY_OF_FORECAST = 20;
            
            var repo = new HistoryRepository(REPO_PATH);
            var forecasting = new Forecasting(new MonteCarloSimulation(), NUMBER_OF_SIMULATIONS, GRANULARITY_OF_FORECAST);
            var sut = new RequestHandler(repo, forecasting);

            var newHistory = new NewHistoryDto {
                Id = "abc",
                Name = "test history",
                Email = "balin@ralfw.de",
                HistoricalData = new[] {
                    new DatapointDto{Value = 1f, Tags = new[]{"a"}},
                    new DatapointDto{Value = 2f, Tags = new[]{"a"}}
                },
                HistoricalDataToParse = "2;a,x\n3;a\n3;a\n4;a\n10;b,x\n10;b\n20;b\n20;b\n30;b,x"
            };
            
            var historyId = sut.Create_history(newHistory);
            
            Assert.AreEqual("abc", historyId);

            var history = sut.Load_history_by_id(historyId);
            
            Assert.AreEqual("test history", history.Name);
            Assert.AreEqual(11, history.HistoricalData.Length);
            Assert.AreEqual(new[]{"a", "b", "x"}, history.Tags);

            history = sut.Load_history_by_name("test history");
            
            Assert.AreEqual("balin@ralfw.de", history.Email);

            var forecast = sut.Calculate_forecast(historyId,
                                                  new[] {
                                                          new FeatureDto {Quantity = 2, Tags = new[] {"a"}},
                                                          new FeatureDto {Quantity = 1, Tags = new[] {"b"}},
                                                  });
            
            // only prognosises with p>=0.5
            Assert.IsTrue(forecast.Distribution.Select(p => p.Count).Sum() >= 500);
        }
    }
}