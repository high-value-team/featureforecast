using System.Linq;
using ff.service.data;
using NUnit.Framework;

namespace ff.tests
{
    [TestFixture]
    public class test_History
    {
        private History.Datapoint[] _datapoints;
        
        [SetUp]
        public void Setup()
        {
            _datapoints = new[] {
                new History.Datapoint{Value=1f, Tags=new[]{"a"}},
                new History.Datapoint{Value=2f, Tags=new[]{"b","a"}},
                new History.Datapoint{Value=3f, Tags=new[]{"a","c"}},
                new History.Datapoint{Value=4f, Tags=new[]{"c"}},
                new History.Datapoint{Value=5f, Tags=new[]{"b","c"}},
                new History.Datapoint{Value=6f, Tags=new string[0]},
            };
        }
        
        [Test]
        public void Query_for_datapoints_wo_tags()
        {
            var result = _datapoints.Query_by_tags(new string[0]).ToArray();
            Assert.AreEqual(1, result.Length);
            Assert.AreEqual(6f, result[0].Value);
        }
        
        [Test]
        public void Query_for_single_tag()
        {
            var result = _datapoints.Query_by_tags(new[]{"b"}).ToArray();
            Assert.AreEqual(2, result.Length);
            Assert.AreEqual(2f, result[0].Value);
            Assert.AreEqual(5f, result[1].Value);
        }
        
        [Test]
        public void Query_for_multiple_tags()
        {
            var result = _datapoints.Query_by_tags(new[]{"c","a"}).ToArray();
            Assert.AreEqual(1, result.Length);
            Assert.AreEqual(3f, result[0].Value);
        }
        
        [Test]
        public void Query_independent_of_case()
        {
            var result = _datapoints.Query_by_tags(new[]{"A"}).ToArray();
            Assert.AreEqual(3, result.Length);
            Assert.AreEqual(1f, result[0].Value);
            Assert.AreEqual(2f, result[1].Value);
            Assert.AreEqual(3f, result[2].Value);
        }
    }
}