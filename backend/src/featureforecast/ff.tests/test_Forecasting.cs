using System;
using ff.service;
using NUnit.Framework;

namespace ff.tests
{
    [TestFixture]
    public class test_Forecasting {
        [Test]
        public void Build_random_number_generator()
        {
            var sut = Forecasting.Build_random_number_generator();

            const int MAX = 10;
            for (var i = 0; i < 100; i++) {
                var r = sut(MAX);
                Assert.IsTrue(r <= (MAX-1));
                
                Console.WriteLine(r);
            }
        }
    }
}