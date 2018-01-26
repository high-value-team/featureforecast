using ff.service.core;
using NUnit.Framework;

namespace ff.tests
{
    [TestFixture]
    public class test_Historgram
    {
        [Test]
        public void All_bins_contain_values()
        {
            //TODO: test mit gruppe, die keine werte enthält; da funktioniert Max() nicht
            var intervals = new[] {
                (4f, 23.2f),
                (23.2f, 42.4f),
                (42.4f, 61.6f),
                (61.6f, 80.8f),
                (80.8f, 100f)
            };
            var values = new[] { 20f,30f,40f,50f,70f,100f, 4f,6f,7f,8f,9f,10f,11f };
            var sut = new Histogram(intervals, values);

            var result = sut.Bins;
            
            equalidator.Equalidator.AreEqual(new[]{
                new Histogram.Bin{ MaxValue = 20f, NumberOfValues = 8 },
                new Histogram.Bin{ MaxValue = 40f, NumberOfValues = 2 },
                new Histogram.Bin{ MaxValue = 50f, NumberOfValues = 1 },
                new Histogram.Bin{ MaxValue = 70f, NumberOfValues = 1 },
                new Histogram.Bin{ MaxValue = 100f, NumberOfValues = 1 },
            }, result);
        }
        
        
        [Test]
        public void Some_bins_are_empty()
        {
            //TODO: test mit gruppe, die keine werte enthält; da funktioniert Max() nicht
            var intervals = new[] {
                (1f, 10f),
                (10f, 20f),
                (100f, 200f),
            };
            var values = new[] { 5f, 150f };
            var sut = new Histogram(intervals, values);

            var result = sut.Bins;
            
            equalidator.Equalidator.AreEqual(new[]{
                new Histogram.Bin{ MaxValue = 5f, NumberOfValues = 1 },
                new Histogram.Bin{ MaxValue = 0f, NumberOfValues = 0 },
                new Histogram.Bin{ MaxValue = 150f, NumberOfValues = 1 }
            }, result);
        }
    }
}