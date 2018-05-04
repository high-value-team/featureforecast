using System.Diagnostics;
using System.Threading;
using ff.server.adapters;
using NUnit.Framework;

namespace ff.tests
{
    [TestFixture]
    public class test_PeriodicGarbageCollection
    {
        [Test, Explicit]
        public void Collect()
        {
            var sut = new PeriodicGarbageCollection(() => Debug.WriteLine("collected"), 1);
            Thread.Sleep(5000);
            sut.Dispose();
        }
    }
}