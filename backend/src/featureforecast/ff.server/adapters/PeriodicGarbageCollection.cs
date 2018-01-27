using System;
using System.Threading;

namespace ff.server.adapters
{
    class PeriodicGarbageCollection : IDisposable
    {
        private const int PERIOD_IN_MINUTES = 60;
        
        private readonly System.Threading.Timer _timer;
        public PeriodicGarbageCollection(Action collect) : this(collect, PERIOD_IN_MINUTES * 60) {}
        internal PeriodicGarbageCollection(Action collect, int periodInSeconds) {
            Console.WriteLine("Background garbage collection started");
            _timer = new System.Threading.Timer(_ => {
                    collect();
                    Console.WriteLine("GC executed");
                }, null, 1000, periodInSeconds * 1000);
        }

        public void Dispose() {
            _timer.Change(Timeout.Infinite, Timeout.Infinite);
            Console.WriteLine("Background garbage collection stopped");
        }
    }
}