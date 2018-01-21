using System.Linq;
using ff.service;
using NUnit.Framework;

namespace ff.tests
{
    [TestFixture]
    public class test_Feature
    {
        [Test]
        public void Flatten()
        {
            var features = new[] {
                new Feature{Tags=new[]{"a"}, Quantity = 0},
                new Feature{Tags=new[]{"b","c"}, Quantity = 1},
                new Feature{Tags=new string[0], Quantity = 2}
            };

            var result = features.Flatten().ToArray();
            
            Assert.AreEqual(new[] {
                new[]{"b","c"},
                new string[0], 
                new string[0]
            }, result);
        }
    }
}