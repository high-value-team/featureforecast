using System.Globalization;
using System.Linq;
using ff.service.core;
using NUnit.Framework;

namespace ff.tests
{
    [TestFixture]
    public class test_Forecasting
    {
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
    }
}