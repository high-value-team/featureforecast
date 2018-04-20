using System;
using System.Collections.Generic;
using ff.service;
using ff.service.core;
using NUnit.Framework;

namespace ff.tests
{
    [TestFixture]
    public class test_MonteCarloSimulation {
        [Test]
        public void Run_simulations()
        {
            var featureValues = new[] {
                new[]{1f,2f,3f}, // F 1
                new[]{5f,6f}, // F 2
                new[]{10f,20f,30f,40f} // F3
            };

            // Values to be selected from each feat. per simulation: (F1,F2,F3), ...
            // Values to be selected: (1f,5f,10f), (2f,6f,20f), (3f,6f,40f)
            // Simulation results expected: 16f, 28f, 49f
            // Indexes of values: 0,0,0, 1,1,1, 2,1,3
            var randomIndexes = new Queue<int>(new[]{0,0,0, 1,1,1, 2,1,3});
            var sut = new MonteCarloSimulation(_ => randomIndexes.Dequeue());
            
            var result = sut.Run(3, featureValues);
            
            Assert.AreEqual(new[]{16f, 28f, 49f}, result);
        }
        
        
        [Test]
        public void Build_random_number_generator()
        {
            var sut = MonteCarloSimulation.Build_random_number_generator();

            const int MAX = 10;
            for (var i = 0; i < 100; i++) {
                var r = sut(MAX);
                Assert.IsTrue(r <= (MAX-1));
                
                Console.WriteLine(r);
            }
        }
    }
}