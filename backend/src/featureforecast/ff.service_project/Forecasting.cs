using System;
using ff.service.data;

namespace ff.service
{
    public class Forecasting
    {
        private readonly Func<int, int> _rnd;

        public Forecasting() {
            var rnd = new Random();
            _rnd = n => rnd.Next(0, n);
        }
        internal Forecasting(Func<int,int> rnd) { _rnd = rnd; }
        
        
        public Forecast Calculate(History.Datapoint[] historicalData, Feature[] features)
        {
            // TODO: Forecasting
            // vorbereitung:
            //     multiply features
            //     zu jedem feature die grunddatenmenge heraussuchen
            // monte carlo: 1000x
            //    aus jeder grunddatenmenge einen zufälligen wert entnehmen
            //    simulation aktualisieren (werte addieren)
            // auswertung der simulationen
            //    simulationsergebnisse gruppieren: den wertebereich in 20 intervalle teilen und die simulationsergebnise zuordnen.
            //        der intervallwert ist der höchste ergebniswert darin.
            //            pro intervall den aktuell höchsten wert und anzahl speichern
            //    intervallwahrscheinlichkeiten berechnen = n werte im intervall / gesamtanzahl der werte.
            //    intervalle auf forecast mappen
            throw new NotImplementedException();
        }
    }
}