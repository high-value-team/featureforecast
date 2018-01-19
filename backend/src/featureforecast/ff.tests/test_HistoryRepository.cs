using System;
using System.Data.Common;
using System.IO;
using System.Linq;
using ff.service.adapters;
using ff.service.data;
using NUnit.Framework;

namespace ff.tests
{
    [TestFixture]
    public class test_HistoryRepository
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
        public void History_roundtrip()
        {
            var history = new History {
                Email = "peter@acme.com",
                Name = "my history",
                HistoricalData = new[] {
                    new History.Datapoint{Value=1.2f, Tags = new[]{"a", "b"}},
                    new History.Datapoint{Value=3.14f, Tags = new string[0]}
                },
                LastUsed = new DateTime(2018,1,19, 17,30,53).ToUniversalTime()
            };
            var sut = new HistoryRepository(REPO_PATH);

            var histId = sut.Store_history(history);

            var loadedHistory = sut.Load_history_by_id(histId);
            
            Assert.AreEqual(history.Email, loadedHistory.Email);
            Assert.AreEqual(history.Name, loadedHistory.Name);
            Assert.AreEqual(history.HistoricalData.Length, loadedHistory.HistoricalData.Length);
            Assert.AreEqual(history.HistoricalData[0].Tags, loadedHistory.HistoricalData[0].Tags);
            Assert.AreEqual(history.HistoricalData[1].Value, loadedHistory.HistoricalData[1].Value);
            Assert.AreEqual(history.LastUsed, loadedHistory.LastUsed);
        }
        
        
        [Test]
        public void Given_id_is_kept()
        {
            var history = new History {
                Id = "abc123",
                Email = "peter@acme.com",
                Name = "my history",
                HistoricalData = new[] {
                    new History.Datapoint{Value=1.2f, Tags = new[]{"a", "b"}},
                    new History.Datapoint{Value=3.14f, Tags = new string[0]}
                },
                LastUsed = new DateTime(2018,1,19, 17,30,53).ToUniversalTime()
            };
            var sut = new HistoryRepository(REPO_PATH);

            var histId = sut.Store_history(history);
            Assert.AreEqual(history.Id, histId);
        }
        
        [Test]
        public void Overwrite_lastused()
        {
            var history = new History {
                Email = "peter@acme.com",
                Name = "my history",
                HistoricalData = new[] {
                    new History.Datapoint{Value=1.2f, Tags = new[]{"a", "b"}},
                    new History.Datapoint{Value=3.14f, Tags = new string[0]}
                },
                LastUsed = new DateTime(2018,1,19, 17,30,53).ToUniversalTime()
            };
            var sut = new HistoryRepository(REPO_PATH);

            var histId = sut.Store_history(history);

            var loadedHistory = sut.Load_history_by_id(histId);
            loadedHistory.LastUsed = new DateTime(2018, 1, 19, 17, 37, 0).ToUniversalTime();
            sut.Store_history(loadedHistory);


            var reloadedHistory = sut.Load_history_by_id(histId);
            Assert.AreEqual(loadedHistory.LastUsed, reloadedHistory.LastUsed);
        }
        
        
        [Test]
        public void Store_multiple_histories() {
            var sut = new HistoryRepository(REPO_PATH);
            
            var history = new History {
                Email = "1@acme.com",
                Name = "my history",
                HistoricalData = new History.Datapoint[0],
                LastUsed = new DateTime(2018,1,19, 17,30,53).ToUniversalTime()
            };
            var histId1 = sut.Store_history(history);

            history.Id = "";
            history.Email = "2@acme.com";
            var histId2 = sut.Store_history(history);
            
            history.Id = "";
            history.Email = "3@acme.com";
            sut.Store_history(history);

            var loadedHistory = sut.Load_history_by_id(histId1);
            Assert.AreEqual("1@acme.com", loadedHistory.Email);

            loadedHistory = sut.Load_history_by_id(histId2);
            Assert.AreEqual("2@acme.com", loadedHistory.Email);
        }
        
        [Test]
        public void Map_name_to_id()
        {
            var sut = new HistoryRepository(REPO_PATH);
            
            var history = new History {
                Email = "peter@acme.com",
                Name = "my history",
                HistoricalData = new History.Datapoint[0],
                LastUsed = new DateTime(2018,1,19, 17,30,53).ToUniversalTime()
            };
            var histId = sut.Store_history(history);

            history.Id = "";
            history.Name = "your history";
            sut.Store_history(history);

            history.Id = "";
            history.Name = "her history";
            sut.Store_history(history);
            
            var foundId = sut.Map_name_to_id("my history");
            
            Assert.AreEqual(histId, foundId);
        }
    }
}