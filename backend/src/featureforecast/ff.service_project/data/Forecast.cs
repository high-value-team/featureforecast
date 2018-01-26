namespace ff.service
{
    public class Forecast {
        public string[] Features;
        public PossibleOutcome[] Distribution;
        
        public class PossibleOutcome {
            public float Prognosis;
            public int Count;
            public float CummulatedProbability;
        }
    }
}